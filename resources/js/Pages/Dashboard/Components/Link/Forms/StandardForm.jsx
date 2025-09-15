import React, {
    useEffect,
    useState,
    useContext,
    useRef,
} from 'react';
import IconList from '../IconList';
import InputTypeRadio from './InputTypeRadio';
import {
    handleSwitchChange,
} from '@/Services/LinksRequest.jsx';
import {
    FolderLinksContext,
} from '../../../Dashboard.jsx';
import {usePageContext} from '@/Context/PageContext.jsx';
import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';

import {acceptTerms} from '@/Services/UserService.jsx';
import IconDescription from './IconDescription.jsx';

import ImageUploader
    from '@/Pages/Dashboard/Components/Link/Forms/ImageUploader.jsx';
import FormTabs from '@/Pages/Dashboard/Components/Link/Forms/FormTabs.jsx';
import IconSettingComponent
    from '@/Pages/Dashboard/Components/Link/Forms/IconSettingComponent.jsx';
import {capitalize} from 'lodash';
import IOSSwitch from '@/Utils/IOSSwitch.jsx';
import {getIcons} from '@/Services/IconRequests.jsx';
import {getIconPaths} from '@/Services/ImageService.jsx';
import MailChimp from '@/Pages/Dashboard/Components/Link/Forms/Mailchimp/MailChimp.jsx';
import ToolTipIcon from '@/Utils/ToolTips/ToolTipIcon.jsx';

const StandardForm = ({
                          editLink,
                          setEditLink,
                          setShowLoader,
                          setFormRow,
                          affiliateStatus,
                          setAffiliateStatus,
                          connectionError = null,
                          index

}) => {

    const { userLinks, dispatch } = useUserLinksContext();
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);
    const  { pageSettings } = usePageContext();
    const [ showTerms, setShowTerms ] = useState(false);

    const [customIconArray, setCustomIconArray] = useState([]);

    const [ showFormTab, setShowFormTab ] = useState("icon");

    const [isLoading, setIsLoading] = useState(true);

    //const {id, folderId} = editLink;
    const [ showIconList, setShowIconList ] = useState({
        type: '',
        list: []
    });

    const [imageSelected, setImageSelected] = useState(false);
    const iconCacheRef = useRef({});

    useEffect(() => {
        setEditLink(
            userLinks.find(function(e) {
                return e?.id === editLink.id
            }) || folderLinks.find(function(e) {
                return e?.id === editLink.id
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
                icon_active: editLink.icon_active,
                bg_active: editLink.bg_active,
            }
        );
    }, []);

    const [charactersLeft, setCharactersLeft] = useState(11);

    useEffect(() => {

        switch (editLink.type) {
            case "url":
            case "email":
            case "phone":
                const type = editLink.icon?.includes("custom-icons") ? "custom" : "standard";
                setShowIconList((prev) => ({
                    ...prev,
                    type: type,
                }));
                break;
            case "offer":
                //const offerIconType = editLink.icon?.includes("custom-icons") ? "custom" : "offers"
                setShowIconList((prev) => ({
                    ...prev,
                    type: "offers",
                }));
                break;
            default:
                setShowIconList((prev) => ({
                    ...prev,
                    type: "standard",
                }));
                break;
        }

    }, []);

    useEffect(() => {

        if (!showIconList.type) return;

        if (iconCacheRef.current[showIconList.type]) {
            const cachedList = iconCacheRef.current[showIconList.type];

            if (showIconList.type === 'custom') {
                setCustomIconArray(cachedList);
            } else {
                setShowIconList((prev) => ({
                    ...prev,
                    list: cachedList,
                }));
            }

            setIsLoading(false);
            return;
        }

        // Clear previous lists before loading new
        setShowIconList((prev) => ({
            ...prev,
            list: []
        }));
        setCustomIconArray([]);

        let url = '';
        switch(showIconList.type) {
            case "standard":
                url = '/get-standard-icons';
                break;
            case "custom":
                url = '/get-custom-icons';
                break;
            case "offers":
                url = '/get-aff-icons';
                break;
            default:
                url = '/get-standard-icons';
                break;
        }

        getIcons(url).then((data) => {
            if(data.success) {

                if (showIconList.type === "custom") {
                    iconCacheRef.current['custom'] = data.iconData;
                    setCustomIconArray(data.iconData);
                } else if (showIconList.type === "standard")  {
                    const iconPaths = getIconPaths(data.iconData);
                    iconCacheRef.current['standard'] = iconPaths;
                    setShowIconList((prev) => ({
                        ...prev,
                        list: iconPaths,
                    }));
                } else if (showIconList.type === "offers") {
                    iconCacheRef.current['offers'] = data.iconData;
                    setShowIconList((prev) => ({
                        ...prev,
                        list: data.iconData,
                    }));
                }

                setIsLoading(false);
            }
        });
    }, [showIconList.type]);

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
*/
    /*const handleOnClick = () => {

        if (!subStatus) {
            setShowUpgradePopup({
                show: true,
                text: "change link name"
            });
        }
    }*/

    const handleSubmitTerms = (e) => {
        e.preventDefault()

        acceptTerms().then((data) => {

            if (data.success && setAffiliateStatus) {
                setAffiliateStatus("approved");
                setShowTerms(false);
            }
        });

    }

    const handleCloseForm = (e) => {
        e.preventDefault();
        const openedDiv = document.querySelector('.column_content.open');
        if (openedDiv) {
            openedDiv.classList.remove('open');
        }
        setFormRow(null);
        setEditLink( prev => ({
            ...prev,
            id: null,
        }));
    }

    return (
        <>
            {pageSettings.page_layout === "layout_two" &&
                <div className="close_wrap w-full text-center">
                    <a className="close_button uppercase" href="#" onClick={(e) => handleCloseForm(e)}><small>close</small></a>
                </div>
            }
            {(affiliateStatus !== "approved" || !affiliateStatus) && editLink.type === "offer" ?
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
                <div className={`form_content w-full ${showFormTab === "integration" ? 'pb-5' : ""}`}>
                    {!imageSelected &&
                        <>
                        <FormTabs
                            showFormTab={showFormTab}
                            setShowFormTab={setShowFormTab}
                            setShowIconList={setShowIconList}
                            pageLayout={pageSettings.page_layout}
                            editLink={editLink}
                        />

                        {pageSettings.page_layout === "layout_one" &&
                            <div className="my_row mt-4 mb-2 px-4">
                                <IconSettingComponent
                                    inputType="text"
                                    editLink={editLink}
                                    setEditLink={setEditLink}
                                    elementName="name"
                                    label="Link Name"
                                    currentValue={editLink.name}
                                    placeholder="Enter Link Name"
                                    maxChar={11}
                                />
                            </div>
                        }
                        </>
                    }

                    { (pageSettings.page_layout === "layout_one" && !imageSelected) ?
                        <div className="my_row mb-4 px-4">
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
                                    currentValue={editLink.url}
                                    placeholder="Enter URL"
                                    label={capitalize(editLink.type)}
                                />
                            }
                        </div>
                        :
                        ""
                    }

                    { (showFormTab === "icon") ?
                        <div className="link_form form_nav_content">
                            {(pageSettings.page_layout === "layout_two" && !imageSelected) &&
                                <div className="setting_row w-full flex justify-between">
                                    <div className="section_title w-full flex justify-start gap-2 !mb-0">
                                        <h4>Icon</h4>
                                        <ToolTipIcon section="icon_status" />
                                    </div>
                                    <div className="switch_wrap">
                                        <IOSSwitch
                                            onChange={() => handleSwitchChange(editLink, setEditLink, dispatch, "icon_active")}
                                            checked={Boolean(editLink.icon_active)}
                                        />
                                        <div className="hover_text switch">
                                            <p>
                                                {Boolean(editLink.icon_active) ? "Hide" : "Show"} Icon
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            }
                            { (editLink.type !== "offer" &&
                                editLink.type !== "mailchimp" &&
                                showFormTab === "icon" &&
                                !imageSelected
                            ) ?
                                <div className="my_row form_nav_content input_types pt-5 pb-5">
                                    <div className="setting_wrap w-full !mb-4">
                                        <div className="section_title w-full flex justify-start gap-2 !mb-4">
                                            <h4>Link Type</h4>
                                            <ToolTipIcon section="link_type" />
                                        </div>
                                        <InputTypeRadio
                                            editLink={editLink}
                                            setEditLink={setEditLink}
                                        />
                                    </div>
                                </div>
                                :
                                ""
                            }
                            <div className="icon_row w-full">
                                <div className="icon_box">
                                    <IconList
                                        setCharactersLeft={setCharactersLeft}
                                        editLink={editLink}
                                        setEditLink={setEditLink}
                                        showIconList={showIconList}
                                        setShowIconList={setShowIconList}
                                        setShowLoader={setShowLoader}
                                        customIconArray={customIconArray}
                                        setCustomIconArray={setCustomIconArray}
                                        isLoading={isLoading}
                                        showFormTab={showFormTab}
                                        imageSelected={imageSelected}
                                        setImageSelected={setImageSelected}

                                    />
                                </div>
                            </div>

                            {/*{!folderID &&
                                <IconDescription
                                    currentLink={currentLink}
                                    setCurrentLink={setCurrentLink}
                                    descChecked={descChecked}
                                    setDescChecked={setDescChecked}
                                />
                            }*/}
                        </div>
                        :
                        ""
                    }
                    { showFormTab === "image" &&
                        <div className="form_nav_content inline-block relative p-5 w-full bg-white">
                            { (editLink.bg_image && !imageSelected) ?
                                <>
                                    <div className="w-full flex justify-between setting_row mb-5">
                                        <div className="section_title w-full flex justify-start gap-2 !mb-4">
                                            <h4>Button Background</h4>
                                            <ToolTipIcon section="button_image" />
                                        </div>
                                        <div className="switch_wrap mb-4">
                                            <IOSSwitch
                                                onChange={() => handleSwitchChange(editLink, setEditLink, dispatch, "bg_active")}
                                                checked={Boolean(editLink.bg_active)}
                                            />
                                            <div className="hover_text switch">
                                                <p>
                                                    {Boolean(editLink.bg_active) ? "Disable" : "Enable"} Background
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <p className="label">Current:</p>
                                        <div className="image_wrap">
                                            <img src={editLink.bg_image} alt=""/>
                                        </div>
                                    </div>
                                </>
                                :
                                ""
                            }
                            <div className="w-full">
                                <ImageUploader
                                    editLink={editLink}
                                    setEditLink={setEditLink}
                                    setShowLoader={setShowLoader}
                                    elementName="bg_image"
                                    imageCrop={{unit: "%", width: 100, aspect: 16 / 5 }}
                                    imageAspectRatio={16 / 5}
                                    imageSelected={imageSelected}
                                    setImageSelected={setImageSelected}
                                    label="Background Image"
                                />
                            </div>
                        </div>
                    }
                    {showFormTab === "integration" &&
                        <MailChimp
                            editLink={editLink}
                            setEditLink={setEditLink}
                            connectionError={connectionError}
                            index={index}
                        />
                    }
                    { (showFormTab === "offers") &&

                        <div className="icon_row link_form form_nav_content">
                            <div className="icon_box">
                                <IconList
                                    setCharactersLeft={setCharactersLeft}
                                    editLink={editLink}
                                    setEditLink={setEditLink}
                                    showIconList={showIconList}
                                    setShowIconList={setShowIconList}
                                    setShowLoader={setShowLoader}
                                    customIconArray={customIconArray}
                                    setCustomIconArray={setCustomIconArray}
                                    isLoading={isLoading}
                                    showFormTab={showFormTab}
                                    imageSelected={imageSelected}
                                    setImageSelected={setImageSelected}
                                />
                            </div>
                        </div>
                    }
                </div>
            </>
            }
        </>
    );
};

export default StandardForm;
