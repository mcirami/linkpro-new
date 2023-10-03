import React, {useEffect, useState} from 'react';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';
import isJSON from 'validator/es/lib/isJSON';

const SectionComponent = ({section}) => {

    //const bgImage = section.type === "image" && section.image ? section.image : Vapor.asset('images/image-placeholder.jpg');

    const [bgStyle, setBgStyle] = useState(null);
    const [buttonStyle, setButtonStyle] = useState(null);

    const {
        id,
        type,
        image,
        bg_color,
        button,
        button_position,
        button_color,
        button_text_color,
        button_text,
        button_size,
        text,
        slug,
        username
    } = section;

    const [textValue, setTextValue] = useState(text)

    useEffect(() => {
        if(type === "text" ) {
            if (text && isJSON(text)) {
                const allContent = JSON.parse(text);
                allContent["blocks"] = allContent["blocks"].map((block) => {
                    if (!block.text) {
                        block.text = ""
                    }

                    return block;
                })

                setTextValue(draftToHtml(allContent));
            } else {
                setTextValue(text)
            }
        }
    },[])

    useEffect(() => {
        setButtonStyle ({
            background: button_color,
            color: button_text_color,
            width: button_size + "%",
        })

    },[])

    const createMarkup = (text) => {

        return {
            __html: DOMPurify.sanitize(text)
        }
    }

    useEffect(() => {

        if(type === "image") {
            if(section.image) {
                setBgStyle ({
                    background: "url(" + image + ") no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover"
                })
            } else {
                setBgStyle ({
                    background: "url(" + Vapor.asset('images/image-placeholder.jpg') + ") no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "30%",
                    backgroundColor: '#f4f4f4',
                })
            }
        }

    },[])

    const url = window.location.protocol + "//" + window.location.host + "/" + username + "/course-page/" + slug;

    const Button = ({buttonText}) => {
        return (
            <div id={id} className={`button_wrap ${button_position ? button_position : "above"}`}>
                <a href={url}
                   target="_blank"
                   className="button"
                   style={buttonStyle}
                >{buttonText || "Get Course"}</a>
            </div>
        )
    }

    return (
        <section className={type} style={ type === "text" ? { background: bg_color } : bgStyle }>
            {type === "text" &&
                <article className="section_content">
                    { (button && button_position === "above") ?
                        <Button buttonText={button_text} />
                        :
                        ""
                    }
                    <div dangerouslySetInnerHTML={createMarkup(textValue)}>
                    </div>
                    { (button && button_position === "below") ?
                        <Button buttonText={button_text} />
                        :
                        ""
                    }
                </article>
            }
            {type === "image" &&
                button ?
                    <Button buttonText={button_text} />
                    :
                    ""
            }
        </section>
    );
};

export default SectionComponent;
