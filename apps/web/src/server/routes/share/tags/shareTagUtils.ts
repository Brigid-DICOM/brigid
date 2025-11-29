import { AppDataSource } from "@brigid/database";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import type { ShareLinkEntity } from "@brigid/database/src/entities/shareLink.entity";
import type { TagTargetType } from "@brigid/database/src/entities/tagAssignment.entity";
import { In } from "typeorm";

interface Target {
    targetType: TagTargetType;
    targetId: string;
}

interface BatchVerifyResult {
    allowed: Target[];
    denied: Target[];
}

export async function batchVerifyTargetAccess(
    shareLink: ShareLinkEntity,
    targets: Target[]
): Promise<BatchVerifyResult> {
    const shareLinkTargetType = shareLink.targets[0]?.targetType;
    const shareLinkTargetIds = new Set(shareLink.targets.map(t => t.targetId));

    const allowed: Target[] = [];
    const denied: Target[] = [];

    // Group target by type
    const studyTargets = targets.filter(t => t.targetType === "study");
    const seriesTargets = targets.filter(t => t.targetType === "series");
    const instanceTargets = targets.filter(t => t.targetType === "instance");

    if (shareLinkTargetType === "study") {
        for (const target of studyTargets) {
            if (shareLinkTargetIds.has(target.targetId)) {
                allowed.push(target);
            } else {
                denied.push(target);
            }
        }

        if (seriesTargets.length > 0) {
            const allowedSeriesIds = await batchVerifySeriesUnderStudies(
                shareLink.workspaceId,
                Array.from(shareLinkTargetIds),
                seriesTargets.map(t => t.targetId)
            );

            for (const target of seriesTargets) {
                if (allowedSeriesIds.has(target.targetId)) {
                    allowed.push(target);
                } else {
                    denied.push(target);
                }
            }
        }

        if (instanceTargets.length > 0) {
            const allowedInstanceUids = await batchVerifyInstancesUnderStudies(
                shareLink.workspaceId,
                Array.from(shareLinkTargetIds),
                instanceTargets.map(t => t.targetId)
            );

            for (const target of instanceTargets) {
                if (allowedInstanceUids.has(target.targetId)) {
                    allowed.push(target);
                } else {
                    denied.push(target);
                }
            }
        }
    } else if (shareLinkTargetType === "series") {
        // share link 為 series，父層的 study 不應該被更新
        denied.push(...studyTargets);

        for (const target of seriesTargets) {
            if (shareLinkTargetIds.has(target.targetId)) {
                allowed.push(target);
            } else {
                denied.push(target);
            }
        }

        if (instanceTargets.length > 0) {
            const allowedInstanceUids = await batchVerifyInstancesUnderSeries(
                shareLink.workspaceId,
                Array.from(shareLinkTargetIds),
                instanceTargets.map(t => t.targetId)
            );

            for (const target of instanceTargets) {
                if (allowedInstanceUids.has(target.targetId)) {
                    allowed.push(target);
                } else {
                    denied.push(target);
                }
            }
        }
    } else if (shareLinkTargetType === "instance") {
        denied.push(...studyTargets);
        denied.push(...seriesTargets);

        for (const target of instanceTargets) {
            if (shareLinkTargetIds.has(target.targetId)) {
                allowed.push(target);
            } else {
                denied.push(target);
            }
        }
    } else {
        denied.push(...targets);
    }

    return {
        allowed,
        denied,
    };
}

/**
 * 批量驗證 series 是否屬於指定的 studies
 * @param workspaceId 
 * @param studyInstanceUids 
 * @param seriesInstanceUids 
 * @returns 
 */
async function batchVerifySeriesUnderStudies(
    workspaceId: string,
    studyInstanceUids: string[],
    seriesInstanceUids: string[]
) {
    if (seriesInstanceUids.length === 0) return new Set();

    const seriesRepo = AppDataSource.getRepository(SeriesEntity);
    const validSeries = await seriesRepo.find({
        where: {
            workspaceId,
            seriesInstanceUid: In(seriesInstanceUids),
            studyInstanceUid: In(studyInstanceUids)
        },
        select: {
            seriesInstanceUid: true,
        }
    });

    return new Set(validSeries.map(s => s.seriesInstanceUid));
}

async function batchVerifyInstancesUnderStudies(
    workspaceId: string,
    studyInstanceUids: string[],
    sopInstanceUids: string[],
) {
    if (sopInstanceUids.length === 0) return new Set();

    const seriesRepo = AppDataSource.getRepository(SeriesEntity);
    const series = await seriesRepo.find({
        where: {
            workspaceId,
            studyInstanceUid: In(studyInstanceUids)
        },
        select: {
            seriesInstanceUid: true,
        }
    });

    if (series.length === 0) return new Set();

    const instanceRepo = AppDataSource.getRepository(InstanceEntity);
    const validInstances = await instanceRepo.find({
        where: {
            workspaceId,
            sopInstanceUid: In(sopInstanceUids),
            seriesInstanceUid: In(series.map(s => s.seriesInstanceUid)),
            studyInstanceUid: In(studyInstanceUids),
        },
        select: {
            sopInstanceUid: true
        }
    });

    return new Set(validInstances.map(i => i.sopInstanceUid));
}

async function batchVerifyInstancesUnderSeries(
    workspaceId: string,
    seriesInstanceUids: string[],
    sopInstanceUids: string[],
) {
    if (sopInstanceUids.length === 0) return new Set();

    const instanceRepo = AppDataSource.getRepository(InstanceEntity);
    const validInstances = await instanceRepo.find({
        where: {
            workspaceId,
            sopInstanceUid: In(sopInstanceUids),
            seriesInstanceUid: In(seriesInstanceUids),
        },
        select: {
            sopInstanceUid: true
        }
    });

    return new Set(validInstances.map(i => i.sopInstanceUid));
}

export async function verifyTargetAccess(
    shareLink: ShareLinkEntity,
    targetType: "study" | "series" | "instance",
    targetId: string
) {
    const result = await batchVerifyTargetAccess(
        shareLink,
        [
            {
                targetType,
                targetId
            }
        ]
    );

    return result.allowed.length > 0;
}