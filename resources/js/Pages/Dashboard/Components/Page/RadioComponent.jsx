import React, {useEffect, useCallback, useState} from 'react';
import {submitPageSetting} from '@/Services/PageRequests.jsx';
import SelectorComponent
    from "@/Pages/Dashboard/Components/SelectorComponent.jsx";
import { SiInternetcomputer } from "react-icons/si";

const RadioComponent = ({
                            setRadioValue,
                            radioValue,
                            setPageSettings,
                            pageId,
                            elementName
                        }) => {

    const [selected, setSelected] = useState(radioValue);

    useEffect(() => {
        setSelected(radioValue);
    },[radioValue]);
    /*const handleOnChange = (value) => {
        const packets = {
            [`${elementName}`]: value,
        };

        submitPageSetting(packets, pageId).then(res => {
            setRadioValue(value)
            setPageSettings((prev) => ({
                ...prev,
                [`${elementName}`]: value,
                successMessage: false
            }));
            setMode(elementName)
        });
    }*/

    const commit = async (value) => {
        setSelected(value);          // animate now
        setRadioValue?.(value);      // update parent UI
        const packets = { [elementName]: value };
        await submitPageSetting(packets, pageId);
        setPageSettings?.(prev => ({ ...prev, [elementName]: value, successMessage: false }));
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
            <button className={`
                transform-none flex items-center w-full group rounded-xl p-4 text-left shadow-md
                 transition-all focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-[#424fcf]/30
                 ${radioValue === 'header' ? 'border-indigo-600 bg-indigo-50 active' : 'bg-white hover:-translate-y-0.5 hover:shadow-lg'}
                 `}
               onClick={() => {commit("header").then(() => {})}}>
                <div className="flex-col items-start gap-3">
                    <div className="text-base font-semibold flex items-center gap-2 text-gray-900">
                        <div className="h-9 w-9 rounded-lg grid place-items-center bg-[#424fcf]/10 text-[#424fcf]">
                            <svg viewBox="0 0 48 48" className="h-7 w-7 md:h-8 md:w-8" aria-hidden>
                                {/* link icon */}
                                <rect x="12" y="11" width="24" height="30" rx="5" fill="currentColor" opacity=".12"/>
                                {/* header band (emphasized) */}
                                <rect x="12" y="7" width="24" height="8" rx="3" fill="currentColor"/>
                            </svg>
                        </div>
                        <h3 className="uppercase leading-none">Header Only</h3>
                    </div>
                </div>
            </button>
            <button className={`
                transform-none flex items-center w-full group rounded-xl p-4 text-left shadow-md
                 transition-all focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-[#424fcf]/30
                ${radioValue === 'page' ? 'border-indigo-600 bg-indigo-50 active' : 'bg-white hover:-translate-y-0.5 hover:shadow-lg'}
                `}
               onClick={() => {commit("page").then(() => {}) } }>
                <div className="flex-col items-start gap-3">
                    <div className="text-base font-semibold flex items-center gap-2 text-gray-900">
                        <div className="h-9 w-9 rounded-lg grid place-items-center bg-[#424fcf]/10 text-[#424fcf]">
                            <svg viewBox="0 0 48 48" className="h-7 w-7 md:h-8 md:w-8" aria-hidden>
                                {/* full-page fill */}
                                <rect x="12" y="7" width="25" height="33" rx="5" fill="currentColor"/>
                                <rect x="15" y="16" width="19" height="3" rx="3" fill="rgb(216,218,242)"/>
                                <rect x="15" y="23" width="19" height="3" rx="3" fill="rgb(216,218,242)"/>
                                <rect x="15" y="30" width="19" height="3" rx="3" fill="rgb(216,218,242)"/>
                            </svg>
                        </div>
                        <h3 className="uppercase leading-none">Full Page</h3>
                    </div>
                </div>
            </button>
            {/*<SelectorComponent
                value={selected}
                onChange={setSelected}
                commit={commit}
                options={[
                    { value: "header", label: "Header Only" },
                    { value: "page",   label: "Full Page" },
                ]}
                size="max-w-sm"
            />*/}
        </div>
    );
};

export default RadioComponent;
