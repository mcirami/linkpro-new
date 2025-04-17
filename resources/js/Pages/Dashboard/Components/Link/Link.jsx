import React from 'react';
import {MdDragHandle} from 'react-icons/md';
import { FaEdit } from "react-icons/fa";
import {checkIcon} from '@/Services/UserService.jsx';
import IOSSwitch from '@/Utils/IOSSwitch.jsx';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import DeleteIcon from '@/Pages/Dashboard/Components/Link/Forms/DeleteIcon.jsx';
import {usePageContext} from '@/Context/PageContext.jsx';
import {MdEdit} from 'react-icons/md';
const Link = ({
                  link,
                  handleOnClick,
                  fetchFolderLinks,
                  handleChange,
                  subStatus,
                  setShowConfirmFolderDelete,
                  setShowConfirmPopup,
}) => {

    const {type, id, icon, links, active_status, name, url} = link;
    const {pageSettings} = usePageContext();

    let hasLinks = true;
    let displayIcon;
    if (type === "folder") {
        hasLinks = links.length > 0;
    } else {
        displayIcon = checkIcon(icon, "", subStatus);
    }

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
             className="grid_item"
             ref={setNodeRef}
             style={style}
        >
            <div className="icon_col">
                <span className="drag_handle"
                      {...attributes}
                      {...listeners}
                >
                    <MdDragHandle/>
                    <div className="hover_text"><p>Move</p></div>
                </span>

                <div className="column_content">
                    {type === "folder" ?
                        <div className="icon_wrap folder">
                            <div className="inner_icon_wrap" onClick={(e) => {
                                fetchFolderLinks(id)
                            }}>
                                <img src={Vapor.asset('images/blank-folder-square.jpg')} alt=""/>
                                <div className={hasLinks ?
                                    "folder_icons main" :
                                    "folder_icons empty"}>
                                    {hasLinks && links.slice(
                                        0, 9).map((innerLink, index) => {

                                        const {
                                            id,
                                            icon
                                        } = innerLink;

                                        return (
                                            <div className="image_col" key={index}>
                                                <img src={checkIcon(icon, "", subStatus)} alt=""/>
                                            </div>
                                        )
                                    })
                                    }
                                    {!hasLinks &&
                                        <p><span>+</span> <br/>Add<br/>Icons
                                        </p>}
                                </div>

                            </div>
                        </div>
                        :
                        <div className="icon_wrap" onClick={(e) => {
                            handleOnClick(id)
                        }}>
                            <div className="image_wrap">
                                <img src={displayIcon} alt=""/>
                            </div>
                        </div>
                    }
                    <div className="link_content">
                        {pageSettings.page_layout === "layout_two" ?
                            <div className="left_col">
                                <h3>{name}</h3>
                                <p>{url}</p>
                            </div>
                            :
                            ""
                        }
                        <div className={`right_col ${pageSettings.page_layout === 'layout_one' ? 'w-full block text-center' : ''}`}>
                           <div className={`${pageSettings.page_layout === 'layout_two' ? 'flex items-center gap-2' : ''}`}>
                               {pageSettings.page_layout === 'layout_two' ?
                                <span className="edit_icon" onClick={(e) => {
                                    handleOnClick(id)
                                }}>
                                    <FaEdit />
                                    <div className="hover_text edit_image">
                                        <p>Edit Icon</p>
                                    </div>
                                </span>
                                   :
                                   ""
                               }
                               <div className="switch_wrap">
                                   <IOSSwitch
                                       onChange={() => handleChange(link, hasLinks, type)}
                                       checked={Boolean(active_status)}
                                   />
                                   <div className="hover_text switch">
                                       <p>
                                           {Boolean(active_status) ? "Disable" : "Enable"}
                                           {type === "folder" ? "Folder" : "Icon"}
                                       </p>
                                   </div>
                               </div>
                           </div>
                            {pageSettings.page_layout === "layout_two" ?
                                <div className="delete_icon mt-auto">
                                    <DeleteIcon
                                        setShowConfirmFolderDelete={setShowConfirmFolderDelete}
                                        setShowConfirmPopup={setShowConfirmPopup}
                                        type={type}
                                        editLink={id}
                                    />
                                </div>
                                :
                                ""
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Link;
