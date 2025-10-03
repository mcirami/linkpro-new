import React from 'react';
import {deleteSection} from '@/Services/CreatorRequests.jsx';
import DeleteIcon from "@/Pages/Dashboard/Components/Link/Forms/DeleteIcon.jsx";
import { MdDeleteForever } from "react-icons/md";

const DeleteSection = ({
                           id,
                           sections,
                           setSections,
                           setOpenIndex,
                           url
}) => {

    const handleDeleteClick = (e) => {
        e.preventDefault();
        setOpenIndex([]);

        const newSectionsArray = sections.filter((section) => {
            return section.id !== id;
        });

        const packets = {
            sections: newSectionsArray
        }

        deleteSection(packets, url)
        .then((response) => {
            if(response.success) {
                setSections(newSectionsArray)
            }
        })
    }

    return (
        <div className="w-full flex justify-end">
            <a className="ml-auto" href="#"
               onClick={(e) => handleDeleteClick(e)}>
                <div className="delete_icon text-red-500 ml-auto">
                    <MdDeleteForever className="w-6 h-6"/>
                    <div className="hover_text delete_folder"><p>Delete Section</p></div>
                </div>
            </a>
        </div>
    );
};

export default DeleteSection;
