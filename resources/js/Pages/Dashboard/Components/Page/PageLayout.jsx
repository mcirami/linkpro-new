import {usePageContext} from '@/Context/PageContext.jsx';
import {updatePageLayout} from '@/Services/PageRequests.jsx';
import ToolTipIcon from '@/Utils/ToolTips/ToolTipIcon.jsx';
import {useEffect} from 'react';

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

                    <button
                        className={`min-h-12 group mr-5 flex-1 p-4 rounded-lg border text-center transition
                        ${pageSettings.page_layout === 'layout_one' ? 'border-indigo-600 bg-indigo-50 shadow-md active' : 'shadow-md '}
                        `}
                        onClick={(e) => {e.preventDefault(); setRadioValue('layout_one') }}
                    >
                        <p className="text-sm font-medium text-gray-800 mb-2">Tiles</p>
                        <img src={Vapor.asset('images/layout-tiles-2.png')} alt=""/>
                        {/*<div className="grid grid-cols-4 gap-2 mx-auto transform transition-transform duration-200 group-hover:scale-105">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="aspect-square rounded bg-indigo-500" />
                            ))}
                        </div>*/}
                    </button>
                    <button
                        className={`min-h-12 group flex-1 p-4 rounded-lg border text-center transition
                        ${pageSettings.page_layout === 'layout_two' ? 'border-indigo-600 bg-indigo-50 shadow-md active' : 'shadow-md '}
                        `}
                        onClick={(e) => {e.preventDefault(); setRadioValue('layout_two') }}
                    >
                        <p className="text-sm font-medium text-gray-800 mb-2">Buttons</p>
                        <img src={Vapor.asset('images/layout-buttons-2-button.png')} alt=""/>
                        {/*<div className="flex flex-col gap-2 mx-auto transform transition-transform duration-200 group-hover:scale-105">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="rounded bg-indigo-500 w-full mx-auto"
                                     style={{
                                         height: 'clamp(2rem, 4vw, 3.7rem)', // ✅ Shrinks on small screens, limits size on large
                                     }}
                                />
                            ))}
                        </div>*/}
                    </button>
                <ToolTipIcon section="layout" />

            </div>
        </div>
    );
}

export default PageLayout;
