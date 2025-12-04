import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const nextAuthCookie = request.cookies.get("authjs.session-token");

    if (url.pathname.startsWith("/auth/signin")) {
        if (nextAuthCookie) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    if (!nextAuthCookie) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    const session = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/session`, {
        headers: {
            Cookie: request.cookies.toString()
        }
    });

    const sessionData = await session.json();

    if (!sessionData || !sessionData.user) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/:workspaceId/dicom-recycle/:path*",
        "/:workspaceId/dicom-upload/:path*",
        "/:workspaceId/dicom-studies/:path*",
        "/auth/signin"
    ]
}