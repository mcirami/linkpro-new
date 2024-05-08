import React, {useEffect, useState} from 'react';
import DeleteSection from './DeleteSection';
import {MdDragHandle, MdKeyboardArrowDown} from 'react-icons/md';
import InputComponent from '@/Components/CreatorComponents/InputComponent.jsx';
import ColorPicker from '@/Components/CreatorComponents/ColorPicker.jsx';
import ImageComponent from '@/Components/CreatorComponents/ImageComponent.jsx';
import SectionButtonOptions from '@/Components/CreatorComponents/SectionButtonOptions.jsx';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import FileComponent
    from '@/Pages/CourseCreator/Components/FileComponent.jsx';
import {getFileParts} from '@/Services/FileService.jsx';
import {updateSectionData} from '@/Services/CourseRequests.jsx';
import IOSSwitch from '@/Utils/IOSSwitch';
import ToolTipIcon from '@/Utils/ToolTips/ToolTipIcon';

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

    const {
        id,
        type,
        text,
        video_title,
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
        setLockVideo(lock_video ? lock_video : true)
    },[])

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
                return (
                    section.text ?
                        section.text.slice(0, 20) + "..." :
                        type  + " " + textCount
                )
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
                } else {
                    content = type  + " " + fileCount
                }
                return (
                    content
                )
        }
    }

    return (
        <div ref={setNodeRef}
             id={`section_${index + 1}`}
             style={style}
             className="section_row"
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
                {(() => {
                    switch (type) {
                        case 'text':
                           return (
                               <>
                                   <InputComponent
                                       placeholder="Add Text"
                                        type="textarea"
                                        hoverText="Add Text to Section"
                                        elementName={`section_${index + 1}_text`}
                                        value={text}
                                        currentSection={section}
                                        sections={sections}
                                        setSections={setSections}
                                   />
                                    <ColorPicker
                                        label="Background Color"
                                        currentSection={section}
                                        sections={sections}
                                        setSections={setSections}
                                        elementName={`section_${index + 1}_background_color`}
                                        submitTo="course"
                                    />
                                    <ColorPicker
                                        label="Text Color"
                                        currentSection={section}
                                        sections={sections}
                                        setSections={setSections}
                                        elementName={`section_${index + 1}_text_color`}
                                        submitTo="course"
                                    />

                                    <SectionButtonOptions
                                        sectionPosition={index + 1}
                                        sections={sections}
                                        setSections={setSections}
                                        currentSection={section}
                                        id={id}
                                        submitTo="course"
                                    />
                               </>
                           )
                        case 'video':
                            return (
                                <>
                                    <InputComponent
                                        placeholder="Video Title"
                                        type="text"
                                        maxChar={65}
                                        hoverText="Add Video Title"
                                        elementName={`video_${index + 1}_title`}
                                        value={video_title || ""}
                                        currentSection={section}
                                        sections={sections}
                                        setSections={setSections}
                                    />
                                    <InputComponent
                                        placeholder="YouTube or Vimeo Link"
                                        type="url"
                                        hoverText="Add Embed Link"
                                        elementName={`video_${index + 1}_link`}
                                        value={video_link || ""}
                                        currentSection={section}
                                        sections={sections}
                                        setSections={setSections}
                                    />
                                    <InputComponent
                                        placeholder="Video Text Blurb (optional)"
                                        type="textarea"
                                        hoverText={`Submit Text Blurb`}
                                        elementName={`section_${index + 1}_text`}
                                        value={text || ""}
                                        currentSection={section}
                                        sections={sections}
                                        setSections={setSections}
                                    />
                                    <ColorPicker
                                        label="Background Color"
                                        currentSection={section}
                                        sections={sections}
                                        setSections={setSections}
                                        elementName={`section_${index + 1}_background_color`}
                                        submitTo="course"
                                    />
                                    <ColorPicker
                                        label="Text Color"
                                        currentSection={section}
                                        sections={sections}
                                        setSections={setSections}
                                        elementName={`section_${index + 1}_text_color`}
                                        submitTo="course"
                                    />
                                    <div className="switch_wrap two_columns">
                                        <div className={`page_settings border_wrap`}>
                                            <h3>Lock Video</h3>
                                            <IOSSwitch
                                                onChange={handleChange}
                                                checked={lockVideo !== null ? Boolean(lockVideo) : true}
                                            />
                                        </div>
                                        <ToolTipIcon section="course_lock_video" />
                                    </div>
                                </>
                            )
                        case 'image' :
                            return (
                                <>
                                    <ImageComponent
                                        ref={nodesRef}
                                        completedCrop={completedCrop}
                                        setCompletedCrop={setCompletedCrop}
                                        setShowLoader={setShowLoader}
                                        currentSection={section}
                                        sections={sections}
                                        setSections={setSections}
                                        elementName={`section_${index + 1}_image`}
                                        previewType="external"
                                        saveTo="course"
                                        cropArray={{
                                            unit: "%",
                                            width: 30,
                                            x: 25,
                                            y: 25,
                                            aspect: 16 / 8
                                        }}
                                    />
                                    <SectionButtonOptions
                                        sectionPosition={index + 1}
                                        sections={sections}
                                        setSections={setSections}
                                        currentSection={section}
                                        id={id}
                                        submitTo="course"
                                    />
                                </>
                            )
                        case 'file' :
                            return (
                                <FileComponent
                                    elementName={`section_${index + 1}_file`}
                                    setShowLoader={setShowLoader}
                                    currentSection={section}
                                    sections={sections}
                                    setSections={setSections}
                                />
                            )
                    }

                })()}
                <DeleteSection
                    id={id}
                    sections={sections}
                    setSections={setSections}
                    setOpenIndex={setOpenIndex}
                />
            </div>
        </div>
    );
};

export default Section;
