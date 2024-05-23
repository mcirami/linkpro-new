import React, {useEffect, useRef, useState} from 'react';
import DOMPurify from 'dompurify';
import draftToHtml from 'draftjs-to-html';

const Hero = ({ data }) => {

    const [textValue, setTextValue] = useState(data["intro_text"])

    const firstUpdate = useRef(true);

    useEffect(() => {

        if (data["intro_text"] !== "") {
            if (firstUpdate.current && data["intro_text"]) {

                const allContent = data["intro_text"];
                allContent["blocks"] = allContent["blocks"].map((block) => {
                    if (!block.text) {
                        block.text = ""
                    }

                    return block;
                })

                setTextValue(draftToHtml(allContent));
                firstUpdate.current = false;
            } else {
                setTextValue(data["intro_text"])
            }
        }

    },[data["intro_text"]])

    const createMarkup = (text) => {
        return {
            __html: DOMPurify.sanitize(text)
        }
    }

    return (
        <div className="hero_section">
            {data['intro_video'] &&
                <div className="video_wrapper" id="preview_intro_video_section">
                    <iframe src={data['intro_video']} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
                </div>
            }
            {data["intro_text"] &&
                <article id="preview_intro_text_section"
                         className="intro_text my_row"
                         style={{
                             background: data["intro_background_color"] || 'rgba(255,255,255,1)'
                        }}
                >
                    <div dangerouslySetInnerHTML={createMarkup(textValue)}></div>
                </article>
            }
        </div>
    );
};

export default Hero;
