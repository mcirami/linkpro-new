import React from 'react';
import { GrUpgrade } from "react-icons/gr";
import StandardButton from "@/Components/StandardButton.jsx";
export const UpgradePopup = ({showUpgradePopup, setShowUpgradePopup}) => {

    const handleClose = e => {
        e.preventDefault();
        setShowUpgradePopup({
            show: false,
            text: ""
        })
    }

    return (

        <div id="upgrade_popup" className="open" onClick={handleClose}>
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
                onClick={handleClose}
            />

            <div className="rounded-2xl bg-white shadow-md relative">
                <button
                    onClick={handleClose}
                    className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full
                     bg-gray-50 !text-gray-500 ring-1 !ring-gray-200 hover:!text-gray-700"
                    aria-label="Close"
                >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                        <path d="M6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z"/>
                    </svg>
                </button>
                <div className="flex items-center gap-3 border-b border-gray-100 p-5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-50 text-green-700 ring-1 ring-green-200">
                        <GrUpgrade />
                    </div>
                    <div>
                        <h2 className="!text-left !text-2xl font-semibold text-gray-900">
                            Upgrade Now
                        </h2>
                    </div>
                </div>
                <div className="py-8 px-10">
                    <p className="text-center text-base text-gray-800">Upgrade to
                        <span className="option_text ml-1">
                            {showUpgradePopup.text}
                        </span> and <span className={'font-bold'}>much more!</span>
                    </p>
                    <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <StandardButton
                            text="Learn More"
                            classes=""
                            onClick={() => window.location.href = route('plans.get')} />
                    </div>
                </div>
            </div>
        </div>

    )
}
