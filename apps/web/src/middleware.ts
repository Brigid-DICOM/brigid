import acceptLanguage from "accept-language";
import { type NextRequest, NextResponse } from "next/server";
import {
    cookieName,
    fallbackLng,
    headerName,
    languages,
} from "./app/_i18n/settings";

acceptLanguage.languages(languages);

export async function middleware(request: NextRequest) {
    // # region i18n
    let lng: string | undefined | null;

    // Try to get the language from the cookie
    if (request.cookies.has(cookieName))
        lng = acceptLanguage.get(request.cookies.get(cookieName)?.value);

    // If no cookie, check the Accept-Language header
    if (!lng) lng = acceptLanguage.get(request.headers.get("Accept-Language"));

    // Default to he fallback language if stull undefined/null
    if (!lng) lng = fallbackLng;

    // Check if the language is already in the path
    const lngInPath = languages.find((loc) =>
        request.nextUrl.pathname.startsWith(`/${loc}`),
    );
    // If language is in path, prioritize it over cookie
    if (lngInPath) lng = lngInPath;
    const headers = new Headers(request.headers);
    headers.set(headerName, lngInPath ?? lng);
    headers.set(cookieName, lngInPath ?? lng);

    // if the language is not in the path, redirect to include it
    if (!lngInPath && !request.nextUrl.pathname.startsWith(`/_next`) && !request.nextUrl.pathname.startsWith(`/html`)) {
        return NextResponse.redirect(
            new URL(
                `/${lng}${request.nextUrl.pathname}${request.nextUrl.search}`,
                request.url,
            ),
        );
    }
    // # endregion i18n

    // # region NextAuth

    const url = request.nextUrl;
    const nextAuthCookie = request.cookies.get("authjs.session-token");

    if (url.pathname.startsWith(`/${lng}/auth/signin`)) {
        if (nextAuthCookie) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    if (!url.pathname.includes(`/share`)) {
        if (!nextAuthCookie) {
            return NextResponse.redirect(
                new URL(`/${lng}/auth/signin`, request.url),
            );
        }

        const session = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/session`,
            {
                headers: {
                    Cookie: request.cookies.toString(),
                },
            },
        );

        const sessionData = await session.json();

        if (!sessionData || !sessionData.user) {
            return NextResponse.redirect(
                new URL(`/${lng}/auth/signin`, request.url),
            );
        }
    }
    // # endregion NextAuth

    const response = NextResponse.next({ headers });
    // Sync cookie if path language differs from cookie
    if (lngInPath && request.cookies.get(cookieName)?.value !== lngInPath) {
        response.cookies.set(cookieName, lngInPath);
    }

    return response;
}

export const config = {
    matcher: [
        "/",
        "/:lng/:workspaceId/dicom-recycle/:path*",
        "/:lng/:workspaceId/dicom-upload/:path*",
        "/:lng/:workspaceId/dicom-studies/:path*",
        "/auth/signin",
        // Avoid matching for static files, API routes, etc.
        "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)",
    ],
};
