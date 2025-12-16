// refer to https://github.com/lobehub/lobe-chat/blob/main/src/libs/next-auth/sso-providers/casdoor.ts

import type { OIDCConfig, OIDCUserConfig } from "@auth/core/providers";

export interface CasdoorProfile extends Record<string, any> {
    avatar: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
    firstName: string;
    id: string;
    lastName: string;
    name: string;
    owner: string;
    permanentAvatar: string;
}

export default function Casdoor(
    config: OIDCUserConfig<CasdoorProfile>,
): OIDCConfig<CasdoorProfile> {
    return {
        ...config,
        id: "casdoor",
        name: "Casdoor",
        profile(profile) {
            return {
                email: profile.email,
                emailVerified: profile.emailVerified,
                id: profile.id,
                image: profile.avatar,
                name:
                    profile.displayName ??
                    profile.firstName ??
                    profile.lastName,
                providerAccountId: profile.id,
            };
        },
        type: "oidc",
    };
}
