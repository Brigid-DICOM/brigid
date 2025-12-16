import type { Metadata } from "next";
import { getT } from "@/app/_i18n";
import Providers from "@/app/providers";

export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getT("translation");
    return {
        title: t("auth.title"),
        description: t("auth.description"),
    };
}

export default function SignInLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <Providers>{children}</Providers>
        </div>
    );
}
