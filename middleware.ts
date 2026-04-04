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

    // Admin routes FIRST: supabase auth required (must check before broad string matching)
    if (pathname.includes("/admin")) {
        const response = NextResponse.next();
        return await updateSession(request, response);
    }

    // Public menu routes: только intl middleware, без supabase (быстрее)
    if (pathname.includes("/menu") || pathname === "/" || pathname === "/ru" || pathname === "/en" || pathname === "/ge") {
        return intlMiddleware(request);
    }

    // Остальные маршруты - только intl
    return intlMiddleware(request);
}

export const config = {
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
