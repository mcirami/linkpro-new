import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import IconList from '../IconList';
import InputTypeRadio from './InputTypeRadio';
import InputComponent from './InputComponent';
import {
    useDebounceEffect,
    onImageLoad,
    createImage,
    getFileToUpload, resizeFile,
} from '@/Services/ImageService.jsx';
import {
    FolderLinksContext,
    UserLinksContext,
} from '../../../Dashboard.jsx';
import {usePageContext} from '@/Context/PageContext.jsx';
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
import EventBus from '@/Utils/Bus';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import {HandleFocus, HandleBlur} from '@/Utils/InputAnimations.jsx';
import CropTools from '@/Utils/CropTools';
import IconDescription from './IconDescription.jsx';
import {getJsonValue} from '@/Services/IconRequests.jsx';
import FormNav from '@/Pages/Dashboard/Components/Link/Forms/FormNav.jsx';
import ImageUploader
    from '@/Pages/Dashboard/Components/Link/Forms/ImageUploader.jsx';

const CustomForm = ({
                        accordionValue,
                        setAccordionValue,
                        inputType,
                        setInputType,
                        editIcon,
                        setShowLinkForm,
                        setEditIcon,
                        setShowLoader,
}) => {

    const {id, folderId} = editIcon;
    const [customIconArray, setCustomIconArray] = useState([]);
    const { userLinks, dispatch } = useContext(UserLinksContext);
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);
    const  { pageSettings } = usePageContext();
    const [ showBGUpload, setShowBGUpload ] = useState(false);
    const [ showIconList, setShowIconList ] = useState(!id);

    //const iconRef = useRef(null)
    const [completedIconCrop, setCompletedIconCrop] = useState({});
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState(1)

    // if a custom icon is selected
    const [iconSelected, setIconSelected] = useState(false);

    //image cropping
    const [upImg, setUpImg] = useState(null);
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: '%', width: 30 });
    const [customIcon, setCustomIcon] = useState(null);

    const [charactersLeft, setCharactersLeft] = useState(11);

    const [currentLink, setCurrentLink] = useState (
        userLinks.find(function(e) {
            return e.id === id
        }) || folderLinks.find(function(e) {
            return e.id === id
        }) ||
        {
            icon: null,
            name: null,
            url: null,
            email: null,
            phone: null,
            mailchimp_list_id: null,
            shopify_products: null,
            shopify_id: null,
            description: null,
            type: null,
        }
    );

    /*const [descChecked, setDescChecked] = useState(
        Boolean(
            currentLink.description &&
            currentLink.description !== "" &&
            currentLink.type === "advanced"
        ));*/

    useDebounceEffect(
        null,
        completedIconCrop,
        null,
        imgRef,
        previewCanvasRef,
        scale,
        rotate
    )

    useEffect(() => {
        if(currentLink.name) {
            setCharactersLeft(11 - currentLink.name.length);
        }
    },[charactersLeft])

    useEffect(() => {
        if (!customIcon) {
            return
        }
        const objectUrl = URL.createObjectURL(customIcon)
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [customIcon]);

    const selectCustomIcon = async (e) => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }

        await resizeFile(files[0]).then((image) => {
            createImage(image, setUpImg);
            setCrop(undefined)
            setIconSelected(true);
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (iconSelected) {
            const image = getFileToUpload(previewCanvasRef?.current)
            image.then((value) => {
                submitWithCustomIcon(value);
            })
        } else {
            let URL = currentLink.url;
            let data;

            if (URL && currentLink.name) {
                data = checkURL(URL, currentLink.name, false,
                    true);
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

               /* if (currentLink.description && currentLink.description !== "") {
                    if(descChecked) {
                        iconType = "advanced";
                    }
                    descValue = getJsonValue(currentLink.description);
                }*/

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
                                    mailchimp_list_id: currentLink.mailchimp_list_id,
                                    shopify_products: currentLink.shopify_products,
                                    shopify_id: currentLink.shopify_id,
                                    description: currentLink.description,
                                    icon: currentLink.icon,
                                    position: data.position,
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

                                    updateLinkStatus(packets, folderId,
                                        url);
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
                                    mailchimp_list_id: currentLink.mailchimp_list_id,
                                    shopify_products: currentLink.shopify_products,
                                    shopify_id: currentLink.shopify_id,
                                    description: currentLink.description,
                                    icon: currentLink.icon,
                                    position: data.position,
                                    active_status: true
                                }

                                dispatch({
                                    type: LINKS_ACTIONS.SET_LINKS,
                                    payload: {
                                        links: newLinks.concat(
                                            newLinkObject)
                                    }
                                })
                            }

                        }

                        setEditIcon(prev =>
                            Object.fromEntries(Object.keys(prev).map(key => [key, null])));
                        setShowLinkForm(false);
                        setAccordionValue(null);
                        setInputType(null);
                        setCompletedIconCrop({});
                        setCurrentLink({})
                    }
                })
            }
        }
    }

    const submitWithCustomIcon = (image) => {

        if(currentLink.name &&
            (
                currentLink.url ||
                currentLink.email ||
                currentLink.phone
            )
        ) {

            setShowLoader({show: true, icon: "upload", position: "fixed"})
            window.Vapor.store(
                image,
                {
                    visibility: "public-read",
                    progress: progress => {
                        setShowLoader(prev => ({
                            ...prev,
                            progress: Math.round(progress * 100)
                        }))
                    }
                }
            ).then(response => {

                console.log("Vapor Response: ", response);
                let URL = currentLink.url;
                if (URL) {
                    URL = checkURL(currentLink.url, null, true);
                }

                let packets;
                let descValue = null;
                let iconType = inputType;

                /*if (currentLink.description && currentLink.description !== "") {
                    if(descChecked) {
                        iconType = "advanced";
                    }
                    descValue = getJsonValue(currentLink.description);
                }*/

                switch (inputType) {
                    case "url":
                        packets = {
                            name: currentLink.name,
                            url: URL,
                            icon: response.key,
                            page_id: pageSettings["id"],
                            ext: response.extension,
                            folder_id: folderId,
                            description: descValue,
                            type: iconType,
                        };
                        break;
                    case "email":
                        packets = {
                            name: currentLink.name,
                            email: currentLink.email,
                            icon: response.key,
                            page_id: pageSettings["id"],
                            ext: response.extension,
                            folder_id: folderId,
                            description: descValue,
                            type: iconType,
                        };
                        break;
                    case "phone":
                        packets = {
                            name: currentLink.name,
                            phone: currentLink.phone,
                            icon: response.key,
                            page_id: pageSettings["id"],
                            ext: response.extension,
                            folder_id: folderId,
                            description: descValue,
                            type: iconType,
                        };
                        break;
                    default:
                        packets = {
                            name: currentLink.name,
                            url: URL,
                            icon: response.key,
                            page_id: pageSettings["id"],
                            ext: response.extension,
                            folder_id: folderId,
                            description: descValue,
                            type: iconType,
                        };
                        break;
                }

                const func = id ? updateLink(packets, id) : addLink(packets);

                func.then((data) => {

                    if (data.success) {

                        const iconPath = data.imagePath;

                        if (folderId) {

                            if (id) {
                                dispatchFolderLinks({
                                    type: FOLDER_LINKS_ACTIONS.UPDATE_FOLDER_LINKS,
                                    payload: {
                                        editID: id,
                                        currentLink: currentLink,
                                        url: URL,
                                        type: iconType,
                                        iconPath: iconPath
                                    }})

                                dispatch({
                                    type: LINKS_ACTIONS.UPDATE_LINK_IN_FOLDER,
                                    payload: {
                                        folderID: folderId,
                                        editID: id,
                                        currentLink: currentLink,
                                        url: URL,
                                        type: iconType,
                                        iconPath: iconPath
                                    }})

                            } else {
                                let newFolderLinks = [...folderLinks];

                                const newLinkObject = {
                                    id: data.link_id,
                                    folder_id: folderId,
                                    name: currentLink.name,
                                    url: URL,
                                    email: currentLink.email,
                                    phone: currentLink.phone,
                                    mailchimp_list_id: currentLink.mailchimp_list_id,
                                    shopify_products: currentLink.shopify_products,
                                    shopify_id: currentLink.shopify_id,
                                    description: currentLink.description,
                                    type: iconType,
                                    icon: iconPath,
                                    position: data.position,
                                    active_status: true
                                }

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
                                    }})

                                dispatchFolderLinks({
                                    type: FOLDER_LINKS_ACTIONS.SET_FOLDER_LINKS,
                                    payload: {
                                        links: newFolderLinks.concat(newLinkObject)
                                    }});
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
                                        iconPath: iconPath
                                    }})

                            } else {
                                let newLinks = [...userLinks];

                                const newLinkObject = {
                                    id: data.link_id,
                                    name: currentLink.name,
                                    url: URL,
                                    email: currentLink.email,
                                    phone: currentLink.phone,
                                    description: currentLink.description,
                                    type: iconType,
                                    icon: iconPath,
                                    position: data.position,
                                    active_status: true
                                }

                                dispatch({
                                    type: LINKS_ACTIONS.SET_LINKS,
                                    payload: {
                                        links: newLinks.concat(newLinkObject)
                                    }})
                            }

                        }

                        setCustomIconArray(customIconArray => [
                            ...customIconArray,
                            iconPath
                        ]);

                        setCurrentLink({});
                        setShowLinkForm(false);
                        setAccordionValue(null);
                        setEditIcon(prev =>
                            Object.fromEntries(Object.keys(prev).map(key => [key, null])))
                        setInputType(null);
                    }

                    setShowLoader({show: false, icon: null, progress: null});
                }).catch(error => {
                    console.error("Post: catch", error);
                })

            }).catch(error => {
                EventBus.dispatch("error", { message: "There was a problem uploading your image." });
                console.error("Vapor.store: catch", error);
                setShowLoader({show: false, icon: null, progress: null});
            });
        } else {
            EventBus.dispatch("error", { message: "Icon Destination and Name is Required" });
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        setEditIcon(prev =>
            Object.fromEntries(Object.keys(prev).map(key => [key, null])));
        setShowLinkForm(false);
        setAccordionValue(null);
        setInputType(null);
        setCompletedIconCrop({});
        setCurrentLink({})
        document.getElementById('left_col_wrap').style.minHeight = "unset";
    }

    const handleLinkName = useCallback( (e) => {
        let value = e.target.value;

        setCharactersLeft(11 - value.length);

        setCurrentLink((prev) => ({
            ...prev,
            name: value
        }))
    },[]);

    const uploadImage = async (e) => {
        e.preventDefault();
        const image = getFileToUpload(previewCanvasRef?.current);
        image.then((value) => {
            setShowLoader({show: true, icon: "upload", position: "fixed"})

            window.Vapor.store(
                value,
                {
                    visibility: "public-read",
                    progress: progress => {
                        setShowLoader(prev => ({
                            ...prev,
                            progress: Math.round(progress * 100)
                        }))
                    }
                }
            ).then(response => {
                //console.log("Vapor Response: ", response);
                const packets = {
                    icon: response.key,
                    ext: response.extension,
                };
                updateLink(packets, currentLink.id)
                .then((data) => {
                    setShowLoader({
                        show: false,
                        icon: "",
                        position: "",
                        progress: null
                    });

                    dispatch({
                        type: LINKS_ACTIONS.UPDATE_LINK,
                        payload: {
                            editID: currentLink.id,
                            icon: data.imagePath,
                        }});
                    setIconSelected(false);
                });
            });
        });
    }

    return (
        iconSelected ?
            <div className="crop_section">
                <p>Crop Icon</p>

                <CropTools
                    rotate={rotate}
                    setRotate={setRotate}
                    scale={scale}
                    setScale={setScale}
                />
                <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedIconCrop(c)}
                    aspect={aspect}
                >
                    <img
                        onLoad={(e) => onImageLoad(e, aspect, setCrop)}
                        src={upImg}
                        ref={imgRef}
                        style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                        alt="Crop Me"/>
                </ReactCrop>
                <div className="icon_col">
                    <p>Icon Preview</p>
                    <canvas
                        ref={previewCanvasRef}
                        // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                        style={{
                            backgroundSize: `cover`,
                            backgroundRepeat: `no-repeat`,
                            width: iconSelected ? `100%` : 0,
                            height: iconSelected ? `100%` : 0,
                            borderRadius: `20px`,
                        }}
                    />
                </div>
                <div className="my_row button_row mt-4">
                    <a className="!uppercase button blue" href="#" onClick={uploadImage}>
                        Upload
                    </a>
                    <a className="!uppercase button transparent gray" href="#" onClick={(e) => {
                        e.preventDefault();
                        setIconSelected(false);
                    }}>
                        Cancel
                    </a>
                </div>
            </div>
            :
            <>
            <FormNav
                currentLink={currentLink}
                showIconList={showIconList}
                setShowIconList={setShowIconList}
                showBGUpload={showBGUpload}
                setShowBGUpload={setShowBGUpload}
                pageLayout={pageSettings.page_layout}
            />
                {showBGUpload ?
                <ImageUploader
                    currentLink={currentLink}
                    setShowLoader={setShowLoader}
                    pageSettings={pageSettings}
                    setShowBGUpload={setShowBGUpload}
                />

                :
                <form onSubmit={handleSubmit} className="link_form">
                    {showIconList &&
                        <div className="icon_row">
                            <div className="icon_box">
                                <IconList
                                    currentLink={currentLink}
                                    setCurrentLink={setCurrentLink}
                                    accordionValue={accordionValue}
                                    setCharactersLeft={setCharactersLeft}
                                    inputType={inputType}
                                    setInputType={setInputType}
                                    customIconArray={customIconArray}
                                    setCustomIconArray={setCustomIconArray}
                                    editID={id}
                                />
                                <div className="uploader inline-block mt-4 w-full">
                                    <label htmlFor="custom_icon_upload" className="custom !uppercase button blue">
                                        Select Image
                                    </label>
                                    <input id="custom_icon_upload" type="file" className="custom" onChange={selectCustomIcon} accept="image/png, image/jpeg, image/jpg, image/gif"/>
                                    <div className="my_row info_text file_types text-center mb-2">
                                        <p className="m-0 char_count w-100 ">Allowed File Types: <span>png, jpg, jpeg, gif</span>
                                        </p>
                                        <a className="hide_button uppercase" href="#" onClick={(e) => {
                                            e.preventDefault();
                                            setShowIconList(false);
                                        }}>Hide Icons</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    <div className="my_row my-4">
                        <div className="input_wrap">
                            <input
                                className={currentLink.name !== "" ?
                                    "active" :
                                    ""}
                                name="name"
                                type="text"
                                value={currentLink.name ||
                                    ""}
                                onChange={(e) => handleLinkName(e)}
                                onFocus={(e) => HandleFocus(e.target)}
                                onBlur={(e) => HandleBlur(e.target)}
                            />
                            <label>Link Name</label>
                        </div>
                        <div className="info_text title my_row">
                            <p className="char_max">Max 11 Characters Shown</p>
                            <p className="char_count">
                                {charactersLeft < 0 ?
                                    <span className="over">Only 11 Characters Will Be Shown</span>
                                    :
                                    "Characters Left: " +
                                    charactersLeft
                                }
                            </p>
                        </div>
                    </div>

                    <InputTypeRadio
                        inputType={inputType}
                        setInputType={setInputType}
                        currentLink={currentLink}
                        setCurrentLink={setCurrentLink}
                    />

                    <div className="my_row">
                        <InputComponent
                            inputType={inputType}
                            setInputType={setInputType}
                            currentLink={currentLink}
                            setCurrentLink={setCurrentLink}
                        />
                    </div>
                    {/*{!folderID &&
                <IconDescription
                    currentLink={currentLink}
                    setCurrentLink={setCurrentLink}
                    descChecked={descChecked}
                    setDescChecked={setDescChecked}
                />
            }*/}
                    <div className="my_row button_row mt-4">
                        <button className="button green" type="submit">
                            Save
                        </button>
                        <a href="#" className="button transparent gray" onClick={(e) => handleCancel(
                            e)}>
                            Cancel
                        </a>
                        <a className="help_link" href="mailto:help@link.pro">Need Help?</a>
                    </div>

                </form>
                }
            </>
        );
};

export default CustomForm;
