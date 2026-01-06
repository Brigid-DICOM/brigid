import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import { getT } from "@/app/_i18n";
import { languages } from "@/app/_i18n/settings";
import Providers from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export async function generateStaticParams() {
    return languages.map((lng) => ({ lng }));
}

export async function generateMetadata() {
    const { t } = await getT("translation");

    return {
        title: t("common.title"),
        description: t("common.description"),
    };
}

export default async function LanguageLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{
        lng: string;
    }>;
}>) {
    const { lng } = await params;
    const runtimeUrl = process.env.NEXT_PUBLIC_APP_URL;
    const authEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTH === "true";

    return (
        <html lang={lng}>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Script id="env-script" strategy="beforeInteractive">
                    {`window.ENV = { NEXT_PUBLIC_APP_URL: ${JSON.stringify(runtimeUrl)}, NEXT_PUBLIC_ENABLE_AUTH: ${JSON.stringify(authEnabled)} };`}
                </Script>
                <NextTopLoader color="var(--primary)" showSpinner={false} />

                <Providers>{children}</Providers>

                <Toaster richColors />
            </body>
        </html>
    );
}
