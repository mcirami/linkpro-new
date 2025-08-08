import React, {useEffect} from 'react';
import {submitPageSetting} from '@/Services/PageRequests.jsx';

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
    const handleOnChange = (value) => {
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
        });
    }
    return (
        <div className="my_row radios_wrap img_type mb-4">
            {radioValues.map((value, index) => {
                return (
                    <label
                        key={index}
                        className="flex items-center space-x-4 cursor-pointer py-3 transition-all hover:bg-gray-50 rounded-lg"
                        onClick={() => handleOnChange(value)}
                    >
                      <span
                          className={`w-5 h-5 rounded-full transition-all duration-200 ${
                              radioValue === value
                                  ? "bg-[#424fcf]"
                                  : "bg-[#d9e8eb]"
                          }`}
                      ></span>
                        <p className=" text-gray-800 uppercase">{label[value]}</p>
                    </label>
                    /*<div className="radio_wrap" key={index}>
                        <label htmlFor={value}>
                            <input id={value}
                                   type="radio"
                                   value={value}
                                   name={elementName}
                                   checked={radioValue === value}
                                   onChange={(e) => {handleOnChange(e) }}/>
                            {capitalize(label[value])}
                        </label>
                    </div>*/
                )
            })}
        </div>
    );
};

export default RadioComponent;
