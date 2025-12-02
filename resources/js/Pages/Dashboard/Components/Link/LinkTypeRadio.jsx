import React, { useContext, useEffect, useState } from "react";
import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';
import {LINKS_ACTIONS, FOLDER_LINKS_ACTIONS} from '@/Services/Reducer.jsx';
import {addLink, updateLinkStatus} from '@/Services/LinksRequest.jsx';
import {
    FolderLinksContext,
} from '../../Dashboard.jsx';
import { SiInternetcomputer } from "react-icons/si";
import { FaMoneyBillWave,FaMailchimp } from "react-icons/fa";
import AffiliateSignup
    from "@/Pages/Dashboard/Components/Link/Forms/AffiliateSignup.jsx";
import ContentSelectButtons
    from "@/Components/ContentSelectButtons.jsx";

const LinkTypeRadio = ({
                           editLink,
                           setEditLink,
                           setShowLinkTypeRadio,
                           pageId,
                           affStatusState,
                           setAffStatusState
}) => {

    const { userLinks, dispatch } = useUserLinksContext();
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);
    const [showAffiliateSignup, setShowAffiliateSignup] = useState(false);

    const [linkOptions, setLinkOptions] = useState( [
        {
            key: 'url',
            icon: <SiInternetcomputer className="h-5 w-5 text-[#424fcf]" aria-hidden="true"/>,
            title: 'URL',
            description: 'Open a webpage, launch an email draft, or start a phone call.'
        },
        {
            key: 'offer',
            icon: <FaMoneyBillWave className="h-5 w-5 text-[#424fcf]" aria-hidden="true" />,
            title: 'Offer',
            description: 'Promote a creator’s lesson. Earn a commission when visitors buy from your link.'
        },
    ]);

    useEffect(() => {
        const hasMailchimp = userLinks?.some(obj => obj.type === 'mailchimp');
        const inFolder = Boolean(editLink?.folder_id);

        if (!hasMailchimp && !inFolder) {
            setLinkOptions(prev => {
                if (prev.some(o => o.key === 'mailchimp')) return prev;
                const newObject = {
                    key: 'mailchimp',
                    icon: <FaMailchimp className="h-5 w-5 text-[#424fcf]" aria-hidden="true" />,
                    title: 'Mailchimp',
                    description:
                        'Add a signup form to grow your newsletter—new subscribers go straight to your list.'
                };
                return [...prev, newObject];
            });
        }

    }, [linkOptions, editLink?.folder_id])

    const handleOnChange = (type) => {

        if (type === "offer" && affStatusState !== "approved") {
            setShowAffiliateSignup(true);
            return;
        }

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

                const newLinkObject = {
                    id: data.link_id,
                    type: type,
                    active_status: true,
                    page_id: pageId,
                    position: data.position,
                    folder_id: editLink.folder_id,
                }

                if (editLink.folder_id) {
                    let newFolderLinks = [...folderLinks];
                    newFolderLinks = newFolderLinks.concat(
                        newLinkObject);

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
            <div className="mb-4 flex items-baseline justify-between pt-4 pb-4">
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
                    className="!text-red-600 shadow-none p-0 w-auto text-sm font-medium hover:underline"
                >
                    Cancel
                </button>
            </div>
            {showAffiliateSignup ?
                <AffiliateSignup
                    commit={handleOnChange}
                    setAffStatusState={setAffStatusState}
                />
                :
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    <ContentSelectButtons
                        options={linkOptions}
                        handleClick={handleOnChange}
                    />
                </div>
            }
        </div>

    );
};

export default LinkTypeRadio;
