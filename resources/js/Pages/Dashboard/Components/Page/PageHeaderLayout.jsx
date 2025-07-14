import React, {useState} from 'react';
import {updateProfileLayout} from '@/Services/PageRequests.jsx';
import {usePageContext} from '@/Context/PageContext.jsx';
import ToolTipIcon from '@/Utils/ToolTips/ToolTipIcon';

function PageHeaderLayout({pageHeaderRef}) {

    const {pageSettings} = usePageContext();
    const [layout, setLayout] = useState(pageSettings['profile_layout']);

    const setRadioValue = (value) => {

        const packets = {
            profileLayout: value
        }

        updateProfileLayout(packets, pageSettings['id'])
        .then((response) => {
            console.log(response.message);
            setLayout(value);
        })

        pageHeaderRef.current.id = value;
    }

    return (
        <div className="edit_form">
            <form className="layouts">
                <div className="radio_wrap relative">
                    <p className="layout_label">Profile Left</p>
                    <label htmlFor="profile_one">
                        <input type="radio" value="profile_one" name="layout"
                               checked={layout === 'profile_one'}
                               onChange={(e) => {setRadioValue(e.target.value) }}
                        />
                        <img src={Vapor.asset('images/profile-1.png')} alt=""/>
                    </label>
                </div>
                {/*<div className="radio_wrap">
                    <label htmlFor="profile_two">
                        <input type="radio" value="profile_two" name="layout"
                               checked={layout === 'profile_two'}
                               onChange={(e) => {setRadioValue(e.target.value) }}
                        />
                        Profile 2
                    </label>
                    <img src={Vapor.asset('images/profile-2.png')} alt=""/>
                </div>*/}
                <div className="radio_wrap relative">
                    <p className="layout_label">Profile Center</p>
                    <label htmlFor="profile_two">
                        <input type="radio" value="profile_two" name="layout"
                               checked={layout === 'profile_two'}
                               onChange={(e) => {setRadioValue(e.target.value) }}
                        />
                        <img src={Vapor.asset('images/profile-3.png')} alt=""/>
                    </label>

                </div>
            </form>

            <ToolTipIcon section="layout" />

        </div>
    );
}

export default PageHeaderLayout;
