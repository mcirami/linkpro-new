import React, {useState} from 'react';
import { RiEdit2Fill } from "react-icons/ri";
import IOSSwitch from '@/Utils/IOSSwitch.jsx';
import DeleteIcon from '@/Pages/Dashboard/Components/Link/Forms/DeleteIcon.jsx';
import IconSettingComponent
    from '@/Pages/Dashboard/Components/Link/Forms/IconSettingComponent.jsx';
import {
    handleSwitchChange,
} from '@/Services/LinksRequest.jsx';

import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';
import { IoMdSettings } from "react-icons/io";

const LayoutTwo = ({
                       handleOnClick,
                       link,
                       setShowConfirmPopup,
                       editLink,
                       setEditLink,
                       index
}) => {

    const {type, id, active_status, name, url, email, phone} = link;

    const [isEditing, setIsEditing] = useState({
        active: false,
        section: "",
        value: "",
        id: null,
        type: ""
    });

    const { dispatch } = useUserLinksContext();

    return (
        <div className="link_content">
            <div className="left_col">
                <div className="switch_wrap w-auto inline-block">
                    <span className="text-[#88c3d7] hover:text-indigo-600 hover:cursor-pointer" onClick={(e) => {
                        handleOnClick(e, id, index + 1)
                    }}>
                        <IoMdSettings className="w-5 h-5"/>
                        <div className="hover_text edit_image text-sm">
                            <p>Button Settings</p>
                        </div>
                    </span>
                </div>
               {/* {isEditing.active && isEditing.section === "name" ?*/}
                    <IconSettingComponent
                        inputType="text"
                        id={id}
                        editLink={editLink}
                        setEditLink={setEditLink}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        elementName="name"
                        label="Button Text"
                        placeholder="Enter Text"
                        currentValue={name}
                    />

                {type === "offer" || type === "mailchimp" ?
                    <p>{type === "offer" ? url : "(mailchimp form)"}</p>
                    :
                    <IconSettingComponent
                        inputType={type === "url" ? "text" : type === "email" ? "email" : type === "phone" ? "tel" : ""}
                        id={id}
                        editLink={editLink}
                        setEditLink={setEditLink}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        elementName={type}
                        label={
                            type === 'url' ? 'Enter URL' : type === "email" ? 'Enter Email' : type === "phone" ? 'Enter Phone Number' : "Enter Text"
                        }
                        currentValue={type === "url" ? url : type === "email" ? email : type === "phone" ? phone : ""}
                    />
                }

            </div>

            <div className={`right_col`}>
                <div className={`edit_wrap flex items-center switch_wrap`}>
                    <div className="switch_wrap">
                        <IOSSwitch
                            onChange={() => handleSwitchChange(link, setEditLink, dispatch, "active_status")}
                            checked={Boolean(active_status)}
                        />
                        <div className="hover_text switch">
                            <p>
                                {Boolean(active_status) ? "Disable " : "Enable "}Button
                            </p>
                        </div>
                    </div>
                </div>
                <div className="delete_icon mt-auto">
                    <DeleteIcon
                        setShowConfirmPopup={setShowConfirmPopup}
                        editId={id}
                        type={type}
                    />
                </div>
            </div>
        </div>
    );
};

export default LayoutTwo;
