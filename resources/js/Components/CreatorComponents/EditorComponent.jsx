import React, {useState, useEffect, useCallback} from 'react';
import {LP_ACTIONS} from '@/Components/Reducers/CreatorReducers.jsx';
import draftToHtml from 'draftjs-to-html';

import {
    updateSectionData,
    updateData
} from '@/Services/LandingPageRequests.jsx';
import {
    updateData as updateCourseData,
    updateSectionData as updateCourseSectionData
} from '@/Services/CourseRequests.jsx';
import TipTap from '@/Components/CreatorComponents/TipTap.jsx';
import isJSON from 'validator/es/lib/isJSON';
import {convertText} from '@/Services/CreatorServices.jsx';
const EditorComponent = ({
                             dispatch,
                             sections = null,
                             setSections,
                             currentSection = null,
                             elementName,
                             data,
                             isValid,
                             setIsValid,
                             showTiny = null,
                             setShowTiny = null,
                             saveTo,
                             initialValue
                         }) => {

    const [editorState, setEditorState] = useState("");

    const resolveContent = useCallback(() => {
        if (initialValue !== undefined && initialValue !== null) {
            return initialValue;
        }
        if (currentSection) {
            const sectionValue = elementName && currentSection[elementName] !== undefined
                ? currentSection[elementName]
                : currentSection["text"];

            if (sectionValue !== undefined && sectionValue !== null) {
                return sectionValue;
            }
        }

        if (data) {
            if (elementName && data[elementName] !== undefined && data[elementName] !== null) {
                return data[elementName];
            }
            if (data.hasOwnProperty('intro_text')) {
                return data["intro_text"];
            }
        }

        return "";
    }, [currentSection, data, elementName, initialValue]);

    useEffect(() => {
        const content = resolveContent();

        if (!content) {
            setEditorState("");
            return;
        }

        if (typeof content !== 'string') {
            setEditorState("");
            return;
        }

        if (typeof content === 'string' && isJSON(content)) {
            const convertedText = convertText(content);

            if (convertedText.type === "blocks") {
                setEditorState(draftToHtml(convertedText.text));
            } else {
                setEditorState(convertedText.text);
            }

            return;
        }
        setEditorState(content);
    }, [resolveContent]);

    useEffect(() => {
        const content = resolveContent();

        if (content && content !== "") {
            setIsValid && setIsValid(true);
        }
    }, [resolveContent, setIsValid]);

    const handleEditorChange = (value) => {

        if (value !== "") {
            setIsValid(true);

            if (sections) {

                /*let element = elementName.split(/(\d+)/);
                element = element[2].replace('_', '');*/

                setSections(sections.map((section) => {
                    if (section.id === currentSection.id) {
                        return {
                            ...section,
                            [`${elementName}`]: value,
                        }
                    }
                    return section;
                }))

            } else {
                dispatch({
                    type: LP_ACTIONS.UPDATE_PAGE_DATA,
                    payload: {
                        value: value,
                        name: elementName
                    }
                })
            }
        } else {
            setIsValid && setIsValid(false);;
        }
    }

    const handleSubmit = (content) => {

        if (isValid) {

            if (sections) {

                /*let element = elementName.split(/(\d+)/);
                element = element[2].replace('_', '');*/

                const packets = {
                    [`${elementName}`]: content,
                };

               saveTo === "course" ?
                    updateCourseSectionData(packets, currentSection.id) :
                    updateSectionData(packets, currentSection.id);

            } else {
                //const value = data[elementName];
                const packets = {
                    [`${elementName}`]: content,
                };

                const method = saveTo === "course" ?
                    updateCourseData(packets, data["id"], elementName) :
                    updateData(packets, data["id"], elementName)

                method.then((response) => {
                        if (response.success && response.slug) {
                            dispatch({
                                type: LP_ACTIONS.UPDATE_PAGE_DATA,
                                payload: {
                                    value: response.slug,
                                    name: 'slug'
                                }
                            })
                        }
                    })
            }
        }
    }

    useEffect(() => {
        if(setShowTiny) {
            setShowTiny(true);
        }
    },[])

    return (
        <div className="page_settings border_wrap wysiwyg w-full">

            {showTiny &&

                <TipTap
                    editorState={editorState}
                    handleEditorChange={handleEditorChange}
                    handleSubmit={handleSubmit}
                />
            }
        </div>
    );
};

export default EditorComponent;
