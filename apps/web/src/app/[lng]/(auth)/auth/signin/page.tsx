"use client";

import { getProviders, signIn } from "@hono/auth-js/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useT } from "@/app/_i18n/client";
import logoBackground from "../../../../../../public/login-background.png";

export default function SignInPage() {
    const { t } = useT("translation");

    const [providers, setProviders] = useState<Awaited<ReturnType<typeof getProviders>> | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const getErrorMessage = (error: string) => {
        if (!error) return null;

        switch (error) {
            case "OAuthAccountNotLinked":
                return t("auth.errorMessages.OAuthAccountNotLinked");
            default:
                return t("auth.errorMessages.Unknown");
        }
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: only run on mount
        useEffect(() => {
        getProviders().then((providers) => {
            setProviders(providers);
        });
        const params = new URLSearchParams(window.location.search);
        const error = params.get("error");
        if (error) {
            setErrorMessage(getErrorMessage(error));
        }
    }, []);

    return (
        <div className="flex w-full h-dvh">
            {/* 左側：黑色背景 + 登入卡片 / Left: black background + login card */}
            <div className="flex items-center justify-center w-full md:w-[55%] bg-zinc-900">
                <div className="flex flex-col justify-center items-center w-80 text-xl">
                    <h2 className="flex items-center mb-4 space-x-2 text-3xl font-light">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="p-2 text-white rounded-full size-12 bg-zinc-800"
                            viewBox="0 0 24 24"
                        >
                            <title>layers</title>
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                        <span className="text-4xl font-medium text-white">
                            Brigid
                        </span>
                    </h2>
                    <div className="flex flex-col gap-2 p-6 m-8 w-full bg-white rounded shadow-lg">
                        {errorMessage && (
                            <div className="p-3 mb-4 text-sm text-red-600 border border-red-200 rounded bg-red-50">
                                {errorMessage}
                            </div>
                        )}
                        {Object.values(providers ?? {}).map((provider) => (
                            <form
                                className="[&>div]:last-of-type:hidden"
                                key={provider.id}
                                action={async (formData) => {
                                    if (provider.id === "credentials") {
                                        await signIn(provider.id, {
                                            redirectTo: "/",
                                            password: formData.get("password"),
                                        });
                                    } else {
                                        await signIn(provider.id, {
                                            redirectTo: "/",
                                        });
                                    }
                                }}
                            >
                                <button
                                    type="submit"
                                    className="flex justify-center items-center px-4 mt-2 space-x-2 w-full h-12 text-base font-light text-white rounded transition focus:ring-2 focus:ring-offset-2 focus:outline-none bg-zinc-800 hover:bg-zinc-900 focus:ring-zinc-800"
                                >
                                    <span>Sign in with {provider.name}</span>
                                </button>
                                <div className="flex gap-2 items-center my-4">
                                    <div className="flex-1 bg-neutral-300 h-[1px]" />
                                    <span className="text-xs leading-4 uppercase text-neutral-500">
                                        or
                                    </span>
                                    <div className="flex-1 bg-neutral-300 h-[1px]" />
                                </div>
                            </form>
                        ))}
                    </div>
                </div>
            </div>

            {/* 右側：背景圖片 / Right: background image */}
            <div className="relative hidden md:block flex-1">
                <Image
                    src={logoBackground}
                    alt="Login Background"
                    fill
                    className="object-cover object-right"
                />
            </div>
        </div>
    );
}
