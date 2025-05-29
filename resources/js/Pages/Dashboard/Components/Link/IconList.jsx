import React, {useCallback, useContext, useEffect, useState} from 'react';
import {icons} from '@/Services/IconObjects.jsx';
import {
    getIcons,
} from '@/Services/IconRequests.jsx';
import {getIconPaths} from '@/Services/ImageService.jsx';
import {getCourseCategories} from '@/Services/CourseRequests.jsx';
import DropdownComponent from './Forms/DropdownComponent';
import {HandleFocus, HandleBlur} from '@/Utils/InputAnimations.jsx';
import str, {isEmpty} from 'lodash';
import {usePage} from '@inertiajs/react';
import {addLink, updateLink} from '@/Services/LinksRequest.jsx';
import {FOLDER_LINKS_ACTIONS, LINKS_ACTIONS} from '@/Services/Reducer.jsx';
import {UserLinksContext, FolderLinksContext} from '@/Pages/Dashboard/Dashboard.jsx';

const IconList = ({
                      setCharactersLeft,
                      integrationType = null,
                      setEditLink,
                      editLink,
                      customIconArray = null,
                      setCustomIconArray = null,
}) => {

    const { auth } = usePage().props;
    const authUser = auth.user.userInfo?.id;

    const { userLinks, dispatch } = useContext(UserLinksContext);
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);

    const [isDefaultIcon, setIsDefaultIcon] = useState(false);

    const [searchInput, setSearchInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [iconList, setIconList] = useState([]);
    const [filteredIcons, setFilteredIcons] = useState([]);
    const [filteredByCat, setFilteredByCat] = useState([]);
    const [courseCategories, setCourseCategories] = useState([]);

    const [activeIcon, setActiveIcon] = useState(null)

    const [iconsWrapClasses, setIconsWrapClasses] = useState("");

    const [iconDisplay, setIconDisplay] = useState('standard');

    useEffect(() => {
        if (str.includes(editLink.icon, "custom-icons") ) {
            setIconDisplay("custom")
        } else {
            setIconDisplay("standard");
        }

    },[editLink])

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
        const url = '/get-standard-icons';

        getIcons(url).then((data) => {
            if(data.success) {
                setIconList(getIconPaths(data.iconData));
            }
        });

        /*let url;

        switch(accordionValue) {
            case "offer":
                url = '/get-aff-icons';
                break;
            case "custom":
            case "integration":
                url = '/get-custom-icons';
                break;
            case "standard":
                url = '/get-standard-icons'
                break;
            default:
                break;
        }

        getIcons(url).then((data) => {
            if(data.success) {

                if (accordionValue === "standard") {
                    setIconList(getIconPaths(data.iconData));
                } else if (accordionValue === "custom" || accordionValue === "integration") {
                    setCustomIconArray(data.iconData);
                } else {
                    //offerArray = data.iconData;
                    setIconList(data.iconData)
                }

                setTimeout(() => {
                    setIsLoading(false);
                }, 500)
            }
        })*/

    },[editLink])

    useEffect(() => {

        if (!editLink.id && editLink.type === "mailchimp" || editLink.type === "shopify") {
            setIsDefaultIcon(true)

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

        setTimeout(() => {
            setIsLoading(false);
        }, 500)

    },[editLink])

    const selectIcon = useCallback((e, source) => {
        e.preventDefault();
        const el = e.target;
        const iconType = el.dataset.icontype;
        const iconIndex = el.dataset.index || null;
        const courseId = el.dataset.course || null;

        if(iconIndex !== activeIcon) {
            setActiveIcon(iconIndex);

            let name = editLink.name;
            if(el.dataset.name) {
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
            }

            let value = null;
            if(iconType === "url") {
                let icon = icons.find(icon => icon.name === name);
                if (icon?.prefix) {
                    value = icon.prefix;
                }
            }

            if(iconType === "offer") {
                //url = window.location.origin + "/" + el.dataset.creator + "/course-page/" + el.dataset.slug + "?a=" + authUser;
                value = window.location.origin + "/offers/" + el.dataset.offer + "/" + authUser
                setEditLink((prev) => ({...prev, type: "offer"}));
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

                console.log("packets: ", packets);
            console.log("linkId: ", linkId);

            setTimeout(function(){
                if (linkId) {
                    updateLink(packets, linkId).then((data) => {
                        if(data.success) {
                            dispatch({
                                type: LINKS_ACTIONS.UPDATE_LINK,
                                payload: {
                                    editID: linkId,
                                    currentLink: editLink,
                                    [`${iconType}`]: value,
                                    type: iconType,
                                    icon: source
                                }
                            })

                            setEditLink(prevState => ({
                                ...prevState,
                                name: name,
                                icon: source,
                                [`${iconType}`]: value,
                                type: iconType,
                                course_id: courseId,
                            }))
                        }
                    })
                } else {
                    addLink(packets).then((data) => {
                        if (data.success) {
                            let newLinks = [...userLinks];
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
                            }

                            setEditLink(prevState => ({
                                ...prevState,
                                id: data.link_id,
                                name: name,
                                icon: source,
                                [`${iconType}`]: value,
                                type: iconType,
                                course_id: courseId,
                            }))

                            if (editLink.folder_id) {
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
                            })
                        }
                    });
                }
            }, 1000)

        } else {
            setActiveIcon(null);
        }
    },[]);

    const handleChange = (e) => {
        setSearchInput(e.target.value);
    }

    useEffect(() => {

        if (editLink.type === "url" || editLink.type === "email" || editLink.type === "phone") {
            setFilteredIcons(iconList?.filter((i) => {
                const iconName = i.name && i.name.toLowerCase().replace(" ", "");
                const userInput = searchInput.toLowerCase().replace(" ", "");
                return iconName && iconName.match(userInput);
            }))
        } else {

            const filterList = filteredByCat.length > 0 ?
                filteredByCat :
                iconList;

            setFilteredIcons(filterList?.filter((i) => {
                const offerName = i.name && i.name.toLowerCase().replace(" ", "");
                const userInput = searchInput.toLowerCase().replace(" ", "");
                return offerName && offerName.match(userInput);
            }))

        }

    },[iconList, searchInput])

    useEffect(() => {

        let classes = "outer";

        if(activeIcon !== null ||
            (customIconArray && customIconArray.length < 5 &&
                (editLink.type === "url" ||
                    editLink.type === "email" ||
                    editLink.type === "phone" ||
                    editLink.type === "mailchimp") ) ) {
            classes += " active";
        }

        setIconsWrapClasses(classes);

    },[activeIcon, customIconArray]);

    const switchIconsList = () => {

        switch(editLink.type) {

            /*case "custom" :

                return (
                    !isEmpty(customIconArray) ? customIconArray.map((iconPath, index) => {
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
                        <div className="info_message">
                            <p>You don't have any icons to display.</p>
                            <p>Click 'Upload Image' above to add a custom icon.</p>
                        </div>
                )*/

                /*case "mailchimp":

                    return (
                        <>
                        <div className="icon_col default_icon">
                            <p>Default Icon</p>
                            <img alt=""
                                 className={`
                                     ${isDefaultIcon ?
                                     "active img-fluid icon_image" :
                                     "img-fluid icon_image"}
                                     ${parseInt(activeIcon) === parseInt(-1) ? "active" : ""}
                                     `}
                                 src={integrationType === "mailchimp" ?
                                     "https://local-lp-user-images.s3.us-east-2.amazonaws.com/icons/Mailchimp.png" :
                                     "https://lp-production-images.s3.us-east-2.amazonaws.com/icons/Shopify.png"}
                                 data-icontype="default"
                                 data-index={-1}
                                 onClick={(e) => {
                                     selectIcon(e, e.target.src)
                                 }}/>
                        </div>
                        <div className="custom_icons">
                            <p>Custom Icons</p>
                            <div className="icons_wrap inner">
                                {!isEmpty(customIconArray) ?
                                    customIconArray.map((iconPath, index) => {
                                        const newPath = iconPath.replace("public", "/storage");

                                        return (
                                            <div key={index}
                                                 className={`icon_col`}
                                            >
                                                <img alt=""
                                                     data-index={index}
                                                     className={`img-fluid icon_image ${parseInt(activeIcon) === parseInt(index) ? "active" : ""}`}
                                                     src={newPath}
                                                     data-icontype={editLink.type}
                                                     onClick={(e) => {
                                                         selectIcon(e, newPath)
                                                     }}/>
                                            </div>
                                        )
                                    })
                                    :
                                    <div className="info_message">
                                        <p>You don't have any icons to display.</p>
                                        <p>Click 'Upload Image' above to add a custom icon.</p>
                                    </div>
                                }
                            </div>
                        </div>
                        </>
                    )*/

                default:

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
                                    <a className={`relative block tab_link ${iconDisplay === "standard" ? "active" : ""}`}
                                       href="#"
                                       onClick={(e) => {
                                           e.preventDefault()
                                           setIconDisplay("standard")
                                       }}>
                                        Standard Icons
                                    </a>
                                </div>
                                <div className="relative">
                                    <a className={`relative block tab_link ${iconDisplay === "custom" ? "active" : ""}`}
                                       href="#"
                                       onClick={(e) => {
                                           e.preventDefault()
                                           setIconDisplay("custom")
                                       }}>
                                        Custom Icons
                                    </a>
                                </div>
                            </div>

                            <div className="icons_wrap inner">
                                {iconDisplay === "custom" ?
                                    !isEmpty(customIconArray) ? customIconArray.map((iconPath, index) => {
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
                                        <div className="info_message">
                                            <p>You don't have any icons to display.</p>
                                            <p>Click 'Upload Image' above to add a custom icon.</p>
                                        </div>
                                    :
                                    filteredIcons ?
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
                                    iconList?.map((icon, index) => {

                                        return (
                                            <div key={index} className="icon_col">
                                                <img
                                                    className={`img-fluid icon_image ${parseInt(
                                                        activeIcon) ===
                                                    parseInt(index) ?
                                                        "active" :
                                                        ""}`}
                                                    src={icon.path}
                                                    onClick={(e) => {
                                                        selectIcon(e, icon.path)
                                                    }}
                                                    data-name={icon.name}
                                                    data-creator={icon.creator ||
                                                        ""}
                                                    data-slug={icon.slug || ""}
                                                    data-course={icon.course_id ||
                                                        ""}
                                                    data-icontype={icon.type ||
                                                        ""}
                                                    data-offer={icon.offer_id ||
                                                        ""}
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
                                }
                            </div>
                        </div>
                        </>
                    )
        }
    }

    return (

        <>
        { (editLink.type === "url" ||
                editLink.type === "offer" ||
                editLink.type === "email" ||
                editLink.type === "phone") &&
            <div className="uploader">
                {editLink.type === "offer" &&
                    <DropdownComponent
                        data={courseCategories}
                        iconList={iconList}
                        setSearchInput={setSearchInput}
                        setFilteredIcons={setFilteredIcons}
                        setFilteredByCat={setFilteredByCat}
                    />
                }
                <div className="relative mb-3 my_row">
                    <input
                        className="animate w-full"
                        name="search"
                        type="text"
                        onChange={(e) => handleChange(e)}
                        onFocus={(e) => HandleFocus(e.target)}
                        onBlur={(e) => HandleBlur(e.target)}
                        value={searchInput}/>
                    <label htmlFor="search">Search {
                        editLink.type === "url" || editLink.type === "email" || editLink.type === "phone"
                        ?
                        "Icons" : "Offers"}</label>
                </div>
            </div>
        }

            <div className={`icons_wrap my_row ${iconsWrapClasses}`}>

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
