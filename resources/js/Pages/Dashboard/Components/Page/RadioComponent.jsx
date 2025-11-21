import React, {useEffect, useCallback, useState} from 'react';
import {submitPageSetting} from '@/Services/PageRequests.jsx';
import ContentSelectButtons from "@/Components/ContentSelectButtons.jsx";

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

    const commit = async (value) => {
        setSelected(value);          // animate now
        setRadioValue?.(value);      // update parent UI
        const packets = { [elementName]: value };
        await submitPageSetting(packets, pageId);
        setPageSettings?.(prev => ({ ...prev, [elementName]: value, successMessage: false }));
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
            <ContentSelectButtons
                options={[
                    {
                        title: 'Header Only',
                        key: 'header',
                        icon: <img className="!h-5 !w-4" src={Vapor.asset('images/header-only-icon.png')} alt="full page" />,
                        buttonClasses: `${selected === 'header' ? '!border-indigo-600 !bg-indigo-50 active hover:!-translate-y-0.0 hover:!shadow-md' : ''}}`
                    },
                    {
                        title: 'Full Page',
                        key: 'page',
                        icon: <img className="!h-5 !w-4" src={Vapor.asset('images/full-page-icon.png')} alt="full page" />,
                        buttonClasses: `${selected === 'page' ? '!border-indigo-600 !bg-indigo-50 active hover:!-translate-y-0.0 hover:!shadow-md' : ''}`
                    },
                ]}
                handleClick={commit}
            />
        </div>
    );
};

export default RadioComponent;
