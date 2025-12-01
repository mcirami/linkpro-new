import React from "react";

const StandardButton = ({
                            classes,
                            onClick,
                            text,
                            ctaProps = [],
                            disabled = null,
                            icon = null
                        }) => {

    return (
        <button target="_blank" disabled={disabled} className={`${classes} rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white flex items-center justify-center gap-2`}
           onClick={onClick} {...ctaProps}>
            <span className="ml-auto">{text}</span>
            <span className={`ml-auto`}>
                {icon ?
                    icon :
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                        <path d="M13 3l8 8-8 8-2-2 4.59-4.59H3v-2h12.59L11 5l2-2z" />
                    </svg>
                }

            </span>
        </button>
    );
};

export default StandardButton;
