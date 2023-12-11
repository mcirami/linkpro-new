import React, {useEffect, useRef, useState} from 'react';
import isJSON from 'validator/es/lib/isJSON';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';
import { TbExternalLink } from "react-icons/tb";

const IconDescription = ({
                             dataRow,
                             row,
                             description,
                             url
                         }) => {

    const [textValue, setTextValue] = useState(description)
    const [hoverSection, setHoverSection] = useState(null);
    const divRef = useRef();

    useEffect(() => {

        if(description !== "") {
            if (description && isJSON(description)) {
                const allContent = JSON.parse(description);
                allContent["blocks"] = allContent["blocks"].map((block) => {
                    if (!block.text) {
                        block.text = ""
                    }

                    return block;
                })

                setTextValue(draftToHtml(allContent));

            } else {
                setTextValue(description);
            }
        }

    },[description])

    const createMarkup = (text) => {
        return {
            __html: DOMPurify.sanitize(text)
        }
    }

    return (
        <div
             ref={divRef}
             className={`relative my_row folder ${dataRow == row ? "open" : ""}`}
             onMouseEnter={(e) => {
                 setHoverSection(divRef)
             }}
             onMouseLeave={(e) => {
                 setHoverSection(null)
             }}
        >
            {dataRow == row &&
                <div className="folder_content description relative">
                    <a target="_blank" href={url}>
                        <div dangerouslySetInnerHTML={createMarkup(textValue)}></div>
                        {hoverSection === divRef &&
                            <div className="hover_content">
                                <p className="text_link">Open Link</p>
                                <span className="icon"><TbExternalLink/></span>
                            </div>
                         }
                    </a>

                </div>
            }
        </div>
    );
};

export default IconDescription;
