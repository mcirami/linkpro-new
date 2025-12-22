import React from 'react';
import {TrackIconClick} from '@/Services/TrackClicks.jsx';
import { IoOpenOutline } from "react-icons/io5";

const AdvancedIcon = ({
                          linkItem,
                          colClasses,
                          displayIcon,
                          dataRow,
                          mainIndex,
                          setRow,
                          value,
                          setValue,
                          index,
                          setClickType,
                          clickType,
                          viewType,
                          pageLayout,
                          styles
                      }) => {

    let {
        id,
        type,
        name,
        url,
        icon_active,
        active_status,
        bg_image,
        bg_active
    } = linkItem;

    const handleClick = (e) => {
        e.preventDefault();

        const clickedDiv = e.currentTarget;

        if (clickedDiv.classList.contains('open')) {
            setRow(null);
            setValue({
                index: null,
                url: null
            });
        } else {
            setRow(parseInt(clickedDiv.dataset.row));
            setValue({
                index: index,
                url: url
            });
            setClickType(type);

            (viewType === "live" && type!== "advanced") && TrackIconClick(id)

            setTimeout(function(){
                document.querySelector('.folder.open .folder_content').scrollIntoView({
                    behavior: 'smooth',
                    block: "nearest",
                });
            }, 300)
        }

    }

    return (
        active_status ?
            <div className={`${colClasses} ${mainIndex === value.index &&
                clickType === type ? "open" : ""}`}
                     data-row={dataRow}
                     onClick={(e) => {
                         handleClick(e)
                     }}
                >
                    {pageLayout === "layout_one" ?
                        <>
                            <a className={`${!displayIcon ? "default" : ""}`}
                               href="#">
                                <img src={displayIcon} alt=""/>
                            </a>
                            <p>
                                {name && name.length >
                                11 ?
                                    name.substring(0,
                                        11) + "..."
                                    :
                                    name || "Link Name"
                                }
                            </p>
                        </>
                        :
                        <>
                            <div className="bg_image_wrap" style={styles}></div>
                            <a className={`icon_wrap flex items-center !justify-between ${!displayIcon ?
                                "default" :
                                ""}`}
                               target="_blank"
                               href={url || "#"}>
                                <div className={`${ (bg_image && bg_active) ?
                                    "w-full icon_info absolute left-0 bottom-0 p-3 flex items-center justify-between gap-2"
                                    :
                                    "flex items-center justify-between w-full"}`}>
                                    <span className="flex items-center justify-start gap-2">
                                        { (displayIcon && icon_active) ?
                                            <img src={displayIcon} alt=""/>
                                            :
                                            ""
                                        }
                                        <h3>{name || "Link Name"}</h3>
                                    </span>
                                </div>
                            </a>
                        </>
                    }
                </div>
                :
            pageLayout === "layout_one" &&
            <div className={` ${colClasses} `}>
            </div>

    );
};

export default AdvancedIcon;
