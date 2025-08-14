import React, {useEffect, useCallback, useState} from 'react';
import {submitPageSetting} from '@/Services/PageRequests.jsx';
import SelectorComponent
    from "@/Pages/Dashboard/Components/SelectorComponent.jsx";

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

    const commit = async (e, value) => {
        e.preventDefault();
        setSelected(value);          // animate now
        setRadioValue?.(value);      // update parent UI
        const packets = { [elementName]: value };
        await submitPageSetting(packets, pageId);
        setPageSettings?.(prev => ({ ...prev, [elementName]: value, successMessage: false }));
    };

    return (
        <div className="my_row radios_wrap img_type mb-4">
            <SelectorComponent
                value={selected}
                onChange={setSelected}
                commit={commit}
                options={[
                    { value: "header", label: "Header Only" },
                    { value: "page",   label: "Full Page" },
                ]}
            />
            {/*<div
                role="tablist"
                aria-label="Main image size"
                className="overflow-hidden max-w-xs relative inline-flex w-full select-none rounded-xl border border-gray-200 bg-white p-2 shadow-sm"
            >
                 Sliding pill
                <span
                    className={`absolute inset-y-0 left-0 w-1/2 rounded-lg
                    bg-[#424fcf] shadow transition-transform duration-300 ease-out
                  ${selected === radioValues[1] ? 'translate-x-full' : 'translate-x-0'}`}
                    aria-hidden="true"
                />
                {radioValues.map((value, index) => {
                    return (
                        <span
                            key={index}
                            role="tab"
                            aria-selected={radioValue === value}
                            tabIndex={radioValue === value ? 0 : -1}
                            className={[
                                "relative z-10 w-1/2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors text-center",
                                radioValue === value ? "text-white" : "text-gray-800",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#424fcf]/30",
                            ].join(" ")}
                            onClick={() => commit(value) }
                        >
                            {label[value]}
                        </span>
                    )
                })}
            </div>*/}
        </div>
    );
};

export default RadioComponent;
