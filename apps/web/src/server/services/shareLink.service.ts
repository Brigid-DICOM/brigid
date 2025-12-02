import { AppDataSource } from "@brigid/database";
import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { ShareLinkEntity } from "@brigid/database/src/entities/shareLink.entity";
import { ShareLinkRecipientEntity } from "@brigid/database/src/entities/shareLinkRecipient.entity";
import { ShareLinkTargetEntity } from "@brigid/database/src/entities/shareLinkTarget.entity";
import { UserWorkspaceEntity } from "@brigid/database/src/entities/userWorkspace.entity";
import { pbkdf2, randomBytes, timingSafeEqual } from "crypto";
import { addSeconds } from "date-fns";
import { HTTPException } from "hono/http-exception";
import { type EntityManager, In } from "typeorm";
import {
    PBKDF2_DIGEST,
    PBKDF2_ITERATIONS,
    PBKDF2_KEYLEN,
    SHARE_PERMISSIONS,
    type SharePermissionsType,
} from "../const/share.const";
import { WORKSPACE_PERMISSIONS } from "../const/workspace.const";
import { hasPermission } from "../utils/sharePermissions";
import { DicomSearchInstanceQueryBuilder } from "./qido-rs/dicomSearchInstanceQueryBuilder";
import { DicomSearchSeriesQueryBuilder } from "./qido-rs/dicomSearchSeriesQueryBuilder";
import { DicomSearchStudyQueryBuilder } from "./qido-rs/dicomSearchStudyQueryBuilder";

export class ShareLinkService {
    private readonly entityManager: EntityManager;

    constructor(entityManager?: EntityManager) {
        this.entityManager = entityManager ?? AppDataSource.manager;
    }

    private generateToken() {
        return randomBytes(32).toString("hex");
    }

    private async hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const salt = randomBytes(16).toString("hex");
            const iterations = PBKDF2_ITERATIONS;
            const keylen = PBKDF2_KEYLEN;
            const digest = PBKDF2_DIGEST;

            pbkdf2(
                password,
                salt,
                iterations,
                keylen,
                digest,
                (err, derivedKey) => {
                    if (err) {
                        reject(err);
                    } else {
                        const hash = derivedKey.toString("hex");
                        resolve(`${iterations}:${salt}:${hash}`);
                    }
                },
            );
        });
    }

    async verifyPassword(password: string, hash: string) {
        return new Promise((resolve, reject) => {
            const [iterations, salt, originalHash] = hash.split(":");

            pbkdf2(
                password,
                salt,
                parseInt(iterations, 10),
                64,
                "sha512",
                (err, derivedKey) => {
                    if (err) {
                        reject(err);
                    } else {
                        const derivedHash = derivedKey.toString("hex");
                        const originalHashBuffer = Buffer.from(
                            originalHash,
                            "hex",
                        );
                        const derivedHashBuffer = Buffer.from(
                            derivedHash,
                            "hex",
                        );

                        if (
                            originalHashBuffer.length ===
                            derivedHashBuffer.length
                        ) {
                            const isValid = timingSafeEqual(
                                originalHashBuffer,
                                derivedHashBuffer,
                            );
                            resolve(isValid);
                        } else {
                            resolve(false);
                        }
                    }
                },
            );
        });
    }

    async createShareLink(options: {
        creatorId: string;
        workspaceId: string;
        targetType: "study" | "series" | "instance";
        targetIds: string[];
        name?: string;
        publicPermissions: SharePermissionsType;
        requiredPassword: boolean;
        password?: string;
        expiresInSec?: number;
        description?: string;
        recipients?: Array<{ userId: string; permissions: number }>;
    }) {
        const shareLink = new ShareLinkEntity();
        shareLink.token = this.generateToken();
        shareLink.creatorId = options.creatorId;
        shareLink.workspaceId = options.workspaceId;
        shareLink.publicPermissions = options.publicPermissions;
        shareLink.requiredPassword = options.requiredPassword;
        shareLink.name = options.name ?? `shared ${options.targetType}`;

        if (options.requiredPassword && options.password) {
            shareLink.passwordHash = await this.hashPassword(options.password);
        }

        if (options.expiresInSec) {
            shareLink.expiresInSec = options.expiresInSec;
            const expiresAt = addSeconds(new Date(), options.expiresInSec);
            shareLink.expiresAt = expiresAt;
        }

        if (options.description) {
            shareLink.description = options.description;
        }

        const savedShareLink = await this.entityManager.save(
            ShareLinkEntity,
            shareLink,
        );

        const targets = options.targetIds.map((targetId) => {
            const target = new ShareLinkTargetEntity();
            target.shareLinkId = savedShareLink.id;
            target.targetType = options.targetType;
            target.targetId = targetId;
            return target;
        });

        await this.entityManager.save(ShareLinkTargetEntity, targets);

        if (options.recipients) {
            const recipients = options.recipients.map((recipient) => {
                const recipientEntity = new ShareLinkRecipientEntity();
                recipientEntity.shareLinkId = savedShareLink.id;
                recipientEntity.userId = recipient.userId;
                recipientEntity.permissions = recipient.permissions;
                return recipientEntity;
            });

            await this.entityManager.save(ShareLinkRecipientEntity, recipients);
        }

        return savedShareLink;
    }

    async getShareLinkByToken(token: string) {
        const shareLink = await this.entityManager.findOne(ShareLinkEntity, {
            where: { token },
            relations: ["targets", "recipients", "creator"],
        });

        if (!shareLink) return null;

        // check if the share link has expired
        if (shareLink.expiresAt && new Date() > shareLink.expiresAt)
            return null;

        return shareLink;
    }

    async getShareLinkDetails(shareLinkId: string) {
        const shareLink = await this.entityManager.findOne(ShareLinkEntity, {
            where: { id: shareLinkId },
            relations: ["targets", "recipients", "creator"],
        });

        if (!shareLink) return null;

        const targetDetails = await Promise.all(
            shareLink.targets.map(async (target) => {
                let resourceInfo = null;

                switch (target.targetType) {
                    case "study": {
                        const studyQueryBuilder =
                            new DicomSearchStudyQueryBuilder(
                                this.entityManager,
                            );
                        const studies =
                            await studyQueryBuilder.getStudiesWithRelatedCounts(
                                {
                                    workspaceId: shareLink.workspaceId,
                                    StudyInstanceUID: target.targetId,
                                    deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                                },
                            );
                        if (studies.length > 0) {
                            resourceInfo = studies[0];
                        }
                        break;
                    }
                    case "series": {
                        const seriesQueryBuilder =
                            new DicomSearchSeriesQueryBuilder(
                                this.entityManager,
                            );
                        const series =
                            await seriesQueryBuilder.getSeriesWithRelatedCounts(
                                {
                                    workspaceId: shareLink.workspaceId,
                                    SeriesInstanceUID: target.targetId,
                                    deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                                }
                            );
                        if (series.length > 0) {
                            resourceInfo = series[0];
                        }
                        break;
                    }
                    case "instance": {
                        const instanceQueryBuilder =
                            new DicomSearchInstanceQueryBuilder(
                                this.entityManager,
                            );
                        const instances = await instanceQueryBuilder.execQuery({
                            workspaceId: shareLink.workspaceId,
                            SOPInstanceUID: target.targetId,
                            deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                        });
                        if (instances.length > 0) {
                            resourceInfo = instances[0];
                        }
                        break;
                    }
                    default: {
                        resourceInfo = null;
                        break;
                    }
                }

                return {
                    ...target,
                    resource: resourceInfo,
                };
            }),
        );

        return {
            ...shareLink,
            targets: targetDetails,
        };
    }

    async updateShareLink(options: {
        shareLinkId: string;
        creatorId: string;
        name?: string;
        publicPermissions?: SharePermissionsType;
        requiredPassword?: boolean;
        password?: string;
        expiresInSec?: number;
        recipientPermissions?: Array<{ userId: string; permissions: number }>;
    }) {
        const shareLink = await this.entityManager.findOne(ShareLinkEntity, {
            where: { id: options.shareLinkId },
            relations: ["recipients"],
        });

        if (!shareLink) return null;

        this.verifyShareLinkOperator({
            shareLink,
            workspaceId: shareLink.workspaceId,
            userId: options.creatorId,
        });

        if (options.name !== undefined) {
            shareLink.name = options.name;
        }

        if (options.publicPermissions !== undefined) {
            shareLink.publicPermissions = options.publicPermissions;
        }

        if (options.requiredPassword !== undefined) {
            shareLink.requiredPassword = options.requiredPassword;

            if (options.requiredPassword && options.password) {
                shareLink.passwordHash = await this.hashPassword(
                    options.password,
                );
            } else if (!options.requiredPassword) {
                shareLink.passwordHash = null;
            }
        }

        if (options.expiresInSec !== undefined) {
            shareLink.expiresInSec = options.expiresInSec;

            if (options.expiresInSec) {
                const expiresAt = addSeconds(new Date(), options.expiresInSec);
                shareLink.expiresAt = expiresAt;
            } else {
                shareLink.expiresAt = null;
            }
        }

        const updatedShareLink = await this.entityManager.save(
            ShareLinkEntity,
            shareLink,
        );

        if (options.recipientPermissions) {
            for (const recipient of options.recipientPermissions) {
                await this.entityManager.update(
                    ShareLinkRecipientEntity,
                    {
                        shareLinkId: shareLink.id,
                        userId: recipient.userId,
                    },
                    {
                        permissions: recipient.permissions,
                    },
                );
            }
        }

        return updatedShareLink;
    }

    async verifyAccess(options: { shareLinkId: string; userId?: string }) {
        const shareLink = await this.entityManager.findOne(ShareLinkEntity, {
            where: { id: options.shareLinkId },
        });

        if (!shareLink) {
            return { allowed: false, reason: "Share link not found" };
        }

        if (shareLink.expiresAt && new Date() > shareLink.expiresAt) {
            return { allowed: false, reason: "Share link has expired" };
        }

        if (
            !hasPermission(shareLink.publicPermissions, SHARE_PERMISSIONS.READ)
        ) {
            if (options.userId) {
                const recipient = await this.entityManager.findOne(
                    ShareLinkRecipientEntity,
                    {
                        where: {
                            shareLinkId: shareLink.id,
                            userId: options.userId,
                        },
                    },
                );

                if (
                    recipient &&
                    !hasPermission(
                        recipient.permissions,
                        SHARE_PERMISSIONS.READ,
                    )
                ) {
                    return {
                        allowed: false,
                        reason: "You do not have permission to access this share link",
                    };
                }
            } else {
                return { allowed: false, reason: "Share link is not public" };
            }
        }

        return { allowed: true };
    }

    async addRecipients(options: {
        shareLinkId: string;
        recipients: Array<{ userId: string; permissions: number }>;
    }) {
        const recipients = options.recipients.map((recipient) => ({
            shareLinkId: options.shareLinkId,
            userId: recipient.userId,
            permissions: recipient.permissions,
        }));

        await this.entityManager.save(ShareLinkRecipientEntity, recipients);
    }

    async incrementAccessCount(shareLinkId: string) {
        const shareLink = await this.entityManager.findOne(ShareLinkEntity, {
            where: { id: shareLinkId },
        });

        if (!shareLink) return null;

        shareLink.accessCount += 1;
        shareLink.lastAccessedAt = new Date();
        return await this.entityManager.save(ShareLinkEntity, shareLink);
    }

    async getUserShareLinks(options: {
        userId: string;
        workspaceId: string;
    }) {
        const shareLinks = await this.entityManager
        .createQueryBuilder(ShareLinkEntity, "shareLink")
        .leftJoinAndSelect("shareLink.targets", "targets")
        .leftJoinAndSelect("shareLink.recipients", "recipients")
        .where("shareLink.workspaceId = :workspaceId", { workspaceId: options.workspaceId })
        .andWhere(
            (subQuery) => {
                return subQuery
                .where("shareLink.creatorId = :userId", { userId: options.userId })
                .orWhere("recipients.userId = :userId", { userId: options.userId });
            }
        )
        .orderBy("shareLink.createdAt", "DESC")
        .getMany();

        return shareLinks;
    }

    async deleteShareLink(options: {
        shareLinkId: string;
        workspaceId: string;
        creatorId: string;
    }) {
        const shareLink = await this.entityManager.findOne(ShareLinkEntity, {
            where: { id: options.shareLinkId, workspaceId: options.workspaceId },
        });

        if (!shareLink) return false;

        this.verifyShareLinkOperator({
            shareLink,
            workspaceId: shareLink.workspaceId,
            userId: options.creatorId,
        });


        await this.entityManager.remove(ShareLinkEntity, shareLink);
        return true;
    }

    private async verifyShareLinkOperator(options: {
        shareLink: ShareLinkEntity;
        workspaceId: string;
        userId: string;
    }) {
        if (options.shareLink.creatorId !== options.userId) {
            const workspaceMember = await this.entityManager.findOne(UserWorkspaceEntity, {
                where: {
                    workspaceId: options.workspaceId,
                    userId: options.userId,
                }
            });

            if (!workspaceMember || !hasPermission(workspaceMember.permissions, WORKSPACE_PERMISSIONS.MANAGE)) {
                throw new HTTPException(403, {
                    message: "You do not have permission to update/delete this share link",
                });
            }
        }
    }

    async getTargetShareLinks(options: {
        targetType: "study" | "series" | "instance";
        targetIds: string[];
        workspaceId: string;
        userId: string;
        page: number;
        limit: number
    }) {
        const workspaceMember = await this.entityManager.findOne(UserWorkspaceEntity, {
            where: {
                workspaceId: options.workspaceId,
                userId: options.userId,
            }
        });

        if (!workspaceMember || !hasPermission(workspaceMember.permissions, WORKSPACE_PERMISSIONS.MANAGE)) {
            throw new HTTPException(403, {
                message: "You do not have permission to access this target share links",
            });
        }

        const [shareLinks, total] = await this.entityManager.findAndCount(ShareLinkEntity, {
            where: {
                targets: {
                    targetType: options.targetType,
                    targetId: In(options.targetIds),
                },
            },
            skip: (options.page - 1) * options.limit,
            take: options.limit,
            relations: ["targets", "recipients", "creator", "recipients.user"],
            order: {
                updatedAt: "DESC",
            },
        });

        return {
            shareLinks,
            hasNextPage: total > options.page * options.limit,
            total,
        };
    }

    async getTargetShareLinkCount(options: {
        targetType: "study" | "series" | "instance";
        targetIds: string[];
        workspaceId: string;
        userId: string;
    }) {
        const workspaceMember = await this.entityManager.findOne(UserWorkspaceEntity, {
            where: {
                workspaceId: options.workspaceId,
                userId: options.userId,
            }
        });

        if (!workspaceMember || !hasPermission(workspaceMember.permissions, WORKSPACE_PERMISSIONS.MANAGE)) {
            throw new HTTPException(403, {
                message: "You do not have permission to access this target share links",
            });
        }

        const count = await this.entityManager.count(ShareLinkEntity, {
            where: {
                targets: {
                    targetType: options.targetType,
                    targetId: In(options.targetIds),
                },
            },
        });

        return count;
    }
}
