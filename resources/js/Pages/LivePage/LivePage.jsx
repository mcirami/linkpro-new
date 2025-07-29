import React, {useEffect, useState} from 'react';
import {Head} from '@inertiajs/react';
import {checkIcon} from '@/Services/UserService.jsx';
import Folder from '@/Components/LinkComponents/Folder.jsx';
import SubscribeForm from '@/Components/LinkComponents/SubscribeForm.jsx';
import StoreProducts from '@/Components/LinkComponents/StoreProducts.jsx';
import AccordionLinks from '@/Components/LinkComponents/AccordionLinks.jsx';
import {TrackIconClick} from '@/Services/TrackClicks.jsx';
import AdvancedIcon from '@/Components/LinkComponents/AdvancedIcon.jsx';
//import IconDescription from '@/Components/LinkComponents/IconDescription.jsx';
import { IoOpenOutline } from "react-icons/io5";
function LivePage({links, page, subscribed}) {

    const {
        user_id,
        header_img,
        page_img,
        main_img_type,
        profile_layout,
        profile_img_active,
        page_layout,
        profile_img,
        title,
        bio,
        name
    } = page;

    const [headerStyle, setHeaderStyle] = useState({});
    const [pageStyle, setPageStyle] = useState({});
    const [iconCount, setIconCount] = useState(null);
    const [row, setRow] = useState(null);
    const [value, setValue] = useState({
        index: null,
        url: null
    });
    const [clickType, setClickType] = useState(null);

    useEffect(() => {
        if(main_img_type === "header") {
            setHeaderStyle({
                background: 'url(' + header_img + ') no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center bottom'
            })
        } else {
            setHeaderStyle({
                padding: "0"
            })
        }

        if(main_img_type === "page") {
            setPageStyle({
                background: 'url(' + page_img + ') no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: "100%",
                width: "100%",
                paddingTop: "20px"
            })
        }
    },[])

    useEffect(() => {

        if (subscribed) {
            setIconCount(links.length)
        } else {
            setIconCount(8);
        }

    }, []);

    const [styles, setStyles] = useState({})

    useEffect(() => {
        if(!profile_img_active) {
            setStyles({
                width: '100%',
                textAlign: "center",
                paddingLeft: '0'
            })
        } else {
            setStyles({})
        }

    }, [profile_img_active]);

    const accordionLinks = value.index !== null ? links[value.index].links : null;
    const mailchimpListId = value.index  !== null ? links[value.index].mailchimp_list_id : null;
    const storeProducts = value.index  !== null ? links[value.index].shopify_products : null;
    //const description = value.index  !== null ? links[value.index].description : null;

    return (
        <main className="py-4">
            <Head title={name}/>
            <div id="links_page">
                <div className="links_col my_row">
                    <div className="links_wrap live_page h-full">
                        <div className={`inner_content live_page ${main_img_type === "page" ? "bg_image" : ""}`} style={pageStyle}>
                            <div className={`page_header ${!header_img ? "default" : ""} `} style={headerStyle}>
                                {!header_img &&
                                    <img src={ Vapor.asset( 'images/default-img.png' ) } alt="Header Image" />
                                }
                            </div>
                            <div id={profile_layout} className="profile_content">
                                {profile_img_active ?
                                    <div className={`profile_img_column ${!profile_img ? "default" : "" }`}>
                                        <div className="profile_image">
                                            <div className="image_wrap">
                                                <img src={profile_img || Vapor.asset( 'images/default-img.png' )} alt=""/>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    ""
                                }
                                <div className="profile_text" style={styles}>
                                    {title && <h2>{title}</h2>}
                                    {bio && <p>{bio}</p>}
                                </div>
                            </div>
                            <div className={`icons_wrap main ${page_layout}`}>
                                {links.slice(0, iconCount).map((linkItem, index) => {
                                    let {
                                        id,
                                        type,
                                        name,
                                        url,
                                        email,
                                        phone,
                                        icon,
                                        icon_active,
                                        active_status,
                                        links,
                                        bg_image,
                                        bg_active
                                    } = linkItem;

                                    let styles = {};
                                    if (bg_image && bg_active && page_layout === "layout_two") {
                                        styles = {
                                            backgroundImage: `url(${bg_image})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }
                                    }

                                    if (type === "email") {
                                        url = "mailto:" + email;
                                    } else if (type === "phone") {
                                        url = "tel:" + phone;
                                        if(icon.includes("Facetime")) {
                                            url = 'facetime:' + phone;
                                        }
                                    }

                                    const dataRow = page_layout === "layout_one" ? Math.ceil((index + 1) / 4) : Math.ceil(index + 1);

                                    let displayIcon = null;
                                    if(type !== "folder") {
                                        displayIcon = checkIcon(icon, "preview", subscribed);
                                    }

                                    let colClasses = "";
                                    if (type === "folder" || type === "mailchimp" || type === "shopify" || type === "advanced") {
                                        colClasses=`icon_col folder
                                        ${bg_image && bg_active && page_layout ==="layout_two" ?
                                            "bg_image"
                                            :
                                            ""
                                        }`
                                    } else {
                                        colClasses = `icon_col ${!icon_active ? "no_icon" : "" } ${bg_image && bg_active && page_layout ==="layout_two" ?
                                            "bg_image"
                                            :
                                            ""
                                        }`;
                                    }

                                    return (
                                        <React.Fragment key={index}>
                                            {(() => {
                                                switch (type) {
                                                    case "folder":
                                                        return ( active_status && subscribed && page_layout !== "layout_two" ?
                                                            <Folder
                                                                id={id}
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
                                                                subStatus={subscribed}
                                                                viewType="live"
                                                                layout={page_layout}
                                                            />
                                                            :
                                                            subscribed && page_layout !== "layout_two" &&
                                                            <div className={` ${colClasses} `}>
                                                            </div>
                                                        )
                                                    case "offer":
                                                    case "url":
                                                    case "email":
                                                    case "phone":
                                                        return (
                                                            (!active_status && page_layout=== "layout_one") || active_status ?
                                                                <div className={` ${colClasses} `}>
                                                                    {active_status ? page_layout === "layout_one" ?
                                                                        <>
                                                                            <a className={!url || !displayIcon ? "default" : ""}
                                                                               target="_blank"
                                                                               href={url || "#"}
                                                                               onClick={(e) => TrackIconClick(id)}
                                                                            >
                                                                                <img src={displayIcon} alt=""/>
                                                                            </a>
                                                                            <p>
                                                                                {name?.length > 11 ? name.substring(0, 11) + "..."
                                                                                    : name || "Link Name"
                                                                                }
                                                                            </p>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <div className="bg_image_wrap" style={styles}></div>
                                                                            <a className={`icon_wrap
                                                                            ${ (!url || !displayIcon) ? "default" : ""}`}
                                                                               target="_blank"
                                                                               href={url || "#"}>
                                                                                <div className={`${bg_image && bg_active ?
                                                                                    "w-full icon_info absolute left-0 bottom-0 p-3 flex items-center justify-between gap-2"
                                                                                    :
                                                                                    "flex items-center justify-between w-full"}`}>
                                                                                    <span className="flex items-center justify-start gap-2">
                                                                                        {!!icon_active &&
                                                                                            <img src={displayIcon} alt=""/>
                                                                                        }
                                                                                        <h3>{name || "Link Name"}</h3>
                                                                                    </span>
                                                                                    <IoOpenOutline />
                                                                                </div>
                                                                            </a>
                                                                        </>

                                                                        :
                                                                        ""
                                                                    }
                                                                </div>
                                                                :
                                                                ""
                                                        )
                                                    case "mailchimp":
                                                    case "shopify":
                                                    case "advanced":
                                                        return (
                                                            (!active_status && page_layout=== "layout_one") || active_status ?
                                                                <AdvancedIcon
                                                                    id={id}
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
                                                                    viewType="live"
                                                                    pageLayout={page_layout}
                                                                />
                                                                :
                                                                ""
                                                        )
                                                }
                                            })()}

                                            {subscribed &&
                                            ( (index + 1) % 4 === 0 || index + 1 === iconCount) ||
                                            (index + 1 === dataRow && page_layout === "layout_two") ?
                                                (() => {
                                                    switch (clickType) {
                                                        case "mailchimp":
                                                            return (
                                                                <SubscribeForm
                                                                    dataRow={dataRow}
                                                                    row={row}
                                                                    mailchimpListId={mailchimpListId}
                                                                    userId={user_id}
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
                                                        /*case "advanced":
                                                            return (
                                                                <IconDescription
                                                                    id={id}
                                                                    dataRow={dataRow}
                                                                    row={row}
                                                                    description={description}
                                                                    url={value.url}
                                                                    viewType="live"
                                                                />
                                                            )*/
                                                        case "folder":
                                                            return (
                                                                dataRow === row &&
                                                                    <div className={`my_row folder open`}>
                                                                        <div className="icons_wrap inner">

                                                                            {accordionLinks?.map(
                                                                                (
                                                                                    innerLinkFull,
                                                                                    index) => {
                                                                                    return (
                                                                                        <AccordionLinks
                                                                                            key={index}
                                                                                            icons={innerLinkFull}
                                                                                            subStatus={subscribed}
                                                                                            viewType="live"
                                                                                        />
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
            </div>


            <div className="my_row user_page_footer">
                <div className="image_wrap">
                    <a href={ route('register') }>
                        <p>Powered By</p>
                        <img src={ Vapor.asset('images/logo.png') } alt="Link Pro" />
                    </a>
                </div>
            </div>
        </main>
    );
}

export default LivePage;
