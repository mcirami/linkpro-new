import React, {useEffect, useState} from 'react';
import {CiImageOn} from 'react-icons/ci';
import {FaImage} from 'react-icons/fa';
import {getIcons} from '@/Services/IconRequests.jsx';
import {getIconPaths} from '@/Services/ImageService.jsx';

const FormTabs = ({
                      setShowIconList,
                      setShowBGUpload,
                      pageLayout
                 }) => {

    const handleOnClick = (e, type) => {
        e.preventDefault();
        if (!e.target.classList.contains("active")) {
            document.querySelector('.tab_link.active').classList.remove('active');
            if (type === "icon") {
                setShowIconList((prev) => ({
                    ...prev,
                    show: true,
                }));
                setShowBGUpload(false);
            } else {
                setShowIconList((prev) => ({
                    ...prev,
                    show: false,
                }));
                setShowBGUpload(true);
            }
            e.target.classList.add('active');
        }
    }


    return (
        <div className="form_nav relative">
            <div className="relative">
                <a className="relative block active tab_link"
                   href="#"
                   onClick={(e) => handleOnClick(e, "icon")}>
                    Button Icon
                </a>
            </div>

            { pageLayout === "layout_two" &&
                <div className="relative flex items-center gap-3">
                    <a className="relative block tab_link"
                       href="#"
                       onClick={(e) => handleOnClick(e, "image")}>
                        Button Image
                    </a>
                </div>
            }
        </div>
    );
};

export default FormTabs;
