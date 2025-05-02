import React, {useEffect, useState} from 'react';
import {TrackIconClick} from '@/Services/TrackClicks.jsx';
import {toInteger} from 'lodash';
import isJSON from 'validator/es/lib/isJSON.js';
import {convertText} from '@/Services/CreatorServices.jsx';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';

const AdvancedIcon = ({
                          id,
                          colClasses,
                          displayIcon,
                          name,
                          active_status,
                          dataRow,
                          mainIndex,
                          setRow,
                          value,
                          setValue,
                          url,
                          index,
                          setClickType,
                          clickType,
                          type,
                          viewType,
                          pageLayout
                      }) => {

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
            setRow(toInteger(clickedDiv.dataset.row));
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
        <div className={ `${colClasses} ${mainIndex === value.index && clickType === type ? "open" : "" }`}
             data-row={ dataRow }
             onClick={(e) => {handleClick(e)} }
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
                <a className={`icon_wrap !justify-start ${!displayIcon ? "default" : ""}`}
                   target="_blank"
                   href={url || "#"}>
                    <img src={displayIcon} alt=""/>
                    <h3>{name || "Link Name"}</h3>
                </a>
            }
        </div>
    );
};

export default AdvancedIcon;
