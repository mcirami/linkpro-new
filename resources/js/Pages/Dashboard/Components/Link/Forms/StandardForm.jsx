import React, {
    useCallback,
    useEffect,
    useState,
    useContext, useRef,
} from 'react';
import IconList from '../IconList';
import InputComponent from './InputComponent';
import InputTypeRadio from './InputTypeRadio';
import {
    addLink,
    checkURL,
    updateLink,
    updateLinkStatus,
} from '@/Services/LinksRequest.jsx';
import {
    FOLDER_LINKS_ACTIONS,
    LINKS_ACTIONS,
} from '@/Services/Reducer.jsx';
import {
    FolderLinksContext,
    UserLinksContext,
} from '../../../Dashboard.jsx';
import {usePageContext} from '@/Context/PageContext.jsx';

import {HandleFocus, HandleBlur} from '@/Utils/InputAnimations.jsx';
import {acceptTerms} from '@/Services/UserService.jsx';
import IconDescription from './IconDescription.jsx';
import { FaImage } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import HoverText from '@/Utils/HoverText.jsx';

import ImageUploader
    from '@/Pages/Dashboard/Components/Link/Forms/ImageUploader.jsx';
import FormTabs from '@/Pages/Dashboard/Components/Link/Forms/FormTabs.jsx';
import IconSettingComponent
    from '@/Pages/Dashboard/Components/Link/Forms/IconSettingComponent.jsx';
import {capitalize} from 'lodash';

const StandardForm = ({
                          editLink,
                          setEditLink,
                          setShowLoader,
                          affiliateStatus = null,
                          setAffiliateStatus = null,

}) => {

    const { userLinks, dispatch } = useContext(UserLinksContext);
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);
    const  { pageSettings } = usePageContext();
    const [ showTerms, setShowTerms ] = useState(false);
    const [ showBGUpload, setShowBGUpload ] = useState({
        show: false,
        initialMessage: false,
    });

    //const {id, folderId} = editLink;
    const [ showIconList, setShowIconList ] = useState(true);

    useEffect(() => {
        setEditLink(
            userLinks.find(function(e) {
                return e.id === editLink.id
            }) || folderLinks.find(function(e) {
                return e.id === editLink.id
            }) ||
            {
                id: null,
                page_id: pageSettings["id"],
                icon: null,
                name: null,
                url: null,
                email: null,
                phone: null,
                mailchimp_list_id: null,
                shopify_products: null,
                shopify_id: null,
                course_id: null,
                folder_id: editLink.folder_id,
                description: null,
                type: editLink.type,
            }
        );
    }, []);

    const [charactersLeft, setCharactersLeft] = useState(11);

    /*const [descChecked, setDescChecked] = useState(
        Boolean(
            currentLink.description &&
            currentLink.description !== "" &&
            currentLink.type === "advanced"
        ));*/

    /*

    useEffect(() => {
        if(currentLink.name) {
            setCharactersLeft(11 - currentLink.name.length);
        }

    },[charactersLeft])

    useEffect(() => {

        if(accordionValue === "standard") {
            if (currentLink.phone) {
                setInputType("phone")
            } else if (currentLink.email) {
                setInputType("email")
            } else {
                setInputType("url")
            }
        } else if (accordionValue === "offer") {
            setInputType("offer")
        }

    },[])

    const handleLinkName = useCallback( (e) => {
            let value = e.target.value;

            setCharactersLeft(11 - value.length);

            setCurrentLink((prev) => ({
                ...prev,
                name: value
            }))
        },[]);
*/
    /*const handleOnClick = () => {

        if (!subStatus) {
            setShowUpgradePopup({
                show: true,
                text: "change link name"
            });
        }
    }*/

    /*const handleSubmit = (e) => {
        e.preventDefault();

        let URL = currentLink.url;
        let data;

        if (URL && currentLink.name) {
            data = checkURL(URL, currentLink.name, null, subStatus);
        } else {
            data = {
                success: true,
                url: URL
            }
        }

        if (data["success"]) {

            URL = data["url"];
            let packets;
            let descValue = null;
            let iconType = inputType;

            /!*if (currentLink.description && currentLink.description !== "") {
                if(descChecked) {
                    iconType = "advanced";
                }
                descValue = getJsonValue(currentLink.description);
            }*!/

            switch (inputType) {
                case "url":
                    packets = {
                        name: currentLink.name,
                        url: URL,
                        icon: currentLink.icon,
                        page_id: pageSettings["id"],
                        folder_id: folderId,
                        description: descValue,
                        type: iconType,
                    };
                    break;
                case "email":
                    packets = {
                        name: currentLink.name,
                        email: currentLink.email,
                        icon: currentLink.icon,
                        page_id: pageSettings["id"],
                        folder_id: folderId,
                        description: descValue,
                        type: iconType,
                    };
                    break;
                case "phone":
                    packets = {
                        name: currentLink.name,
                        phone: currentLink.phone,
                        icon: currentLink.icon,
                        page_id: pageSettings["id"],
                        folder_id: folderId,
                        description: descValue,
                        type: iconType,
                    };
                    break;
                case "offer":
                    packets = {
                        name: currentLink.name,
                        icon: currentLink.icon,
                        url: URL,
                        page_id: pageSettings["id"],
                        course_id: currentLink.course_id,
                        folder_id: folderId,
                        description: descValue,
                        type: iconType,
                    };
                    break;
                default:
                    packets = {
                        name: currentLink.name,
                        url: URL,
                        icon: currentLink.icon,
                        page_id: pageSettings["id"],
                        folder_id: folderId,
                        description: descValue,
                        type: iconType,
                    };
                    break;
            }

            const func = id ? updateLink(packets, id) : addLink(packets);

            func.then((data) => {

                if (data.success) {

                    if (folderId) {

                        if (id) {
                            dispatchFolderLinks({
                                type: FOLDER_LINKS_ACTIONS.UPDATE_FOLDER_LINKS,
                                payload: {
                                    editID: id,
                                    currentLink: currentLink,
                                    url: URL,
                                    type: iconType,
                                    iconPath: currentLink.icon
                                }
                            })

                            dispatch({
                                type: LINKS_ACTIONS.UPDATE_LINK_IN_FOLDER,
                                payload: {
                                    folderID: folderId,
                                    editID: id,
                                    currentLink: currentLink,
                                    url: URL,
                                    type: iconType,
                                    iconPath: currentLink.icon
                                }
                            })

                        } else {
                            let newFolderLinks = [...folderLinks];

                            const newLinkObject = {
                                id: data.link_id,
                                folder_id: folderId,
                                name: currentLink.name,
                                url: URL,
                                email: currentLink.email,
                                phone: currentLink.phone,
                                type: iconType,
                                icon: currentLink.icon,
                                course_id: currentLink.course_id,
                                position: data.position,
                                description: currentLink.description,
                                active_status: true
                            }

                            newFolderLinks = newFolderLinks.concat(
                                newLinkObject);

                            dispatchFolderLinks({
                                type: FOLDER_LINKS_ACTIONS.SET_FOLDER_LINKS,
                                payload: {
                                    links: newFolderLinks
                                }
                            });

                            let folderActive = null;
                            if (newFolderLinks.length === 1) {
                                folderActive = true;
                                const url = "/dashboard/folder/status/";
                                const packets = {
                                    active_status: folderActive,
                                };

                                updateLinkStatus(packets, folderId, url);
                            }

                            dispatch({
                                type: LINKS_ACTIONS.ADD_NEW_IN_FOLDER,
                                payload: {
                                    newLinkObject: newLinkObject,
                                    folderActive: folderActive,
                                    folderID: folderId
                                }
                            })

                        }

                    } else {

                        if (id) {
                            dispatch({
                                type: LINKS_ACTIONS.UPDATE_LINK,
                                payload: {
                                    editID: id,
                                    currentLink: currentLink,
                                    url: URL,
                                    type: iconType,
                                    iconPath: currentLink.icon
                                }
                            })

                        } else {
                            let newLinks = [...userLinks];

                            const newLinkObject = {
                                id: data.link_id,
                                name: currentLink.name,
                                url: URL,
                                email: currentLink.email,
                                phone: currentLink.phone,
                                type: iconType,
                                icon: currentLink.icon,
                                course_id: currentLink.course_id,
                                position: data.position,
                                description: currentLink.description,
                                active_status: true
                            }

                            dispatch({
                                type: LINKS_ACTIONS.SET_LINKS,
                                payload: {
                                    links: newLinks.concat(newLinkObject)
                                }
                            })
                        }
                    }

                    if (!id) {
                        setShowBGUpload({
                            show: false,
                            initialMessage: true
                        })
                    }
                    setCurrentLink((prev)=> ({
                        ...prev,
                        id: data.link_id,
                    }));

                    //setAccordionValue(null);
                    //setShowLinkForm(false);
                    //setInputType(null);
                    //setEditLink(prev => Object.fromEntries(Object.keys(prev).map(key => [key, null])));
                }
            })
        }
    };

*/
    const handleSubmitTerms = (e) => {
        e.preventDefault()

        acceptTerms().then((data) => {

            if (data.success && setAffiliateStatus) {
                setAffiliateStatus("approved");
                setShowTerms(false);
            }
        });

    }

    return (
         (affiliateStatus !== "approved" || !affiliateStatus) && editLink.type === "offer" ?
            showTerms ?
                <div className="aff_terms">
                    <h3>Terms and Conditions</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, aspernatur dignissimos doloribus itaque quaerat rem repellendus vel voluptates. Aliquam doloribus eligendi iste, labore molestias nisi omnis saepe voluptatibus. Consequuntur, esse.</p>
                    <form action="" onSubmit={handleSubmitTerms}>
                        {/*<div className="checkbox_wrap">
                            <input
                                name="terms"
                                type="checkbox"
                                onChange={() => setTermsChecked(!termsChecked)}
                            />
                            <label htmlFor="terms">I Agree</label>
                        </div>*/}
                        <div className="buttons_wrap">
                            <button type="submit" className="button green" >Accept</button>
                            <a className="button transparent gray" href="#"
                               onClick={(e) => {
                                   e.preventDefault();
                                   setShowTerms(false);
                               }}
                            >Cancel</a>
                        </div>
                    </form>
                </div>
                :
                <div className="info_message">
                    <p>Sign up now to become an affiliate and earn money selling courses!</p>
                    <a className="button blue"
                       href="#"
                       onClick={(e) => {
                           e.preventDefault();
                           setShowTerms(true);
                       }}>Click Here To Get Approved</a>
                </div>
            :
            <>
            <FormTabs
                currentLink={editLink}
                showIconList={showIconList}
                setShowIconList={setShowIconList}
                showBGUpload={showBGUpload}
                setShowBGUpload={setShowBGUpload}
                pageLayout={pageSettings.page_layout}
            />
                {showBGUpload.show ?
                <div className="flex flex-wrap justify-end mt-5 relative">
                    <div className="w-full">
                        <ImageUploader
                            currentLink={editLink}
                            setShowLoader={setShowLoader}
                            pageSettings={pageSettings}
                            setShowBGUpload={setShowBGUpload}
                        />
                    </div>
                </div>
                :
                <div className="link_form">
                    {showIconList &&
                        <div className="icon_row">
                            <div className="icon_box">
                                <IconList
                                    setCharactersLeft={setCharactersLeft}
                                    editLink={editLink}
                                    setEditLink={setEditLink}
                                />
                            </div>
                            <a className="hide_button uppercase mt-2" href="#" onClick={(e) => {
                                e.preventDefault();
                                setShowIconList(false);
                            }}>Hide Icons</a>
                        </div>
                    }

                    {pageSettings.page_layout === "layout_one" &&
                        <div className="my_row mb-4">
                            <IconSettingComponent
                                inputType="text"
                                editLink={editLink}
                                setEditLink={setEditLink}
                                elementName="name"
                                label="Link Name"
                                maxChar={11}
                            />
                        </div>
                    }

                    {editLink.type !== "offer" &&
                        <InputTypeRadio
                            editLink={editLink}
                            setEditLink={setEditLink}
                        />
                    }

                    {pageSettings.page_layout === "layout_one" &&
                        <div className="my_row mb-4">
                            {editLink.type === "offer" ?
                                <div className="external_link">
                                    <h3>Tracking Link:</h3>
                                    {editLink.url ?
                                        <a className="inline-block" target="_blank" href={editLink.url}>{editLink.url}</a>
                                        :
                                        <p>Select An Icon Above</p>
                                    }
                                </div>
                                :
                                <IconSettingComponent
                                    inputType={editLink.type}
                                    editLink={editLink}
                                    setEditLink={setEditLink}
                                    elementName={editLink.type}
                                    label={capitalize(editLink.type)}
                                />
                            }
                        </div>
                    }

                    {/*{!folderID &&
                        <IconDescription
                            currentLink={currentLink}
                            setCurrentLink={setCurrentLink}
                            descChecked={descChecked}
                            setDescChecked={setDescChecked}
                        />
                    }*/}

                    <div className="button_row w-full mt-4">
                        <a className="help_link" href="mailto:help@link.pro">Need Help?</a>
                    </div>
                </div>
                }
                </>
    );
};

export default StandardForm;
