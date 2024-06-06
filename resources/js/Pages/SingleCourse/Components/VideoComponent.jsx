import React, {useEffect, useState} from 'react';
import isJSON from 'validator/es/lib/isJSON.js';
import {convertText} from '@/Services/CreatorServices.jsx';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';

const VideoComponent = ({indexValue, sections}) => {

    const [textValue, setTextValue] = useState(sections[indexValue].section_text)

    useEffect(() => {

        if (sections[indexValue].section_text && isJSON(sections[indexValue].section_text)) {
            const content = convertText(sections[indexValue].section_text);
            if (content.type === "blocks") {
                setTextValue(draftToHtml(content.text));
            } else {
                setTextValue(content.text);
            }
        } else if (sections[indexValue].section_text) {
            setTextValue(sections[indexValue].section_text)
        }


    },[])

    const createMarkup = (convertText) => {
        return {
            __html: DOMPurify.sanitize(convertText)
        }
    }

    return (
        <div className="video_viewer my_row">
            <div className="video_content" style={{ background: sections[indexValue].background_color}}>
                <div className={`my_row folder open`}>
                    <div className="video_wrapper">
                        <iframe src={sections[indexValue].video_link} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
                    </div>
                </div>
                <div className="video_description my_row">
                    <h3 style={{
                        color: sections[indexValue].title_color,
                        fontSize: sections[indexValue].title_size + "rem"
                    }}>{sections[indexValue].video_title}</h3>
                    <div dangerouslySetInnerHTML={createMarkup(textValue)}>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoComponent;
