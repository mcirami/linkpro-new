import { ImPlus } from "react-icons/im";
import addFolder from '../../../../Services/FolderRequests';
import React, {useContext} from 'react';
import {usePageContext} from '@/Context/PageContext.jsx';
import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';
import {
    FolderLinksContext,
} from '../../Dashboard.jsx';

import {
    LINKS_ACTIONS,
    FOLDER_LINKS_ACTIONS,
} from '@/Services/Reducer.jsx';
import { AiFillFolderAdd } from "react-icons/ai";

const AddFolder = ({
                       setShowUpgradePopup,
                       setEditLink,
                       subStatus,
}) => {

    const  { pageSettings } = usePageContext();
    const { userLinks, dispatch } = useUserLinksContext();
    //const { originalArray, dispatchOrig } = useContext(OriginalArrayContext);
    const { dispatchFolderLinks } = useContext(FolderLinksContext);
    //const { dispatchOrigFolderLinks } = useContext(OriginalFolderLinksContext);

    const handleClick = (e) => {
        e.preventDefault();

        if ( subStatus ) {

            const packets = {
                pageID: pageSettings["id"]
            }

            addFolder(packets)
            .then((data) => {

                if (data.success) {
                    let newLinks = [...userLinks];
                    //let newOriginalArray = [...originalArray];
                    const newFolderObject = {
                        id: data.id,
                        name: null,
                        type: 'folder',
                        position: data.position,
                        links: []
                    }

                    //dispatchOrig({ type: ORIGINAL_LINKS_ACTIONS.SET_ORIGINAL_LINKS, payload: {links: newOriginalArray.concat(newFolderObject) }})
                    dispatch({ type: LINKS_ACTIONS.SET_LINKS, payload: {links: newLinks.concat(newFolderObject) }})

                    fetchFolderLinks(data.id);
                }
            })

        } else {
            setShowUpgradePopup({
                show: true,
                text: "add folders"
            });
        }
    };

    const fetchFolderLinks = async (folderID) => {
        const url = 'folder/links/' + folderID;
        const response = await fetch(url);
        const folderLinks = await response.json();

        //dispatchOrigFolderLinks({ type: ORIG_FOLDER_LINKS_ACTIONS.SET_ORIG_FOLDER_LINKS, payload: {links: folderLinks["links"] }})
        dispatchFolderLinks({ type: FOLDER_LINKS_ACTIONS.SET_FOLDER_LINKS, payload: {links: folderLinks["links"] }});

        setEditLink(prev => ({...prev, folder_id: folderID}));

        setTimeout(function(){
            document.querySelector('#scrollTo').scrollIntoView({
                behavior: 'smooth',
                block: "start",
                inline: "nearest"
            });

        }, 800)
    }

    return (

        <a href="#" className="transform-none flex items-start w-full group rounded-xl bg-white p-4 text-left shadow-md
                 transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-[#424fcf]/30" onClick={handleClick}>
            <div className="flex-col items-start gap-3">
                <div className="text-base font-semibold flex items-center gap-2 text-gray-900">
                    <div className="h-9 w-9 rounded-lg grid place-items-center bg-[#424fcf]/10">
                        {/* link icon */}
                        <AiFillFolderAdd className="h-6 w-6 text-[#424fcf]" aria-hidden="true" />
                    </div>
                    <h3 className="uppercase">Add Folder</h3>
                </div>
            </div>
        </a>

    )
}
export default AddFolder;
