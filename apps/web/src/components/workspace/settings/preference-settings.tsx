"use client";

import { useParams, usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useT } from "@/app/_i18n/client";
import i18next from "@/app/_i18n/i18next";
import { languages } from "@/app/_i18n/settings";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function PreferenceSettings() {
    const { t } = useT("translation");
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const currentLng = params?.lng as string;

    const handleLanguageChange = async (newLanguage: string) => {
        if (!currentLng || newLanguage === currentLng) return;

        i18next.changeLanguage(newLanguage, () => {
            const segment = pathname.split("/");
            if (segment[1] === currentLng) {
                segment[1] = newLanguage;
                const newPath = segment.join("/");
                router.push(newPath);
            }
        });
    };

    const getLanguageLabel = (language: string) => {
        switch (language) {
            case "en":
                return "English";
            case "zh-TW":
                return "繁體中文";
            default:
                return language;
        }
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex-1 gap-6 overflow-y-auto p-6">
                <div className="grid gap-4 mb-3">
                    <div className="space-y-1 flex items-center gap-2">
                        <h3 className="text-lg font-medium">
                            {t("workspaceSettings.preferencesTab.title")}
                        </h3>
                    </div>
                </div>

                <Separator className="mb-3" />
                <div className="grid gap-2">
                    <div className="space-y-1">
                        <h4 className="text-sm font-medium leading-none">
                            {t("workspaceSettings.preferencesTab.Language")}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            {t("workspaceSettings.preferencesTab.LanguageDesc")}
                        </p>
                    </div>

                    <Select
                        value={currentLng}
                        onValueChange={(value) => handleLanguageChange(value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((lng) => (
                                <SelectItem key={lng} value={lng}>
                                    {getLanguageLabel(lng)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
