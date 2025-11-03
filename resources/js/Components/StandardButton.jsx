import React from "react";

const StandardButton = ({
    color,
    size,
    onClick,
    text,
                        }) => {
    return (
        <a className={`button ${color} !w-full md:!${size} !flex items-center justify-center gap-2 `}
           href={onClick}>
            <span className="ml-auto">{text}</span>
            <span className="text-white inline-flex items-center self-end ml-auto">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M13 3l8 8-8 8-2-2 4.59-4.59H3v-2h12.59L11 5l2-2z" />
                </svg>
            </span>
        </a>
    );
};

export default StandardButton;
