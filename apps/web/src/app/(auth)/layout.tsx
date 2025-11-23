import type { Metadata } from "next";
import Providers from "@/app/providers";

export const metadata: Metadata = {
    title: "Sign In - Brigid",
    description: "Brigid PACS Sign In",
};

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
