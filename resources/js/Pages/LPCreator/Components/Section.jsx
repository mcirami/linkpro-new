import React from 'react';
import DeleteSection from './DeleteSection';
import {MdDragHandle, MdKeyboardArrowDown} from 'react-icons/md';
import InputComponent from './InputComponent';
import ColorPicker from './ColorPicker';
import ImageComponent from './ImageComponent';
import SectionButtonOptions from './SectionButtonOptions';
const courses = user.courses;
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {setOpen} from 'browser-sync/dist/options';

const Section = ({
                     section,
                     index,
                     completedCrop,
                     setCompletedCrop,
                     nodesRef,
                     sections,
                     setSections,
                     openIndex,
                     setOpenIndex,
                     setShowLoader,
                     handleMouseEnter,
                     showTiny,
                     setShowTiny
}) => {

    const {
        id,
        type,
        text,
        button_position,
        button,
        button_course_id,
        button_size
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

    const handleSectionOpen = (rowIndex) => {

        if(openIndex) {
            if (openIndex.includes(rowIndex)) {
                const newArrayIndex = openIndex.filter(
                    element => element !== rowIndex)
                setOpenIndex(newArrayIndex)
            } else {
                const newArrayIndex = openIndex.concat(rowIndex);
                setOpenIndex(newArrayIndex);
            }
        }
    }

    const handleMouseDown = () => {
        setOpenIndex([])
    }

    return (
        <div ref={setNodeRef}
             className="section_row"
             id={`section_${index + 1}`}
             style={style}
             onMouseEnter={(e) => handleMouseEnter(e)}
        >
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
                    <h4>Section {index + 1}</h4>
                </div>
                <div className={`icon_wrap ${openIndex.includes(index) ? "open" : ""}`}>
                    <MdKeyboardArrowDown />
                </div>
            </div>
            <div className={`section_content my_row ${openIndex.includes(index) ? "open" : ""}`}>
                {type === "text" &&
                    <>
                        <InputComponent
                            placeholder="Add Text"
                            type="textarea"
                            hoverText={`Add Text to Section ${index + 1}`}
                            elementName={`section_${index + 1}_text`}
                            value={text}
                            currentSection={section}
                            sections={sections}
                            setSections={setSections}
                            showTiny={showTiny}
                            setShowTiny={setShowTiny}
                        />
                        <ColorPicker
                            label="Background Color"
                            currentSection={section}
                            sections={sections}
                            setSections={setSections}
                            elementName={`section_${index + 1}_bg_color`}
                        />
                        {/* <ColorPicker
                            label="Text Color"
                            currentSection={section}
                            sections={sections}
                            setSections={setSections}
                            elementName={`section_${index + 1}_text_color`}
                        />*/}
                    </>
                }
                {type === "image" &&
                    <ImageComponent
                        ref={nodesRef}
                        completedCrop={completedCrop}
                        setCompletedCrop={setCompletedCrop}
                        setShowLoader={setShowLoader}
                        currentSection={section}
                        sections={sections}
                        setSections={setSections}
                        elementName={`section_${index + 1}_image`}
                        cropArray={{
                            unit: "%",
                            width: 30,
                            x: 25,
                            y: 25,
                            aspect: 16 / 8
                        }}
                    />
                }
                <div className="my_row">
                    <SectionButtonOptions
                        position={index + 1}
                        buttonPosition={button_position}
                        includeButton={button}
                        sections={sections}
                        setSections={setSections}
                        currentSection={section}
                        buttonCourseId={button_course_id}
                        buttonSize={button_size}
                        courses={courses}
                        id={id}
                    />
                </div>
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
