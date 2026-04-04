import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserRole } from '@/lib/db';

async function verifySuperadmin() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const role = await getUserRole(supabase, user.id);
    if (role?.role !== 'superadmin') return null;
    return user;
}

// POST - Create new user
export async function POST(request: NextRequest) {
    try {
        const currentUser = await verifySuperadmin();
        if (!currentUser) {
            return NextResponse.json({ error: 'Forbidden - Superadmin only' }, { status: 403 });
        }

        const { email, password, role } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        const adminSupabase = createAdminClient();

        const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        if (!authData.user) {
            return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
        }

        if (role === 'admin' || role === 'superadmin') {
            const { error: roleError } = await adminSupabase
                .from('user_roles')
                .upsert({ user_id: authData.user.id, role }, { onConflict: 'user_id' });

            if (roleError) {
                return NextResponse.json({ error: 'Failed to assign role' }, { status: 500 });
            }
        }

        return NextResponse.json({ user: authData.user }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest) {
    try {
        const currentUser = await verifySuperadmin();
        if (!currentUser) {
            return NextResponse.json({ error: 'Forbidden - Superadmin only' }, { status: 403 });
        }

        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        if (userId === currentUser.id) {
            return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
        }

        const adminSupabase = createAdminClient();
        const { error } = await adminSupabase.auth.admin.deleteUser(userId);

        if (error) {
            return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
