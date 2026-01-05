import {usePageContext} from '@/Context/PageContext.jsx';
import {updatePageLayout} from '@/Services/PageRequests.jsx';
import ToolTipIcon from '@/Utils/ToolTips/ToolTipIcon.jsx';
import React from 'react';
import ContentSelectButtons from "@/Components/ContentSelectButtons.jsx";
import { PiSquaresFour } from "react-icons/pi";
import { BsViewStacked } from "react-icons/bs";
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
        <div className="layouts_wrap border-b border-gray-100 !pb-3 w-full">
            <div className="edit_form">
                <div className="section_title w-full flex justify-start gap-2">
                    <h4 className="capitalize">Layout</h4>
                    <ToolTipIcon section="layout" />
                </div>
                <div className="flex flex-wrap w-full gap-4">
                    <ContentSelectButtons
                        options={[
                            {
                                title: 'Tiles',
                                key: 'layout_one',
                                icon: <PiSquaresFour className="h-6 w-6 text-[#424fcf]" />,
                                buttonClasses: `${pageSettings.page_layout === 'layout_one' ? '!border-indigo-600 !bg-indigo-50 active hover:!shadow-md hover:!-translate-y-0' : ''}`
                            },
                            {
                                title: 'Buttons',
                                key: 'layout_two',
                                icon: <BsViewStacked className="h-5 w-5 text-[#424fcf]"/>,
                                buttonClasses: `${pageSettings.page_layout === 'layout_two' ? '!border-indigo-600 !bg-indigo-50 active hover:!shadow-md hover:!-translate-y-0' : ''}`
                            },
                        ]}
                        handleClick={(value) => {
                            setRadioValue(value);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default PageLayout;
