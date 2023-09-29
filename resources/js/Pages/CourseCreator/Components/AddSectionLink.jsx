import React from 'react';
import { ImPlus } from "react-icons/im";
import {addSection} from '@/Services/CourseRequests.jsx';
import {capitalize, toUpper} from 'lodash';

const AddSectionLink = ({
                            sections,
                            setSections,
                            courseID,
                            setOpenIndex,
                            type
}) => {

    const handleOnClick = (e) => {
        e.preventDefault();

        const packets = {
            type: type
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
            }
        })
    }

    return (
        <a className="icon_wrap" href="#" onClick={(e) => handleOnClick(e)}>
            <ImPlus />
            <h3>Add {capitalize(type)} Section</h3>
        </a>
    );
};

export default AddSectionLink;
