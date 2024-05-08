import React, {useState, useRef, useReducer, useEffect} from 'react';

import {Loader} from '@/Utils/Loader';
import {Flash} from '@/Utils/Flash';
import InputComponent from '@/Components/CreatorComponents/InputComponent.jsx';
import ImageComponent from '@/Components/CreatorComponents/ImageComponent.jsx';
import ContentSelect from '@/Components/CreatorComponents/ContentSelect.jsx';
import ColorPicker from '@/Components/CreatorComponents/ColorPicker';
import {
    pageDataReducer,
} from '@/Components/Reducers/CreatorReducers.jsx';
import Preview from './Components/Preview/Preview';
import EventBus from '@/Utils/Bus';
import {isEmpty} from 'lodash';
import PreviewButton from '@/Components/PreviewButton.jsx';
import {previewButtonRequest} from '@/Services/PageRequests';
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
import {updateSectionsPositions} from '@/Services/LandingPageRequests';
import {Head} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';

function LPCreator({landingPageArray, courses, username}) {

    const [showTiny, setShowTiny]   = useState(false);
    const [openIndex, setOpenIndex] = useState([0]);
    const [hoverSection, setHoverSection] = useState(null);


    const [pageData, dispatchPageData] = useReducer(pageDataReducer, landingPageArray);
    const [sections, setSections] = useState([]);

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
        setSections(pageData["sections"].map((section) => {
            return section;
        }))
    }, []);

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
    let textCount = 0;
    let imageCount = 0;

    return (
        <AuthenticatedLayout>
            <Head title="Landing Page Creator"/>
            <div className="container">

                <h2 className="page_title">Course Creator</h2>
                <section className="card edit_page creator">
                    <div id="links_page">
                        <div id="creator" className="my_row creator_wrap">
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
                                                    dispatch={dispatchPageData}
                                                    value={pageData['title']}
                                                    submitType="landingPage"
                                                />
                                            </div>
                                            <div className="section_content my_row">
                                                <ImageComponent
                                                    ref={nodesRef}
                                                    completedCrop={completedCrop}
                                                    setCompletedCrop={setCompletedCrop}
                                                    setShowLoader={setShowLoader}
                                                    data={pageData}
                                                    dispatch={dispatchPageData}
                                                    previewType="external"
                                                    elementName="logo"
                                                    saveTo="landingPage"
                                                    cropArray={{
                                                        unit: '%',
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
                                                    dispatch={dispatchPageData}
                                                    value={pageData['slogan']}
                                                    submitType="landingPage"
                                                />
                                                <ImageComponent
                                                    ref={nodesRef}
                                                    completedCrop={completedCrop}
                                                    setCompletedCrop={setCompletedCrop}
                                                    setShowLoader={setShowLoader}
                                                    data={pageData}
                                                    dispatch={dispatchPageData}
                                                    elementName="hero"
                                                    previewType="external"
                                                    saveTo="landingPage"
                                                    cropArray={{
                                                        unit: '%',
                                                        width: 30,
                                                        x: 25,
                                                        y: 25,
                                                        aspect: 16 / 8,
                                                    }}
                                                />
                                                <ColorPicker
                                                    label="Top Header Color"
                                                    data={pageData}
                                                    dispatch={dispatchPageData}
                                                    elementName="header_color"
                                                />
                                                <ColorPicker
                                                    label="Header Text Color"
                                                    data={pageData}
                                                    dispatch={dispatchPageData}
                                                    elementName="header_text_color"
                                                />
                                                <div className="my_row page_settings">
                                                    {pageData['slug'] &&
                                                        <div className="url_wrap">
                                                            <p>Landing Page URL:</p>
                                                            <a target="_blank" href={`${url}/${pageData['slug']}`}>{`${url}/${pageData['slug']}`}</a>
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
                                                        {sections.map((section,
                                                                       index) => {
                                                            {
                                                                section.type ===
                                                                'image' ?
                                                                    ++imageCount :
                                                                    ++textCount;
                                                            }
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
                                                                    courses={courses}
                                                                    imageCount={imageCount}
                                                                    textCount={textCount}
                                                                />
                                                            );
                                                        })}
                                                    </SortableContext>
                                                </section>
                                            </DndContext>
                                        }

                                        <section className="my_row section_row">
                                            <div className="section_title">
                                                <h4>Add Content</h4>
                                            </div>
                                            <ContentSelect
                                                sections={sections}
                                                setSections={setSections}
                                                dataId={pageData['id']}
                                                setOpenIndex={setOpenIndex}
                                                addTo="landingPage"
                                                options={[
                                                    {
                                                        id: 1,
                                                        type: "text",
                                                        label: "Text Section"
                                                    },
                                                    {
                                                        id: 2,
                                                        type: "image",
                                                        label: "Image Section"
                                                    }
                                                ]}
                                            />
                                        </section>

                                        {!pageData['published'] &&

                                            <PublishButton
                                                pageData={pageData}
                                                dispatch={dispatchPageData}
                                            />
                                        }
                                    </div>
                                </div>

                                <div className={`right_column links_col preview${showPreview ?
                                    ' show' :
                                    ''}`}>
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
                        </div>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    )
}

export default LPCreator;
