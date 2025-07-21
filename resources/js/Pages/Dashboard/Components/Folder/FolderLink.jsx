import React, {useState} from 'react';
import {MdDragHandle} from 'react-icons/md';
import IOSSwitch from '@/Utils/IOSSwitch.jsx';
import {checkIcon} from '@/Services/UserService.jsx';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import StandardForm
    from '@/Pages/Dashboard/Components/Link/Forms/StandardForm.jsx';

const FolderLink = ({
                        link,
                        linkCount,
                        index,
                        handleOnClick,
                        handleChange,
                        subStatus,
                        setValue,
                        formRow,
                        setFormRow,
                        affStatus,
                        editLink,
                        setEditLink,
                        setShowLoader
}) => {

    const linkID = link.id;
    let displayIcon;
    if (!link.icon) {
        displayIcon = Vapor.asset('images/icon-placeholder.png');
    } else {
        displayIcon = checkIcon(link.icon, "edit", subStatus);
    }

    const [affiliateStatus, setAffiliateStatus] = useState(affStatus);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: link.id});

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
                <span className="drag_handle"
                      {...attributes}
                      {...listeners}
                >
                    <MdDragHandle/>
                    <div className="hover_text"><p>Move</p></div>
                </span>

                <div className="column_content">

                    <div className="icon_wrap" onClick={(e) => {
                        handleOnClick(e, linkID, Math.ceil((index + 1) / 3))
                    }}>
                        <div className="image_wrap">
                            <img src={displayIcon} alt=""/>
                        </div>
                    </div>

                    <div className="my_row">
                        <div className="switch_wrap">
                            <IOSSwitch
                                onChange={(e) => handleChange(link)}
                                checked={Boolean(link.active_status)}
                            />
                            <div className="hover_text switch"><p>{Boolean(link.active_status) ? "Deactivate" : "Active"} Icon</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        { Math.ceil((index + 1) / 3) === formRow &&
            ((index + 1) % 3 === 0 || index + 1 === linkCount) ?
            <div className="edit_form link my_row">
                <StandardForm
                    editLink={editLink}
                    setEditLink={setEditLink}
                    setShowLoader={setShowLoader}
                    setFormRow={setFormRow}
                    affiliateStatus={affiliateStatus}
                    setAffiliateStatus={setAffiliateStatus}
                    index={index}
                />
            </div>
            :
            ""
        }
        </>
    );
};

export default FolderLink;
