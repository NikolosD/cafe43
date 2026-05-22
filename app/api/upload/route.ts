import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { uploadToR2, deleteFromR2, keyFromPublicUrl } from '@/lib/r2';

export const runtime = 'nodejs';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

async function requireAdmin() {
    const supabase = createClient(cookies());
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return user;
}

export async function POST(req: NextRequest) {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
        return NextResponse.json({ error: 'No file' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: 'File too large' }, { status: 413 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json({ error: 'Unsupported type' }, { status: 415 });
    }

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const key = `${crypto.randomUUID()}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());

    const publicUrl = await uploadToR2(key, buf, file.type);
    return NextResponse.json({ url: publicUrl, key });
}

export async function DELETE(req: NextRequest) {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { url } = await req.json().catch(() => ({ url: null }));
    if (typeof url !== 'string') {
        return NextResponse.json({ error: 'url required' }, { status: 400 });
    }
    const key = keyFromPublicUrl(url);
    if (!key) {
        return NextResponse.json({ ok: true, skipped: true });
    }
    await deleteFromR2(key);
    return NextResponse.json({ ok: true });
}
