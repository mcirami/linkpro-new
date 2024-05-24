import React, {useState, useEffect, useRef} from 'react';
import {LP_ACTIONS} from '@/Components/Reducers/CreatorReducers.jsx';
//import { Editor } from '@tinymce/tinymce-react';
import { ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from "html-to-draftjs";

import {
    updateSectionData,
    updateData
} from '@/Services/LandingPageRequests.jsx';
import {
    updateData as updateCourseData,
    updateSectionData as updateCourseSectionData
} from '@/Services/CourseRequests.jsx';
import isJSON from 'validator/es/lib/isJSON';
import {BubbleMenu, EditorProvider, FloatingMenu, useEditor, EditorContent, useCurrentEditor, Editor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit'
import MenuBar from '@/Components/CreatorComponents/MenuBar.jsx';
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
                             index
                         }) => {

    const editorRef = useRef(null);

    const [editorState, setEditorState] = useState("");
    const [editorValue, setEditorValue] = useState("");

    useEffect(() => {

        if (currentSection) {

            if (currentSection["text"]) {
                const allContent = currentSection["text"];
                if(allContent.hasOwnProperty("blocks")) {
                    allContent["blocks"] = allContent["blocks"].map((block) => {
                        if (!block.text) {
                            block.text = ""
                        }

                        return block;
                    })
                    setEditorState(draftToHtml(allContent))
                }
            }
        } else if (data["intro_text"]) {

            const allContent = data["intro_text"];
            if(allContent.hasOwnProperty("blocks")) {
                allContent["blocks"] = allContent["blocks"].map((block) => {
                    if (!block.text) {
                        block.text = ""
                    }

                    return block;
                })
                setEditorState(draftToHtml(allContent))
            }
        }

    },[sections])

    useEffect(() => {
        if (currentSection) {
            if (currentSection["text"] &&
                currentSection["text"].hasOwnProperty("blocks") &&
                currentSection["text"]["blocks"][0]["text"] !== "") {
                setIsValid(true)
            }
        } else {
            if (data["intro_text"] &&
                data["intro_text"].hasOwnProperty("blocks") &&
                data["intro_text"]["blocks"][0]["text"] !== "") {
                setIsValid(true)
            }
        }
    },[])

    useEffect(() => {
        if(setShowTiny) {
            setShowTiny(true);
        }
    },[])

    const handleEditorChange = (value) => {

        //const value = editorRef.current.getContent();
        setEditorValue(value);

        if (value !== "") {
            setIsValid(true);

            if (sections) {

                let element = elementName.split(/(\d+)/);
                element = element[2].replace('_', '');

                setSections(sections.map((section) => {
                    if (section.id === currentSection.id) {
                        return {
                            ...section,
                            [`${element}`]: value,
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
            setIsValid(false);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isValid) {

            const blocksFromHTML = htmlToDraft(editorValue);

            const { contentBlocks, entityMap } = blocksFromHTML;

            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

            const finalValue = convertToRaw(contentState);

            if (sections) {

                let element = elementName.split(/(\d+)/);
                element = element[2].replace('_', '');

                const packets = {
                    [`${element}`]: finalValue,
                };

               saveTo === "course" ?
                    updateCourseSectionData(packets, currentSection.id) :
                    updateSectionData(packets, currentSection.id);

            } else {
                //const value = data[elementName];
                const packets = {
                    [`${elementName}`]: finalValue,
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

    const extensions = [
        StarterKit,
    ]
    const editor = useEditor({
        extensions: extensions,
        content: editorState,
        onUpdate({ editor }) {
            console.log("json", editor.getJSON())
            handleEditorChange(editor.getHTML())
        }
    })

    return (
        <div className="page_settings border_wrap wysiwyg">

            {showTiny &&
                <>
                {/*<Editor
                    apiKey='h3695sldkjcjhvyl34syvczmxxely99ind71gtafhpnxy8zj'
                    key={currentSection ? currentSection.id + index : data.id + index}
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={editorState}
                    value={editorValue}
                    onEditorChange={handleEditorChange}
                    onBlur={(e) => handleSubmit(e)}
                    onSubmit={(e) => handleSubmit(e)}
                    init={{
                        height: 500,
                        width: 100 + '%',
                        menubar: false,
                        menu: {
                            file: {
                                title: 'File',
                                items: ''
                            },
                            edit: {
                                title: 'Edit',
                                items: 'undo redo | cut copy paste pastetext | selectall | searchreplace'
                            },
                            view: {
                                title: 'View',
                                items: 'visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments'
                            },
                            insert: {
                                title: 'Insert',
                                items: 'link | emoticons hr | pagebreak '
                            },
                            format: {
                                title: 'Format',
                                items: 'bold italic underline strikethrough superscript subscript | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat'
                            },
                            tools: {
                                title: 'Tools',
                                items: 'spellchecker spellcheckerlanguage | a11ycheck wordcount'
                            },
                        },
                        plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'fullscreen', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | forecolor backcolor',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />*/}
                <div className="tiptap">
                    <MenuBar editor={editor} />
                    <EditorContent className="editor__content" editor={editor} />

                </div>
                </>
            }

        </div>
    );
};

export default EditorComponent;
