import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserRole } from '@/lib/db';

// POST - Create new user
export async function POST(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        // Check if current user is superadmin
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentRole = await getUserRole(supabase, currentUser.id);
        if (currentRole?.role !== 'superadmin') {
            return NextResponse.json({ error: 'Forbidden - Superadmin only' }, { status: 403 });
        }

        const { email, password, role } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        // Create user using admin API
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
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

        // Update role if superadmin was requested
        if (role === 'superadmin') {
            const { error: roleError } = await supabase
                .from('user_roles')
                .update({ role })
                .eq('user_id', authData.user.id);

            if (roleError) {
                return NextResponse.json({ error: roleError.message }, { status: 500 });
            }
        }

        return NextResponse.json({ user: authData.user }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        // Check if current user is superadmin
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentRole = await getUserRole(supabase, currentUser.id);
        if (currentRole?.role !== 'superadmin') {
            return NextResponse.json({ error: 'Forbidden - Superadmin only' }, { status: 403 });
        }

        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Prevent deleting yourself
        if (userId === currentUser.id) {
            return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
        }

        // Delete user
        const { error } = await supabase.auth.admin.deleteUser(userId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
