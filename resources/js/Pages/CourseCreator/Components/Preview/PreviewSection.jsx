import React, {useEffect, useState} from 'react';
import SectionVideo from './SectionVideo';

const PreviewSection = ({
                            currentSection,
                            index,
                            url
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
        button_size
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
            id={`preview_section_${index + 1}`}
            className={type}
            style={{ background: background_color || 'rgba(255,255,255,1)'}}
        >
            {( !!button && button_position === "above") &&
                <Button
                    buttonText={button_text}
                />
            }
            {{
                "text":
                    <p
                        style={{ color: text_color || 'rgba(0,0,0,1)'}}
                    >{text || ""}</p>
                    ,
                "video":
                    <SectionVideo
                        title={video_title}
                        link={video_link}
                        text={text}
                        textColor={text_color}
                        index={index}

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
