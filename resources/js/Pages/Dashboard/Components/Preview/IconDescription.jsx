import React, {useEffect, useRef, useState} from 'react';
import isJSON from 'validator/es/lib/isJSON';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';

const IconDescription = ({
                             dataRow,
                             row,
                             description,
                             url
                         }) => {

    const [textValue, setTextValue] = useState(description)
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
        <div className={`my_row folder ${dataRow == row ? "open" : ""}`}>
            {dataRow == row &&
                <div className="folder_content description">
                    <a target="_blank" href={url}>
                        <div dangerouslySetInnerHTML={createMarkup(textValue)}></div>
                    </a>
                </div>
            }
        </div>
    );
};

export default IconDescription;
