import React, {useState} from 'react';
import {FaEdit} from 'react-icons/fa';
import IOSSwitch from '@/Utils/IOSSwitch.jsx';
import DeleteIcon from '@/Pages/Dashboard/Components/Link/Forms/DeleteIcon.jsx';
import IconSettingComponent
    from '@/Pages/Dashboard/Components/Link/Forms/IconSettingComponent.jsx';
import {capitalize, toUpper} from 'lodash';

const LayoutTwo = ({
                       hasLinks,
                       displayIcon,
                       handleOnClick,
                       link,
                       handleChange,
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
        id: id,
        type: type
    });

    return (
        <div className="link_content">

            <div className="icon_wrap"
                 onClick={(e) => {
                handleOnClick(e, id, index + 1)
            }}>
                <div className="image_wrap">
                    <img src={displayIcon} alt=""/>
                </div>
            </div>
            <div className="left_col">

                {isEditing.active && isEditing.section === "name" ?
                    <IconSettingComponent
                        inputType="text"
                        editLink={editLink}
                        setEditLink={setEditLink}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        elementName="name"
                        label="Link Name"
                    />
                    :
                    <div className="flex gap-1 items-start">
                        <h3>{name}</h3>
                        <span className="edit_icon edit_setting" onClick={(e) => {
                            setIsEditing({
                                active: true,
                                section: "name",
                                value: name,
                                id: id
                            });
                        }}>
                            <FaEdit />
                           {/* <div className="hover_text edit_image">
                                <p>Edit Name</p>
                            </div>*/}
                        </span>
                    </div>

                }
                {isEditing.active && isEditing.section === type ?
                    <IconSettingComponent
                        inputType={type === "url" ? "text" : type === "email" ? "email" : type === "phone" ? "tel" : ""}
                        editLink={editLink}
                        setEditLink={setEditLink}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        elementName={type}
                        label={capitalize(type)}
                    />
                    :
                    <div className="flex gap-1 items-start">
                        <p>
                            {(type === "url" || type === "offer") && url}
                            {type === "email" && email}
                            {type === "phone" && phone}
                        </p>
                        {type !== "offer" && type !== "mailchimp" &&
                            <span className="edit_icon edit_setting" onClick={(e) => {
                                setIsEditing({
                                    active: true,
                                    section: type,
                                    value: type === "url" ? url : type === "email" ? email : type === "phone" ? phone : "",
                                    id: id
                                });
                            }}>
                                <FaEdit />
                                {/*<div className="hover_text edit_image">
                                    <p>Edit {capitalize(type)}</p>
                                </div>*/}
                            </span>
                        }
                    </div>
                }
            </div>


            <div className={`right_col`}>
                <div className={`edit_wrap flex items-center gap-2`}>
                    <span className="edit_icon" onClick={(e) => {
                        handleOnClick(e, id, index + 1)
                    }}>
                        <FaEdit />
                        <div className="hover_text edit_image">
                            <p>Edit Icon</p>
                        </div>
                    </span>
                    <div className="switch_wrap">
                        <IOSSwitch
                            onChange={() => handleChange(link, hasLinks, type)}
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
