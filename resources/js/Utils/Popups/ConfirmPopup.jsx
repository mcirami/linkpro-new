import React, {useContext, useState} from 'react';
import {MdCheckCircle} from 'react-icons/md';
import {
    deleteLink,
    updateLinkStatus,
} from '@/Services/LinksRequest.jsx';
import {UserLinksContext, FolderLinksContext} from '../../Pages/Dashboard/Dashboard.jsx';
import {
    LINKS_ACTIONS,
    FOLDER_LINKS_ACTIONS,
} from '@/Services/Reducer.jsx';
import {deleteFolder} from '@/Services/FolderRequests.jsx';

export const ConfirmPopup = ({
                                 editIcon,
                                 setEditIcon,
                                 showConfirmPopup,
                                 setShowConfirmPopup,
                                 setInputType,
                                 setIntegrationType,
                                 setAccordionValue
                             }) => {

    const {id, type, folderId} = editIcon;
    const { userLinks, dispatch  } = useContext(UserLinksContext);
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);

    const deleteItem = (e) => {
        e.preventDefault();

        let newFolderArray;
        let newArray;

        const iconId = (id || folderId) || showConfirmPopup.id;

        if (!id && folderId) {
            let newArray = userLinks.filter(element => {

                if (element.type !== "folder") {
                    return element
                } else {
                    return element.id !== iconId
                }

            });

            const packets = {
                userLinks: newArray,
            }

            deleteFolder(packets, iconId)
            .then((data) => {

                if(data.success) {

                    //dispatchOrig({ type: ORIGINAL_LINKS_ACTIONS.SET_ORIGINAL_LINKS, payload: {links: data.links} })
                    dispatch({ type: LINKS_ACTIONS.SET_LINKS, payload: {links: data.links} })

                    setEditIcon(prev =>
                        Object.fromEntries(Object.keys(prev).map(key => [key, null])));

                    setShowConfirmPopup({
                        show: false,
                        id: null,
                        type: null,
                    })
                }
            })
        } else {
            if (type === "folder" || showConfirmPopup.type === "folder") {
                newFolderArray = folderLinks.filter(element => element.id !== iconId);
                newArray = userLinks.map((item) => {
                    if (item.id === iconId) {
                        const itemLinks = item.links.filter(element => element.id !== iconId)

                        return {
                            ...item,
                            links: itemLinks
                        }
                    }
                    return item;
                });
            } else {
                newArray = userLinks.filter(element => element.id !== iconId);
            }

            const packets = {
                userLinks: newArray,
                folderLinks: newFolderArray
            }

            deleteLink(packets, iconId)
            .then((data) => {

                if(data.success) {

                    if (type === "folder" || showConfirmPopup.type === "folder") {

                        const newFolderLinks = data.links.find(el => el.id === iconId);
                        dispatchFolderLinks({ type: FOLDER_LINKS_ACTIONS.SET_FOLDER_LINKS, payload: {links: newFolderLinks.links} })

                        let folderActive = null;
                        if (newFolderArray.length === 0) {

                            folderActive = false;
                            const url = "/dashboard/folder/status/";
                            const packets = {
                                active_status: folderActive,
                            };

                            updateLinkStatus(packets, iconId, url);
                        }

                        dispatch({ type: LINKS_ACTIONS.UPDATE_LINKS_POSITIONS, payload: {links: newArray, folderActive: folderActive, folderID: iconId} })

                    } else {
                        dispatch({ type: LINKS_ACTIONS.SET_LINKS, payload: {links: data.links} })
                    }

                    setEditIcon(prev =>
                        Object.fromEntries(Object.keys(prev).map(key => [key, null])));
                    setShowConfirmPopup({
                        show: false,
                        id: null,
                        type: null,
                    })
                    setIntegrationType(null);
                    setInputType(null);
                    setAccordionValue(null);
                }
            })
        }
    }

    const handleCancel = e => {
        e.preventDefault();
        setEditIcon(prev =>
            Object.fromEntries(Object.keys(prev).map(key => [key, null])));
        setShowConfirmPopup({
            show: false,
            id: null,
            type: null
        })
    }

    return (

        <div id="confirm_popup_link" className={showConfirmPopup.show ? 'open' : "" }>
            <div className="box">
                <div className="form_icon_wrap svg check">
                    <MdCheckCircle/>
                </div>
                <h2>Confirm</h2>
                <div className="text_wrap">
                    <p className="confirm_text">Are you sure you want to delete this
                        {type === "folder" || showConfirmPopup.type === "folder" ?
                            " folder" :
                            " icon"}?
                    </p>
                    <form action="" className="button_row">
                        <a className="button green" href="#" onClick={deleteItem}>Yes</a>
                        <a className="button transparent gray" href="#" onClick={handleCancel}>No</a>
                    </form>
                </div>
            </div>
        </div>

    )
}
