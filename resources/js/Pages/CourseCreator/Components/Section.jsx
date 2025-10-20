import React, {useEffect, useState} from 'react';
import DeleteSection from '@/Components/CreatorComponents/DeleteSection.jsx';
import {MdDragHandle, MdKeyboardArrowDown} from 'react-icons/md';
import InputComponent from '@/Components/CreatorComponents/InputComponent.jsx';
import ColorPicker from '@/Components/CreatorComponents/ColorPicker.jsx';
import ImageUploader from '@/Pages/Dashboard/Components/Page/ImageUploader.jsx';
import SectionButtonOptions from '@/Components/CreatorComponents/SectionButtonOptions.jsx';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import FileComponent
    from '@/Pages/CourseCreator/Components/FileComponent.jsx';
import {getFileParts} from '@/Services/FileService.jsx';
import {updateSectionData, updateSectionImage as updateCourseSectionImage} from '@/Services/CourseRequests.jsx';
import IOSSwitch from '@/Utils/IOSSwitch';
import ToolTipIcon from '@/Utils/ToolTips/ToolTipIcon';
import SliderComponent
    from '@/Components/CreatorComponents/SliderComponent.jsx';
import isJSON from 'validator/es/lib/isJSON.js';
import {convertText} from '@/Services/CreatorServices.jsx';
import SelectorComponent from "@/Components/SelectorComponent.jsx";
const Section = ({
                     section,
                     index,
                     sections,
                     setSections,
                     openIndex,
                     setOpenIndex,
                     videoCount,
                     textCount,
                     imageCount,
                     fileCount,
                     setHoverSection,
                     completedCrop,
                     setCompletedCrop,
                     nodesRef,
                     setShowLoader
}) => {

    const [lockVideo, setLockVideo] = useState(true);
    const [showTiny, setShowTiny]   = useState(false);
    const [pageTab, setPageTab] = useState("content");
    const [sectionTabs, setSectionTabs] = useState([
        {
            value: "content",
            label: "Content",
        },
        {
            value: "button",
            label: "Button",
        }
    ]);

    const {
        id,
        type,
        text,
        video_title,
        title_size,
        video_link,
        lock_video,
    } = section;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: section.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    useEffect(() => {
        setLockVideo(lock_video !== null ? lock_video : true)
    },[])

    useEffect(() => {
        setSectionTabs(type === 'video' ?
            [
                {
                    value: "content",
                    label: "Content",
                },
                {
                    value: "video",
                    label: "Video",
                }
            ]
        :
            [
                {
                    value: "content",
                    label: "Content",
                },
                {
                    value: "button",
                    label: "Button",
                }
            ]
        );

    },[type])

    const handleSectionOpen = (rowIndex) => {
        if(openIndex.includes(rowIndex)) {
            const newArrayIndex = openIndex.filter(element => element !== rowIndex)
            setOpenIndex(newArrayIndex)
        } else {
            const newArrayIndex = openIndex.concat(rowIndex);
            setOpenIndex(newArrayIndex);
        }
    }

    const handleChange = () => {
        const newLockVideoValue = !lockVideo;
        setLockVideo(newLockVideoValue);

        const packets = {
            lock_video: newLockVideoValue,
        };

        updateSectionData(packets, section.id)
        .then((response) => {
            if(response.success) {
                setSections(
                    sections.map((section) => {
                        if(section.id === id) {
                            section.lock_video = newLockVideoValue;
                        }
                        return section;
                    })
                )
            }
        });
    }
    const handleMouseDown = () => {
        setOpenIndex([])
    }

    const getSectionTitle = () => {
        switch(type) {
            case 'video':
                const ellipsis = section.video_title?.length > 20 ? "..." : ""
                return (
                    section.video_title ?
                        section.video_title.slice(0, 20) + ellipsis :
                        type  + " " + videoCount
                )
            case 'text':
                const regex = /(<([^>]+)>)/gi;
                let parsedText = "";
                if (section.text && isJSON(section.text)) {
                    const convertedText = convertText(section.text);
                    parsedText = convertedText.text;
                    const result = parsedText.replace(regex, "");
                    parsedText = result.length > 20 ?
                        result.slice(0, 20) + '...' :
                        result;
                } else if (section.text) {
                    const result = section.text.replace(regex, "");
                    parsedText = result.length > 20 ?
                        result.slice(0,20) + "..." :
                        result;

                } else {
                    parsedText = type + ' ' + textCount;
                }

                return parsedText;
            case 'image' :
                return (
                    section.image ?
                        <img className="input_image" src={section.image} alt=""/>
                        :
                        type  + " " + imageCount
                )
            case 'file' :
                let content = "";
                if(section.file) {
                    const fileNameObj = getFileParts(section.file)
                    content = fileNameObj.name + "." + fileNameObj.type
                    content = content.length > 20 ?
                        content.slice(0, 20) + '...' :
                        content;
                } else {
                    content = type  + " " + fileCount
                }

                return (
                    content
                )
        }
    }

    const handleOnClick = (e,value) => {
        e.preventDefault();
        setPageTab(value);
    }

    return (
        <div ref={setNodeRef}
             id={`section_${index + 1}`}
             style={style}
             className="section_row shadow-md"
             onMouseEnter={(e) =>
                 setHoverSection(e.target.id)
        }>
            <div className="section_title"
                 onClick={(e) => handleSectionOpen(index)}
            >
                <div className="drag_handle creator_section"
                     onMouseDown={handleMouseDown}
                     {...attributes}
                     {...listeners}
                >
                    <MdDragHandle/>
                </div>
                <div className="title_column">
                    <h4>
                        {getSectionTitle()}
                    </h4>
                </div>
                <div className={`icon_wrap ${openIndex.includes(index) ? "open" : ""}`}>
                    <MdKeyboardArrowDown />
                </div>
            </div>
            <div className={`section_content my_row ${openIndex.includes(index) ? "open" : ""}`}>
                <div className="w-full mb-5">
                    <SelectorComponent
                        value={pageTab}
                        onChange={setPageTab}
                        commit={handleOnClick}
                        options={sectionTabs}
                    />
                </div>
                {(() => {
                    switch (type) {
                        case 'text':
                           return (
                               <>
                                   {pageTab === "content" &&
                                       <>
                                           <InputComponent
                                                placeholder="Add Text"
                                                label="Text"
                                                type="wysiwyg"
                                                hoverText="Add Text to Section"
                                                elementName={`text`}
                                                value={text}
                                                currentSection={section}
                                                sections={sections}
                                                setSections={setSections}
                                                showTiny={showTiny}
                                                setShowTiny={setShowTiny}
                                                saveTo="course"
                                           />
                                           <div className="section_title w-full !mb-5">
                                               <h4>Color</h4>
                                           </div>
                                           <div className="w-1/3">
                                                <ColorPicker
                                                    label="Background"
                                                    currentSection={section}
                                                    sections={sections}
                                                    setSections={setSections}
                                                    elementName={`background_color`}
                                                    saveTo="course"
                                                />
                                           </div>
                                       </>
                                   }
                                   {pageTab === "button" &&

                                            <SectionButtonOptions
                                                sectionPosition={index + 1}
                                                sections={sections}
                                                setSections={setSections}
                                                currentSection={section}
                                                id={id}
                                                buttonType="purchase"
                                                saveTo="course"
                                            />
                                   }
                               </>
                           )
                        case 'video':
                            return (
                                <>
                                    {pageTab === "content" &&
                                        <>
                                            <InputComponent
                                                placeholder="Video Title"
                                                label="Title"
                                                type="text"
                                                maxChar={65}
                                                hoverText="Add Video Title"
                                                elementName={`video_title`}
                                                value={video_title || ""}
                                                currentSection={section}
                                                sections={sections}
                                                setSections={setSections}
                                                saveTo="course"
                                            />
                                            <InputComponent
                                                placeholder="Video Text Blurb (optional)"
                                                label="Text Blurb"
                                                type="wysiwyg"
                                                hoverText={`Submit Text Blurb`}
                                                elementName={`text`}
                                                value={text || ""}
                                                currentSection={section}
                                                sections={sections}
                                                setSections={setSections}
                                                showTiny={showTiny}
                                                setShowTiny={setShowTiny}
                                                saveTo="course"
                                            />
                                            <div className="section_title w-full !mb-5">
                                                <h4>Title Size</h4>
                                            </div>
                                            <div className="mb-5 w-full border-b border-gray-100 pb-8">
                                                <div className="w-1/3">
                                                    <SliderComponent
                                                        label="Title Font Size"
                                                        id={id}
                                                        currentSection={section}
                                                        sections={sections}
                                                        setSections={setSections}
                                                        value={title_size}
                                                        elementName={`title_size`}
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
                                            <div className="section_title w-full !mb-3 mt-5">
                                                <h4>Colors</h4>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                                                <ColorPicker
                                                    label="Title Color"
                                                    currentSection={section}
                                                    sections={sections}
                                                    setSections={setSections}
                                                    elementName={`title_color`}
                                                    saveTo="course"
                                                />
                                                <ColorPicker
                                                    label="Background Color"
                                                    currentSection={section}
                                                    sections={sections}
                                                    setSections={setSections}
                                                    elementName={`background_color`}
                                                    saveTo="course"
                                                />
                                            </div>
                                        </>
                                    }

                                    {pageTab === "video" &&
                                        <>
                                            <InputComponent
                                                placeholder="YouTube or Vimeo Link"
                                                label="URL"
                                                type="url"
                                                hoverText="Add Embed Link"
                                                elementName={`video_link`}
                                                value={video_link || ""}
                                                currentSection={section}
                                                sections={sections}
                                                setSections={setSections}
                                                saveTo="course"
                                            />

                                            <div className="flex flex-between w-full">
                                                <div className="section_title w-1/2 flex !justify-start gap-1 items-center">
                                                    <h4>Lock</h4>
                                                    <ToolTipIcon section="course_lock_video" />
                                                </div>
                                                <div className={`switch_wrap w-1/2 flex justify-end items-center`}>
                                                    <IOSSwitch
                                                        onChange={handleChange}
                                                        checked={Boolean(lockVideo)}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    }
                                </>
                            )
                        case 'image' :
                            return (
                                <>
                                    {pageTab === "content" &&
                                        <ImageUploader
                                                elementName={`section_${index + 1}_image`}
                                                label="Background Image"
                                                cropSettings={{
                                                    unit: "%",
                                                    width: 30,
                                                    x: 25,
                                                    y: 25,
                                                    aspect: 16 / 8
                                                }}
                                                ref={nodesRef}
                                                setShowLoader={setShowLoader}
                                                completedCrop={completedCrop}
                                                setCompletedCrop={setCompletedCrop}
                                                startCollapsed={section['image']}
                                                onUpload={(response) => {
                                                    const packets = {
                                                        [`${section}_${index + 1}_image}`]: response.key,
                                                        ext: response.extension,
                                                    };
                                                    updateCourseSectionImage(packets, section['id'])
                                                    .then((response) => {
                                                        if (response.success) {
                                                            setSections(
                                                                sections.map((loopSection) => {
                                                                    if (loopSection.id === section.id) {
                                                                        return {
                                                                            ...loopSection,
                                                                            image: response.imagePath,
                                                                        };
                                                                    }
                                                                    return loopSection;
                                                                }),
                                                            );
                                                            const activeSection = "." + section + "_" + index + 1 + "_image_form";
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
                                    }
                                    {pageTab === "button" &&
                                        <SectionButtonOptions
                                            sectionPosition={index + 1}
                                            sections={sections}
                                            setSections={setSections}
                                            currentSection={section}
                                            id={id}
                                            buttonType="purchase"
                                            saveTo="course"
                                        />
                                    }
                                </>
                            )
                        case 'file' :
                            return (
                                <>
                                    {pageTab === "content" &&
                                        <>
                                            <div className="section_title !mb-5">
                                                <h4>File</h4>
                                            </div>
                                            <FileComponent
                                                elementName={`file`}
                                                setShowLoader={setShowLoader}
                                                currentSection={section}
                                                sections={sections}
                                                setSections={setSections}
                                                index={index}
                                            />
                                        </>
                                    }
                                    {pageTab === "button" &&
                                        <SectionButtonOptions
                                            sectionPosition={index + 1}
                                            sections={sections}
                                            setSections={setSections}
                                            currentSection={section}
                                            id={id}
                                            buttonType="download"
                                            saveTo="course"
                                        />
                                    }
                                </>
                            )
                    }

                })()}
                <div className="border-t border-gray-100 w-full pt-5 mt-5 my_row">
                    <DeleteSection
                        id={id}
                        sections={sections}
                        setSections={setSections}
                        setOpenIndex={setOpenIndex}
                        url={"/creator-center/course/delete-section/" + id}
                    />
                </div>
            </div>
        </div>
    );
};

export default Section;
