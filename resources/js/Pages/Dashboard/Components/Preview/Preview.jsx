import React, {
    useContext,
    useState,
    useEffect,
} from 'react';
import {PageContext, UserLinksContext} from '../../Dashboard.jsx';
import {IoIosCloseCircleOutline} from 'react-icons/io';
import AccordionLinks from '@/Components/LinkComponents/AccordionLinks.jsx';
import {checkIcon} from '@/Services/UserService.jsx';
import Header from './Header';
import ProfileImage from './ProfileImage';
import ProfileText from './ProfileText';
import Folder from '@/Components/LinkComponents/Folder.jsx';
import SubscribeForm from '@/Components/LinkComponents/SubscribeForm.jsx';
import StoreProducts from '@/Components/LinkComponents/StoreProducts.jsx';
import {UseLoadPreviewHeight, UseResizePreviewHeight} from '@/Services/PreviewHooks.jsx';
import AdvancedIcon from '@/Components/LinkComponents/AdvancedIcon.jsx';
import IconDescription from '@/Components/LinkComponents/IconDescription.jsx';

const Preview = ({
                     nodesRef,
                     completedCrop,
                     row,
                     setRow,
                     value,
                     setValue,
                     subStatus,
                     pageHeaderRef,
                     setShowPreview
}) => {

    const loadPreviewHeight = UseLoadPreviewHeight();
    const resizePreviewHeight = UseResizePreviewHeight();

    const { userLinks } = useContext(UserLinksContext);
    const {pageSettings} = useContext(PageContext);
    const [iconCount, setIconCount] = useState(null);
    const [clickType, setClickType] = useState(null);

    useEffect(() => {

        if (subStatus) {
            setIconCount(userLinks.length)
        } else {
            setIconCount(8);
        }

    }, [userLinks]);

    useEffect(() => {

        function handleResize() {
            const windowWidth = window.outerWidth;

            if (windowWidth > 992) {
                document.querySelector('.links_col.preview').classList.remove('show');
                document.querySelector('body').classList.remove('fixed');
            }
        }

        window.addEventListener('resize', handleResize);

        //handleResize()
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    const ClosePreview = () => {
        document.querySelector('body').classList.remove('fixed');
        setShowPreview(false);
    }

    const accordionLinks = value.index ? userLinks[value.index].links : null;
    const mailchimpListId = value.index ? userLinks[value.index].mailchimp_list_id : null;
    const storeProducts = value.index ? userLinks[value.index].shopify_products : null;
    const description = value.index ? userLinks[value.index].description : null;

    return (

        <>
            <div className="close_preview" onClick={ClosePreview}>
                <IoIosCloseCircleOutline/>
            </div>

            <div className="links_wrap preview">
                <div className="inner_content" id="preview_wrap">
                    <div className="inner_content_wrap" style={{ maxHeight: resizePreviewHeight ? resizePreviewHeight + "px" : loadPreviewHeight + "px"}}>
                        <Header
                            nodesRef={nodesRef}
                            completedCrop={completedCrop}
                        />

                        <div id={pageSettings['profile_layout']} className="profile_content" ref={pageHeaderRef}>
                            <ProfileImage
                                completedCrop={completedCrop}
                                nodesRef={nodesRef}
                            />
                            <ProfileText />
                        </div>
                        <div className="icons_wrap main">

                            {userLinks?.slice(0, iconCount).map(( linkItem, index ) => {

                                let {
                                    id,
                                    type,
                                    name,
                                    url,
                                    email,
                                    phone,
                                    icon,
                                    active_status,
                                    links
                                } = linkItem;

                                if (email) {
                                    url = "mailto:" + email;
                                } else if (phone) {
                                    url = "tel:" + phone;
                                    if(icon.includes("Facetime")) {
                                        url = 'facetime:' + phone;
                                    }
                                }

                                const dataRow = Math.ceil((index + 1) / 4);

                                let displayIcon = null;
                                if(type !== "folder") {
                                    displayIcon = checkIcon(icon, "preview", subStatus);
                                }

                                let colClasses = "";
                                if (type === "folder" || type === "mailchimp" || type === "shopify" || type === "advanced") {
                                    colClasses = "icon_col folder";
                                } else {
                                    colClasses = "icon_col";
                                }

                                return (
                                    <React.Fragment key={index}>
                                        {(() => {
                                            switch (type) {
                                                case "folder":
                                                    return ( active_status && subStatus ?
                                                        <Folder
                                                            colClasses={colClasses}
                                                            mainIndex={index}
                                                            links={links}
                                                            setRow={setRow}
                                                            value={value}
                                                            setValue={setValue}
                                                            dataRow={dataRow}
                                                            name={name}
                                                            clickType={clickType}
                                                            setClickType={setClickType}
                                                            subStatus={subStatus}
                                                        />
                                                        :
                                                        subStatus &&
                                                        <div className={` ${colClasses} `}>
                                                        </div>
                                                    )
                                                case "standard":
                                                case "offer":
                                                case "url":
                                                case "email":
                                                case "phone":
                                                    return (
                                                        <div className={` ${colClasses} `}>
                                                            {active_status ?
                                                                <>
                                                                    <a className={!url || !displayIcon ? "default" : ""}
                                                                       target="_blank"
                                                                       href={url || "#"}>
                                                                        <img src={displayIcon} alt=""/>
                                                                    </a>
                                                                    <p>
                                                                        {name?.length > 11 ? name.substring(0, 11) + "..."
                                                                            : name || "Link Name"
                                                                        }
                                                                    </p>
                                                                </>
                                                                :
                                                                ""
                                                            }
                                                        </div>
                                                    )
                                                case "mailchimp":
                                                case "shopify":
                                                case "advanced":
                                                    return (
                                                        <AdvancedIcon
                                                            colClasses={colClasses}
                                                            displayIcon={displayIcon}
                                                            name={name}
                                                            active_status={active_status}
                                                            dataRow={dataRow}
                                                            mainIndex={index}
                                                            setRow={setRow}
                                                            value={value}
                                                            setValue={setValue}
                                                            url={url}
                                                            index={index}
                                                            setClickType={setClickType}
                                                            clickType={clickType}
                                                            type={type}
                                                        />
                                                    )
                                            }
                                        })()}

                                        {subStatus && ( (index + 1) % 4 === 0 || index + 1 === iconCount) ?
                                            (() => {
                                                switch (clickType) {
                                                    case "mailchimp":
                                                        return (
                                                            <SubscribeForm
                                                                dataRow={dataRow}
                                                                row={row}
                                                                mailchimpListId={mailchimpListId}
                                                            />
                                                        )
                                                    case "shopify":
                                                        return (
                                                            <StoreProducts
                                                                dataRow={dataRow}
                                                                row={row}
                                                                storeProducts={storeProducts}
                                                            />
                                                        )
                                                    case "advanced":
                                                        return (
                                                            <IconDescription
                                                                dataRow={dataRow}
                                                                row={row}
                                                                description={description}
                                                                url={value.url}
                                                            />
                                                        )
                                                    case "folder":
                                                        return (
                                                            <div className={`my_row folder ${dataRow == row ? "open" : ""}`}>
                                                                <div className="icons_wrap inner">

                                                                    {accordionLinks?.map((innerLinkFull, index) => {
                                                                        return (
                                                                            <AccordionLinks key={index} icons={innerLinkFull}/>
                                                                        )
                                                                    })
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                }
                                            })()
                                            :
                                            ""
                                        }

                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Preview;

