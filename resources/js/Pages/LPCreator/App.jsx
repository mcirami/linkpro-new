import React, {useState, useRef, useReducer, useEffect} from 'react';

const landingPageArray = user.landingPage;
const username = user.username;
import {Loader} from '../../Utils/Loader';
import {Flash} from '../../Utils/Flash';
import InputComponent from './Components/InputComponent';
import ColorPicker from './Components/ColorPicker';
import Preview from './Components/Preview/Preview';
import AddTextSection from './Components/AddTextSection';
import AddImageSection from './Components/AddImageSection';
import ImageComponent from './Components/ImageComponent';
import {reducer} from './Reducer';
import EventBus from '../../Utils/Bus';
import {isEmpty} from 'lodash';
import PreviewButton from '../Dashboard/Components/Preview/PreviewButton';
import {previewButtonRequest} from '../../Services/PageRequests';
import PublishButton from './Components/PublishButton';
import Section from './Components/Section';
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
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {updateSectionsPositions} from '../../Services/LandingPageRequests';

function App() {

    const [showTiny, setShowTiny]   = useState(false);

    const [openIndex, setOpenIndex] = useState([0]);
    const [hoverSection, setHoverSection] = useState(null);

    const [pageData, dispatch] = useReducer(reducer, landingPageArray);
    const [sections, setSections] = useState(pageData["sections"]);
    const [showPreviewButton, setShowPreviewButton] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [completedCrop, setCompletedCrop] = useState({})
    const nodesRef = useRef({});

    const [showLoader, setShowLoader] = useState({
        show: false,
        icon: "",
        position: ""
    });
    const [flash, setFlash] = useState({
        show: false,
        type: '',
        msg: ''
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        previewButtonRequest(setShowPreviewButton);
    }, [])

    useEffect(() => {

        function setPreviewButton() {
            previewButtonRequest(setShowPreviewButton);
        }

        window.addEventListener('resize', setPreviewButton);

        return () => {
            window.removeEventListener('resize', setPreviewButton);
        }

    }, [])

    const showFlash = (show = false, type='', msg='') => {
        setFlash({show, type, msg})
    }

    useEffect(() => {
        EventBus.on('success', (data) => {
            showFlash(true, 'success', data.message.replace(/"/g, ""))

            return () => EventBus.remove("success");
        });

    }, []);

    useEffect(() => {
        EventBus.on('error', (data) => {
            showFlash(true, 'error', data.message.replace(/"/g, ""))

            return () => EventBus.remove("error");
        });

    }, []);

    const handleMouseEnter = (e) => {
        setHoverSection(e.target.id)
    }

    const handleDragEnd = (event) => {

        const {active, over} = event;

        if (active.id !== over.id) {

            let newArray;

            setSections((sections) => {
                const oldIndex = sections.map(function (e) {
                    return e.id;
                }).indexOf(active.id);
                const newIndex = sections.map(function (e) {
                    return e.id;
                }).indexOf(over.id);
                newArray = arrayMove(sections, oldIndex, newIndex);
                return newArray;
            });


            const packets = {
                sections: newArray
            }

            updateSectionsPositions(packets).then(() => {
                setShowTiny(false);
                setShowTiny(true);
            });
        }
    }

    const url = window.location.protocol + "//" + window.location.host + "/" + username;

    return (
        <div className="my_row page_wrap">

            {showLoader.show &&
                <Loader
                    showLoader={showLoader}
                />
            }

            {flash.show &&
                <Flash
                    {...flash}
                    setFlash={setFlash}
                    removeFlash={showFlash}
                    pageSettings={pageData}
                />
            }

            {showPreviewButton &&
                <PreviewButton setShowPreview={setShowPreview}/>
            }

            <div className="left_column">
                <h3 className="mb-4 card_title">Create Your Landing Page</h3>
                <div className="content_wrap my_row creator" id="left_col_wrap">
                    <section id="header_section"
                             className="my_row section section_row"
                             onMouseEnter={(e) =>
                                 handleMouseEnter(e)
                            }>
                        <div className="section_title">
                            <h4>Header</h4>
                        </div>
                        <div className="section_content my_row">
                            <InputComponent
                                placeholder="Page Title"
                                type="text"
                                maxChar={60}
                                hoverText="Submit Page Title"
                                elementName="title"
                                data={pageData}
                                dispatch={dispatch}
                                value={pageData["title"]}
                            />
                        </div>
                        <div className="section_content my_row">
                            <ImageComponent
                                ref={nodesRef}
                                completedCrop={completedCrop}
                                setCompletedCrop={setCompletedCrop}
                                setShowLoader={setShowLoader}
                                pageData={pageData}
                                dispatch={dispatch}
                                elementName="logo"
                                cropArray={{
                                    unit: "%",
                                    width: 60,
                                    height: 30,
                                    x: 25,
                                    y: 25,
                                }}
                            />
                            <InputComponent
                                placeholder="Slogan (optional)"
                                type="text"
                                maxChar={30}
                                hoverText="Submit Slogan Text"
                                elementName="slogan"
                                data={pageData}
                                dispatch={dispatch}
                                value={pageData["slogan"]}
                            />
                            <ImageComponent
                                ref={nodesRef}
                                completedCrop={completedCrop}
                                setCompletedCrop={setCompletedCrop}
                                setShowLoader={setShowLoader}
                                pageData={pageData}
                                dispatch={dispatch}
                                elementName="hero"
                                cropArray={{
                                    unit: "%",
                                    width: 30,
                                    x: 25,
                                    y: 25,
                                    aspect: 16 / 8
                                }}
                            />
                            <ColorPicker
                                label="Top Header Color"
                                pageData={pageData}
                                dispatch={dispatch}
                                elementName="header_color"
                            />
                            <ColorPicker
                                label="Header Text Color"
                                pageData={pageData}
                                dispatch={dispatch}
                                elementName="header_text_color"
                            />
                            <div className="my_row page_settings">
                                {pageData["slug"] &&
                                    <div className="url_wrap">
                                        <p>Landing Page URL:</p>
                                        <a target="_blank" href={`${url}/${pageData["slug"]}`}>{`${url}/${pageData["slug"]}`}</a>
                                    </div>
                                }
                            </div>
                        </div>
                    </section>

                    {!isEmpty(sections) &&

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <section className="sections_wrap my_row">

                                <SortableContext
                                    items={sections}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {sections.map((section, index) => {

                                        return (

                                            <Section
                                                key={section.id}
                                                section={section}
                                                index={index}
                                                completedCrop={completedCrop}
                                                setCompletedCrop={setCompletedCrop}
                                                nodesRef={nodesRef}
                                                sections={sections}
                                                setSections={setSections}
                                                url={url}
                                                openIndex={openIndex}
                                                setOpenIndex={setOpenIndex}
                                                setShowLoader={setShowLoader}
                                                handleMouseEnter={handleMouseEnter}
                                                showTiny={showTiny}
                                                setShowTiny={setShowTiny}
                                            />
                                        )
                                    })}
                                </SortableContext>
                            </section>
                        </DndContext>
                    }

                    <div className="link_row">
                        <AddTextSection
                            sections={sections}
                            setSections={setSections}
                            pageID={pageData["id"]}
                            setOpenIndex={setOpenIndex}
                        />
                        <AddImageSection
                            sections={sections}
                            setSections={setSections}
                            pageID={pageData["id"]}
                            setOpenIndex={setOpenIndex}
                        />
                    </div>

                    {!pageData["published"] &&

                        <PublishButton
                            pageData={pageData}
                            dispatch={dispatch}
                        />
                    }
                </div>
            </div>

            <div className={`right_column links_col preview${showPreview ? " show" : ""}`}>
                <Preview
                    completedCrop={completedCrop}
                    nodesRef={nodesRef}
                    sections={sections}
                    url={url}
                    pageData={pageData}
                    setShowPreview={setShowPreview}
                    hoverSection={hoverSection}
                />
            </div>

        </div>
    )
}

export default App;
