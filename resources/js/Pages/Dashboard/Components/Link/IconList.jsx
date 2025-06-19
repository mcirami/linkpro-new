import React, {useCallback, useContext, useEffect, useState} from 'react';
import {icons} from '@/Services/IconObjects.jsx';
import {getCourseCategories} from '@/Services/CourseRequests.jsx';
import DropdownComponent from './Forms/DropdownComponent';
import {HandleFocus, HandleBlur} from '@/Utils/InputAnimations.jsx';
import str, {isEmpty} from 'lodash';
import {usePage} from '@inertiajs/react';
import {addLink, updateLink} from '@/Services/LinksRequest.jsx';
import {FOLDER_LINKS_ACTIONS, LINKS_ACTIONS} from '@/Services/Reducer.jsx';
import {UserLinksContext, FolderLinksContext} from '@/Pages/Dashboard/Dashboard.jsx';
import ImageUploader
    from '@/Pages/Dashboard/Components/Link/Forms/ImageUploader.jsx';

const IconList = ({
                      setCharactersLeft,
                      integrationType = null,
                      setEditLink,
                      editLink,
                      showIconList,
                      setShowIconList,
                      setShowLoader,
                      customIconArray,
                      setCustomIconArray,
                      isLoading
}) => {

    const { auth } = usePage().props;
    const authUser = auth.user.userInfo?.id;

    const { userLinks, dispatch } = useContext(UserLinksContext);
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);

    const [searchInput, setSearchInput] = useState("");

    const [filteredIcons, setFilteredIcons] = useState([]);
    const [filteredByCat, setFilteredByCat] = useState([]);
    const [courseCategories, setCourseCategories] = useState([]);

    const [activeIcon, setActiveIcon] = useState(null)

    //const [isLoading, setIsLoading] = useState(true);

    const [iconsWrapClasses, setIconsWrapClasses] = useState("");

    useEffect(() => {

        if (editLink.type === "offer") {
            getCourseCategories().then((data) => {
                if (data.success) {
                    setCourseCategories(data.categories);
                }
            })
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
        const el = e.target;
        const iconType = el.dataset.icontype;
        const iconIndex = el.dataset.index || null;
        const courseId = el.dataset.course || null;

        if(iconIndex !== activeIcon) {
            setActiveIcon(iconIndex);

            let name = el.dataset.name || editLink.name;
            setCharactersLeft(11 - name.length);
            /*if(el.dataset.name) {
                name = el.dataset.name;
                setCharactersLeft(11 - name.length);

                if( (name.toLowerCase().includes("mail") && !name.toLowerCase().includes("mailchimp") )
                    || name.toLowerCase().includes("yahoo")
                    || name.toLowerCase().includes("outlook") ) {
                    setEditLink((prev) => ({...prev, type: "email"}));
                } else if (name.toLowerCase() === "phone" || name.toLowerCase() === "facetime") {
                    setEditLink((prev) => ({...prev, type: "phone"}));
                } else {
                    setEditLink((prev) => ({...prev, type: "url"}));
                }
            }*/

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

            let linkId = editLink.id;
            const packets =
                {
                    page_id: editLink.page_id,
                    folder_id: editLink.folder_id,
                    name: name,
                    icon: source,
                    [`${iconType}`]: value,
                    type: iconType,
                    course_id: courseId
                }

            /*setTimeout(function(){*/
                if (linkId) {
                    updateLink(packets, linkId).then((data) => {
                        if(data.success) {
                            const valueKey = iconType === "offer" ? "url" : iconType;
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

                            setEditLink(prevState => ({
                                ...prevState,
                                name: name,
                                icon: source,
                                icon_active: true,
                                [`${valueKey}`]: value,
                                type: iconType,
                                course_id: courseId,
                            }))
                        }
                    })
                } else {
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

                            dispatch({
                                type: LINKS_ACTIONS.UPDATE_LINK,
                                payload: {
                                    id: linkId,
                                    /*editLink: editLink,*/
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
    },[]);


    const switchIconsList = () => {
        const mapArray = filteredIcons?.length > 0 ? filteredIcons : showIconList.list;

            return (
                <>
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

                <div className="custom_icons">
                    <div className="form_nav icons relative">
                        <div className="relative">
                            <a className={`relative block tab_link
                            ${showIconList.type === "standard" ||
                            showIconList.type === "offer" ? "active" : ""}`}
                               href="#"
                               onClick={(e) => {
                                   e.preventDefault();
                                   handleTabClick(e, editLink.type === "offer" ? "offer" : "standard");
                               }}>
                                {editLink.type === "offer" ? "Offer" : "Standard"} Icons
                            </a>
                        </div>
                        <div className="relative">
                            <a className={`relative block tab_link ${showIconList.type === "custom" ? "active" : ""}`}
                               href="#"
                               onClick={(e) => {
                                   e.preventDefault()
                                   handleTabClick(e, "custom")
                               }}>
                                Custom Icons
                            </a>
                        </div>
                    </div>

                    <div className="icons_wrap inner">
                        {!isEmpty(customIconArray) ?
                            customIconArray.map((iconPath, index) => {
                                    const newPath = iconPath?.replace("public", "/storage");

                                    return (
                                        <div key={index} className="icon_col">
                                            <img alt=""
                                                 className={`img-fluid icon_image ${parseInt(activeIcon) === parseInt(index) ? "active" : ""}`}
                                                 data-icontype={editLink.type}
                                                 data-index={index}
                                                 src={newPath}
                                                 onClick={(e) => {
                                                     selectIcon(e, newPath)
                                                 }}/>
                                        </div>
                                    )

                                })
                            :
                            !isEmpty(filteredIcons) ?
                                 filteredIcons.map((icon, index) => {

                                     return (
                                         <div key={index} className="icon_col">
                                             <img
                                                 className={`img-fluid icon_image ${parseInt(activeIcon) === parseInt(index) ? "active" : ""}`}
                                                 src={icon.path}
                                                 onClick={(e) => {
                                                     selectIcon(e, icon.path)
                                                 }}
                                                 data-name={icon.name}
                                                 data-creator={icon.creator || ""}
                                                 data-slug={icon.slug || ""}
                                                 data-course={icon.course_id || ""}
                                                 data-icontype={icon.type}
                                                 data-offer={icon.offer_id || ""}
                                                 data-index={index}
                                                 alt=""
                                             />
                                             <div className="hover_text icon_text">
                                                 <p>
                                                     {icon.name}
                                                 </p>
                                             </div>
                                         </div>
                                     )
                                 })
                                :
                                !isEmpty(mapArray) ?
                                    mapArray?.map((icon, index) => {

                                        return (
                                            <div key={index} className="icon_col">
                                                <img
                                                    className={`img-fluid icon_image ${parseInt(activeIcon) === parseInt(index) ? "active" : ""}`}
                                                    src={icon.path}
                                                    onClick={(e) => {
                                                        selectIcon(e, icon.path)
                                                    }}
                                                    data-name={icon.name}
                                                    data-creator={icon.creator || ""}
                                                    data-slug={icon.slug || ""}
                                                    data-course={icon.course_id || ""}
                                                    data-icontype={icon.type || ""}
                                                    data-offer={icon.offer_id || ""}
                                                    data-index={index}
                                                    alt=""
                                                />
                                                <div className="hover_text icon_text">
                                                    <p>
                                                        {icon.name}
                                                    </p>
                                                </div>
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
                { (editLink.type === "offer" && showIconList.type !== "custom") &&
                    <DropdownComponent
                        data={courseCategories}
                        iconList={showIconList.list}
                        setSearchInput={setSearchInput}
                        setFilteredIcons={setFilteredIcons}
                        setFilteredByCat={setFilteredByCat}
                    />
                }
                { (showIconList.type === "standard") &&

                    <div className="relative mb-3 my_row">
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
                                editLink={editLink}
                                setEditLink={setEditLink}
                                setShowLoader={setShowLoader}
                                elementName="icon"
                                imageCrop={{ unit: '%', width: 30 }}
                                imageAspectRatio={1}
                                setCustomIconArray={setCustomIconArray}
                            />
                        </div>
                    </div>
                }
            </div>
        }

        <div className={`icons_wrap my_row outer`}>

            {isLoading &&
                <div id="loading_spinner" className="active">
                    <img src={Vapor.asset('images/spinner.svg')} alt="" />
                </div>
            }

            {switchIconsList()}
        </div>

        </>
    );
}

export default IconList;
