import React from 'react';
const ContentSelectButtons = ({
                                  options,
                                  handleClick,
}) => {

    return (options.map((item) => (
            <button
                key={item.key}
                onClick={() => handleClick(item.key)}
                className={`transform-none flex items-start w-full group rounded-xl border border-gray-200 bg-white p-4 text-left shadow-md
                 transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-[#424fcf]/30 ${item.buttonClasses} `}
            >
                <div className="flex-col items-start gap-3">
                    <div className={`text-base font-semibold flex items-center gap-2 text-gray-900 ${item.description ? 'mb-2' : ''} `}>
                        <div className="h-8 w-8 rounded-lg bg-[#424fcf]/10 grid place-items-center">
                            {item.icon}
                        </div>
                        <h3 className="uppercase leading-tight">{item.title}</h3>
                    </div>
                    {item.description &&
                        <p className="text-gray-500 text-sm mb-1">{item.description}</p>
                    }
                </div>
            </button>
        ))
    );
};

export default ContentSelectButtons;
