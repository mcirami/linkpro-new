import {usePageContext} from '@/Context/PageContext.jsx';
import {updatePageLayout} from '@/Services/PageRequests.jsx';
import ToolTipIcon from '@/Utils/ToolTips/ToolTipIcon.jsx';

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
        <div className="edit_form">
            <form className="layouts">
                <div className="radio_wrap relative">
                    <p className="layout_label">Tiles</p>
                    <label htmlFor="layout_one">
                        <input type="radio" value="layout_one" name="layout"
                               checked={pageSettings.page_layout === 'layout_one'}
                               onChange={(e) => {setRadioValue(e.target.value) }}
                        />
                        <img src={Vapor.asset('images/profile-1.png')} alt=""/>
                    </label>
                </div>
                <div className="radio_wrap relative">
                    <p className="layout_label">Buttons</p>
                    <label htmlFor="layout_two">
                        <input type="radio" value="layout_two" name="layout"
                               checked={pageSettings.page_layout === 'layout_two'}
                               onChange={(e) => {setRadioValue(e.target.value) }}
                        />
                        <img src={Vapor.asset('images/profile-2.png')} alt=""/>
                    </label>

                </div>
            </form>

            <ToolTipIcon section="layout" />

        </div>
    );
}

export default PageLayout;
