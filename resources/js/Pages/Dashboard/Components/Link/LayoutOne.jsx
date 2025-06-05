import React, {useContext} from 'react';
import IOSSwitch from '@/Utils/IOSSwitch.jsx';
import {
    handleSwitchChange
} from '@/Services/LinksRequest.jsx';
import {
    UserLinksContext,
} from '@/Pages/Dashboard/Dashboard.jsx';

const LayoutOne = ({
                       fetchFolderLinks,
                       hasLinks,
                       links,
                       checkIcon,
                       subStatus,
                       displayIcon,
                       handleOnClick,
                       link,
                       index,
                       setShowUpgradePopup
}) => {

    const {type, id, active_status} = link;
    const { dispatch } = useContext(UserLinksContext);

    return (
        <>
        {type === "folder" ?

            <div className="icon_wrap folder">
                <div className="inner_icon_wrap" onClick={(e) => {
                    fetchFolderLinks(id)
                }}>
                    <img src={Vapor.asset('images/blank-folder-square.jpg')} alt=""/>
                    <div className={hasLinks ?
                        "folder_icons main" :
                        "folder_icons empty"}>
                        {hasLinks && links.slice(
                            0, 9).map((innerLink, index) => {

                            const {
                                id,
                                icon
                            } = innerLink;

                            return (
                                <div className="image_col" key={index}>
                                    <img src={checkIcon(icon, "", subStatus)} alt=""/>
                                </div>
                            )
                        })}
                        {!hasLinks &&
                            <p><span>+</span> <br/>Add<br/>Icons
                            </p>}
                    </div>

                </div>

            </div>
            :
                <div className="icon_wrap" onClick={(e) => {
                    handleOnClick(e, id, Math.ceil((index + 1) / 4))
                }}>
                    <div className="image_wrap">
                        <img src={displayIcon} alt=""/>
                    </div>
                </div>
        }
            <div className="link_content">
                <div className={`right_col w-full block text-center`}>
                    <div>
                        <div className="switch_wrap">
                            <IOSSwitch
                                onChange={() => handleSwitchChange(link, dispatch, subStatus, hasLinks, setShowUpgradePopup)}
                                checked={Boolean(active_status)}
                            />
                            <div className="hover_text switch">
                                <p>
                                    {Boolean(active_status) ? "Disable" : "Enable"}
                                    {type === "folder" ? "Folder" : "Icon"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            </>
    );
};

export default LayoutOne;
