import React, {useState, useRef, useReducer, useEffect} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';

import {Loader} from '@/Utils/Loader';
import {Flash} from '@/Utils/Flash';
import InputComponent from '@/Components/CreatorComponents/InputComponent.jsx';
import ContentSelectButtons from '@/Components/ContentSelectButtons.jsx';
import ColorPicker from '@/Components/CreatorComponents/ColorPicker.jsx';
import PreviewButton from '@/Components/PreviewButton.jsx';
import {
    LP_ACTIONS,
    OFFER_ACTIONS,
    offerDataReducer,
    pageDataReducer
} from "@/Components/Reducers/CreatorReducers.jsx";
import Preview from './Components/Preview/Preview';
import EventBus from '@/Utils/Bus';
import PublishButton from './Components/PublishButton';
import Section from './Components/Section';
import {addSection} from '@/Services/CourseRequests.jsx';
import DropdownComponent from './Components/DropdownComponent';
import {previewButtonRequest} from '@/Services/PageRequests';
import { ToolTipContextProvider } from '@/Utils/ToolTips/ToolTipContext';
import InfoText from '@/Utils/ToolTips/InfoText';
import ToolTipIcon from '@/Utils/ToolTips/ToolTipIcon';
import {handleDragEndAction} from '@/Services/CreatorServices.jsx';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    updateSectionsPositions,
} from '../../Services/CourseRequests';
import { Head, Link, usePage } from "@inertiajs/react";
import SliderComponent from '@/Components/CreatorComponents/SliderComponent.jsx';
import {MessageAlertPopup} from '@/Utils/Popups/MessageAlertPopup.jsx';
import PageHeader from "@/Components/PageHeader.jsx";
import LivePageButton from "@/Components/LivePageButton.jsx";
import PageTabs from "@/Components/PageTabs.jsx";
import PageNav from "@/Pages/Dashboard/Components/Page/PageNav.jsx";
import { updateImage as updateCourseImage } from "@/Services/CourseRequests.jsx";
import ImageUploader from "@/Pages/Dashboard/Components/Page/ImageUploader.jsx";
import { ImageUploader as InlineImageUploader } from '@/Components/ImageUploader.jsx';
import { updateIcon, updateOfferData } from "@/Services/OfferRequests.jsx";
import IOSSwitch from "@/Utils/IOSSwitch.jsx";
import { BiNotepad, BiImage, BiVideo, BiFolderOpen } from "react-icons/bi";
import { IoChevronForwardOutline } from "react-icons/io5";

function CourseCreator({
                           courseArray,
                           offerArray,
                           categories,
                           userCourses
}) {

    const { auth } = usePage().props;
    const username = auth.user.userInfo.username;

    const [showTiny, setShowTiny]   = useState(false);
    const [openIndex, setOpenIndex] = useState([0]);
    const [hoverSection, setHoverSection] = useState(null);

    const [offerData, dispatchOfferData] = useReducer(offerDataReducer, offerArray);
    const [courseData, dispatchCourseData] = useReducer(pageDataReducer, courseArray);
    const [sections, setSections] = useState(courseArray["sections"]);
    const [showPreviewButton, setShowPreviewButton] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [pageTab, setPageTab] = useState("header");

    const [infoText, setInfoText] = useState({section:'', text:[]});
    const [infoTextOpen, setInfoTextOpen] = useState(false)
    const [infoLocation, setInfoLocation] = useState({})
    const [infoClicked, setInfoClicked] = useState(null);
    const [triangleRef, setTriangleRef] = useState(null);

    const [completedCrop, setCompletedCrop] = useState({})
    const nodesRef = useRef({});
    const divRef = useRef(null);
    const columnRef = useRef(null);

    const [showMessageAlertPopup, setShowMessageAlertPopup] = useState({
        show: false,
        text: "",
        url: null,
        buttonText: ""
    });

    const [showLoader, setShowLoader] = useState({
        show: false,
        icon: "",
        position: "",
        progress: null
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
        previewButtonRequest(setShowPreviewButton, setShowPreview);
    }, [])

    useEffect(() => {

        function setPreviewButton() {
            previewButtonRequest(setShowPreviewButton, setShowPreview);
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

    const handleMouseHover = (e) => {
        setHoverSection(e.target.id)
    }

    const landerUrl = window.location.protocol + "//" + window.location.host + "/" + username + "/course-page/" + courseData["slug"];
    const liveUrl = window.location.protocol + "//" + window.location.host + "/" + username + "/course/" + courseData["slug"];
    let videoCount = 0;
    let textCount = 0;
    let imageCount = 0;
    let fileCount = 0;

    return (
        <AuthenticatedLayout>
            <Head title="Course Creator"/>
            <div className="container">
                <div className="pb-6 gap-3 flex justify-between align-bottom items-baseline mt-3 border-b border-gray-100">
                    <div className="flex flex-col w-3/4">
                        <PageHeader
                            heading="Course Creator"
                            description="Create your own course adding text, images, videos and files. Share your course with the world!"
                        />
                    </div>
                    <div className="view_live_link header max-w-[15rem] w-1/4 mt-auto">
                        <LivePageButton
                            url={liveUrl}
                        />
                    </div>
                </div>
                <div className="flex justify-start items-center gap-2 py-5 w-full">
                    <Link
                        href={route('creator.center')}
                        className="text-xs font-medium tracking-wide text-slate-800 transition  hover:text-indigo-500"
                    >
                        Creator Center
                    </Link>
                    <IoChevronForwardOutline className="h-3 w-3 text-slate-900" />
                    <h4 className="text-xs tracking-wide text-slate-800">Course: <span className="font-medium">{courseData["title"] || "(no title)"}</span></h4>
                </div>

            </div>
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
                {showMessageAlertPopup.show &&
                    <MessageAlertPopup
                        showMessageAlertPopup={showMessageAlertPopup}
                        setShowMessageAlertPopup={setShowMessageAlertPopup}
                    />
                }
                <div className="container">
                    <section className="mt-5 edit_page creator course_creator">
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
                                        <div className="page_menu_row flex justify-between w-full">
                                            <div className="page_tabs w-full">
                                                <PageTabs
                                                    tabs={[
                                                        { value: "header", label: "Header"},
                                                        { value: "intro", label: "Intro"},
                                                        { value: "sections", label: "Sections"},
                                                        { value: "settings", label: "Settings"}
                                                    ]}
                                                    pageTab={pageTab}
                                                    setPageTab={setPageTab}
                                                />
                                            </div>
                                            <div>
                                                <PageNav
                                                    allUserPages={userCourses}
                                                    settings={{
                                                        type : "course",
                                                        addNewLabel : "New Course",
                                                        linkLabel : "title",
                                                        urlPrefix: '/creator-center/course/'
                                                    }}
                                                    handleClick={() => {
                                                        window.location.href = '/creator-center/add-course/';
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="content_wrap my_row creator" id="left_col_wrap">
                                            {pageTab === "header" &&
                                                <>
                                                <section id="header_section"
                                                         className="my_row section_row"
                                                         onMouseEnter={(e) =>
                                                             handleMouseHover(e)
                                                        }>
                                                    <div className="section_content my_row" ref={divRef}>
                                                        <InputComponent
                                                            placeholder="Course Title"
                                                            label="Title"
                                                            type="text"
                                                            maxChar={60}
                                                            hoverText="Submit Course Title"
                                                            elementName="title"
                                                            data={courseData}
                                                            dispatch={dispatchCourseData}
                                                            value={courseData['title']}
                                                            saveTo="course"
                                                        />
                                                        <div className="flex flex-col !mb-5">
                                                            <ImageUploader
                                                                elementName="logo"
                                                                label="Logo"
                                                                cropSettings={{
                                                                    unit: '%',
                                                                    x: 25,
                                                                    y: 25,
                                                                    width: 75,
                                                                    height: 20,
                                                                }}
                                                                ref={nodesRef}
                                                                setShowLoader={setShowLoader}
                                                                completedCrop={completedCrop}
                                                                setCompletedCrop={setCompletedCrop}
                                                                startCollapsed={courseData['logo']}
                                                                onUpload={(response) => {
                                                                    const packets = {
                                                                        'logo': response.key,
                                                                        ext: response.extension,
                                                                    };
                                                                    updateCourseImage(packets, courseData['id'])
                                                                    .then((response) => {
                                                                        if (response.success) {
                                                                            dispatchCourseData({
                                                                                type: LP_ACTIONS.UPDATE_PAGE_DATA,
                                                                                payload: {
                                                                                    value: response.imagePath,
                                                                                    name: "logo",
                                                                                },
                                                                            });
                                                                        }
                                                                    });
                                                                }}

                                                            />
                                                        </div>
                                                        <div className="section_title w-full flex justify-start gap-2 !mb-5">
                                                            <h4>Font Size</h4>
                                                        </div>
                                                        <div className="mb-5 w-full border-b border-gray-100">
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 !mb-8">
                                                                <SliderComponent
                                                                    label="Title Font Size"
                                                                    id={courseData['id']}
                                                                    dispatch={dispatchCourseData}
                                                                    value={courseData['header_font_size']}
                                                                    elementName="header_font_size"
                                                                    sliderValues={{
                                                                        step: .1,
                                                                        min: .1,
                                                                        max: 5,
                                                                        unit: 'rem',
                                                                    }}
                                                                    saveTo="course"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="section_title w-full flex justify-start gap-2">
                                                            <h4>Colors</h4>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                                                            <ColorPicker
                                                                label="Title"
                                                                data={courseData}
                                                                dispatch={dispatchCourseData}
                                                                elementName="header_text_color"
                                                                saveTo="course"
                                                            />
                                                           {/* <ToolTipIcon section="course_header_text_color"/>*/}
                                                            <ColorPicker
                                                                label="Background"
                                                                data={courseData}
                                                                dispatch={dispatchCourseData}
                                                                elementName="header_color"
                                                                saveTo="course"
                                                            />
                                                           {/* <ToolTipIcon section="course_header_color"/>*/}
                                                        </div>
                                                    </div>
                                                </section>
                                                </>
                                                }
                                                {pageTab === "intro" &&
                                                    <>
                                                    <section id="intro_video_section"
                                                             className="my_row section_row"
                                                             onMouseEnter={(e) =>
                                                                 setHoverSection(
                                                                     e.target.id)
                                                             }>
                                                        <div className="section_content my_row">
                                                            <InputComponent
                                                                placeholder="YouTube or Vimeo Link"
                                                                label="YouTube or Vimeo URL"
                                                                type="url"
                                                                hoverText="Add Embed Link"
                                                                elementName="intro_video"
                                                                value={courseData['intro_video'] ||
                                                                    ''}
                                                                data={courseData}
                                                                dispatch={dispatchCourseData}
                                                                saveTo="course"
                                                            />
                                                        </div>
                                                    </section>
                                                    <section
                                                        id="intro_text_section"
                                                        className="my_row section_row"
                                                        onMouseEnter={(e) =>
                                                            setHoverSection(e.target.id)
                                                    }>
                                                        <div className="section_content my_row">
                                                            <InputComponent
                                                                placeholder="Intro Text"
                                                                label="Text"
                                                                type="wysiwyg"
                                                                hoverText="Submit Intro Text"
                                                                elementName="intro_text"
                                                                data={courseData}
                                                                dispatch={dispatchCourseData}
                                                                value={courseData["intro_text"]}
                                                                showTiny={showTiny}
                                                                setShowTiny={setShowTiny}
                                                                saveTo="course"
                                                            />
                                                            <div className="section_title">
                                                                <h4>Color</h4>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                                                <ColorPicker
                                                                    label="Background"
                                                                    data={courseData}
                                                                    dispatch={dispatchCourseData}
                                                                    elementName="intro_background_color"
                                                                    saveTo="course"
                                                                />
                                                            </div>
                                                        </div>
                                                    </section>
                                                </>
                                            }

                                            {pageTab === "sections" &&
                                                <>
                                                    <section className="my_row section_row mb-10">
                                                        <h2 className="text-xl font-bold text-gray-900 mb-2">Add Section</h2>
                                                        <p className="text-gray-500 mb-6">Choose the type of section you want to add to your course.</p>
                                                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                                                            <ContentSelectButtons
                                                                handleClick={(sectionType) => {
                                                                    const packets = {
                                                                        type: sectionType
                                                                    }
                                                                    addSection(packets, courseData['id'])
                                                                    .then((response) => {
                                                                        if (response.success) {
                                                                            setSections([
                                                                                ...sections,
                                                                                response.section
                                                                            ])
                                                                            const newIndex = sections.length;
                                                                            setOpenIndex(prev => ([
                                                                                ...prev,
                                                                                newIndex
                                                                            ]))
                                                                            setTimeout(function() {
                                                                                document.querySelector(
                                                                                    '.sections_wrap .section_row:last-child').
                                                                                    scrollIntoView({
                                                                                        behavior: 'smooth',
                                                                                        block: "start",
                                                                                        inline: "nearest"
                                                                                    });

                                                                            }, 800)
                                                                        }
                                                                    })
                                                                }}
                                                                options={[
                                                                    {
                                                                        key: 'text',
                                                                        icon: <BiNotepad className="h-4 w-4 text-[#424fcf]"/>,
                                                                        title: 'Text',
                                                                        description: 'Add formatted text, descriptions, or instructions for your students.'
                                                                    },
                                                                    {
                                                                        key: 'image',
                                                                        icon: <BiImage className="h-4 w-4 text-[#424fcf]"/>,
                                                                        title: 'Image',
                                                                        description: 'Upload a photo, diagram, or chart to visually support your content.'
                                                                    },
                                                                    {
                                                                        key: 'video',
                                                                        icon: <BiVideo className="h-4 w-4 text-[#424fcf]"/>,
                                                                        title: 'Video',
                                                                        description: 'Embed a video lesson directly into your course.'
                                                                    },
                                                                    {
                                                                        key: 'file',
                                                                        icon: <BiFolderOpen className="h-4 w-4 text-[#424fcf]"/>,
                                                                        title: 'File',
                                                                        description: 'Attach a downloadable file such as a PDF, ZIP, or worksheet.'
                                                                    },
                                                                ]}
                                                            />
                                                        </div>
                                                    </section>

                                                    <DndContext
                                                        sensors={sensors}
                                                        collisionDetection={closestCenter}
                                                        onDragEnd={event =>
                                                            handleDragEndAction(
                                                                event,
                                                                setSections,
                                                                updateSectionsPositions,
                                                                setShowTiny)
                                                    }>
                                                        <section className="sections_wrap my_row mb-4">

                                                            <SortableContext
                                                                items={sections}
                                                                strategy={verticalListSortingStrategy} d
                                                            >
                                                                {sections.map((section, index) => {

                                                                    {section.type === "video" ?
                                                                        ++videoCount :
                                                                        section.type === "image" ?
                                                                            ++imageCount :
                                                                            section.type === "file" ?
                                                                                ++fileCount :
                                                                                ++textCount
                                                                    }

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
                                                                            imageCount={imageCount}
                                                                            fileCount={fileCount}
                                                                            setHoverSection={setHoverSection}
                                                                            showTiny={showTiny}
                                                                            setShowTiny={setShowTiny}
                                                                            completedCrop={completedCrop}
                                                                            setCompletedCrop={setCompletedCrop}
                                                                            nodesRef={nodesRef}
                                                                            setShowLoader={setShowLoader}
                                                                        />

                                                                    )
                                                                })}
                                                            </SortableContext>

                                                        </section>
                                                    </DndContext>
                                                    </>
                                            }
                                            {pageTab === "settings" &&
                                                <>
                                                <section className="my_row section_row">
                                                    <div className="section_title !mb-5">
                                                        <h4>Category</h4>
                                                    </div>
                                                    <DropdownComponent
                                                        id={courseData['id']}
                                                        dispatch={dispatchCourseData}
                                                        value={courseData['category'] ||
                                                            ''}
                                                        categories={categories}
                                                    />
                                                    <div className="section_content my_row mt-3">
                                                        <div className="section_title !mb-5">
                                                            <div className="flex justify-start gap-2">
                                                                <h4>Icon</h4>
                                                                <ToolTipIcon section="offer_icon"/>
                                                            </div>
                                                            {offerData['icon'] &&
                                                                <img className='!w-10 !h-10 rounded-lg' src={offerData['icon']} alt="" />
                                                            }
                                                        </div>
                                                        <InlineImageUploader
                                                            elementName="icon"
                                                            label="Icon"
                                                            cropSettings={{
                                                                unit: '%',
                                                                width: 30,
                                                            }}
                                                            aspect={1}
                                                            setShowLoader={setShowLoader}
                                                            startCollapsed={offerData['icon']}
                                                            onUpload={(response) => {
                                                                const packets = {
                                                                    'icon': response.key,
                                                                    ext: response.extension,
                                                                };
                                                                updateIcon(packets, courseData['id'])
                                                                .then((response) => {
                                                                    if (response.success) {
                                                                        dispatchOfferData({
                                                                            type: OFFER_ACTIONS.UPDATE_OFFER_DATA,
                                                                            payload: {
                                                                                value: response.imagePath,
                                                                                name: "icon",
                                                                            },
                                                                        });
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                        <div className="mb-3 w-full flex flex-col">
                                                            <InputComponent
                                                                placeholder="$ Course price in USD"
                                                                label="Price"
                                                                type="currency"
                                                                hoverText="Submit Course Price"
                                                                elementName="price"
                                                                data={offerData}
                                                                dispatch={dispatchOfferData}
                                                                value={offerData["price"]}
                                                                saveTo="offer"
                                                            />
                                                        </div>
                                                        <div className="mb-5 pb-5 border-b border-gray-100 flex">
                                                            <div className="flex justify-start w-full gap-2 items-center">
                                                                <div className={`switch_wrap flex justify-end items-center`}>
                                                                    <IOSSwitch
                                                                        onChange={() => {
                                                                            const packets = {
                                                                                public: !offerData['public'],
                                                                            };
                                                                            updateOfferData(packets, offerData["id"]).then((response) => {
                                                                                if(response.success) {
                                                                                    dispatchOfferData({
                                                                                        type: OFFER_ACTIONS.UPDATE_OFFER_DATA,
                                                                                        payload: {
                                                                                            value: !offerData['public'],
                                                                                            name: "public"
                                                                                        }
                                                                                    })
                                                                                }
                                                                            });
                                                                        }}
                                                                        checked={Boolean(offerData['public'])}
                                                                        disabled={!Boolean(offerData["published"])}
                                                                    />
                                                                </div>
                                                                <div className="section_title !mb-0 flex !justify-start gap-2">
                                                                    <h4>Public</h4>
                                                                    <ToolTipIcon section="public_course" />
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-end w-full gap-2 items-center">
                                                                <div className="section_title !mb-0 flex !justify-start gap-2">
                                                                    <h4>Active</h4>
                                                                    <ToolTipIcon section="active_course" />
                                                                </div>
                                                                <div className={`switch_wrap flex justify-end items-center`}>
                                                                    <IOSSwitch
                                                                        onChange={() => {
                                                                            const packets = {
                                                                                active: !offerData['active'],
                                                                            };
                                                                            updateOfferData(packets, offerData["id"]).then((response) => {
                                                                                if(response.success) {
                                                                                    dispatchOfferData({
                                                                                        type: OFFER_ACTIONS.UPDATE_OFFER_DATA,
                                                                                        payload: {
                                                                                            value: !offerData['active'],
                                                                                            name: "active"
                                                                                        }
                                                                                    })
                                                                                }
                                                                            });
                                                                        }}
                                                                        checked={Boolean(offerData['active'])}
                                                                        disabled={!Boolean(offerData["published"])}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Legend */}
                                                        <section className="mb-10 rounded-2xl bg-white/60 p-4 shadow-md">
                                                            <dl className="grid gap-4 sm:grid-cols-2">
                                                                {/* PRP */}
                                                                <div className="flex items-start gap-3">
                                                                    <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-indigo-50 px-2 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
                                                                        PRP
                                                                    </span>
                                                                    <div className="min-w-0">
                                                                        <dt className="text-sm font-medium text-gray-900">Personal Referral Payout</dt>
                                                                        <dd className="text-sm text-gray-600">
                                                                            Your payout will be <span className="font-semibold">80%</span> of the price you set when you personally refer someone to your course.
                                                                        </dd>
                                                                    </div>
                                                                </div>

                                                                {/* ARP */}
                                                                <div className="flex items-start gap-3">
                                                                    <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-indigo-50 px-2 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
                                                                        ARP
                                                                    </span>
                                                                    <div className="min-w-0">
                                                                        <dt className="text-sm font-medium text-gray-900">Affiliate Referral Payout</dt>
                                                                        <dd className="text-sm text-gray-600">
                                                                            Your payout will be <span className="font-semibold">40%</span> of the price you set when someone
                                                                            adds your course to their LinkPro page.
                                                                        </dd>
                                                                    </div>
                                                                </div>

                                                                {/* PRP */}
                                                                <div className="flex items-start gap-3">
                                                                    <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-green-50 px-2 text-xs font-semibold text-green-700 ring-1 ring-green-200">
                                                                        Payout
                                                                    </span>
                                                                    <div className="min-w-0">
                                                                        <dt className="text-sm font-medium text-gray-900">PRP Calculations</dt>
                                                                        <dd className="text-sm text-gray-600">
                                                                            ${offerData['price']} * 80% = <span className="font-semibold">${ (Math.round( (offerData['price'] * .80) * 100) / 100).toFixed(2) }</span>
                                                                        </dd>
                                                                    </div>
                                                                </div>
                                                                {/* ARP */}
                                                                <div className="flex items-start gap-3">
                                                                    <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-green-50 px-2 text-xs font-semibold text-green-700 ring-1 ring-green-200">
                                                                        Payout
                                                                    </span>
                                                                    <div className="min-w-0">
                                                                        <dt className="text-sm font-medium text-gray-900">ARP Calculations</dt>
                                                                        <dd className="text-sm text-gray-600">
                                                                            ${offerData['price']} * 40% = <span className="font-semibold">${ (Math.round( (offerData['price']  * .40) * 100) / 100).toFixed(2) }</span>
                                                                        </dd>
                                                                    </div>
                                                                </div>
                                                            </dl>
                                                        </section>
                                                    </div>
                                                </section>

                                                {!offerData["published"] &&

                                                    <PublishButton
                                                        data={offerData}
                                                        dispatch={dispatchOfferData}
                                                        courseTitle={courseData["title"]}
                                                    />
                                                }

                                                </>
                                            }

                                        </div>
                                        <InfoText
                                            divRef={columnRef}
                                        />
                                    </div>

                                    <div className={`right_column links_col preview${showPreview ? " show" : ""}`}>
                                        <Preview
                                            sections={sections}
                                            data={courseData}
                                            setShowPreview={setShowPreview}
                                            url={landerUrl}
                                            hoverSection={hoverSection}
                                            nodesRef={nodesRef}
                                            completedCrop={completedCrop}
                                            setShowMessageAlertPopup={setShowMessageAlertPopup}
                                            liveUrl={liveUrl}
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
