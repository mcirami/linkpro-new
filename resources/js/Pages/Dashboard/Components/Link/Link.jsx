import React, {useState} from 'react';
import {MdDragHandle} from 'react-icons/md';
import {checkIcon} from '@/Services/UserService.jsx';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {usePageContext} from '@/Context/PageContext.jsx';
import LayoutOne from '@/Pages/Dashboard/Components/Link/LayoutOne.jsx';
import LayoutTwo from '@/Pages/Dashboard/Components/Link/LayoutTwo.jsx';
import StandardForm
    from '@/Pages/Dashboard/Components/Link/Forms/StandardForm.jsx';
const Link = ({
                  link,
                  linkCount,
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
                  affStatus,
                  connectionError
}) => {

    const {type, id, icon, links} = link;
    const {pageSettings} = usePageContext();
    const [affiliateStatus, setAffiliateStatus] = useState(affStatus);

    console.log("Links: ", links);
    let hasLinks = false;
    let displayIcon;
    if (type === "folder") {
        hasLinks = links?.length > 0;
    } else {
        if (!icon && pageSettings.page_layout === "layout_one") {
            displayIcon = Vapor.asset('images/icon-placeholder.png');
        } else {
            displayIcon = checkIcon(icon, "", subStatus);
        }
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
                            setEditLink={setEditLink}
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
                                connectionError={connectionError}
                                index={index}
                            />
                        </div>
                    </div>
                    :
                    ""
            }
        </div>
            {(pageSettings.page_layout === "layout_one" &&
            Math.ceil((index + 1) / 4) === formRow &&
            ((index + 1) % 4 === 0 || index + 1 === linkCount)) ?
            <div className="edit_form link my_row">
                <StandardForm
                    editLink={editLink}
                    setEditLink={setEditLink}
                    setShowLoader={setShowLoader}
                    setFormRow={setFormRow}
                    affiliateStatus={affiliateStatus}
                    setAffiliateStatus={setAffiliateStatus}
                    connectionError={connectionError}
                    index={index}
                />
            </div>
                :
                ""
            }
        </>
    );
};

export default Link;
