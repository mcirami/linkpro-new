import React, {useContext} from 'react';
import {MdCheckCircle} from 'react-icons/md';
import {
    deleteLink,
    updateLinkItemStatus,
} from '@/Services/LinksRequest.jsx';
import {FolderLinksContext} from '../../Pages/Dashboard/Dashboard.jsx';
import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';
import {
    LINKS_ACTIONS,
    FOLDER_LINKS_ACTIONS,
} from '@/Services/Reducer.jsx';
import {deleteFolder} from '@/Services/FolderRequests.jsx';

export const ConfirmPopup = ({
                                 editLink,
                                 setEditLink,
                                 showConfirmPopup,
                                 setShowConfirmPopup,
                             }) => {

    const {id, type, folderId} = editLink;
    const { userLinks, dispatch  } = useUserLinksContext();
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

                    setEditLink(prev =>
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

                            updateLinkItemStatus(packets, iconId, url);
                        }

                        dispatch({ type: LINKS_ACTIONS.UPDATE_LINKS_POSITIONS, payload: {links: newArray, folderActive: folderActive, folderID: iconId} })

                    } else {
                        dispatch({ type: LINKS_ACTIONS.SET_LINKS, payload: {links: data.links} })
                    }

                    setEditLink(prev =>
                        Object.fromEntries(Object.keys(prev).map(key => [key, null])));
                    setShowConfirmPopup({
                        show: false,
                        id: null,
                        type: null,
                    })
                }
            })
        }
    }

    const handleCancel = e => {
        e.preventDefault();
        setEditLink(prev =>
            Object.fromEntries(Object.keys(prev).map(key => [key, null])));
        setShowConfirmPopup({
            show: false,
            id: null,
            type: null
        })
    }

    return (

        <div id="confirm_popup_link" className={`${showConfirmPopup.show ? 'open' : ""}`}>
            <div className="rounded-2xl bg-white shadow-md">
                <div className="flex items-center gap-3 border-b border-gray-100 p-5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-50 text-green-700 ring-1 ring-green-200">
                        {/* success/check icon */}
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                            <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="!text-left !text-2xl font-semibold text-gray-900">
                            Confirm Delete
                        </h2>
                    </div>
                </div>
                <div className="py-8 px-10">
                    <p className="text-center text-base text-gray-800">
                        Are you sure you want to delete this
                        {type === "folder" || showConfirmPopup.type === "folder" ?
                            " folder" :
                            " icon"}?
                    </p>
                    <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <button
                            className='!w-40 button blue'
                            onClick={deleteItem}
                        >
                            Yes
                        </button>
                        <button className="!w-40 close_details button transparent gray"
                           onClick={handleCancel}
                        >No</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
