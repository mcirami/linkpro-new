import FolderLinks from './FolderLinks.jsx';
import React from 'react';
import {TrackFolderClick} from '@/Services/TrackClicks.jsx';
import {toInteger} from 'lodash';

const Folder = ({
                    id,
                    colClasses,
                    mainIndex,
                    links,
                    setRow,
                    value,
                    setValue,
                    dataRow,
                    name,
                    clickType,
                    setClickType,
                    subStatus,
                    viewType,
                    layout
}) => {

    const folderClick = (e, index, viewType) => {
        e.preventDefault();

        console.log("index", index);
        const clickedDiv = e.currentTarget.parentNode;

        if (clickedDiv.classList.contains('open')) {
            setRow(null);
            setValue({
                index: null,
                url: null
            });
        } else {
            setRow(toInteger(clickedDiv.firstChild.dataset.row));
            console.log("index", index);
            setValue((prev) => ({
                ...prev,
                index: index
            }));
            setClickType("folder");

            setTimeout(function(){
                document.querySelector('.icons_wrap.inner .icon_col:last-child')?.scrollIntoView({
                    behavior: 'smooth',
                    block: "nearest",
                });

            }, 300)

            viewType === "live" && TrackFolderClick(id);
        }
    }

    return (

        <div className={`${colClasses} ${mainIndex === value.index && clickType === "folder" ? " open" : "" }`}>
            {layout === "layout_one" ?
                <>
                    <a className="inner_icon_wrap"
                       href="#"
                       data-row={ dataRow }
                       onClick={(e) => {
                            folderClick(e, mainIndex, viewType);
                       }}
                    >
                        <img className="bg_image" src={Vapor.asset('images/blank-folder-square.jpg')} alt=""/>
                        <div className={`folder_icons ${viewType}`}>
                            {links.slice(0, 9).map(( innerLinkIcons, index ) => {
                                return (
                                    <FolderLinks
                                        key={index}
                                        icons={innerLinkIcons}
                                        subStatus={subStatus}
                                        viewType={viewType}
                                        layout={layout}
                                    />
                                )
                            })}
                        </div>
                    </a>
                    <p>
                        {name && name.length >
                            11 ?
                            name.substring(0,
                            11) + "..."
                            :
                            name || "Folder Name"
                        }
                    </p>
                </>

                :
                <>
                    <h3 className="mb-2">{name || "Folder Name"}</h3>
                    <div className="folder_icons preview">
                        {links.slice(0, 9).map(( innerLinkIcons, index ) => {
                            return (
                                <FolderLinks
                                    key={index}
                                    icons={innerLinkIcons}
                                    subStatus={subStatus}
                                    viewType={viewType}
                                    layout={layout}
                                />
                            )
                        })}
                    </div>
                </>
            }
        </div>
    )
}

export default Folder;
