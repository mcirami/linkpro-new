import React from "react";
import { BiCheck } from "react-icons/bi";
import StandardButton from "@/Components/StandardButton.jsx";

const PlanCard = ({
                      name,
                      price,
                      period,
                      size = 'column',
                      features = [],
                      isCurrent = false,
                      ctaLabel = 'Choose Plan',
                      onClick,
                      accent = 'indigo',   // 'green' | 'indigo' | 'violet'
                      ctaProps = {},
                      extraText = []
                  }) => {

    const accentMap = {
        green:  {
            ring: 'ring-green-300',
            pill: 'bg-green-50 text-green-700 ring-green-200',
            button: 'bg-green-600 hover:bg-green-700',
            shadow: 'shadow-green-100',
            text: '!text-green-700'
        },
        indigo: {
            ring: 'ring-indigo-300',
            pill: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
            button: 'bg-indigo-600 hover:bg-indigo-700',
            shadow: 'shadow-indigo-100',
            text: 'text-indigo-700'
        },
        violet: {
            ring: 'ring-fuchsia-300',
            pill: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200',
            button: 'bg-fuchsia-600 hover:bg-fuchsia-700',
            shadow: 'shadow-fuchsia-100',
            text: 'text-fuchsia-700'
        },
        gray: {
            ring: 'ring-stone-300',
            pill: 'bg-stone-50 text-stone-700 ring-stone-200',
            button: 'bg-stone-600 hover:bg-stone-700',
            shadow: 'shadow-stone-100',
            text: 'text-stone-700'
        },
    }[accent];

    return (
        <section
            className={`
                relative rounded-2xl border border-gray-200 bg-white
                shadow-md hover:shadow-lg transition
                ring-1 ${accentMap.ring} ring-opacity-20
              `}
            >
                {/* Current ribbon */}
                {isCurrent && (
                    <div className="absolute -top-2 right-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${accentMap.pill}`}>
                        Current Plan
                      </span>
                    </div>
                )}
                <div className="p-5">
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900">{name}</h3>

                    {/* Divider */}
                    <div className="my-3 h-px bg-gray-100" />


                    <div className={`${size === 'full' ? 'flex justify-between flex-wrap' : 'space-y-4'}`}>
                        {extraText.length > 0 &&
                            <div className={`${size === 'full' ? 'w-full md:!w-1/3 mb-4 md:mb-0' : ""} flex flex-col items-start justify-start gap-2 text-center w-full md:text-left `}>
                                {extraText.map((text, i) => (
                                    <div className="w-full">
                                        <h4 className={`${accentMap.text} !text-xl font-bold mb-2`} key={i}>{text.title}</h4>
                                        <p>{text.desc}</p>
                                    </div>
                                ))}
                            </div>
                        }
                        {/* Features */}
                        <ul className={`space-y-2 ${size === 'full' ? 'w-full md:!w-1/5 mb-4 md:mb-0' : ""} `}>
                            {features.map((f, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 text-left">
                                    <span className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full ${accentMap.pill} ring-1`}>
                                        {/* Use your existing check svg if you prefer */}
                                        <BiCheck className="h-6 w-6 !mr-0" />
                                    </span>
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>

                        {name !== 'Free' &&
                            <div className="mt-5 flex items-end gap-1">
                                <span className="text-3xl font-bold text-gray-900">{price}</span>
                                {period && <span className="text-sm text-gray-600">{period}</span>}
                            </div>
                        }
                        {/* CTA */}
                        <div className={`${size === 'full' ? 'w-full md:!w-1/3 mt-4 md:mt-0' : ""} flex flex-col items-center justify-center `}>
                            <StandardButton
                                classes={`w-full
                                  text-white shadow-md ${accentMap.button}
                                  focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60
                                  disabled:opacity-50 disabled:cursor-not-allowed`}
                                text={ctaLabel}
                                onClick={onClick}
                                ctaProps={ctaProps}
                            />
                        </div>
                    </div>

                </div>
        </section>
    );
};

export default PlanCard;
