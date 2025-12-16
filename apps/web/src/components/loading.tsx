import { Loader2Icon } from "lucide-react";
import { getT } from "@/app/_i18n";

export default async function Loading() {
    const { t } = await getT("translation");

    return (
        <div className="px-4 py-8 min-h-[calc(100vh-65px)] flex items-center justify-center">
            <div className="flex items-center space-x-4">
                <Loader2Icon className="size-10 animate-spin" />
                <span className="text-lg font-medium">
                    {t("common.loading")}
                </span>
            </div>
        </div>
    );
}
