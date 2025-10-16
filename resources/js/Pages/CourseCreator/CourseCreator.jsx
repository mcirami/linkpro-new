import React, {useState, useRef, useReducer, useEffect} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';

import {Loader} from '@/Utils/Loader';
import {Flash} from '@/Utils/Flash';
import InputComponent from '@/Components/CreatorComponents/InputComponent.jsx';
import ContentSelect from '@/Components/CreatorComponents/ContentSelect.jsx';
import ColorPicker from '@/Components/CreatorComponents/ColorPicker.jsx';
import PreviewButton from '@/Components/PreviewButton.jsx';
import ImageComponent from '@/Components/CreatorComponents/ImageComponent.jsx';
import {
    LP_ACTIONS,
    offerDataReducer,
    pageDataReducer
} from "@/Components/Reducers/CreatorReducers.jsx";
import Preview from './Components/Preview/Preview';
import EventBus from '@/Utils/Bus';
import SwitchOptions from './Components/SwitchOptions';
import PublishButton from './Components/PublishButton';
import Section from './Components/Section';
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
import {Head, usePage} from '@inertiajs/react';
import SliderComponent from '@/Components/CreatorComponents/SliderComponent.jsx';
import {MessageAlertPopup} from '@/Utils/Popups/MessageAlertPopup.jsx';
import PageHeader from "@/Components/PageHeader.jsx";
import LivePageButton from "@/Components/LivePageButton.jsx";
import PageTabs from "@/Components/PageTabs.jsx";
import PageNav from "@/Pages/Dashboard/Components/Page/PageNav.jsx";
import { updateImage as updateCourseImage } from "@/Services/CourseRequests.jsx";
import ImageUploader from "@/Pages/Dashboard/Components/Page/ImageUploader.jsx";

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
                    <PageHeader
                        heading="Course Creator"
                        description="Create your own course adding text, images, videos and files. Share your course with the world!"
                    />
                    <div className="view_live_link header mt-auto">
                        <LivePageButton
                            url={liveUrl}
                        />
                    </div>
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
                                        <div className="page_menu_row flex justify-between w-full">
                                            <div className="page_tabs w-1/2">
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
                                                        addNewLabel : "Add New Course",
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
                                                            type="text"
                                                            maxChar={60}
                                                            hoverText="Submit Course Title"
                                                            elementName="title"
                                                            data={courseData}
                                                            dispatch={dispatchCourseData}
                                                            value={courseData['title']}
                                                            saveTo="course"
                                                        />
                                                        <div className="section_title w-full flex justify-start gap-2 !mb-5">
                                                            <h4>Logo</h4>
                                                        </div>
                                                        <div className="flex flex-col !mb-5">
                                                            <ImageUploader
                                                                elementName="logo"
                                                                label="Logo"
                                                                cropSettings={{
                                                                    unit: '%',
                                                                    x: 25,
                                                                    y: 25,
                                                                    width: 50,
                                                                    height: 50,
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


                                                        {/*{courseData['slug'] &&
                                                        offerData['published'] ?
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
                                                            ''
                                                        }*/}
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
                                                        <div className="section_title">
                                                            <h4>Intro Video</h4>
                                                        </div>
                                                        <div className="section_content my_row">
                                                            <InputComponent
                                                                placeholder="YouTube or Vimeo Link"
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
                                                                data={courseData}
                                                                dispatch={dispatchCourseData}
                                                                value={courseData["intro_text"]}
                                                                showTiny={showTiny}
                                                                setShowTiny={setShowTiny}
                                                                saveTo="course"
                                                            />
                                                            <ColorPicker
                                                                label="Background Color"
                                                                data={courseData}
                                                                dispatch={dispatchCourseData}
                                                                elementName="intro_background_color"
                                                                saveTo="course"
                                                            />
                                                        </div>
                                                    </section>
                                                </>
                                            }

                                            {pageTab === "sections" &&
                                                sections.length > 0 &&

                                                <>

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

                                                    <section className="my_row section_row">
                                                        <div className="section_title">
                                                            <h4>Add Content</h4>
                                                        </div>
                                                        <ContentSelect
                                                            sections={sections}
                                                            setSections={setSections}
                                                            dataId={courseData['id']}
                                                            setOpenIndex={setOpenIndex}
                                                            saveTo="course"
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
                                                                },
                                                                {
                                                                    id: 3,
                                                                    type: "video",
                                                                    label: "Video Section"
                                                                },
                                                                {
                                                                    id: 4,
                                                                    type: "file",
                                                                    label: "File Section"
                                                                }
                                                            ]}
                                                        />
                                                    </section>
                                                    </>
                                            }
                                            {pageTab === "settings" &&
                                                <>
                                                <section className="my_row section_row">

                                                    <DropdownComponent
                                                        id={courseData['id']}
                                                        dispatch={dispatchCourseData}
                                                        value={courseData['category'] ||
                                                            ''}
                                                        categories={categories}
                                                    />
                                                    <div className="section_content my_row">
                                                        <ImageComponent
                                                            ref={nodesRef}
                                                            completedCrop={completedCrop}
                                                            setCompletedCrop={setCompletedCrop}
                                                            setShowLoader={setShowLoader}
                                                            elementName={`icon`}
                                                            dispatch={dispatchOfferData}
                                                            data={offerData}
                                                            previewType="inline"
                                                            saveTo="offer"
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
                                                            data={offerData}
                                                            dispatch={dispatchOfferData}
                                                            value={offerData["price"]}
                                                            saveTo="offer"
                                                        />
                                                        <SwitchOptions
                                                            dispatch={dispatchOfferData}
                                                            data={offerData}
                                                        />
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
