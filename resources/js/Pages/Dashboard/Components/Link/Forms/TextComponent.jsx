import React, {useEffect, useRef, useState} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import draftToHtml from 'draftjs-to-html';
import isJSON from 'validator/es/lib/isJSON';

const TextComponent = ({
                           currentLink,
                           setCurrentLink,
                           showTiny
                       }) => {


    const editorRef = useRef(null);
    const [editorState, setEditorState] = useState("");
    const [editorValue, setEditorValue] = useState("");
    const firstUpdate = useRef(true);

    useEffect(() => {
        if(currentLink.description !== "") {
            if (currentLink.description && isJSON(currentLink.description)) {
                const allContent = JSON.parse(currentLink.description);
                allContent["blocks"] = allContent["blocks"].map((block) => {
                    if (!block.text) {
                        block.text = ""
                    }

                    return block;
                })
                setEditorState(draftToHtml(allContent))
            } else {
                setEditorState(currentLink.description)
            }
        }

    },[]);

    const handleEditorChange = () => {

        const value = editorRef.current.getContent();
        setEditorValue(value);

        setCurrentLink(() => ({
            ...currentLink,
            description: value
        }))
    }

    return (
        <>
            {showTiny &&
                <Editor
                    apiKey='h3695sldkjcjhvyl34syvczmxxely99ind71gtafhpnxy8zj'
                    key={currentLink.id}
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={editorState}
                    value={editorValue}
                    onEditorChange={handleEditorChange}
                    init={{
                        height: 250,
                        width: 100 + '%',
                        menubar: true,
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
                                items: 'preview fullscreen'
                            },
                            insert: {
                                title: 'Insert',
                                items: 'link'
                            },
                            format: {
                                title: 'Format',
                                items: 'bold italic underline strikethrough superscript subscript | styles blocks align lineheight | forecolor backcolor | language | removeformat'
                            },
                            tools: {
                                title: 'Tools',
                                items: 'spellchecker spellcheckerlanguage | a11ycheck wordcount'
                            },
                        },
                        plugins: [
                            'advlist',
                            'autolink',
                            'lists',
                            'link',
                            'image',
                            'charmap',
                            'preview',
                            'anchor',
                            'searchreplace',
                            'fullscreen',
                            'wordcount'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | forecolor backcolor',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />
            }
        </>
    );
};

export default TextComponent;
