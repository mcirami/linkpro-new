import React, {
    useRef,
    useContext,
} from 'react';
import {
    FolderLinksContext,
} from '../../Dashboard.jsx';
import {
    updateLinksPositions,
    updateLinkItemStatus,
} from '@/Services/LinksRequest.jsx';
import {
    LINKS_ACTIONS,
    FOLDER_LINKS_ACTIONS,
} from '@/Services/Reducer.jsx';
import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy
} from '@dnd-kit/sortable';
import FolderLink from './FolderLink';

const FolderLinks = ({
                         folder_id,
                         subStatus,
                         editLink,
                         setEditLink,
                         formRow,
                         setFormRow,
                         setShowLoader
               }) => {

    const {dispatch  } = useUserLinksContext();
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);

    const targetRef = useRef(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleChange = (currentItem) => {
        const newStatus = !currentItem.active_status;

        const packets = {
            active_status: newStatus,
        };

        const url = "/dashboard/links/item-status/"

        updateLinkItemStatus(packets, currentItem.id, url)
        .then((data) => {

            if(data.success) {

                dispatchFolderLinks({ type: FOLDER_LINKS_ACTIONS.UPDATE_FOLDER_LINKS_STATUS, payload: {id: currentItem.id } })
                dispatch ({ type: LINKS_ACTIONS.UPDATE_LINKS_STATUS_FROM_FOLDER, payload: {id: currentItem.id, folder_id: folder_id } })

            }
        })
    };

    const handleOnClick = (e, linkID, row) => {
        if (formRow === row) {
            if (e.target.closest('.column_content').classList.contains('open')) {
                e.target.closest('.column_content').classList.remove('open');
                setFormRow(null)
                setEditLink({});
            } else {
                const openedDiv = document.querySelector('.column_content.open');
                if (openedDiv) {
                    openedDiv.classList.remove('open');
                }
                e.target.closest('.column_content').classList.add('open');
                setEditLink(folderLinks.find(function(e) {
                    return e.id === linkID
                }));
                setTimeout(function(){
                    const closestScrollTo = e.target.closest('.grid_item');

                    closestScrollTo.scrollIntoView({
                        behavior: 'smooth',
                        block: "start",
                        inline: "nearest"
                    });
                }, 300)
            }

        } else {
            setFormRow(row);
            setEditLink(folderLinks.find(function(e) {
                return e.id === linkID
            }));
            const openedDiv = document.querySelector('.column_content.open');
            if (openedDiv) {
                openedDiv.classList.remove('open');
            }
            e.target.closest('.column_content').classList.add('open');

            setTimeout(function(){
                const closestScrollTo = e.target.closest('.grid_item');

                closestScrollTo.scrollIntoView({
                    behavior: 'smooth',
                    block: "start",
                    inline: "nearest"
                });
            }, 300)
        }

    }

    const handleGridOnChange = (event) => {

        const {active, over} = event;

        if (active.id !== over.id) {

            const oldIndex = folderLinks.map(function(e) {
                return e.id;
            }).indexOf(active.id);
            const newIndex = folderLinks.map(function(e) {
                return e.id;
            }).indexOf(over.id);
            const newArray = arrayMove(folderLinks, oldIndex, newIndex);

            dispatchFolderLinks({ type: FOLDER_LINKS_ACTIONS.SET_FOLDER_LINKS, payload: {links: newArray}})
            dispatch({ type: LINKS_ACTIONS.SET_FOLDER_LINKS_ORDER, payload: {links: newArray, id: folder_id}})

            const packets = {
                userLinks: newArray,
            }
            updateLinksPositions(packets);
        }
    }

    return (

        <div id="layout_one" ref={targetRef} className={`icons_wrap add_icons icons folder ${folderLinks?.length === 0 ? "no_icons" : ""}`}>

            {folderLinks?.length === 0 ?
                <div className="info_message">
                    <p>You don't have any icons to display in this folder.</p>
                    <p>Click 'Add Icon' above to start adding links.</p>
                </div>
                :
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleGridOnChange}
                >
                    <SortableContext
                        id={'grid-sort-contextbasic'}
                        items={folderLinks.map((i) => i?.id)}
                        strategy={rectSortingStrategy}
                    >
                            {folderLinks?.length > 0 && folderLinks.map((link, index) => {

                                return (
                                    <FolderLink
                                        key={link.id}
                                        link={link}
                                        linkCount={folderLinks.length}
                                        index={index}
                                        subStatus={subStatus}
                                        handleChange={handleChange}
                                        handleOnClick={handleOnClick}
                                        formRow={formRow}
                                        setFormRow={setFormRow}
                                        editLink={editLink}
                                        setEditLink={setEditLink}
                                        setShowLoader={setShowLoader}
                                    />
                                )
                            })}
                        </SortableContext>
                </DndContext>
            }

        </div>
    );
};

export default FolderLinks;
