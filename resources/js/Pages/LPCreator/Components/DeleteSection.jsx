import React from 'react';
import {deleteSection} from '../../../Services/LandingPageRequests';

const DeleteSection = ({id, sections, setSections, setOpenIndex}) => {

    const handleDeleteClick = (e) => {
        e.preventDefault();
        setOpenIndex([])

        const newSectionsArray =  sections.filter((section) => {
            return section.id !== id;
        })

        const packets = {
            sections: newSectionsArray
        }

        deleteSection(id, packets)
        .then((response) => {
            if(response.success) {
                setSections(newSectionsArray)
            }
        })
    }

    return (
        <a className="button red float-end" href="#"
           onClick={(e) => handleDeleteClick(e)}>
            Delete Section
        </a>
    );
};

export default DeleteSection;
