'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';

interface ImageCropperProps {
    image: string | null;
    aspect?: number;
    onCropComplete: (croppedImage: Blob) => void;
    onCancel: () => void;
    isOpen: boolean;
}

export default function ImageCropper({ image, aspect = 16 / 9, onCropComplete, onCancel, isOpen }: ImageCropperProps) {
    const t = useTranslations('Admin');
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropChange = useCallback((crop: any) => {
        setCrop(crop);
    }, []);

    const onZoomChange = useCallback((zoom: number) => {
        setZoom(zoom);
    }, []);

    const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<Blob> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
            }, 'image/jpeg', 0.9);
        });
    };

    const handleSave = async () => {
        if (!image || !croppedAreaPixels) return;
        try {
            const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
            onCropComplete(croppedBlob);
        } catch (e) {
            console.error(e);
        }
    };

    if (!image) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()} modal={true}>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 overflow-hidden" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle>Crop Image</DialogTitle>
                </DialogHeader>
                <div className="flex-1 relative bg-zinc-900 mt-4 h-full">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteInternal}
                        onZoomChange={onZoomChange}
                    />
                </div>
                <div className="p-6 space-y-4 bg-white">
                    <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold text-zinc-500">{t('zoom')}</Label>
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(vals: number[]) => setZoom(vals[0])}
                        />
                    </div>
                    <DialogFooter className="pt-2">
                        <Button variant="outline" onClick={onCancel}>{t('cancel')}</Button>
                        <Button onClick={handleSave} className="bg-zinc-900 text-white hover:bg-zinc-800">
                            {t('apply_crop')}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
