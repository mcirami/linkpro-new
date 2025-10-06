import React from 'react';

const RadioGroup = ({
                            value,
                            options,
                            onChange
}) => {

    return (
        <div className="radios_wrap relative">
            {options.map((option, index) => {
                return (
                    <label
                        key={index}
                        className="flex items-center space-x-4 cursor-pointer py-3 transition-all hover:bg-gray-50 rounded-lg"
                        onClick={(e) => onChange(e, option)}
                    >
                              <span
                                  className={`w-5 h-5 rounded-full transition-all duration-200 ${
                                      value === option
                                          ? "bg-[#424fcf]"
                                          : "bg-[#d9e8eb]"
                                  }`}
                              ></span>
                    <p className=" text-gray-800 uppercase">{option}</p>
                </label>
                )
            })}
        </div>
    );
};

export default RadioGroup;
