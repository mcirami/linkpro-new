import React, {
    useContext
} from 'react';
import Link from './Link';
import {
    FolderLinksContext,
} from '../../Dashboard.jsx';
import {usePageContext} from '@/Context/PageContext.jsx';
import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';
import {
    updateLinksPositions,
} from '@/Services/LinksRequest.jsx';

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

import {
    LINKS_ACTIONS,
    FOLDER_LINKS_ACTIONS,
} from '@/Services/Reducer.jsx';

const Links = ({
                   editLink,
                   setEditLink,
                   setValue,
                   setShowUpgradePopup,
                   subStatus,
                   pageLayoutRef,
                   setShowConfirmPopup,
                   setShowLoader,
                   affStatus,
                   connectionError,
                   formRow,
                   setFormRow
}) => {

    const { userLinks, dispatch } = useUserLinksContext();
    const { dispatchFolderLinks } = useContext(FolderLinksContext);
    const {pageSettings} = usePageContext();

    //const targetRef = useRef(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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
                setEditLink(userLinks.find(function(e) {
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
            setEditLink(userLinks.find(function(e) {
                return e.id === linkID
            }));
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

        /*if(currentLink.type === "shopify" || currentLink.type === "mailchimp") {
            setAccordionValue("integration")
        } else if (currentLink.icon?.includes("offer-images")) {
            setAccordionValue("offer")
        } else if (currentLink.icon?.includes("custom-icons")){
            if(subStatus) {
                setAccordionValue("custom")
            } else {
                setAccordionValue("standard")
            }
        } else {
            setAccordionValue("standard")
        }*/

    }

    const fetchFolderLinks = async (linkID) => {
        if(subStatus) {
            /*const url = 'folder/links/' + linkID;
            const response = await fetch(url);
            const folderLinks = await response.json();*/
            const folderLinks = userLinks.find(function(e) {
                if(e.id === linkID) {
                    return e.links;
                }
            })

            dispatchFolderLinks({ type: FOLDER_LINKS_ACTIONS.SET_FOLDER_LINKS, payload: {links: folderLinks.links} })
            setEditLink(prev => ({...prev, folder_id: linkID, type: "folder"}));

            setValue(prev => ({...prev, index: 0, url: null}));

            setTimeout(function(){
                document.querySelector('#scrollTo').scrollIntoView({
                    behavior: 'smooth',
                    block: "start",
                    inline: "nearest"
                });

            }, 300)

        } else {
            setShowUpgradePopup({
                show: true,
                text: "access your folders"
            });
        }

    }

    const handleGridOnChange = (event) => {
        const {active, over} = event;

        if (active.id !== over.id) {

            setValue({
                index: null,
                url: null
            })
            const oldIndex = userLinks.map(function(e) {
                return e.id;
            }).indexOf(active.id);
            const newIndex = userLinks.map(function(e) {
                return e.id;
            }).indexOf(over.id);
            const newArray = arrayMove(userLinks, oldIndex, newIndex);

            dispatch ({ type: LINKS_ACTIONS.SET_LINKS, payload: {links: newArray}})

            const packets = {
                userLinks: newArray,
            }
            updateLinksPositions(packets);
        }
    }

    const handleDragStart = (event) => {
        const div = document.querySelector('.column_content.open');
        if (div) {
            div.classList.remove('open');
            setFormRow(null)
            setEditLink({});
        }
    }

    return (
        <section id={pageSettings['page_layout']} ref={pageLayoutRef} className={`icons_wrap add_icons icons ${userLinks?.length === 0 ? "no_icons" : ""} `}>

            {userLinks?.length === 0 ?
                <div className="info_message">
                    <p>You don't have any icons to display.</p>
                    <p>Click 'Add Icon' above to start adding links.</p>
                </div>
            :
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleGridOnChange}
                    onDragStart={handleDragStart}
                >
                    <SortableContext
                        id={'grid-sort-contextbasic'}
                        items={userLinks?.map((i) => i.id)}
                        strategy={rectSortingStrategy}
                    >

                        {userLinks?.map((link, index) => {

                            return (
                                ((link.type !== "folder" && pageSettings['page_layout'] === "layout_two") ||
                                pageSettings['page_layout'] === "layout_one")
                                &&
                                <Link
                                    key={link.id || index}
                                    link={link}
                                    linkCount={userLinks.length}
                                    handleOnClick={handleOnClick}
                                    fetchFolderLinks={fetchFolderLinks}
                                    subStatus={subStatus}
                                    setShowConfirmPopup={setShowConfirmPopup}
                                    editLink={editLink}
                                    setEditLink={setEditLink}
                                    index={index}
                                    setShowLoader={setShowLoader}
                                    formRow={formRow}
                                    setFormRow={setFormRow}
                                    setShowUpgradePopup={setShowUpgradePopup}
                                    affStatus={affStatus}
                                    connectionError={connectionError}
                                />
                            )
                        })}

                    </SortableContext>
                </DndContext>
            }
        </section>
    );
};

export default Links;
