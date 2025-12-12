import type { Metadata } from "next";
import Providers from "@/app/providers";
import { getT } from "@/app/_i18n";

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }): Promise<Metadata> {
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
            <Providers>
                {children}
            </Providers>
        </div>
    );
}
