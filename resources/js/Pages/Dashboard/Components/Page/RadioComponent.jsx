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
                size="max-w-sm"
            />
        </div>
    );
};

export default RadioComponent;
