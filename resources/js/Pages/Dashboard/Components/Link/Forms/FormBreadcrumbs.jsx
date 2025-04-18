import React, {useState} from 'react';
import {BiChevronLeft, BiChevronsLeft} from 'react-icons/bi';

const FormBreadcrumbs = ({
                             editIcon,
                             setEditIcon,
                             setAccordionValue,
                             showLinkForm,
                             setShowLinkForm,
                             setIntegrationType,
                             setInputType
}) => {

    const {id, type, folderId} = editIcon;

    return (
        <div className="breadcrumb_links">
            {folderId  ?
                <>
                    {id || showLinkForm ?
                        <a className="back" href="#"
                           onClick={(e) => {
                               e.preventDefault();
                               setShowLinkForm(false)
                               setEditIcon(prev => ({...prev,
                                   id: null,
                                   type: null,
                                   inputType: null,
                               }))
                               setAccordionValue(null);
                           }}
                        >
                            <BiChevronLeft />
                            Folder
                        </a>
                        :
                        ""
                    }
                    <a className="back" href="#"
                       onClick={(e) => {
                           e.preventDefault();
                           setShowLinkForm(false);
                           setEditIcon(prev =>
                               Object.fromEntries(Object.keys(prev).map(key => [key, null])));
                           setAccordionValue(null);
                       }}
                    >
                        <BiChevronsLeft />
                        Icons
                    </a>
                </>
                :
                <a className="back" href="#"
                   onClick={(e) => {
                       e.preventDefault();
                       setShowLinkForm(false)
                       setEditIcon(prev =>
                           Object.fromEntries(Object.keys(prev).map(key => [key, null])))
                       setIntegrationType(null)
                       setInputType(null)
                       setAccordionValue(null);
                   }}
                >
                    <BiChevronLeft />
                    Back To Icons
                </a>
            }
        </div>
    );
};

export default FormBreadcrumbs;
