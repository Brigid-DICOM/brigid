import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import Loading from "@/components/loading";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Brigid",
    description: "Brigid PACS",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Suspense fallback={<Loading />}>
                    <NextTopLoader 
                        color="var(--primary)"
                        showSpinner={false}
                    />
                    
                    <Providers>
                        {children}
                    </Providers>

                    <Toaster richColors />
                </Suspense>
            </body>
        </html>
    );
}
