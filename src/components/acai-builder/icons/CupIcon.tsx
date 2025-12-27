import React from 'react';

interface CupIconProps extends React.SVGProps<SVGSVGElement> {
    fillColor?: string;
    lidColor?: string;
}

export const CupIcon = ({ fillColor = "#F3E8FF", lidColor = "currentColor", ...props }: CupIconProps) => {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            {/* Cup Body */}
            <path
                d="M20 25 L28 85 C29 92 34 95 50 95 C66 95 71 92 72 85 L80 25"
                fill={fillColor}
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Cup Rim/Lid Area - slightly curved to give 3D effect */}
            <ellipse
                cx="50"
                cy="25"
                rx="30"
                ry="8"
                fill={lidColor}
                fillOpacity="0.1"
                stroke="currentColor"
                strokeWidth="4"
            />

            {/* Açaí Contents (optional detail) */}
            <path
                d="M25 35 C35 45 65 45 75 35 L73 80 C72 88 68 90 50 90 C32 90 28 88 27 80 Z"
                fill="#6D214F"
                fillOpacity="0.8"
            />

            {/* Straw (optional) */}
            <path
                d="M60 25 L75 5"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
            />
        </svg>
    );
};
