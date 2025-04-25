import React from 'react';
import {MdDeleteForever} from 'react-icons/md';

const DeleteIcon = ({
                        setShowConfirmPopup,
                        editId,
                        type = null,
}) => {

    const handleDeleteClick = e => {
        e.preventDefault();
        setShowConfirmPopup({
            show: true,
            id: editId,
            type: type
        });
    }

    return (
        <a className="delete" href="#"
           onClick={handleDeleteClick}>
            <MdDeleteForever />
            <div className="hover_text delete_folder"><p>Delete {type === "folder" ? "Folder" : "Icon"}</p></div>
        </a>
    );
};

export default DeleteIcon;
