import React, {useEffect, useState} from 'react';

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
            let split;
            if (link.includes('youtube')) {
                split = link.split("/embed/");
                setImagePlaceholder("https://img.youtube.com/vi/" + split[1] +
                    "/mqdefault.jpg");
            } else {
                split = link.split("/video/");
                setImagePlaceholder("https://vumbnail.com/" + split[1] + ".jpg")
            }
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
