"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { useT } from "@/app/_i18n/client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getQueryClient } from "@/react-query/get-query-client";
import { createWorkspaceMutation } from "@/react-query/queries/workspace";

interface CreateWorkspaceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateWorkspaceDialog({
    open,
    onOpenChange,
}: CreateWorkspaceDialogProps) {
    const { t } = useT("translation");
    const [name, setName] = useState("");
    const router = useRouter();
    const queryClient = getQueryClient();
    const createWorkspace = useMutation(createWorkspaceMutation());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) return;

        try {
            const result = await createWorkspace.mutateAsync(name);

            toast.success(t("createWorkspace.success"));
            setName("");
            onOpenChange(false);

            await queryClient.invalidateQueries({ queryKey: ["workspaces"] });

            router.push(`/${result.workspace.id}`);
        } catch (error) {
            console.error(t("createWorkspace.error"), error);
            toast.error(t("createWorkspace.error"));
        }
    };

    return createPortal(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t("createWorkspace.title")}</DialogTitle>
                        <DialogDescription>
                            {t("createWorkspace.description")}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                {t("createWorkspace.name")}
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                placeholder={t("createWorkspace.placeholder")}
                                autoFocus
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant={"outline"}
                            onClick={() => onOpenChange(false)}
                        >
                            {t("createWorkspace.cancel")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={createWorkspace.isPending}
                        >
                            {createWorkspace.isPending
                                ? t("createWorkspace.creating")
                                : t("createWorkspace.create")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>,
        document.body,
    );
}
