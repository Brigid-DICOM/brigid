import { i18n } from "@/lib/i18n";
import { redirect } from "next/navigation";

export async function generateStaticParams() {
    return i18n.languages.map((lang) => ({ lang }));
}

export default async function Page() {
    const { defaultLanguage} = i18n;

    redirect(`/${defaultLanguage}`);
}