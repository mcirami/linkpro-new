import React, {useEffect, useState} from 'react';
import {BiLock} from 'react-icons/bi';
import {FaCirclePlay} from 'react-icons/fa6';

const ColumnComponent = ({
                             section,
                             dataRow,
                             indexValue,
                             setIndexValue,
                             index,
                             course,
                             hasCourseAccess,
                             affRef,
                             clickId,
                             creator,
                             page,
                             userAuth
}) => {

    const {
        type,
        text,
        text_color,
        video_title,
        video_link,
        background_color,
        button,
        button_position,
        button_text,
        button_text_color,
        button_color,
        button_size,
        lock_video,
    } = section;

    const {slug, header_color, header_text_color} = course;

    let additionalVars = "";
    if (affRef && clickId) {
        additionalVars = "?a=" + affRef + "&cid=" + clickId;
    }
    const buttonSlug = !userAuth ? "/register" : "/checkout"
    const buttonUrl = window.location.protocol + "//" + window.location.host + "/" + creator + "/course/" + slug + buttonSlug + additionalVars;

    const [imagePlaceholder, setImagePlaceholder] = useState(null);
    const [mobileVideo, setMobileVideo] = useState(null);
    const [buttonStyle, setButtonStyle] = useState(null);

    useEffect(() => {
        if (type === "video" && video_link) {
            let split;
            if (video_link.includes('youtube')) {
                split = video_link.split("/embed/");
                setImagePlaceholder("https://img.youtube.com/vi/" + split[1] +
                    "/mqdefault.jpg");
            } else {
                split = video_link.split("/video/");
                setImagePlaceholder("https://vumbnail.com/" + split[1] + ".jpg")
            }
        }
    },[])

    useEffect(() => {

        function handleResize() {

            if (window.innerWidth < 551) {
                setIndexValue(null);
            } else {
                setMobileVideo(null);
            }
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    },[])

    useEffect(() => {

        if(button) {

            let maxWidth = 'auto';
            if(window.innerWidth > 550) {
                maxWidth = '250px';
            }

            setButtonStyle({
                background: button_color,
                color: button_text_color,
                width: button_size + "%",
                maxWidth: maxWidth
            })
        }

    },[])

    const handleOnClick = (e) => {
        e.preventDefault();


        if(hasCourseAccess || !lock_video) {
            const clickedDiv = e.currentTarget.parentNode

            if (window.innerWidth < 551) {
                setMobileVideo(true);
            } else {
                if (clickedDiv.classList.contains('open')) {
                    setIndexValue(null);
                } else {
                    setIndexValue(clickedDiv.firstChild.dataset.index);
                    setTimeout(function() {
                        document.querySelector('.video_viewer').scrollIntoView({
                            behavior: 'smooth',
                            block: "nearest",
                        });

                    }, 600)
                }
            }
        }
    }

    const Button = () => {
        return (
            <div className={`button_wrap ${button_position ? button_position : "above"}`}>
                <a href={buttonUrl}
                   target="_blank"
                   className="button"
                   style={buttonStyle}
                >{button_text || "Get Course"}</a>
            </div>
        )
    }

    return (

        <div className={`column ${type} ${index == indexValue ? "open" : ""}`}
             style={{background: background_color}}>

            {type === "video" ?

                mobileVideo ?
                    <div className="my_row folder open">
                        <div className="video_wrapper">
                            <iframe src={video_link} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
                        </div>
                    </div>
                    :
                    (hasCourseAccess || !lock_video) && page !== "lander" ?
                        <a className="my_row relative" href="#"
                           data-video={video_link}
                           data-index={index}
                           data-row={dataRow}
                           onClick={(e) => handleOnClick(e)}>
                             <span className="image_wrap my_row">
                                <img src={imagePlaceholder} alt=""/>
                             </span>
                            <span className="play_icon">
                                <FaCirclePlay />
                            </span>
                        </a>
                        :
                        <span className="image_wrap my_row">
                            <img className="locked" src={imagePlaceholder} alt=""/>
                            <div className="text-center locked_content" style={{ color: 'rgb(255,255,255)' }}>
                                <BiLock />
                                <p>Unlock this video<br/>
                                    by purchasing this course</p>
                                <a className="button" href={buttonUrl} style={{ background: header_color, color: header_text_color }}>
                                    Purchase Now
                                </a>
                            </div>
                         </span>

                :
                ""
            }
            <div className="my_row text_wrap">
                {type === "video" &&
                    <h3 style={{color: text_color}}>{video_title}</h3>
                }

                { (!hasCourseAccess || page === "lander") &&
                    (button && button_position === "above") ?
                        <Button />
                        :
                        ""
                }
                <p style={{color: text_color}}>{text}</p>
                { (!hasCourseAccess || page === "lander") &&
                    (button && button_position === "below") ?
                            <Button />
                        :
                        ""
                }
            </div>
        </div>


    );
};

export default ColumnComponent;
