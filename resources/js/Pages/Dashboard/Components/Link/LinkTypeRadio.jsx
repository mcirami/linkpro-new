import React, {useContext} from 'react';
import {UserLinksContext} from '../../Dashboard.jsx';
import {LINKS_ACTIONS} from '@/Services/Reducer.jsx';
import addLink from '@/Services/LinksRequest.jsx';

const LinkTypeRadio = ({
                           setEditLink,
                           setShowLinkTypeRadio,
                           pageId,
}) => {

    const { userLinks, dispatch } = useContext(UserLinksContext);
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

                setEditLink(prevState => ({
                    ...prevState,
                    id: data.link_id,
                    position: data.position,
                }))

                /* if (editLink.folder_id) {
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
                const newLinkObject = {
                    id: data.link_id,
                    type: type,
                    active_status: true,
                    page_id: pageId,
                    position: data.position,
                }
                let newLinks = [...userLinks];
                newLinks = newLinks.concat(newLinkObject)
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
        <div id="scrollTo" className="my_row radios_wrap mb-1">
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
        </div>
    );
};

export default LinkTypeRadio;
