import React, {useEffect, useRef, useState} from 'react';
import DOMPurify from 'dompurify';
import draftToHtml from 'draftjs-to-html';
import isJSON from 'validator/es/lib/isJSON';

const Hero = ({ courseData }) => {

    const [textValue, setTextValue] = useState(courseData["intro_text"])

    const firstUpdate = useRef(true);

    useEffect(() => {

        if (courseData["intro_text"] !== "") {
            if (firstUpdate.current && courseData["intro_text"] && isJSON(courseData["intro_text"])) {

                const allContent = JSON.parse(courseData["intro_text"]);
                allContent["blocks"] = allContent["blocks"].map((block) => {
                    if (!block.text) {
                        block.text = ""
                    }

                    return block;
                })

                setTextValue(draftToHtml(allContent));
                firstUpdate.current = false;
            } else {
                setTextValue(courseData["intro_text"])
            }
        }

    },[courseData["intro_text"]])

    const createMarkup = (text) => {
        return {
            __html: DOMPurify.sanitize(text)
        }
    }

    return (
        <div className="hero_section">
            {courseData['intro_video'] &&
                <div className="video_wrapper" id="preview_intro_video_section">
                    <iframe src={courseData['intro_video']} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
                </div>
            }
            {courseData["intro_text"] &&
                <article id="preview_intro_text_section"
                         className="intro_text my_row"
                         style={{
                             background: courseData["intro_background_color"] || 'rgba(255,255,255,1)'
                        }}
                >
                    <div dangerouslySetInnerHTML={createMarkup(textValue)}></div>
                </article>
            }
        </div>
    );
};

export default Hero;
