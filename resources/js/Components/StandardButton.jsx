import React from "react";

const StandardButton = ({
                            classes,
                            onClick,
                            text,
                            ctaProps = [],
                        }) => {

    return (
        <button className={`${classes} uppercase rounded-lg px-4 py-3 text-sm font-medium text-center flex items-center justify-center gap-2`}
           onClick={onClick} {...ctaProps}>
            <span className="ml-auto">{text}</span>
            <span className={`ml-auto`}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M13 3l8 8-8 8-2-2 4.59-4.59H3v-2h12.59L11 5l2-2z" />
                </svg>
            </span>
        </button>
    );
};

export default StandardButton;
