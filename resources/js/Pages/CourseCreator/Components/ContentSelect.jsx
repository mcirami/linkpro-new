import React, {useState} from 'react';
import {addSection} from '@/Services/CourseRequests.jsx';

const ContentSelect = ({
                           sections,
                           setSections,
                           courseID,
                           setOpenIndex
}) => {

    const options = [
        {
            id: 1,
            type: "video",
            label: "Video Section"
        },
        {
            id: 2,
            type: "text",
            label: "Text Section"
        },
        {
            id: 4,
            type: "image",
            label: "Image Section"
        },
        {
            id: 3,
            type: "file",
            label: "File Section"
        }
    ]

    const [optionValue, setOptionValue] = useState("");

    const onSelectChange = (e) => {
        e.preventDefault();
        setOptionValue(e.target.value);

        const packets = {
            type: e.target.value
        }

        addSection(packets, courseID)
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
                setTimeout(function(){
                    document.querySelector('.sections_wrap .section_row:last-child').scrollIntoView({
                        behavior: 'smooth',
                        block: "start",
                        inline: "nearest"
                    });

                }, 800)
                setOptionValue("");
            }
        })
    }

    return (
        <select
            name="add_section"
            id="add_section"
            onChange={(e) => onSelectChange(e)}
            value={optionValue}
        >
            <option value="">Select Section To Add</option>
            {options.map((option) => {
                return (
                    <option key={option.id} value={option.type}>
                        {option.label}
                    </option>
                )
            })}
        </select>
    );
};

export default ContentSelect;
