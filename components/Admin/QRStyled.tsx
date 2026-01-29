"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling, {
    DrawType,
    TypeNumber,
    Mode,
    ErrorCorrectionLevel,
    DotType,
    CornerSquareType,
    CornerDotType,
    GradientType
} from "qr-code-styling";

interface QRStyledProps {
    data: string;
    qrColor?: string;
    qrColor2?: string; // For gradient
    gradientType?: GradientType;
    bgColor?: string;
    dotsType?: DotType;
    cornersSquareType?: CornerSquareType;
    cornersDotType?: CornerDotType;
    logo?: string;
    logoSize?: number;
    logoMargin?: number;
    errorCorrectionLevel?: ErrorCorrectionLevel;
    onReady?: (qrCode: QRCodeStyling) => void;
}

export default function QRStyled({
    data,
    qrColor = "#000000",
    qrColor2,
    gradientType = "linear",
    bgColor = "#ffffff",
    dotsType = "square",
    cornersSquareType = "square",
    cornersDotType = "square",
    logo,
    logoSize = 0.4,
    logoMargin = 0,
    errorCorrectionLevel = "H",
    onReady
}: QRStyledProps) {
    const [qrCode, setQrCode] = useState<QRCodeStyling>();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const qrCode = new QRCodeStyling({
            width: 300,
            height: 300,
            type: "svg", // Switch to SVG for better performance on updates
            image: logo,
            qrOptions: {
                errorCorrectionLevel: errorCorrectionLevel,
            },
            dotsOptions: {
                type: dotsType,
                gradient: qrColor2 ? {
                    type: gradientType,
                    colorStops: [
                        { offset: 0, color: qrColor },
                        { offset: 1, color: qrColor2 }
                    ]
                } : undefined,
                color: qrColor2 ? undefined : qrColor
            },
            backgroundOptions: {
                color: bgColor,
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: logoMargin,
                imageSize: logoSize
            },
            cornersSquareOptions: {
                color: qrColor,
                type: cornersSquareType
            },
            cornersDotOptions: {
                color: qrColor,
                type: cornersDotType
            }
        });

        setQrCode(qrCode);
        if (onReady) onReady(qrCode);

        // Cleanup
        return () => {
            if (ref.current) {
                ref.current.innerHTML = "";
            }
        };
    }, []);

    useEffect(() => {
        if (!qrCode) return;

        // Debounce slightly to avoid stuttering on rapid slider/color changes
        const timer = setTimeout(() => {
            qrCode.update({
                data: data,
                qrOptions: {
                    errorCorrectionLevel: errorCorrectionLevel,
                },
                dotsOptions: {
                    type: dotsType,
                    gradient: qrColor2 ? {
                        type: gradientType,
                        colorStops: [
                            { offset: 0, color: qrColor },
                            { offset: 1, color: qrColor2 }
                        ]
                    } : undefined,
                    color: qrColor2 ? undefined : qrColor
                },
                backgroundOptions: {
                    color: bgColor,
                },
                cornersSquareOptions: {
                    color: qrColor,
                    type: cornersSquareType
                },
                cornersDotOptions: {
                    color: qrColor,
                    type: cornersDotType
                },
                image: logo,
                imageOptions: {
                    margin: logoMargin,
                    imageSize: logoSize
                }
            });
        }, 50);

        return () => clearTimeout(timer);
    }, [qrCode, data, qrColor, qrColor2, gradientType, bgColor, dotsType, cornersSquareType, cornersDotType, logo, logoSize, logoMargin, errorCorrectionLevel]);

    useEffect(() => {
        if (ref.current && qrCode) {
            ref.current.innerHTML = "";
            qrCode.append(ref.current);
        }
    }, [qrCode, ref]);

    return <div ref={ref} className="qr-container" />;
}
