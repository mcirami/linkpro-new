import React, {useEffect} from 'react';
import {submitPageSetting} from '@/Services/PageRequests.jsx';
import {capitalize} from 'lodash';

const RadioComponent = ({
                            setRadioValue,
                            radioValue,
                            setPageSettings,
                            pageId,
                            elementName,
                            label,
                            radioValues
                        }) => {

    useEffect(() => {
        setRadioValue(radioValue);
    },[radioValue]);
    const handleOnChange = (e) => {
        const packets = {
            [`${elementName}`]: e.target.value,
        };

        submitPageSetting(packets, pageId).then(res => {
            setRadioValue(e.target.value)
            setPageSettings((prev) => ({
                ...prev,
                [`${elementName}`]: e.target.value,
                successMessage: false
            }));
        });
    }
    return (
        <div className="my_row radios_wrap img_type mb-1">
            {radioValues.map((value, index) => {
                return (
                    <div className="radio_wrap" key={index}>
                        <label htmlFor={value}>
                            <input id={value}
                                   type="radio"
                                   value={value}
                                   name={elementName}
                                   checked={radioValue === value}
                                   onChange={(e) => {handleOnChange(e) }}/>
                            {capitalize(label[value])}
                        </label>
                    </div>
                )
            })}
        </div>
    );
};

export default RadioComponent;
