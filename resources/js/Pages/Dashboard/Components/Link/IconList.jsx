import React, {useCallback, useContext, useEffect, useState} from 'react';
import {icons} from '@/Services/IconObjects.jsx';
import {getCourseCategories} from '@/Services/CourseRequests.jsx';
import DropdownComponent from './Forms/DropdownComponent';
import {HandleFocus, HandleBlur} from '@/Utils/InputAnimations.jsx';
import {usePage} from '@inertiajs/react';
import {addLink, updateLink} from '@/Services/LinksRequest.jsx';
import {FOLDER_LINKS_ACTIONS, LINKS_ACTIONS} from '@/Services/Reducer.jsx';
import {FolderLinksContext} from '@/Pages/Dashboard/Dashboard.jsx';
import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';
import ImageUploader from '@/Components/ImageUploader.jsx';
import SelectorComponent
    from '@/Pages/Dashboard/Components/SelectorComponent.jsx';

const IconList = ({
                      setCharactersLeft,
                      setEditLink,
                      editLink,
                      showIconList,
                      setShowIconList,
                      setShowLoader,
                      customIconArray,
                      setCustomIconArray,
                      isLoading,
                      showFormTab,
                      imageSelected,
                      setImageSelected
}) => {

    const { auth } = usePage().props;
    const authUser = auth.user.userInfo?.id;

    const {dispatch } = useUserLinksContext();
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);

    const [searchInput, setSearchInput] = useState("");

    const [filteredIcons, setFilteredIcons] = useState([]);
    const [filteredByCat, setFilteredByCat] = useState([]);
    const [courseCategories, setCourseCategories] = useState([]);

    const [activeIcon, setActiveIcon] = useState(null)

    const [iconTabs, setIconTabs] = useState([]);
    const [selected, setSelected] = useState(showIconList.type);

    useEffect(() => {
        const optionsArray = [];
        if(editLink.type !== "offer") {
            optionsArray.push({
                value: "standard",
                label: "Standard Icons",
            });
        }

        optionsArray.push({
            value: "custom",
            label: "Custom Icons"
        })

        setIconTabs(optionsArray);
    },[])

    useEffect(() => {

        if (editLink.type === "offer" && showFormTab === "offers") {
            getCourseCategories().then((data) => {
                if (data.success) {
                    setCourseCategories(data.categories);
                }
            })
        }

        if ( ((editLink.type === "offer" || editLink.icon?.includes("custom-icons") ) && showFormTab !== "offers")) {
            setShowIconList((prev) => ({
                ...prev,
                type: "custom",
            }))
            setSelected("custom");
        } else if (editLink.type === "offer") {
            setShowIconList((prev) => ({
                ...prev,
                type: "offers",
            }))
            setSelected("offers");
        } else {
            setShowIconList((prev) => ({
                ...prev,
                type: "standard",
            }))
            setSelected("standard");
        }
    },[editLink])

    useEffect(() => {

        if (!editLink.id && editLink.type === "mailchimp" || editLink.type === "shopify") {

            if (editLink.type === "mailchimp") {
                setEditLink(prevState => ({
                    ...prevState,
                    icon: "https://local-lp-user-images.s3.us-east-2.amazonaws.com/icons/Mailchimp.png",
                    type: "mailchimp"
                }))
            }

            if (editLink.type === "shopify") {
                setEditLink(prevState => ({
                    ...prevState,
                    icon: "https://lp-production-images.s3.us-east-2.amazonaws.com/icons/Shopify.png",
                    type: "shopify"
                }))
            }
        }

        /*setTimeout(() => {
            setIsLoading(false);
        }, 500)*/

    },[editLink])

    const selectIcon = useCallback((e, source) => {
        e.preventDefault();
        const el = e.target.closest('a');
        const iconType = el.dataset.icontype;
        const iconIndex = el.dataset.index || null;
        const courseId = el.dataset.course || null;

        if(iconIndex !== activeIcon) {

            setActiveIcon(iconIndex);

            let name = el.dataset.name || editLink.name;
            setCharactersLeft(11 - name.length);

            let value = editLink[iconType];
            if(iconType === "url" && showIconList.type === "standard") {
                let icon = icons.find(icon => icon.name === name);
                if (icon?.prefix) {
                    value = icon.prefix;
                }
            }

            if(iconType === "offer") {
                //url = window.location.origin + "/" + el.dataset.creator + "/course-page/" + el.dataset.slug + "?a=" + authUser;
                value = window.location.origin + "/offers/" + el.dataset.offer + "/" + authUser
            }

            setTimeout(function(){
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: "nearest",
                });

            }, 500)

            const valueKey = iconType === "offer" ? "url" : iconType;
            let linkId = editLink.id;
            let iconList = showIconList.list;
            if (source.includes("custom-icons")) {
                value = editLink[valueKey];
                name = editLink.name;
                iconList = "custom";
            }
            const packets =
                {
                    page_id: editLink.page_id,
                    folder_id: editLink.folder_id,
                    name: name,
                    icon: source,
                    [`${valueKey}`]: value,
                    type: iconType,
                    course_id: courseId
                }

            /*setTimeout(function(){*/
                if (linkId) {
                    updateLink(packets, linkId).then((data) => {
                        if(data.success) {

                            if (editLink.folder_id) {
                                dispatchFolderLinks({
                                    type: FOLDER_LINKS_ACTIONS.UPDATE_FOLDER_LINKS,
                                    payload: {
                                        id: editLink.id,
                                        currentLink: editLink,
                                        [`${valueKey}`]: value,
                                        type: iconType,
                                        icon: source,
                                        name: name,
                                    }
                                })

                                dispatch({
                                    type: LINKS_ACTIONS.UPDATE_LINK_IN_FOLDER,
                                    payload: {
                                        folder_id: editLink.folder_id,
                                        id: editLink.id,
                                        currentLink: editLink,
                                        [`${valueKey}`]: value,
                                        icon: source,
                                        type: iconType,
                                        name: name,
                                    }
                                })
                            } else {
                                dispatch({
                                    type: LINKS_ACTIONS.UPDATE_LINK,
                                    payload: {
                                        id: linkId,
                                        editLink: editLink,
                                        [`${valueKey}`]: value,
                                        type: iconType,
                                        icon: source,
                                        icon_active: true,
                                        name: name,
                                    }
                                })
                            }

                            setEditLink(prevState => ({
                                ...prevState,
                                name: name,
                                icon: source,
                                icon_active: true,
                                [`${valueKey}`]: value,
                                type: iconType,
                                course_id: courseId,
                            }))

                            setShowIconList((prev) => ({
                                ...prev,
                                type: iconList,
                            }))
                        }
                    })
                } else {
                    addLink(packets).then((data) => {
                        if (data.success) {
                            const valueKey = iconType === "offer" ? "url" : iconType;
                            setEditLink(prevState => ({
                                ...prevState,
                                id: data.link_id,
                                name: name,
                                icon: source,
                                [`${valueKey}`]: value,
                                type: iconType,
                                course_id: courseId,
                            }))

                            dispatch({
                                type: LINKS_ACTIONS.UPDATE_LINK,
                                payload: {
                                    id: linkId,
                                    [`${valueKey}`]: value,
                                    type: iconType,
                                    icon: source
                                }
                            })
                        }
                    });
                }
            /*}, 1000)*/

        } else {
            setActiveIcon(null);
        }
    },[]);

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);

        /*if (editLink.type === "url" || editLink.type === "email" || editLink.type === "phone") {*/
            setFilteredIcons(showIconList?.list?.filter((i) => {
                const iconName = i.name && i.name.toLowerCase().replace(" ", "");
                const userInput = value.toLowerCase().replace(" ", "");
                return iconName && iconName.match(userInput);
            }))
        /*} else {
            const filterList = filteredByCat.length > 0 ?
                filteredByCat :
                showIconList.list;

            setFilteredIcons(filterList?.filter((i) => {
                const offerName = i.name && i.name.toLowerCase().replace(" ", "");
                const userInput = value.toLowerCase().replace(" ", "");
                return offerName && offerName.match(userInput);
            }))

        }*/
    }

    /*useEffect(() => {

        if (editLink.type === "url" || editLink.type === "email" || editLink.type === "phone") {
            setFilteredIcons(showIconList?.list?.filter((i) => {
                const iconName = i.name && i.name.toLowerCase().replace(" ", "");
                const userInput = searchInput.toLowerCase().replace(" ", "");
                return iconName && iconName.match(userInput);
            }))
        } else {

            const filterList = filteredByCat.length > 0 ?
                filteredByCat :
                showIconList.list;

            setFilteredIcons(filterList?.filter((i) => {
                const offerName = i.name && i.name.toLowerCase().replace(" ", "");
                const userInput = searchInput.toLowerCase().replace(" ", "");
                return offerName && offerName.match(userInput);
            }))

        }

    },[editLink, searchInput]);*/

    const handleTabClick = useCallback ((e, type) => {
        e.preventDefault();
        setShowIconList((prev) => ({
            ...prev,
            type: type,
        }))
        setActiveIcon(null);
        setSelected(type);
    },[]);


    const switchIconsList = () => {
        const mapArray = filteredIcons?.length > 0 ? filteredIcons : showIconList.list;

            return (
                <>
                    {showFormTab !== "offers" &&
                        <div className="icon_col default_icon">
                            <p>Current Icon</p>
                            {editLink.icon ?
                                <img alt=""
                                     className={`active img-fluid icon_image`}
                                     src={editLink.icon}
                                />
                                :
                                <p>No Icon Selected</p>
                            }
                        </div>
                    }
                    <div className="custom_icons">
                        {showFormTab !== "offers" &&
                            <div className="form_nav icons relative">
                                <SelectorComponent
                                    value={selected}
                                    onChange={setSelected}
                                    commit={handleTabClick}
                                    options={iconTabs}
                                    size="max-w-xl"
                                />
                                {/*{editLink.type !== "offer" &&
                                    <div className="relative">
                                        <a className={`relative block tab_link
                                        ${showIconList.type === "standard" && "active"}`}
                                           href="#"
                                           onClick={(e) => {
                                               e.preventDefault();
                                               handleTabClick(e, "standard");
                                           }}>
                                            Standard Icons
                                        </a>
                                    </div>
                                }
                                <div className="relative">
                                    <a className={`relative block tab_link ${showIconList.type === "custom" && editLink.type !== "offer" ? "active" : ""}`}
                                       href="#"
                                       onClick={(e) => {
                                           e.preventDefault()
                                           editLink.type !== "offer" && handleTabClick(e, "custom")
                                       }}>
                                        Custom Icons
                                    </a>
                                </div>*/}
                            </div>
                        }

                        <div className="icons_wrap inner">
                            {
                                filteredIcons.length > 0 ?
                                    filteredIcons.map((icon, index) => {

                                        return (
                                            <div key={index} className="icon_col">
                                                <a className="w-full flex items-center justify-start gap-3"
                                                   href="#"
                                                   onClick={(e) => {
                                                       e.preventDefault();
                                                       selectIcon(e, icon.path)
                                                   }}
                                                   data-name={icon.name}
                                                   data-creator={icon.creator || ""}
                                                   data-slug={icon.slug || ""}
                                                   data-course={icon.course_id || ""}
                                                   data-icontype={icon.type}
                                                   data-offer={icon.offer_id || ""}
                                                   data-index={index}
                                                >
                                                    <img
                                                        className={`img-fluid icon_image ${parseInt(activeIcon) === parseInt(index) ? "active" : ""}`}
                                                        src={icon.path}
                                                        alt=""
                                                    />
                                                    <div className={`icon_text ${showFormTab === "offers" ? "" : "hover_text"}`}>
                                                        <p>
                                                            {icon.name}
                                                        </p>
                                                    </div>
                                                </a>
                                            </div>
                                        )
                                    })
                                :
                                showIconList.type === "custom" ?
                                    customIconArray.map((iconPath, index) => {
                                        const newPath = iconPath?.replace("public", "/storage");

                                        return (
                                            <div key={index} className="icon_col">
                                                <a href="#"
                                                   data-icontype={editLink.type}
                                                   data-index={index}
                                                   data-name={editLink.name}
                                                   onClick={(e) => {
                                                       selectIcon(e, newPath)
                                                   }}
                                                >
                                                    <img alt=""
                                                         className={`img-fluid icon_image ${parseInt(activeIcon) === parseInt(index) ? "active" : ""}`}
                                                         src={newPath}
                                                    />
                                                </a>
                                            </div>
                                        )

                                    })
                                    :
                                    mapArray.length > 0 ?
                                        mapArray?.map((icon, index) => {

                                            return (
                                                <div key={index} className="icon_col">
                                                    <a className="w-full flex items-center justify-start gap-3"
                                                       href="#"
                                                       onClick={(e) => {
                                                           e.preventDefault();
                                                           selectIcon(e, icon.path)
                                                       }}
                                                       data-name={icon.name}
                                                       data-creator={icon.creator || ""}
                                                       data-slug={icon.slug || ""}
                                                       data-course={icon.course_id || ""}
                                                       data-icontype={icon.type || ""}
                                                       data-offer={icon.offer_id || ""}
                                                       data-index={index}
                                                    >
                                                        <img
                                                            className={`img-fluid icon_image ${parseInt(activeIcon) === parseInt(index) ? "active" : ""}`}
                                                            src={icon.path}
                                                            alt=""
                                                        />
                                                        <div className={`icon_text ${showFormTab === "offers" ? "" : "hover_text"}`}>
                                                            <p>
                                                                {icon.name}
                                                            </p>
                                                        </div>
                                                    </a>
                                                </div>
                                            )
                                        })
                                        :
                                        <div className="info_message">
                                            <p>You don't have any icons to display.</p>
                                            <p>Click 'Upload Image' below to add a custom icon.</p>
                                        </div>

                            }
                        </div>
                    </div>
                </>
            )
    }

    return (

        <>
        { (editLink.type === "url" ||
                editLink.type === "offer" ||
                editLink.type === "email" ||
                editLink.type === "phone" ||
                editLink.type === "mailchimp"
            ) &&
            <div className="uploader">
                { (editLink.type === "offer" && showIconList.type !== "custom" && showFormTab === "offers") &&
                    <DropdownComponent
                        data={courseCategories}
                        iconList={showIconList.list}
                        setSearchInput={setSearchInput}
                        setFilteredIcons={setFilteredIcons}
                        setFilteredByCat={setFilteredByCat}
                    />
                }
                { (showIconList.type === "standard") &&

                    <div className="relative mb-6 my_row">
                        <input
                            className="animate w-full"
                            name="search"
                            type="text"
                            onChange={(e) => handleChange(e)}
                            onFocus={(e) => HandleFocus(e.target)}
                            onBlur={(e) => HandleBlur(e.target)}
                            value={searchInput}/>
                        <label htmlFor="search">Search Icons</label>
                    </div>
                }

                {showIconList.type === "custom" &&
                    <div className="flex flex-wrap w-full relative">
                        <div className="w-full">
                            <ImageUploader
                                elementName="icon"
                                label="Icon Image"
                                cropSettings={{ unit: '%', width: 30 }}
                                aspect={1}
                                setShowLoader={setShowLoader}
                                onImageSelect={setImageSelected}
                                startCollapsed={editLink.icon}
                                onUpload={(response) => {
                                    const packets = {
                                        icon: response.key,
                                        ext: response.extension,
                                    };
                                    return updateLink(packets, editLink.id).then((data) => {
                                        dispatch({
                                            type: LINKS_ACTIONS.UPDATE_LINK,
                                            payload: { id: editLink.id, icon: data.imagePath.icon },
                                        });
                                        setEditLink((prev) => ({
                                            ...prev,
                                            icon: data.imagePath.icon,
                                        }));
                                        setCustomIconArray((prev) => ([
                                            ...prev,
                                            data.imagePath.icon,
                                        ]));
                                    });
                                }}
                            />
                        </div>
                    </div>
                }
            </div>
        }
            {!imageSelected &&
                <>
                    <div className={`icons_wrap icon_select shadow-md my_row outer ${showFormTab === "offers" ? "offer_list" : ""}`}>
                        {isLoading &&
                            <div id="loading_spinner" className="active">
                                <img src={Vapor.asset('images/spinner.svg')} alt="" />
                            </div>
                        }

                        {switchIconsList()}
                    </div>
                    <div className="button_row w-full mt-1 flex flex-nowrap justify-between">
                        <div className="info_text file_types text-center !pl-0">
                            <a href="mailto:help@link.pro" className="mx-auto m-0 char_count">Don't See Your Icon? Contact Us!</a>
                        </div>
                        <a className="help_link" href="mailto:help@link.pro"><small>Need Help?</small></a>
                    </div>
                </>
            }
        </>
    );
}

export default IconList;
