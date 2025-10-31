import React from "react";
import { BiCheck } from "react-icons/bi";

const PlanCard = ({
                      name,
                      price,
                      period,
                      features = [],
                      isCurrent = false,
                      ctaLabel = 'Choose Plan',
                      onClick,
                      accent = 'indigo',   // 'green' | 'indigo' | 'violet'
                      ctaProps = {},
                  }) => {

    const accentMap = {
        green:  {
            ring: 'ring-green-300',
            pill: 'bg-green-50 text-green-700 ring-green-200',
            button: 'bg-green-600 hover:bg-green-700',
            shadow: 'shadow-green-100',
        },
        indigo: {
            ring: 'ring-indigo-300',
            pill: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
            button: 'bg-indigo-600 hover:bg-indigo-700',
            shadow: 'shadow-indigo-100',
        },
        violet: {
            ring: 'ring-violet-300',
            pill: 'bg-violet-50 text-violet-700 ring-violet-200',
            button: 'bg-violet-600 hover:bg-violet-700',
            shadow: 'shadow-violet-100',
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

                    {/* Features */}
                    <ul className="space-y-2">
                        {features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full ${accentMap.pill} ring-1`}>
                                    {/* Use your existing check svg if you prefer */}
                                    <BiCheck className="h-6 w-6 !mr-0" />
                                </span>
                                <span>{f}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Price */}
                    <div className="mt-5 flex items-end gap-1">
                        <span className="text-3xl font-bold text-gray-900">{price}</span>
                        {period && <span className="text-sm text-gray-600">{period}</span>}
                    </div>

                    {/* CTA */}
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={onClick}
                            disabled={isCurrent}
                            className={`
                              inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium
                              text-white shadow-md ${accentMap.button}
                              focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60
                              disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                            {...ctaProps}
                        >
                            {ctaLabel}
                        </button>
                    </div>
                </div>
        </section>
    );
};

export default PlanCard;
