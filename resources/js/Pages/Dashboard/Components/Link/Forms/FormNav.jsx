import React, {useState} from 'react';
import {CiImageOn} from 'react-icons/ci';
import {FaImage} from 'react-icons/fa';

const FormNav = ({
                     currentLink,
                     showIconList,
                     setShowIconList,
                     showBGUpload,
                     setShowBGUpload,
                     pageLayout
                 }) => {

    const [ isHovering, setIsHovering ] = useState({
        status: false,
        section: null,
    });
    return (
        <div className="form_nav relative mb-4">
            <div className="relative">
                <a className="relative block"
                   onMouseOver={() => setIsHovering(
                       {status: true, section: "icon"})}
                   onMouseLeave={() => setIsHovering(
                       {status: false, section: null})}
                   href="#"
                   onClick={(e) => {
                       e.preventDefault();
                       setShowIconList(true);
                       setIsHovering(
                           {status: false, section: null})
                   }}><CiImageOn/>
                </a>
                {(isHovering.section === "icon" &&
                        isHovering.status) &&
                    <div className="hover_text block" style={{
                        opacity: 1,
                        width: '50px'
                    }}><p>Icon</p></div>
                }
            </div>

            { (pageLayout === "layout_two" && currentLink.id) &&
                <div className="relative">
                    <a className="relative block"
                       onMouseOver={() => setIsHovering(
                           {status: true, section: "bg"})}
                       onMouseLeave={() => setIsHovering(
                           {status: false, section: null})}
                       href="#"
                       onClick={(e) => {
                           e.preventDefault();
                           setShowBGUpload(true);
                           setIsHovering(
                               {status: false, section: null})
                       }}><FaImage/></a>
                    {(isHovering.section === "bg" &&
                            isHovering.status) &&
                        <div className="hover_text" style={{opacity: 1}}>
                            <p>Background</p></div>
                    }
                </div>
            }
        </div>
    );
};

export default FormNav;
