import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { translate } from 'google-translate-api-x';

function toTitleCase(str: string) {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

export async function POST(request: Request) {
    try {
        // Auth check - only admin users can translate
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify admin role
        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

        if (!roleData || (roleData.role !== 'admin' && roleData.role !== 'superadmin')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { text, target, source = 'ka', format } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const res = await translate(text, {
            to: target,
            from: source,
        }) as any;

        let translatedText = res.text;

        if (format === 'title') {
            translatedText = toTitleCase(translatedText);
        }

        return NextResponse.json({ text: translatedText });
    } catch {
        return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
    }
}
