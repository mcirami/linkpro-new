import React, {useState, useRef, useReducer, useEffect} from 'react';

import {Loader} from '@/Utils/Loader';
import {Flash} from '@/Utils/Flash';
import InputComponent from '@/Components/CreatorComponents/InputComponent.jsx';
import ContentSelect from '@/Components/CreatorComponents/ContentSelect.jsx';
import ColorPicker from '@/Components/CreatorComponents/ColorPicker';
import {
    LP_ACTIONS,
    pageDataReducer
} from "@/Components/Reducers/CreatorReducers.jsx";
import Preview from './Components/Preview/Preview';
import EventBus from '@/Utils/Bus';
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
import {
    updateImage,
    updateSectionsPositions
} from "@/Services/LandingPageRequests";
import {Head} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {handleDragEndAction} from '@/Services/CreatorServices.jsx';
import SliderComponent
    from '@/Components/CreatorComponents/SliderComponent.jsx';
import PageHeader from "@/Components/PageHeader.jsx";
import LivePageButton from "@/Components/LivePageButton.jsx";
import ImageUploader from '@/Pages/Dashboard/Components/Page/ImageUploader.jsx';
import ClickToCopyUrl from "@/Components/CreatorComponents/ClickToCopyUrl.jsx";
import PageTabs from "@/Components/PageTabs.jsx";

function LPCreator({landingPageArray, courses, username}) {

    const [showTiny, setShowTiny]   = useState(false);
    const [openIndex, setOpenIndex] = useState([0]);
    const [hoverSection, setHoverSection] = useState(null);


    const [pageData, dispatchPageData] = useReducer(pageDataReducer, landingPageArray ?? {});
    const [sections, setSections] = useState(() =>
        Array.isArray(landingPageArray?.sections) ? landingPageArray.sections : []
    );

    console.log("landingPageArray", landingPageArray.sections);
    console.log("pageData", pageData["sections"]);

    const [showPreviewButton, setShowPreviewButton] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [completedCrop, setCompletedCrop] = useState({})
    const nodesRef = useRef({});

    const [imageSelected, setImageSelected] = useState(false);

    const [pageTab, setPageTab] = useState("header");

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

    useEffect(() => {
        setSections(Array.isArray(pageData?.sections) ? pageData.sections : []);
    }, [pageData?.sections]);

    const url = window.location.protocol + "//" + window.location.host + "/" + username;
    const livePage = url + "/" + (pageData?.slug ?? "");
    let textCount = 0;
    let imageCount = 0;


    return (
        <AuthenticatedLayout>
            <Head title="Landing Page Creator"/>
            <div className="container">

                <div className="pb-6 gap-3 flex justify-between align-bottom items-baseline mt-3 border-b border-gray-100">
                    <PageHeader
                        heading="Landing Page Creator"
                        description="Create your own landing page where you can display your courses and direct your traffic to purchase them."
                    />
                    <div className="view_live_link header mt-auto">
                        <LivePageButton
                            url={livePage}
                        />
                    </div>
                </div>
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
                                    <div className="page_menu_row flex justify-between w-full">
                                        <div className="page_tabs w-1/2">
                                            <PageTabs
                                                tabs={[
                                                    { value: "header", label: "Header"},
                                                    { value: "sections", label: "Sections"}
                                                ]}
                                                pageTab={pageTab}
                                                setPageTab={setPageTab}
                                            />
                                        </div>
                                    </div>
                                    {pageTab === "header" ?
                                        <div className="content_wrap my_row creator mb-10">
                                            <section id="header_section"
                                                     className="my_row section"
                                                     onMouseEnter={(e) =>
                                                         handleMouseEnter(e)
                                                     }>
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
                                                        saveTo="landingPage"
                                                    />
                                                </div>
                                                <div className="section_content my_row">
                                                    <div className="section_title w-full flex justify-start gap-2">
                                                        <h4>Logo</h4>
                                                    </div>
                                                    <div className="w-full mb-5 flex">
                                                        <ImageUploader
                                                            elementName="logo"
                                                            label="Logo"
                                                            cropSettings={{
                                                                unit: '%',
                                                                width: 60,
                                                                height: 30,
                                                                x: 25,
                                                                y: 25,
                                                            }}
                                                            ref={nodesRef}
                                                            setShowLoader={setShowLoader}
                                                            completedCrop={completedCrop}
                                                            setCompletedCrop={setCompletedCrop}
                                                            startCollapsed={pageData['logo']}
                                                            onImageSelect={setImageSelected}
                                                            onUpload={(response) => {
                                                                const packets = {
                                                                    'logo': response.key,
                                                                    ext: response.extension,
                                                                };
                                                                updateImage(packets, pageData['id'])
                                                                .then((response) => {
                                                                    if (response.success) {
                                                                        dispatchPageData({
                                                                            type: LP_ACTIONS.UPDATE_PAGE_DATA,
                                                                            payload: {
                                                                                value: response.imagePath,
                                                                                name: "logo",
                                                                            },
                                                                        });
                                                                        const activeSection = "form.logo";
                                                                        document.querySelector(activeSection + " .bottom_section")
                                                                        .classList.add("hidden");
                                                                        setTimeout(function () {
                                                                            document.querySelector(activeSection).scrollIntoView({
                                                                                behavior: "smooth",
                                                                                block: "center",
                                                                                inline: "nearest",
                                                                            });
                                                                        }, 800);
                                                                    }
                                                                });
                                                            }}

                                                        />
                                                    </div>

                                                    <InputComponent
                                                        placeholder="Slogan (optional)"
                                                        type="text"
                                                        maxChar={30}
                                                        hoverText="Submit Slogan Text"
                                                        elementName="slogan"
                                                        data={pageData}
                                                        dispatch={dispatchPageData}
                                                        value={pageData['slogan']}
                                                        saveTo="landingPage"
                                                    />

                                                    <div className="section_title w-full flex justify-start gap-2">
                                                        <h4>Header Image</h4>
                                                    </div>
                                                    <div className="w-full mb-5 flex">
                                                        <ImageUploader
                                                            elementName="hero"
                                                            label="Header Image"
                                                            cropSettings={{
                                                                unit: '%',
                                                                width: 30,
                                                                x: 25,
                                                                y: 25,
                                                                aspect: 16 / 8,
                                                            }}
                                                            ref={nodesRef}
                                                            setShowLoader={setShowLoader}
                                                            completedCrop={completedCrop}
                                                            setCompletedCrop={setCompletedCrop}
                                                            startCollapsed={pageData['hero']}
                                                            onImageSelect={setImageSelected}
                                                            onUpload={(response) => {
                                                                const packets = {
                                                                    'hero': response.key,
                                                                    ext: response.extension,
                                                                };
                                                                updateImage(packets, pageData['id'])
                                                                .then((response) => {
                                                                    if (response.success) {
                                                                        dispatchPageData({
                                                                            type: LP_ACTIONS.UPDATE_PAGE_DATA,
                                                                            payload: {
                                                                                value: response.imagePath,
                                                                                name: "hero",
                                                                            },
                                                                        });
                                                                        const activeSection = "form.hero";
                                                                        document.querySelector(activeSection + " .bottom_section")
                                                                        .classList.add("hidden");
                                                                        setTimeout(function () {
                                                                            document.querySelector(activeSection).scrollIntoView({
                                                                                behavior: "smooth",
                                                                                block: "center",
                                                                                inline: "nearest",
                                                                            });
                                                                        }, 800);
                                                                    }
                                                                });
                                                            }}

                                                        />
                                                    </div>
                                                    <div className="mb-5 w-full">
                                                       <div className="section_title w-full flex justify-start gap-2">
                                                           <h4>Colors</h4>
                                                       </div>
                                                       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                                                           <ColorPicker
                                                               label="Text"
                                                               data={pageData}
                                                               dispatch={dispatchPageData}
                                                               elementName="header_text_color"
                                                           />
                                                           <ColorPicker
                                                               label="Background"
                                                               data={pageData}
                                                               dispatch={dispatchPageData}
                                                               elementName="header_color"
                                                           />
                                                       </div>
                                                    </div>
                                                    <div className="mb-7 w-full">
                                                        <div className="section_title w-full">
                                                            <h4>Font Size</h4>
                                                        </div>
                                                        <SliderComponent
                                                            id={pageData["id"]}
                                                            dispatch={dispatchPageData}
                                                            value={pageData["header_font_size"]}
                                                            elementName="header_font_size"
                                                            sliderValues={{
                                                                step: .1,
                                                                min: .1,
                                                                max: 5,
                                                                unit: "rem",
                                                            }}
                                                            saveTo="landingPage"
                                                        />
                                                    </div>

                                                    <div className="w-full">
                                                        <div className="section_title w-full">
                                                            <h4>Landing Page URL</h4>
                                                        </div>
                                                        {pageData['slug'] &&
                                                            <ClickToCopyUrl
                                                                url={livePage}
                                                            />
                                                        }
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    :
                                    <div className="content_wrap my_row creator">
                                        <section className="my_row">
                                            {sections.length > 0 &&

                                                <DndContext
                                                    sensors={sensors}
                                                    collisionDetection={closestCenter}
                                                    onDragEnd={event =>
                                                        handleDragEndAction(
                                                            event,
                                                            setSections,
                                                            updateSectionsPositions,
                                                            setShowTiny)}
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
                                        </section>

                                        <section className="my_row section_row !shadow-none !p-0 mt-5">
                                            <div className="section_title">
                                                <h4>Add Content</h4>
                                            </div>
                                            <ContentSelect
                                                sections={sections}
                                                setSections={setSections}
                                                dataId={pageData['id']}
                                                setOpenIndex={setOpenIndex}
                                                saveTo="landingPage"
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
                                    }
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
