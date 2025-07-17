import React, {useContext} from 'react';
import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';
import {LINKS_ACTIONS, FOLDER_LINKS_ACTIONS} from '@/Services/Reducer.jsx';
import addLink from '@/Services/LinksRequest.jsx';
import {
    FolderLinksContext,
} from '../../Dashboard.jsx';
const LinkTypeRadio = ({
                           editLink,
                           setEditLink,
                           setShowLinkTypeRadio,
                           pageId,
}) => {

    const { userLinks, dispatch } = useUserLinksContext();
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);

    console.log("userLinks:", userLinks);
    const handleOnChange = (type) => {

        console.log('editLink', editLink);
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
                let newLinks = [...userLinks];
                //newLinks = newLinks.concat(newLinkObject)

                setEditLink(prevState => ({
                    ...prevState,
                    id: data.link_id,
                    position: data.position,
                }))

                if (editLink.folder_id) {
                    let newFolderLinks = [...folderLinks];
                    newFolderLinks = newFolderLinks.concat(
                        newLinkObject);

                     newLinks = newLinks.map((link, index) => {
                         if (link.id === editLink.folder_id) {
                             link.links.push(newLinkObject);
                         }
                     })
                    dispatchFolderLinks({ type: FOLDER_LINKS_ACTIONS.SET_FOLDER_LINKS, payload: {links: newFolderLinks} })
                    dispatch({
                        type: LINKS_ACTIONS.ADD_NEW_IN_FOLDER,
                        payload: {
                            newLinkObject: newLinkObject,
                            folderActive: true,
                            folderID: editLink.folder_id,
                        }
                    })
                } else {
                     newLinks = newLinks.concat(newLinkObject)
                 }

                 dispatch({
                     type: LINKS_ACTIONS.SET_LINKS,
                     payload: {
                         links: newLinks
                     }
                 })

                setTimeout(function(){
                    window.scrollTo(0, document.body.scrollHeight);
                }, 800)
            }
        });
    }

    return (
        <div id="scrollTo" className="my_row radios_wrap my-2 px-10">
            <div className="radio_wrap">
                <label htmlFor="link_type">
                    <input type="radio"
                           name="link_type"
                           id="personal_button"
                           value="url"
                           onChange={(e) => handleOnChange("url")}
                    />
                    Personal Button
                </label>
            </div>
            <div className="radio_wrap">
                <label htmlFor="link_type">
                    <input type="radio"
                           name="link_type"
                           id="offer_button"
                           value="offer"
                           onChange={(e) => handleOnChange(e.target.value)}
                    />
                    Creator Offer
                </label>
            </div>
            { (!userLinks.some(obj => obj.type === "mailchimp") && !editLink.folder_id) &&
                <div className="radio_wrap">
                    <label htmlFor="link_type">
                        <input type="radio"
                               name="link_type"
                               id="mailchimp_button"
                               value="mailchimp"
                               onChange={(e) => handleOnChange(e.target.value)}
                        />
                        MailChimp
                    </label>
                </div>
            }
            <a className="ml-auto text-red-600 flex justify-end text-md"
               href="#"
               onClick={(e) => {
                   e.preventDefault();
                   setShowLinkTypeRadio(false);
               }}
            >
                CANCEL
            </a>
        </div>
    );
};

export default LinkTypeRadio;
