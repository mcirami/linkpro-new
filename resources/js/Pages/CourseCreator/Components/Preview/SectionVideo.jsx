import React, {useEffect, useState} from 'react';
import { FaCirclePlay } from "react-icons/fa6";
import {getVideoScreenshot} from '@/Services/VideoService.jsx';

const SectionVideo = ({
                          title,
                          link,
                          text,
                          textColor,
                          index
}) => {

    const [imagePlaceholder, setImagePlaceholder] = useState("");
    const [indexValue, setIndexValue] = useState(null);

    useEffect(() => {
        if(link) {
            setImagePlaceholder(getVideoScreenshot(link));
        }
    },[link])

    const handleOnClick = (e) => {
        e.preventDefault();
        setIndexValue(e.currentTarget.dataset.index);
    }

    return (
        <>
            {link ?
                <div className="video_content">
                    {indexValue == index ?
                        <div className="video_row my_row">
                            <div className="video_wrapper">
                                <iframe src={link} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
                            </div>
                        </div>
                        :
                        <a href="#" data-index={index} onClick={(e) => handleOnClick(e)}>
                            <img src={imagePlaceholder} alt=""/>
                            <span className="play_icon">
                                <FaCirclePlay />
                            </span>
                        </a>
                    }
                </div>
                :
                <img src={ Vapor.asset('images/image-placeholder.jpg')} alt=""/>
            }

            <div className="text_wrap">
                <h3 style={{color: textColor || "rgba(0,0,0,1)" }}>{title || "Video Title"}</h3>

                {text &&
                    <p style={{color: textColor || "rgba(0,0,0,1)"}}>{text}</p>
                }
            </div>
        </>
    );
};

export default SectionVideo;
