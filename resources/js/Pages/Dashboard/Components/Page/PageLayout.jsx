import {usePageContext} from '@/Context/PageContext.jsx';
import {updatePageLayout} from '@/Services/PageRequests.jsx';
import ToolTipIcon from '@/Utils/ToolTips/ToolTipIcon.jsx';
import React, {useEffect} from 'react';

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
                <button
                    className={`min-h-12 group mr-5 flex-1 p-4 rounded-lg border text-center transition
                    ${pageSettings.page_layout === 'layout_one' ? 'border-indigo-600 bg-indigo-50 shadow-md active' : 'shadow-md '}
                    `}
                    onClick={(e) => {e.preventDefault(); setRadioValue('layout_one') }}
                >
                    <p className="text-sm font-medium text-gray-800 mb-2">Tiles</p>
                    <img src={Vapor.asset('images/layout-tiles-2.png')} alt=""/>
                </button>
                <button
                    className={`min-h-12 group flex-1 p-4 rounded-lg border text-center transition
                    ${pageSettings.page_layout === 'layout_two' ? 'border-indigo-600 bg-indigo-50 shadow-md active' : 'shadow-md '}
                    `}
                    onClick={(e) => {e.preventDefault(); setRadioValue('layout_two') }}
                >
                    <p className="text-sm font-medium text-gray-800 mb-2">Buttons</p>
                    <img src={Vapor.asset('images/layout-buttons-2-button.png')} alt=""/>
                </button>
            </div>
        </div>
    );
}

export default PageLayout;
