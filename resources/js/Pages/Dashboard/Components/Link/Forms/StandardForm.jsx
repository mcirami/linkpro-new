import React, {
    useEffect,
    useState,
    useContext,
    useRef,
} from 'react';
import IconList from '../IconList';
import RadioGroup from '@/Components/RadioGroup.jsx';
import {
    commitLinkUpdate,
    handleSwitchChange,
    updateLink
} from '@/Services/LinksRequest.jsx';
import {
    FolderLinksContext,
} from '../../../Dashboard.jsx';
import {usePageContext} from '@/Context/PageContext.jsx';
import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';

import ImageUploader from '@/Components/ImageUploader.jsx';

import FormTabs from '@/Pages/Dashboard/Components/Link/Forms/FormTabs.jsx';
import IconSettingComponent
    from '@/Pages/Dashboard/Components/Link/Forms/IconSettingComponent.jsx';
import IOSSwitch from '@/Utils/IOSSwitch.jsx';
import {getIcons} from '@/Services/IconRequests.jsx';
import {getIconPaths} from '@/Services/ImageService.jsx';
import MailChimp from '@/Pages/Dashboard/Components/Link/Forms/Mailchimp/MailChimp.jsx';
import VideoForm from '@/Pages/Dashboard/Components/Link/Forms/VideoForm.jsx';
import ToolTipIcon from '@/Utils/ToolTips/ToolTipIcon.jsx';
import LinkColorPicker from '@/Components/LinkComponents/LinkColorPicker.jsx';
import { LINKS_ACTIONS } from '@/Services/Reducer.jsx';
const StandardForm = ({
                          editLink,
                          setEditLink,
                          setShowLoader,
                          setFormRow,
                          connectionError = null,
                          index

}) => {

    const { userLinks, dispatch } = useUserLinksContext();
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);
    const  { pageSettings } = usePageContext();


    const [customIconArray, setCustomIconArray] = useState([]);

    const [ showFormTab, setShowFormTab ] = useState("");

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
                button_design: editLink.button_design || "color",
                bg_color: null,
                text_color: null,
            }
        );
    }, []);

    const [charactersLeft, setCharactersLeft] = useState(11);

    useEffect(() => {

        switch (editLink.type) {
            case "url":
                case "email":
                    case "phone":
                        let stdType = editLink.icon?.includes("custom-icons") ? "custom" : "standard";
                        setShowIconList((prev) => ({
                            ...prev,
                            type: stdType,
                        }));
                        break;
                        case "offer":
                            //const offerIconType = editLink.icon?.includes("custom-icons") ? "custom" : "offers"
                            setShowIconList((prev) => ({
                                ...prev,
                                type: "offers",
                            }));
                            break;

                            case "mailchimp":
                                let mcType = editLink.icon?.includes("custom-icons") ? "custom" : "standard";
                                setShowIconList((prev) => ({
                                    ...prev,
                                    type: mcType,
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

    // Links created before the column existed come back null.
    const buttonDesign = editLink.button_design || "color";

    // Switching modes only flips the flag - bg_image and the colors are left
    // alone so toggling back restores what was there.
    const handleDesignChange = (e, option) => {
        e.preventDefault();

        if (option === buttonDesign) return;

        setEditLink(prev => ({
            ...prev,
            button_design: option
        }));

        commitLinkUpdate({ button_design: option }, {
            editLink,
            dispatch,
            dispatchFolderLinks,
            pageId: pageSettings.id,
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

                    { (pageSettings.page_layout === "layout_one" && showFormTab === "icon") &&
                        <div className="my_row mt-4 mb-2 px-4">
                            <IconSettingComponent
                                inputType="text"
                                editLink={editLink}
                                elementName="name"
                                label={editLink.type === "video" ? "Video Title" : "Link Name"}
                                currentValue={editLink.name}
                                placeholder={editLink.type === "video" ? "Enter Video Title" : "Enter Link Name"}
                                maxChar={11}
                            />
                        </div>
                    }
                    </>
                }

                { (pageSettings.page_layout === "layout_one" && !imageSelected && (editLink.type !== "video" || showFormTab === "icon")) ?
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
                            editLink.type === "video" ?
                                <IconSettingComponent
                                    inputType="text"
                                    editLink={editLink}
                                    elementName="url"
                                    currentValue={editLink.url}
                                    placeholder="Enter URL (optional)"
                                    label="Link (optional)"
                                />
                            :
                            editLink.type !== "mailchimp" &&
                            <IconSettingComponent
                                inputType={editLink.type}
                                editLink={editLink}
                                elementName={editLink.type}
                                currentValue={editLink.url}
                                placeholder="Enter URL"
                                label={editLink.type}
                            />
                        }
                    </div>
                    :
                    ""
                }

                { (showFormTab === "icon") ?
                    <div className="link_form form_nav_content">
                        {(pageSettings.page_layout === "layout_two" && !imageSelected) &&
                            <div className={`setting_row w-full border-b !border-gray-100 flex justify-between ${editLink.type === "mailchimp" ? "mb-5" : ""} `}>
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
                                            {Boolean(editLink.icon_active) ? "Hide" : "Show"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        }
                        { (editLink.type !== "offer" &&
                            editLink.type !== "mailchimp" &&
                            editLink.type !== "video" &&
                            showFormTab === "icon" &&
                            !imageSelected
                        ) ?
                            <div className="my_row form_nav_content input_types pt-5 pb-3 border-b border-gray-100 mb-8">
                                <div className="setting_wrap w-full !mb-4">
                                    <div className="section_title w-full flex justify-start gap-2 !mb-4">
                                        <h4>Link Type</h4>
                                        <ToolTipIcon section="link_type" />
                                    </div>
                                    <RadioGroup
                                        value={editLink.type}
                                        options={["url", "email", "phone"]}
                                        onChange={(e, option) => {
                                            e.preventDefault();
                                            setEditLink(prev => ({
                                                ...prev,
                                                type: option
                                            }));

                                            dispatch({
                                                type: LINKS_ACTIONS.UPDATE_LINK,
                                                payload: {
                                                    id: editLink.id,
                                                    editLink: editLink,
                                                    type: option,
                                                    [`${option}`] : editLink[`${option}`]
                                                }
                                            })
                                        }}
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
                { showFormTab === "design" &&
                    <div className="form_nav_content inline-block relative p-5 w-full bg-white">
                        {!imageSelected &&
                            <div className="setting_wrap w-full !mb-5">
                                <div className="section_title w-full flex justify-start gap-2 !mb-4">
                                    <h4>Button Design</h4>
                                </div>
                                <RadioGroup
                                    value={buttonDesign}
                                    options={["color", "image"]}
                                    onChange={handleDesignChange}
                                />
                            </div>
                        }

                        { buttonDesign === "image" ?
                            <>
                                { (editLink.bg_image && !imageSelected) ?
                                    <div className="w-full">
                                        <p className="label !text-gray-500 w-full text-center mb-2">Current</p>
                                        <div className="image_wrap">
                                            <img src={editLink.bg_image} alt=""/>
                                        </div>
                                    </div>
                                    :
                                    ""
                                }

                                <div className="w-full">
                                    <ImageUploader
                                        elementName="bg_image"
                                        label="Background Image"
                                        cropSettings={{ unit: '%', width: 100 }}
                                        aspect={16 / 5}
                                        setShowLoader={setShowLoader}
                                        onImageSelect={setImageSelected}
                                        startCollapsed={editLink.bg_image}
                                        onUpload={(response) => {
                                            const packets = {
                                                bg_image: response.key,
                                                ext: response.extension,
                                                button_design: "image",
                                            };
                                            return updateLink(packets, editLink.id).then((data) => {
                                                dispatch({
                                                    type: LINKS_ACTIONS.UPDATE_LINK,
                                                    payload: {
                                                        id: editLink.id,
                                                        bg_image: data.imagePath.bg_image,
                                                        button_design: "image",
                                                    },
                                                });
                                                setEditLink((prev) => ({
                                                    ...prev,
                                                    bg_image: data.imagePath.bg_image,
                                                    button_design: "image",
                                                }));
                                            });
                                        }}
                                    />
                                </div>
                            </>
                            :
                            <div className="w-full mb-4">
                                <LinkColorPicker
                                    key={`bg_color-${editLink.id}`}
                                    label="Button Color"
                                    elementName="bg_color"
                                    editLink={editLink}
                                    setEditLink={setEditLink}
                                    fallback="rgba(255,255,255,1)"
                                />
                            </div>
                        }

                        {/* Text sits over the image as well as the color, so this
                            one stays visible in both modes. */}
                        {!imageSelected &&
                            <div className="w-full">
                                <LinkColorPicker
                                    key={`text_color-${editLink.id}-${buttonDesign}`}
                                    label="Text Color"
                                    elementName="text_color"
                                    editLink={editLink}
                                    setEditLink={setEditLink}
                                    fallback={buttonDesign === "image" ? "rgba(255,255,255,1)" : "rgba(0,0,0,1)"}
                                />
                            </div>
                        }
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
                {showFormTab === "video" &&
                    <VideoForm
                        editLink={editLink}
                        setEditLink={setEditLink}
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
                {pageSettings.page_layout === "layout_two" &&
                    <div className="close_wrap w-full text-center">
                        <a className="close_button uppercase" href="#" onClick={(e) => handleCloseForm(e)}><small>close</small></a>
                    </div>
                }
            </div>
        </>
    );
};

export default StandardForm;
