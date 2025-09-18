import React, {useContext} from 'react';
import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';
import {LINKS_ACTIONS, FOLDER_LINKS_ACTIONS} from '@/Services/Reducer.jsx';
import {addLink, updateLinkStatus} from '@/Services/LinksRequest.jsx';
import {
    FolderLinksContext,
} from '../../Dashboard.jsx';
import { SiInternetcomputer } from "react-icons/si";
import { FaMoneyBillWave,FaMailchimp } from "react-icons/fa";

const LinkTypeRadio = ({
                           editLink,
                           setEditLink,
                           setShowLinkTypeRadio,
                           pageId,
}) => {

    const { userLinks, dispatch } = useUserLinksContext();
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);

    const handleOnChange = (type) => {

        setEditLink((prev) => ({
            ...prev,
            type: type,
            page_id: pageId,
            icon_active: false,
            bg_active: false
        }));
        setShowLinkTypeRadio(false);

        const packets = {
            type: type,
            page_id: pageId,
            folder_id: editLink.folder_id,
        }

        addLink(packets).then((data) => {
            if (data.success) {
                /*let newLinks = [...userLinks];
                const newLinkObject = {
                    name: name,
                    icon: source,
                    [`${iconType}`]: value,
                    type: iconType,
                    course_id: courseId,
                    id: data.link_id,
                    position: data.position,
                    active_status: true,
                    folder_id: editLink.folder_id,
                }*/

                const newLinkObject = {
                    id: data.link_id,
                    type: type,
                    active_status: true,
                    page_id: pageId,
                    position: data.position,
                    folder_id: editLink.folder_id,
                }

                //newLinks = newLinks.concat(newLinkObject)

                /*setEditLink(prevState => ({
                    ...prevState,
                    id: data.link_id,
                    position: data.position,
                }))*/

                if (editLink.folder_id) {
                    let newFolderLinks = [...folderLinks];
                    newFolderLinks = newFolderLinks.concat(
                        newLinkObject);

                     /*newLinks = newLinks.map((link, index) => {
                         if (link.id === editLink.folder_id) {
                             link.links.push(newLinkObject);
                         }
                     })*/
                    dispatchFolderLinks({ type: FOLDER_LINKS_ACTIONS.SET_FOLDER_LINKS, payload: {links: newFolderLinks} })

                    let folderActive = null;
                    if (newFolderLinks.length === 1) {
                        folderActive = true;
                        const url = "/dashboard/folder/status/";
                        const packets = {
                            active_status: folderActive,
                        };

                        updateLinkStatus(packets, editLink.folder_id, url);
                    }

                    dispatch({
                        type: LINKS_ACTIONS.ADD_NEW_IN_FOLDER,
                        payload: {
                            newLinkObject: newLinkObject,
                            folderActive: true,
                            folderID: editLink.folder_id,
                        }
                    })
                } else {
                    let newLinks = [...userLinks];
                    newLinks = newLinks.concat(newLinkObject)
                    dispatch({
                        type: LINKS_ACTIONS.SET_LINKS,
                        payload: {
                            links: newLinks
                        }
                    })
                 }

                setTimeout(function(){
                    window.scrollTo(0, document.body.scrollHeight);
                }, 800)
            }
        });
    }

    return (
        <div id="scrollTo" className="my_row px-6 sm:px-10 mt-4">
            {/* Title + helper */}
            <div className="mb-4 flex items-baseline justify-between pt-4 border-t border-gray-200 pb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Choose a link type</h3>
                    <p className="text-sm text-gray-500">
                        Pick what you want to add to this page.
                    </p>
                </div>

                {/* Cancel */}
                <button
                    type="button"
                    onClick={() => setShowLinkTypeRadio(false)}
                    className="text-red-600 shadow-none p-0 w-auto text-sm font-medium hover:underline"
                >
                    Cancel
                </button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* URL */}
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleOnChange("url"); }}
                    className="transform-none flex items-start w-full group rounded-xl border border-gray-200 bg-white p-4 text-left shadow-md
                 transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-[#424fcf]/30"
                >
                    <div className="flex-col items-start gap-3">
                        <div className="text-base font-semibold flex items-center gap-2 text-gray-900">
                            <div className="h-9 w-9 rounded-lg bg-[#424fcf]/10 grid place-items-center">
                                {/* link icon */}
                                <SiInternetcomputer className="h-5 w-5 text-[#424fcf]" aria-hidden="true" />
                            </div>
                            <h3 className="uppercase">URL</h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                            Open a webpage, launch an email draft, or start a phone call.
                        </p>
                    </div>
                </button>

                {/* Offer */}
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleOnChange("offer"); }}
                    className="transform-none flex items-start w-full group rounded-xl border border-gray-200 bg-white p-4 text-left shadow-md
                 transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-[#424fcf]/30"
                >
                    <div className="flex-col items-start gap-3">
                        <div className="text-base font-semibold flex items-center gap-2 text-gray-900">
                            <div className="h-9 w-9 rounded-lg bg-[#424fcf]/10 grid place-items-center">
                                {/* ticket/offer icon */}
                                <FaMoneyBillWave className="h-5 w-5 text-[#424fcf]" aria-hidden="true" />
                            </div>
                            <h3 className="uppercase">Offer</h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                            Promote a creator’s lesson. Earn a commission when visitors buy from your link.
                        </p>
                    </div>
                </button>

                {/* Mailchimp (conditionally render) */}
                {(!userLinks.some(obj => obj.type === "mailchimp") && !editLink.folder_id) && (
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); handleOnChange("mailchimp"); }}
                        className="transform-none flex items-start w-full group rounded-xl border border-gray-200 bg-white p-4 text-left shadow-md
                   transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none
                   focus-visible:ring-2 focus-visible:ring-[#424fcf]/30"
                    >
                        <div className="flex-col items-start gap-3">
                            <div className="flex items-center gap-2 text-base font-semibold text-gray-900">
                                <div className="h-9 w-9 rounded-lg bg-[#424fcf]/10 grid place-items-center">
                                    {/* inbox icon */}
                                    <FaMailchimp className="h-5 w-5 text-[#424fcf]" aria-hidden="true" />
                                </div>
                                <h3 className="uppercase">Mailchimp</h3>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                                Add a signup form to grow your newsletter—new subscribers go straight to your list.
                            </p>
                        </div>
                    </button>
                )}
            </div>
        </div>

    );
};

export default LinkTypeRadio;
