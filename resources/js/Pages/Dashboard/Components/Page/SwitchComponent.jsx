import React from 'react';
import IOSSwitch from '@/Utils/IOSSwitch.jsx';
import {submitPageSetting} from '@/Services/PageRequests.jsx';

const SwitchComponent = ({
                             setSwitchValue,
                             switchValue,
                             pageId,
                             setPageSettings,
                             elementName,
                             hoverText = null,
                             label = null
}) => {

    const handleOnChange = (e) => {
        const newStatus = !switchValue;
        const packets = {
            [`${elementName}`]: newStatus,
            successMessage: false
        };

        submitPageSetting(packets, pageId).then(res => {
            setSwitchValue(newStatus)
            setPageSettings((prev) => ({
                ...prev,
                [`${elementName}`]: newStatus
            }));
        });
    }

    return (
        <div className="switch_wrap w-full flex justify-between gap-2 mb-4">
            {label &&
                <h3 className="uppercase text-sm">{label}</h3>
            }
            <IOSSwitch
                onChange={(e) => handleOnChange(e)}
                checked={Boolean(switchValue)}
            />
            {hoverText &&
                <div className="hover_text switch inline-block">
                    <p>
                        {Boolean(switchValue) ? "Disable " : "Enable "}
                        {hoverText}
                    </p>
                </div>
            }
        </div>
    );
};

export default SwitchComponent;
