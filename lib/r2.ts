import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET_NAME;
const publicBaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) {
    throw new Error('Missing R2 environment variables');
}

export const r2 = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
});

export const R2_BUCKET = bucket;
export const R2_PUBLIC_BASE_URL = publicBaseUrl.replace(/\/$/, '');

export async function uploadToR2(key: string, body: Buffer | Uint8Array, contentType: string) {
    await r2.send(new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
    }));
    return `${R2_PUBLIC_BASE_URL}/${key}`;
}

export async function deleteFromR2(key: string) {
    await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
}

export function keyFromPublicUrl(url: string): string | null {
    if (!url.startsWith(R2_PUBLIC_BASE_URL + '/')) return null;
    return url.slice(R2_PUBLIC_BASE_URL.length + 1);
}
