import React, {useEffect, useState} from 'react';
import SectionVideo from './SectionVideo';
import SectionImage
    from '@/Pages/CourseCreator/Components/Preview/SectionImage.jsx';
import SectionFile
    from '@/Pages/CourseCreator/Components/Preview/SectionFile.jsx';

const PreviewSection = ({
                            currentSection,
                            index,
                            url,
                            nodesRef,
                            completedCrop,
                            position,
                            hoverSection,
}) => {

    const {
        type,
        background_color,
        text_color,
        text,
        video_title,
        video_link,
        button,
        button_position,
        button_color,
        button_text_color,
        button_text,
        button_size,
        image,
        file
    } = currentSection;

    const [buttonStyle, setButtonStyle] = useState(null);

    useEffect(() => {
        setButtonStyle ({
            background: button_color,
            color: button_text_color,
            width: button_size + "%"
        })

    },[button_color, button_text_color, button_size])

    const Button = ({buttonText}) => {
        return (
            <div className={`button_wrap ${button_position ? button_position : "above"}`}>
                <a href={`${url}/checkout`}
                   target="_blank"
                   className="button"
                   style={buttonStyle}
                >{buttonText || "Get Course"}</a>
            </div>
        )
    }

    return (
        <section
            id={`preview_section_${position}`}
            className={ type + " " + hoverSection === 'section_'+ position ? "active" : ""}
            style={{ background: background_color || 'rgba(255,255,255,1)'}}
        >
            {( !!button && button_position === "above") &&
                <Button
                    buttonText={button_text}
                />
            }
            {{
                "text":
                 <div className="text_wrap">
                    <p
                        style={{ color: text_color || 'rgba(0,0,0,1)'}}
                    >{text || ""}</p>
                 </div>
                    ,
                "video":
                    <SectionVideo
                        title={video_title}
                        link={video_link}
                        text={text}
                        textColor={text_color}
                        index={index}

                    />,
                "image":
                    <SectionImage
                        nodesRef={nodesRef}
                        completedCrop={completedCrop}
                        elementName={"section_"+ position + "_" + type}
                        imgUrl={image}
                    />,
                "file":
                    <SectionFile
                        file={file}
                    />,
            }[type]}
            {( !!button && button_position === "below") &&
                <Button
                    buttonText={button_text}
                />
            }
        </section>
    );
};

export default PreviewSection;
