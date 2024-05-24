import React from 'react';
import {
    FaBold,
    FaItalic,
    FaUnderline,
    FaHeading,
    FaStrikethrough,
    FaListUl,
    FaListOl,
    FaQuoteLeft,
    FaUndo,
    FaRedo
} from 'react-icons/fa';
const MenuBar = ({editor}) => {
    if (!editor) {
        return null;
    }
    return (
        <div className="menuBar">

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleBold().run()
                    }}
                    className={editor.isActive("bold") ? "is_active" : ""}
                >
                    <FaBold/>
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleItalic().run();
                    }}
                    className={editor.isActive("italic") ? "is_active" : ""}
                >
                    <FaItalic/>
                </button>
                {/*<button
                    onClick={() => editor.chain().
                        focus().
                        toggleUnderline().
                        run()}
                    className={editor.isActive("underline") ? "is_active" : ""}
                >
                    <FaUnderline/>
                </button>*/}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleStrike().run();
                    }}
                    className={editor.isActive("strike") ? "is_active" : ""}
                >
                    <FaStrikethrough/>
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleHeading({level: 2}).run();
                    }}
                    className={
                        editor.isActive("heading", {level: 2}) ?
                            "is_active" :
                            ""
                    }
                >
                    <FaHeading/>
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleHeading({level: 3}).run();
                    }}
                    className={
                        editor.isActive("heading", {level: 3}) ?
                            "is_active" :
                            ""
                    }
                >
                    <FaHeading className="heading3"/>
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleBulletList().run();
                    }}
                    className={editor.isActive("bulletList") ? "is_active" : ""}
                >
                    <FaListUl/>
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleOrderedList().run()
                    }}
                    className={editor.isActive("orderedList") ?
                        "is_active" :
                        ""}
                >
                    <FaListOl/>
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleBlockquote().run();
                    }}
                    className={editor.isActive("blockquote") ? "is_active" : ""}
                >
                    <FaQuoteLeft/>
                </button>

                <button onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().undo().run();
                }}>
                    <FaUndo/>
                </button>
                <button onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().redo().run();
                }}>
                    <FaRedo/>
                </button>

        </div>
    );
};

export default MenuBar;
