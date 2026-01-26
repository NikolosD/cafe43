import createMiddleware from "next-intl/middleware";
import { updateSession } from "@/lib/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
    locales: ["ru", "en", "ge"],
    defaultLocale: "ge",
    localePrefix: "always",
});

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // ✅ Admin routes: no locale redirect/rewrite
    if (pathname.startsWith("/admin")) {
        const response = NextResponse.next();
        return await updateSession(request, response);
    }

    // Normal public routes (menu) use intl middleware
    const response = intlMiddleware(request);
    return await updateSession(request, response);
}

export const config = {
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};