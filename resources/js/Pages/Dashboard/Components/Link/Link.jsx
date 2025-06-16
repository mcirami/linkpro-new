import React, {useState} from 'react';
import {MdDragHandle} from 'react-icons/md';
import { FaEdit } from "react-icons/fa";
import {checkIcon} from '@/Services/UserService.jsx';
import IOSSwitch from '@/Utils/IOSSwitch.jsx';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import DeleteIcon from '@/Pages/Dashboard/Components/Link/Forms/DeleteIcon.jsx';
import {usePageContext} from '@/Context/PageContext.jsx';
import {MdEdit} from 'react-icons/md';
import LayoutOne from '@/Pages/Dashboard/Components/Link/LayoutOne.jsx';
import LayoutTwo from '@/Pages/Dashboard/Components/Link/LayoutTwo.jsx';
import StandardForm
    from '@/Pages/Dashboard/Components/Link/Forms/StandardForm.jsx';
const Link = ({
                  link,
                  handleOnClick,
                  fetchFolderLinks,
                  subStatus,
                  setShowConfirmPopup,
                  editLink,
                  setEditLink,
                  index,
                  setShowLoader,
                  formRow,
                  setFormRow,
                  setShowUpgradePopup,
                  affStatus
}) => {

    const {type, id, icon, links} = link;
    const {pageSettings} = usePageContext();
    const [affiliateStatus, setAffiliateStatus] = useState(affStatus);

    let hasLinks = false;
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
        <>
        <div
             className="grid_item"
             ref={setNodeRef}
             style={style}
        >
            <div className="icon_col">
                <span className="drag_handle relative"
                      {...attributes}
                      {...listeners}
                >
                    <MdDragHandle/>
                    <div className="hover_text"><p>Move</p></div>
                </span>

                <div className={`column_content ${type === "folder" ? "folder" : ""}`}>
                    {pageSettings.page_layout === "layout_one" ?
                        <LayoutOne
                            fetchFolderLinks={fetchFolderLinks}
                            hasLinks={hasLinks}
                            links={links}
                            checkIcon={checkIcon}
                            subStatus={subStatus}
                            displayIcon={displayIcon}
                            link={link}
                            handleOnClick={handleOnClick}
                            index={index}
                            setShowUpgradePopup={setShowUpgradePopup}
                        />
                        :
                        type !== "folder" &&
                            <LayoutTwo
                                displayIcon={displayIcon}
                                link={link}
                                handleOnClick={handleOnClick}
                                setShowConfirmPopup={setShowConfirmPopup}
                                editLink={editLink}
                                setEditLink={setEditLink}
                                index={index}
                            />
                    }
                </div>
            </div>

            {
                ((pageSettings.page_layout === "layout_two" && formRow === index + 1)) ?
                    <div className="form_wrapper">
                        <div className="edit_form link my_row">
                            <StandardForm
                                editLink={editLink}
                                setEditLink={setEditLink}
                                setShowLoader={setShowLoader}
                                setFormRow={setFormRow}
                                affiliateStatus={affiliateStatus}
                                setAffiliateStatus={setAffiliateStatus}
                            />
                        </div>
                    </div>
                    :
                    ""
            }
        </div>
            {(pageSettings.page_layout === "layout_one" &&
                    Math.ceil((index + 1) / 4) === formRow &&
                    (index + 1) % 4 === 0) ?
            <div className="edit_form link my_row">
                <StandardForm
                    editLink={editLink}
                    setEditLink={setEditLink}
                    setShowLoader={setShowLoader}
                    setFormRow={setFormRow}
                    affiliateStatus={affiliateStatus}
                    setAffiliateStatus={setAffiliateStatus}
                />
            </div>
                :
                ""
            }
        </>
    );
};

export default Link;
