import {usePageContext} from '@/Context/PageContext.jsx';
import {updatePageLayout} from '@/Services/PageRequests.jsx';
import ToolTipIcon from '@/Utils/ToolTips/ToolTipIcon.jsx';
import React, {useEffect} from 'react';
import { TfiLayoutGrid4Alt } from "react-icons/tfi";

function PageLayout({pageLayoutRef}) {
    const {pageSettings, setPageSettings} = usePageContext();

    const setRadioValue = (value) => {

        const packets = {
            pageLayout: value
        }

        updatePageLayout(packets, pageSettings['id'])
        .then((response) => {
            setPageSettings((prev) => ({...prev, page_layout: value}));
        })

        pageLayoutRef.current.id = value;
    }

    return (
        <div className="layouts_wrap">
            <div className="edit_form">
                <div className="section_title w-full flex justify-start gap-2">
                    <h4 className="capitalize">Page Layout</h4>
                    <ToolTipIcon section="layout" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* ${pageSettings.page_layout === 'layout_one' ? 'border-indigo-600 bg-indigo-50 shadow-md active' : 'shadow-md '}*/}
                    <button
                        className={`transform-none flex items-start w-full group rounded-xl border border-gray-200 p-4 text-left shadow-md
                     transition-all focus:outline-none
                     focus-visible:ring-2 focus-visible:ring-[#424fcf]/30
                     ${pageSettings.page_layout === 'layout_one' ? 'border-indigo-600 bg-indigo-50 active' : 'bg-white hover:-translate-y-0.5 hover:shadow-lg'}
                     `}
                        onClick={(e) => {e.preventDefault(); setRadioValue('layout_one') }}
                    >
                        <div className="flex-col items-start gap-3">
                            <div className="text-base font-semibold flex items-center gap-2 text-gray-900">
                                <div className="h-9 w-9 rounded-lg bg-[#424fcf]/10 grid place-items-center text-indigo-600">
                                    {/*<img src={Vapor.asset('images/layout-tiles.png')} alt=""/>*/}
                                    <svg viewBox="0 0 58 58" className="h-8 w-8 md:h-9 md:w-9">
                                        {/* 4x4 grid glyph */}
                                        <g fill="currentColor">
                                            <rect x="13" y="16" width="6" height="6" rx="1"/>
                                            <rect x="21" y="16" width="6" height="6" rx="1"/>
                                            <rect x="29" y="16" width="6" height="6" rx="1"/>
                                            <rect x="37" y="16" width="6" height="6" rx="1"/>

                                            <rect x="13" y="25" width="6" height="6" rx="1"/>
                                            <rect x="21" y="25" width="6" height="6" rx="1"/>
                                            <rect x="29" y="25" width="6" height="6" rx="1"/>
                                            <rect x="37" y="25" width="6" height="6" rx="1"/>

                                            <rect x="13" y="34" width="6" height="6" rx="1"/>
                                            <rect x="21" y="34" width="6" height="6" rx="1"/>
                                            <rect x="29" y="34" width="6" height="6" rx="1"/>
                                            <rect x="37" y="34" width="6" height="6" rx="1"/>
                                        </g>
                                    </svg>
                                </div>
                                <h3 className="uppercase">Tiles</h3>
                            </div>
                            {/*<p className="mt-1 text-sm text-gray-600">
                                Display your links in a grid style.
                            </p>*/}
                        </div>
                    </button>
                    <button
                        className={`transform-none flex items-start w-full group rounded-xl border border-gray-200  p-4 text-left shadow-md
                     transition-all focus:outline-none
                     focus-visible:ring-2 focus-visible:ring-[#424fcf]/30
                     ${pageSettings.page_layout === 'layout_two' ? 'border-indigo-600 bg-indigo-50 active' : 'bg-white hover:-translate-y-0.5 hover:shadow-lg'}
                        `}
                        onClick={(e) => {e.preventDefault(); setRadioValue('layout_two') }}
                    >
                        <div className="flex-col items-start gap-3">
                            <div className="text-base font-semibold flex items-center gap-2 text-gray-900">
                                <div className="h-9 w-9 rounded-lg bg-[#424fcf]/10 grid place-items-center text-indigo-600">
                                    <svg viewBox="0 0 48 48" className="h-7 w-7 md:h-8 md:w-8">
                                        {/* two filled “button” pills */}
                                        <g fill="currentColor">
                                            <rect x="10" y="12" width="30" height="5" rx="3"/>
                                            <rect x="10" y="21" width="30" height="5" rx="3"/>
                                            <rect x="10" y="30" width="30" height="5" rx="3"/>
                                        </g>
                                    </svg>
                                </div>
                                <h3 className="uppercase">Buttons</h3>
                            </div>
                            {/*<p className="mt-1 text-sm text-gray-600">
                                Display your links in a button style, stacked on the page.
                            </p>*/}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PageLayout;
