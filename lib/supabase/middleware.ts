import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, response: NextResponse) {
    let supabaseResponse = response;

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    supabaseResponse.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    supabaseResponse.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Protected Routes Check
    const isLoginPath = request.nextUrl.pathname.includes('/admin/login')
    const isAdminPath = request.nextUrl.pathname.includes('/admin')
    const isUsersPath = request.nextUrl.pathname.includes('/admin/users')

    if (isAdminPath && !isLoginPath && !user) {
        // Redirect to login if not authenticated
        const localeMatch = request.nextUrl.pathname.match(/^\/([a-z]{2})\//)
        const locale = localeMatch ? localeMatch[1] : 'ge'

        const url = request.nextUrl.clone()
        url.pathname = `/${locale}/admin/login`
        return NextResponse.redirect(url)
    }

    // Check role for users management page
    if (isUsersPath && user) {
        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single()

        if (roleData?.role !== 'superadmin') {
            // Redirect to categories if not superadmin
            const localeMatch = request.nextUrl.pathname.match(/^\/([a-z]{2})\//)
            const locale = localeMatch ? localeMatch[1] : 'ge'
            
            const url = request.nextUrl.clone()
            url.pathname = `/${locale}/admin/categories`
            return NextResponse.redirect(url)
        }
    }

    if (isLoginPath && user) {
        // Redirect to dashboard if already authenticated
        const localeMatch = request.nextUrl.pathname.match(/^\/([a-z]{2})\//)
        const locale = localeMatch ? localeMatch[1] : 'ge'

        const url = request.nextUrl.clone()
        url.pathname = `/${locale}/admin/categories`
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
