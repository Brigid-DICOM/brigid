

export type ShareTargetType = "study" | "series" | "instance";

export interface ShareLinkRecipient {
    userId: string;
    permissions: number;
    user: {
        id: string;
        name: string;
        email: string;
        image?: string;
    };
}

export interface ShareLinkTarget {
    id: string;
    targetType: ShareTargetType;
    targetId: string;
}

export interface ClientShareLinkData {
    id: string;
    creatorId: string;
    workspaceId: string;
    token: string;
    publicPermissions: number;
    requiredPassword: boolean;
    accessCount: number;
    createdAt: Date;
    name?: string;
    description?: string;
    expiresInSec?: number;
    expiresAt?: Date;
    recipients: ShareLinkRecipient[];
    targets: ShareLinkTarget[];
}

export interface ApiShareLinkData {
    id: string;
    creatorId: string;
    workspaceId: string;
    token: string;
    publicPermissions: number;
    requiredPassword: boolean;
    accessCount: number;
    createdAt: string;
    name?: string;
    description?: string;
    expiresInSec?: number;
    expiresAt?: string;
    recipients: ShareLinkRecipient[];
    targets: ShareLinkTarget[];
}