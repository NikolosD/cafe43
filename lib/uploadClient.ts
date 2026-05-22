import imageCompression from 'browser-image-compression';

const COMPRESSION_OPTS = {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
};

export async function uploadImage(file: File): Promise<string> {
    let compressed: File = file;
    try {
        compressed = await imageCompression(file, COMPRESSION_OPTS);
    } catch (e) {
        console.error('Compression failed, uploading original:', e);
    }

    const form = new FormData();
    form.append('file', compressed, compressed.name || 'image.jpg');

    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Upload failed (${res.status})`);
    }
    const { url } = await res.json();
    return url as string;
}

export async function deleteImage(url: string | null) {
    if (!url) return;
    await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
    }).catch(() => { /* best-effort cleanup */ });
}
