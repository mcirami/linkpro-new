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

        if (isEditing?.value) {
            const packets = {
                [`${isEditing.section}`]: isEditing.value,
                page_id: pageSettings.id,
                type: isEditing.type,
            };

            if(isEditing.id) {
                updateLink(packets, isEditing.id).then((data) => {
                    if (data.success) {
                        dispatch({
                            type: LINKS_ACTIONS.UPDATE_LINK,
                            payload: {
                                id: isEditing.id,
                                editLink: editLink,
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
            } else {
                addLink(packets).then((data) => {
                    if (data.success) {
                        dispatch({
                            type: LINKS_ACTIONS.UPDATE_LINK,
                            payload: {
                                id: isEditing.id,
                                editLink: editLink,
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
                })
            }
        } else if (editLink[elementName]) {

            const packets = {
                [`${elementName}`]: editLink[elementName],
                page_id: pageSettings.id,
                folder_id: editLink.folder_id,
                type: editLink.type,
            };

            if(editLink.id) {

                updateLink(packets, editLink.id).then((data) => {
                    if (data.success) {
                        dispatch({
                            type: LINKS_ACTIONS.UPDATE_LINK,
                            payload: {
                                editID: editLink.id,
                                editLink: editLink,
                                [`${elementName}`]: editLink[elementName]
                            }
                        })
                    }
                });
            } else {
                addLink(packets).then((data) => {
                    if (data.success) {
                        const linkId = data.link_id;
                        /*const newLinkObject = {
                            [`${elementName}`]: editLink[elementName],
                            type: editLink.type,
                            course_id: editLink.course_id,
                            id: linkId,
                            position: data.position,
                            active_status: true,
                            folder_id: editLink.folder_id,
                        }*/
                        setEditLink(prev => ({
                            ...prev,
                            id: linkId,
                            position: data.position,
                            active_status: true,
                        }));

                        /*
                        let newLinks = [...userLinks];

                        if (editLink.folder_id) {
                            newLinks.map((link, index) => {
                                if (link.id === editLink.folder_id) {
                                    link.links.push(newLinkObject);
                                }
                            })
                            dispatchFolderLinks({ type: FOLDER_LINKS_ACTIONS.SET_FOLDER_LINKS, payload: {links: folderLinks.concat(newLinkObject)} })
                        } else {
                            newLinks = newLinks.concat(newLinkObject)
                        }

                        dispatch({
                            type: LINKS_ACTIONS.SET_LINKS,
                            payload: {
                                links: newLinks
                            }
                        })*/

                        dispatch({
                            type: LINKS_ACTIONS.UPDATE_LINK,
                            payload: {
                                [`${elementName}`]: editLink[elementName],
                                editID: linkId,
                                editLink: editLink,
                            }
                        })
                    }
                });
            }
        }
    }

    return (
        <>
            <div className="input_wrap mt-2">
                <input
                    className={`w-full ${editLink[elementName] ? "active" : ""}`}
                    name={elementName}
                    type={inputType === "phone" ? "tel" : inputType}
                    value={isEditing?.value}
                    autoFocus={isEditing?.section === elementName}
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
