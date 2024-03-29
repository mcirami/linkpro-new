import React, {useState, useRef, useReducer, useEffect} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';

import { ToolTipContextProvider } from '@/Utils/ToolTips/ToolTipContext';
import {Loader} from '@/Utils/Loader';
import {Flash} from '@/Utils/Flash';
import InputComponent from './Components/InputComponent';
import ColorPicker from './Components/ColorPicker';
import Preview from './Components/Preview/Preview';
import AddSectionLink from './Components/AddSectionLink.jsx';
import ImageComponent from './Components/ImageComponent';
import {offerDataReducer, reducer} from './Reducer';
import EventBus from '@/Utils/Bus';
import {isEmpty} from 'lodash';
import PreviewButton from '../../Components/PreviewButton.jsx';
import SwitchOptions from './Components/SwitchOptions';
import {previewButtonRequest} from '@/Services/PageRequests';
import PublishButton from './Components/PublishButton';
import Section from './Components/Section';
import DropdownComponent from './Components/DropdownComponent';
import InfoText from '@/Utils/ToolTips/InfoText';
import ToolTipIcon from '@/Utils/ToolTips/ToolTipIcon';

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
import {updateSectionsPositions} from '../../Services/CourseRequests';
import {Head, usePage} from '@inertiajs/react';

function CourseCreator({courseArray, offerArray, categories}) {

    const { auth } = usePage().props;
    const username = auth.user.userInfo.username;

    const [showTiny, setShowTiny]   = useState(false);

    const [openIndex, setOpenIndex] = useState([0]);
    const [hoverSection, setHoverSection] = useState(null);
    const [courseData, dispatch] = useReducer(reducer, courseArray);
    const [sections, setSections] = useState(courseArray["sections"]);
    const [offerData, dispatchOfferData] = useReducer(offerDataReducer, offerArray);
    const [showPreviewButton, setShowPreviewButton] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [infoText, setInfoText] = useState({section:'', text:[]});
    const [infoTextOpen, setInfoTextOpen] = useState(false)
    const [infoLocation, setInfoLocation] = useState({})
    const [infoClicked, setInfoClicked] = useState(null);
    const [triangleRef, setTriangleRef] = useState(null);

    const initialRender = useRef(true);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [completedCrop, setCompletedCrop] = useState({})
    const nodesRef = useRef({});

    const divRef = useRef(null);
    const columnRef = useRef(null);

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

    }, []);

    useEffect(() => {

        function setPreview() {

            if(window.innerWidth > 992) {
                setShowPreview(false);
                document.querySelector('body').classList.remove('fixed');
            }

        }

        window.addEventListener('resize', setPreview);

        return () => {
            window.removeEventListener('resize', setPreview);
        }

    },[])

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

    useEffect(() => {

        const firstRender = initialRender.current;

        if (!firstRender) {

            document.querySelector('.menu_wrap').style.background = courseData["header_color"];

        } else {
            initialRender.current = false;
        }


    }, [courseData["header_color"]]);

    useEffect(() => {

        const firstRender = initialRender.current;

        if (!firstRender) {

            document.querySelectorAll('.menu_wrap a .menu_icon').forEach((div) => {
                div.style.color = courseData["header_text_color"];
            })
            document.querySelector('.menu_top').style.borderColor = courseData["header_text_color"];
            document.querySelectorAll('.menu_top a span').forEach((div) => {
                div.style.background = courseData["header_text_color"];
            })

        } else {
            initialRender.current = false;
        }


    }, [courseData["header_text_color"]]);

    const handleMouseHover = (e) => {
        setHoverSection(e.target.id)
    }

    const landerUrl = window.location.protocol + "//" + window.location.host + "/" + username + "/course-page/" + courseData["slug"];
    const liveUrl = window.location.protocol + "//" + window.location.host + "/" + username + "/course/" + courseData["slug"];
    let videoCount = 0;
    let textCount = 0;

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

    return (
        <AuthenticatedLayout>
            <Head title="Course Creator"/>
            <ToolTipContextProvider value={{
                infoText,
                setInfoText,
                infoTextOpen,
                setInfoTextOpen,
                infoLocation,
                setInfoLocation,
                infoClicked,
                setInfoClicked,
                setTriangleRef,
                triangleRef,
            }}>
                <div className="container">
                    <h2 className="page_title">Course Creator</h2>
                    <section className="card edit_page creator course_creator">
                        <div id="links_page">
                            <div id="edit_course" className="my_row creator_wrap">
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
                                        />
                                    }

                                    {showPreviewButton &&
                                        <PreviewButton setShowPreview={setShowPreview}/>
                                    }

                                    <div className="left_column" ref={columnRef}>
                                        <h3 className="mb-4 card_title">Create Your Course</h3>
                                        <div className="content_wrap my_row creator" id="left_col_wrap">
                                            <section id="header_section"
                                                     className="my_row section_row"
                                                     onMouseEnter={(e) =>
                                                         handleMouseHover(e)
                                                    }>
                                                <div className="section_title">
                                                    <h4>Header</h4>
                                                </div>
                                                <div className="section_content my_row" ref={divRef}>
                                                    <InputComponent
                                                        placeholder="Course Title"
                                                        type="text"
                                                        maxChar={60}
                                                        hoverText="Submit Course Title"
                                                        elementName="title"
                                                        courseData={courseData}
                                                        dispatch={dispatch}
                                                        value={courseData["title"]}
                                                    />
                                                    <ImageComponent
                                                        ref={nodesRef}
                                                        completedCrop={completedCrop}
                                                        setCompletedCrop={setCompletedCrop}
                                                        setShowLoader={setShowLoader}
                                                        data={courseData}
                                                        dispatch={dispatch}
                                                        elementName="logo"
                                                        placeholder="Logo"
                                                        type="extPreview"
                                                        cropArray={{
                                                            unit: "%",
                                                            x: 25,
                                                            y: 25,
                                                            width: 50,
                                                            height: 50,
                                                        }}
                                                    />
                                                    <div className="picker_wrap">
                                                        <ColorPicker
                                                            label="Header Background Color"
                                                            courseData={courseData}
                                                            dispatch={dispatch}
                                                            elementName="header_color"
                                                        />
                                                        <ToolTipIcon section="course_header_color" />
                                                    </div>
                                                    <div className="picker_wrap">
                                                        <ColorPicker
                                                            label="Course Title Color"
                                                            courseData={courseData}
                                                            dispatch={dispatch}
                                                            elementName="header_text_color"
                                                        />
                                                        <ToolTipIcon section="course_header_text_color" />
                                                    </div>
                                                    <DropdownComponent
                                                        id={courseData["id"]}
                                                        dispatch={dispatch}
                                                        value={courseData["category"] || ""}
                                                        categories={categories}
                                                    />
                                                    {courseData["slug"] && offerData["published"] ?
                                                        <>
                                                            <div className="url_wrap mb-4">
                                                                <p>Landing Page:</p>
                                                                <a target="_blank" href={landerUrl}>View Course Landing Page</a>
                                                            </div>
                                                            <div className="url_wrap">
                                                                <p>Live Page:</p>
                                                                <a target="_blank" href={liveUrl}>View Live Course Page</a>
                                                            </div>
                                                        </>
                                                        :
                                                        ""
                                                    }
                                                </div>
                                            </section>
                                            <section id="intro_video_section"
                                                     className="my_row section_row"
                                                     onMouseEnter={(e) =>
                                                         setHoverSection(e.target.id)
                                                     }>
                                                <div className="section_title">
                                                    <h4>Intro Video</h4>
                                                </div>
                                                <div className="section_content my_row">
                                                    <InputComponent
                                                        placeholder="YouTube or Vimeo Link"
                                                        type="url"
                                                        hoverText="Add Embed Link"
                                                        elementName="intro_video"
                                                        value={courseData["intro_video"] || ""}
                                                        courseData={courseData}
                                                        dispatch={dispatch}
                                                    />
                                                </div>
                                            </section>
                                            <section id="intro_text_section"
                                                     className="my_row section_row"
                                                     onMouseEnter={(e) =>
                                                         setHoverSection(e.target.id)
                                                     }>
                                                <div className="section_title">
                                                    <h4>Intro Text</h4>
                                                </div>
                                                <div className="section_content my_row">
                                                    <InputComponent
                                                        placeholder="Intro Text"
                                                        type="wysiwyg"
                                                        hoverText="Submit Intro Text"
                                                        elementName="intro_text"
                                                        courseData={courseData}
                                                        dispatch={dispatch}
                                                        value={courseData["intro_text"]}
                                                        showTiny={showTiny}
                                                        setShowTiny={setShowTiny}
                                                    />
                                                    <ColorPicker
                                                        label="Background Color"
                                                        courseData={courseData}
                                                        dispatch={dispatch}
                                                        elementName="intro_background_color"
                                                    />
                                                </div>
                                            </section>

                                            {!isEmpty(sections) &&

                                                <DndContext
                                                    sensors={sensors}
                                                    collisionDetection={closestCenter}
                                                    onDragEnd={handleDragEnd}
                                                >
                                                    <section className="sections_wrap my_row mb-4">

                                                        <SortableContext
                                                            items={sections}
                                                            strategy={verticalListSortingStrategy} d
                                                        >
                                                            {sections.map((section, index) => {

                                                                {section.type === "video" ? ++videoCount : ++textCount}

                                                                return (

                                                                    <Section
                                                                        key={section.id}
                                                                        section={section}
                                                                        index={index}
                                                                        sections={sections}
                                                                        setSections={setSections}
                                                                        openIndex={openIndex}
                                                                        setOpenIndex={setOpenIndex}
                                                                        videoCount={videoCount}
                                                                        textCount={textCount}
                                                                        setHoverSection={setHoverSection}
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
                                                <AddSectionLink
                                                    sections={sections}
                                                    setSections={setSections}
                                                    courseID={courseData["id"]}
                                                    setOpenIndex={setOpenIndex}
                                                    type="text"
                                                />
                                                <AddSectionLink
                                                    sections={sections}
                                                    setSections={setSections}
                                                    courseID={courseData["id"]}
                                                    setOpenIndex={setOpenIndex}
                                                    type="video"
                                                />
                                            </div>

                                            <section className="my_row section_row">
                                                <div className="section_title">
                                                    <h4>Nitty Gritty</h4>
                                                </div>
                                                <div className="section_content my_row">
                                                    <ImageComponent
                                                        placeholder="Course Icon"
                                                        ref={nodesRef}
                                                        completedCrop={completedCrop}
                                                        setCompletedCrop={setCompletedCrop}
                                                        setShowLoader={setShowLoader}
                                                        elementName={`icon`}
                                                        dispatch={dispatchOfferData}
                                                        data={offerData}
                                                        type={"inlinePreview"}
                                                        cropArray={{
                                                            unit: '%',
                                                            width: 30,
                                                            aspect: 1
                                                        }}
                                                    />
                                                    <InputComponent
                                                        placeholder="$ Course price in USD"
                                                        type="currency"
                                                        hoverText="Submit Course Price"
                                                        elementName="price"
                                                        offerData={offerData}
                                                        dispatchOffer={dispatchOfferData}
                                                        value={offerData["price"]}
                                                    />
                                                    <SwitchOptions
                                                        dispatchOffer={dispatchOfferData}
                                                        offerData={offerData}
                                                    />
                                                </div>
                                            </section>

                                            {!offerData["published"] &&

                                                <PublishButton
                                                    offerData={offerData}
                                                    dispatchOffer={dispatchOfferData}
                                                    courseTitle={courseData["title"]}
                                                />
                                            }
                                        </div>
                                        <InfoText
                                            divRef={columnRef}
                                        />
                                    </div>

                                    <div className={`right_column links_col preview${showPreview ? " show" : ""}`}>
                                        <Preview
                                            sections={sections}
                                            courseData={courseData}
                                            setShowPreview={setShowPreview}
                                            url={landerUrl}
                                            hoverSection={hoverSection}
                                            nodesRef={nodesRef}
                                            completedCrop={completedCrop}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </ToolTipContextProvider>
        </AuthenticatedLayout>
    )
}

export default CourseCreator;
