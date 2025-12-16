"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { TFunction } from "i18next";
import { AlertCircleIcon, FileIcon, FolderIcon, LockIcon } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useT } from "@/app/_i18n/client";
import { LoadingGrid } from "@/components/common/loading-grid";
import SharedInstancesView from "@/components/share/public-views/shared-instances-view";
import SharedSeriesView from "@/components/share/public-views/shared-series-view";
import SharedStudiesView from "@/components/share/public-views/shared-studies-view";
import { ShareCreateTagDialogProvider } from "@/components/share/tag/share-create-tag-dialog-provider";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getQueryClient } from "@/react-query/get-query-client";
import { getPublicShareLinkQuery, verifyPasswordMutation } from "@/react-query/queries/publicShare";

interface ShareContentProps {
    token: string;
}

export default function ShareContent({
    token,
}: ShareContentProps) {
    const { t } = useT("translation");
    const queryClient = getQueryClient();

    const [password, setPassword] = useState("");
    const [showPasswordInput, setShowPasswordInput] = useState(false);

    const { data, isLoading, error } = useQuery({
        ...getPublicShareLinkQuery({
            token
        }),
        refetchOnWindowFocus: false,
    });

    const { mutate: verifyPassword, isPending: isVerifyingPassword, error: verifyPasswordError } = useMutation({
        ...verifyPasswordMutation({
            token,
            password
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["public-share-link", token],
            })
            setShowPasswordInput(false);
        }
    });

    const handlePasswordSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            verifyPassword()
        },
        [verifyPassword],
    );

    useEffect(() => {
        if (error?.message === "Password is required" ||
            error?.message === "Invalid password") {
            setShowPasswordInput(true);
        } else {
            setShowPasswordInput(false);
        }
    }, [error]);

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto space-y-6">
                <Card>
                    <CardHeader className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-24" />
                    </CardHeader>
                </Card>

                <LoadingGrid itemCount={10} />
            </div>
        );
    }

    // Password protected content
    if (showPasswordInput || error?.message === "Password is required") {
        return (
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <LockIcon className="size-6 text-primary" />
                        </div>
                        <CardTitle>{t("sharePublicView.passwordProtected.title")}</CardTitle>
                        <CardDescription>
                            {t("sharePublicView.passwordProtected.description")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordSubmit}>
                            <Input
                                type="password"
                                placeholder={t("sharePublicView.passwordProtected.placeholder")}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isVerifyingPassword}
                                autoFocus
                            />
                            {verifyPasswordError?.message === "Invalid password" && (
                                <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                                    <AlertCircleIcon className="size-4" />
                                    {t("sharePublicView.passwordProtected.invalidPassword")}
                                </p>
                            )}
                            <Button 
                                type="submit" 
                                className="w-full mt-4"
                                disabled={isVerifyingPassword}
                            >
                                {isVerifyingPassword ? t("sharePublicView.passwordProtected.verifying") : t("sharePublicView.passwordProtected.unlock")}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Error state
    if (error || !data?.ok) {
        return (
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertCircleIcon className="size-6 text-destructive" />
                        </div>
                        <CardTitle>{t("sharePublicView.error.title")}</CardTitle>
                        <CardDescription>
                            {error?.message ||
                                t("sharePublicView.error.defaultMessage")}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    const shareData = data.data;
    const { targetType, description, targets } = shareData;

    const getTargetIcon = () => {
        switch (targetType) {
            case "study":
                return <FolderIcon className="size-5 text-primary" />;
            case "series":
                return <FolderIcon className="size-5 text-primary" />;
            case "instance":
                return <FileIcon className="size-5 text-primary" />;
            default:
                return <FolderIcon className="size-5 text-primary" />;
        }
    };

    const getTargetTitle = () => {
        switch (targetType) {
            case "study":
                return "Studies";
            case "series":
                return "Series";
            case "instance":
                return "Instances";
            default:
                return "Content";
        }
    };

    // Get count label based on target type
    const getCountLabel = (t: TFunction) => {
        const count = targets.length;
        switch (targetType) {
            case "study":
                return count === 1 ? t("sharePublicView.countLabel.study", { count }) : t("sharePublicView.countLabel.studies", { count });
            case "series":
                return t("sharePublicView.countLabel.series", { count });
            case "instance":
                return count === 1 ? t("sharePublicView.countLabel.instance", { count }) : t("sharePublicView.countLabel.instances", { count });
            default:
                return t("sharePublicView.countLabel.items", { count });
        }
    };

    return (
        <>
            <div className="mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                                {getTargetIcon()}
                            </div>
                            <div>
                                <CardTitle className="capitalize">
                                    {t("sharePublicView.sharedTitle", { targetType: getTargetTitle() })}
                                </CardTitle>
                                {description && (
                                    <CardDescription>
                                        {description}
                                    </CardDescription>
                                )}
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                            {getCountLabel(t)}
                        </div>
                    </CardHeader>
                </Card>

                {targetType === "study" && (
                    <SharedStudiesView
                        token={token}
                        password={password}
                        publicPermissions={shareData.publicPermissions}
                    />
                )}

                {targetType === "series" && (
                    <SharedSeriesView
                        token={token}
                        password={password}
                        publicPermissions={shareData.publicPermissions}
                    />
                )}

                {targetType === "instance" && (
                    <SharedInstancesView
                        token={token}
                        password={password}
                        publicPermissions={shareData.publicPermissions}
                    />
                )}
            </div>

            <ShareCreateTagDialogProvider />
        </>
    );
}
