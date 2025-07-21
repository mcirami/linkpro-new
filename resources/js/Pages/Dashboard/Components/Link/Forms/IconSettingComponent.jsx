import React, {useContext, useEffect, useState} from 'react';
import {HandleBlur, HandleFocus} from '@/Utils/InputAnimations.jsx';
import {usePageContext} from '@/Context/PageContext.jsx';
import {addLink, updateLink} from '@/Services/LinksRequest.jsx';
import {FOLDER_LINKS_ACTIONS, LINKS_ACTIONS} from '@/Services/Reducer.jsx';
import {FolderLinksContext} from '@/Pages/Dashboard/Dashboard.jsx';
import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';

const IconSettingComponent = ({
                                  inputType,
                                  editLink,
                                  setEditLink,
                                  elementName,
                                  label,
                                  maxChar = null,
                                  isEditing = null,
                                  setIsEditing = null
}) => {

    const [charactersLeft, setCharactersLeft] = useState(maxChar);
    const { pageSettings } = usePageContext();
    const { dispatch } = useUserLinksContext();
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);

    useEffect(() => {
        if(editLink[elementName] && maxChar) {
            setCharactersLeft(maxChar - editLink[elementName].length);
        }
    },[charactersLeft])

    const handleChange = (e) => {
        const value = e.target.value;

        if (maxChar) {
            setCharactersLeft(maxChar - value?.length);
        }

        if (isEditing?.active) {
            if(setIsEditing) {
                setIsEditing(prev => ({
                    ...prev,
                    value: value,
                }));
            }
        } else {
            setEditLink((prev) => ({
                ...prev,
                [`${elementName}`]: value,
            }));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing?.value && isEditing.id) {
            const packets = {
                [`${isEditing.section}`]: isEditing.value,
                page_id: pageSettings.id,
                type: isEditing.type,
            };

            updateLink(packets, isEditing.id).then((data) => {
                if (data.success) {

                    dispatch({
                        type: LINKS_ACTIONS.UPDATE_LINK,
                        payload: {
                            id: isEditing.id,
                            editLink: null,
                            [`${isEditing.section}`]: isEditing.value
                        }
                    })

                    setIsEditing &&
                    setIsEditing({
                        active: false,
                        section: "",
                        value: "",
                        id: null,
                        type: null
                    });
                }
            });
        } else if (editLink[elementName] && editLink.id) {

            const packets = {
                [`${elementName}`]: editLink[elementName],
                page_id: pageSettings.id,
                folder_id: editLink.folder_id,
                type: editLink.type,
            };

            updateLink(packets, editLink.id).then((data) => {
                if (data.success) {

                    if (editLink.folder_id) {
                        dispatchFolderLinks({
                            type: FOLDER_LINKS_ACTIONS.UPDATE_FOLDER_LINKS,
                            payload: {
                                id: editLink.id,
                                currentLink: editLink,
                                [`${elementName}`]: editLink[elementName],
                            }
                        })

                        dispatch({
                            type: LINKS_ACTIONS.UPDATE_LINK_IN_FOLDER,
                            payload: {
                                folder_id: editLink.folder_id,
                                id: editLink.id,
                                currentLink: editLink,
                                [`${elementName}`]: editLink[elementName]
                            }
                        })
                    } else {
                        dispatch({
                            type: LINKS_ACTIONS.UPDATE_LINK,
                            payload: {
                                id: editLink.id,
                                editLink: editLink,
                                [`${elementName}`]: editLink[elementName]
                            }
                        })
                    }
                }
            });
        }
    }

    return (
        <>
            <div className="input_wrap mt-2">
                <input
                    className={`w-full ${editLink[elementName] ? "active" : ""}`}
                    name={elementName}
                    type={inputType === "phone" ? "tel" : inputType}
                    value={isEditing?.value || editLink[elementName] || ""}
                    autoFocus={isEditing?.section === elementName || false}
                    onChange={(e) => handleChange(e)}
                    onFocus={(e) => HandleFocus(e.target)}
                    onBlur={(e) => {HandleBlur(e.target); handleSubmit(e); }}
                    onKeyDown={ event => {
                        if(event.key === 'Enter') {
                            handleSubmit(event);
                        }
                    }}
                />
                <label>{label}</label>
            </div>
            {(pageSettings.page_layout === "layout_one" && maxChar) &&
                <div className="my_row info_text title">
                    <p className="char_max">Max {maxChar} Characters Shown</p>
                    <p className="char_count">
                        {charactersLeft < 0 ?
                            <span className="over">Only {maxChar} Characters Will Be Shown</span>
                            :
                            "Characters Left: " +
                            charactersLeft
                        }
                    </p>
                </div>
            }
        </>
    );
};

export default IconSettingComponent;
