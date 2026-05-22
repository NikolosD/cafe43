#!/usr/bin/env node
// Migrate images from Supabase Storage to Cloudflare R2.
// Reads image URLs from categories.image_url, items.image_url, item_images.image_url.
// Downloads each from old Supabase public URL, uploads to R2 with the same key,
// then rewrites the URL in DB rows to the R2 public URL.
//
// Required env:
//   SUPABASE_URL                  e.g. https://gqfaoovnwlpcpshwdtea.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY     service role key from Supabase Dashboard
//   R2_ACCOUNT_ID
//   R2_ACCESS_KEY_ID
//   R2_SECRET_ACCESS_KEY
//   R2_BUCKET_NAME                cafe43-images
//   R2_PUBLIC_URL                 https://cdn.cafe43.ge
//   OLD_STORAGE_PREFIX (optional) default = ${SUPABASE_URL}/storage/v1/object/public/menu-images/
//
// Idempotent: if a row's URL already starts with R2_PUBLIC_URL, it is skipped.
// Dry run: pass --dry to see what would happen without writing anything.

import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const {
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME,
    R2_PUBLIC_URL,
    OLD_STORAGE_PREFIX,
} = process.env;

const dry = process.argv.includes('--dry');

const required = { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL };
for (const [k, v] of Object.entries(required)) {
    if (!v) { console.error(`Missing env: ${k}`); process.exit(1); }
}

const oldPrefix = (OLD_STORAGE_PREFIX || `${SUPABASE_URL}/storage/v1/object/public/menu-images/`).replace(/\/$/, '/');
const r2PublicBase = R2_PUBLIC_URL.replace(/\/$/, '');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const r2 = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

function keyFromUrl(url) {
    if (!url) return null;
    if (url.startsWith(r2PublicBase + '/')) return null; // already on R2
    if (url.startsWith(oldPrefix)) return url.slice(oldPrefix.length);
    // Fallback: take last path segment
    try {
        const u = new URL(url);
        return u.pathname.split('/').pop() || null;
    } catch {
        return null;
    }
}

async function existsInR2(key) {
    try {
        await r2.send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
        return true;
    } catch (e) {
        if (e?.$metadata?.httpStatusCode === 404 || e?.name === 'NotFound') return false;
        throw e;
    }
}

async function downloadAndUpload(url, key) {
    if (await existsInR2(key)) return; // resume-safe
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Download failed ${res.status} for ${url}`);
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buf = Buffer.from(await res.arrayBuffer());
    await r2.send(new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buf,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
    }));
}

async function migrateTable(table, idColumn = 'id') {
    console.log(`\n=== ${table} ===`);
    const { data, error } = await supabase.from(table).select(`${idColumn}, image_url`).not('image_url', 'is', null);
    if (error) throw error;
    console.log(`Rows with image_url: ${data.length}`);

    let migrated = 0, skipped = 0, failed = 0;
    for (const row of data) {
        const url = row.image_url;
        if (!url || url.startsWith(r2PublicBase + '/')) { skipped++; continue; }
        const key = keyFromUrl(url);
        if (!key) { console.warn(`  [skip] cannot derive key: ${url}`); failed++; continue; }
        const newUrl = `${r2PublicBase}/${key}`;

        try {
            if (!dry) await downloadAndUpload(url, key);
            if (!dry) {
                const { error: updErr } = await supabase.from(table).update({ image_url: newUrl }).eq(idColumn, row[idColumn]);
                if (updErr) throw updErr;
            }
            migrated++;
            process.stdout.write(`  ${dry ? '[DRY]' : '[OK]'} ${key}\n`);
        } catch (e) {
            failed++;
            console.error(`  [FAIL] ${key}: ${e.message || e}`);
        }
    }
    console.log(`  migrated=${migrated} skipped=${skipped} failed=${failed}`);
}

await migrateTable('categories');
await migrateTable('items');
await migrateTable('item_images');

console.log(dry ? '\nDry run complete.' : '\nMigration complete.');
