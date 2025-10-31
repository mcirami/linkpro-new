import React, { useEffect, useRef } from "react";
import {IoMdAlert} from 'react-icons/io';
export const MessageAlertPopup = ({
                                      showMessageAlertPopup,
                                      setShowMessageAlertPopup,
}) => {

    const ref = useRef(null);
    useEffect(() => {
        if (!showMessageAlertPopup.show) return;
        const onKey = (e) => e.key === "Escape" && setShowMessageAlertPopup?.({
            show: false,
            text: "",
            url: null,
            buttonText: ""
        });
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [showMessageAlertPopup, setShowMessageAlertPopup]);
    const handleClose = e => {
        e.preventDefault();
        setShowMessageAlertPopup({
            show: false,
            text: "",
            url: null,
            buttonText: ""
        })
    }

    useEffect(() => {
        if (showMessageAlertPopup.show) ref.current?.focus();
    }, [showMessageAlertPopup.show]);

    if (!showMessageAlertPopup.show) return null;

    return (
        <div
            className="fixed inset-0 z-[999] grid place-items-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="alert-title"
            aria-describedby="alert-desc"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
                onClick={handleClose}
            />
            {/* Modal */}
            <div className="
        relative w-[92vw] max-w-md rounded-2xl border border-gray-200 bg-white
        shadow-md animate-in fade-in zoom-in-95 duration-150
      ">
                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center justify-start gap-3 mb-5">
                        <div className="grid h-12 w-12 place-items-center rounded-xl ring-1 bg-amber-50  text-amber-800  ring-amber-200">
                            <IoMdAlert className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900">Heads Up</h2>
                    </div>
                    <p id="alert-desc" className="mt-2 text-sm text-gray-700 text-center">
                        { showMessageAlertPopup.text }
                    </p>
                </div>

                <div className="flex items-center justify-center gap-3 px-6 pb-6">
                    <button
                        ref={ref}
                        type="button"
                        onClick={showMessageAlertPopup.url || handleClose}
                        className="inline-flex min-w-[7rem] items-center justify-center rounded-xl
                       bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white
                       shadow-md hover:bg-indigo-700 focus:outline-none
                       focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                    >
                        {showMessageAlertPopup.buttonText !== "" ? showMessageAlertPopup.buttonText : "Ok"}
                    </button>
                </div>

                {/* Close (X) */}
                <button
                    onClick={handleClose}
                    className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full
                     bg-gray-50 text-gray-500 ring-1 ring-gray-200 hover:text-gray-700"
                    aria-label="Close"
                >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                        <path d="M6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z"/>
                    </svg>
                </button>
            </div>
        </div>

    )
}
