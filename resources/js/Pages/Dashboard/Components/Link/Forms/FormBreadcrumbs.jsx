import React, {useState} from 'react';
import {BiChevronLeft, BiChevronsLeft} from 'react-icons/bi';

const FormBreadcrumbs = ({
                             editLink,
                             setEditLink,
                             showLinkForm,
                             setShowLinkForm,
                             setIntegrationType,
                             setInputType,
                             showLinkTypeRadio
}) => {

    const {id, folder_id} = editLink;

    return (
        <div className="breadcrumb_links">
            {folder_id  ?
                <>
                    {id || showLinkForm.show || showLinkTypeRadio?
                        <a className="back" href="#"
                           onClick={(e) => {
                               e.preventDefault();
                               setShowLinkForm({
                                   show: false,
                               })
                               setEditLink(prev => ({...prev,
                                   id: null,
                                   type: null,
                                   inputType: null,
                               }))
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
                           setShowLinkForm({
                               show: false,
                           });
                           setEditLink(prev =>
                               Object.fromEntries(Object.keys(prev).map(key => [key, null])));
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
                       setShowLinkForm({
                           show: false,
                       })
                       setEditLink(prev =>
                           Object.fromEntries(Object.keys(prev).map(key => [key, null])))
                       setIntegrationType(null)
                       setInputType(null)
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
