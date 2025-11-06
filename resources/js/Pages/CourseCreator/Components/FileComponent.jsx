import React, {useEffect, useState} from 'react';
import {MdEdit} from 'react-icons/md';
import {getFileParts, uploadSectionFile} from '@/Services/FileService.jsx';
import EventBus from '@/Utils/Bus.jsx';
import { FiUploadCloud } from "react-icons/fi";

const FileComponent = ({
                           elementName,
                           setShowLoader,
                           currentSection,
                           sections,
                           setSections,
                           index,
                           startCollapsed,
                           getSectionTitle
}) => {

    const [disableButton, setDisableButton] = useState(true);
    const [upFile, setUpFile] = useState('');
    const [fileName, setFileName] = useState("");
    const [currentFileName, setCurrentFileName] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [open, setOpen] = useState(!startCollapsed);

    useEffect(() => {
        if (currentSection.file) {
            const fileNameObj = getFileParts(currentSection.file);
            const fileName = fileNameObj.name + "." + fileNameObj.type;
            setFileName(fileName);
            setCurrentFileName(fileName);
        }
    }, [sections]);
    const onSelectFile = (e) => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }
        setDisableButton(false);
        document.querySelector("." + CSS.escape(elementName) + "_" + index + "_form .bottom_section").classList.remove("hidden");
        if (window.innerWidth < 993) {
            document.querySelector("." + CSS.escape(elementName)  + "_" + index + "_form").scrollIntoView({
                behavior: "smooth",
            });
        }
        setFileName(files[0].name)
        setUpFile(files[0]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowLoader({
            show: true,
            icon: 'upload',
            position: 'fixed'
        });
        Vapor.store(
            upFile,
            {
                visibility: "public-read",
                progress: progress => {
                    setShowLoader(prev => ({
                        ...prev,
                        progress: Math.round(progress * 100)
                    }))
                },
            }
        ).then((response) => {
            const packets = {
                [`${elementName}`]: response.key,
                ext: response.extension,
                name: fileName.split('.')[0].replace(/[,\/#!$%\^&\*;:{}=\-_'`~()]/g, '').replaceAll(" ", "-")
            };

            uploadSectionFile(currentSection.id, packets)
            .then(response => {
                if (response.success) {
                    setSections(sections.map((section) => {
                        if (section.id === currentSection.id) {
                            return {
                                ...section,
                                file: response.filePath,
                            }
                        }
                        return section;
                    }));

                    setUpFile(null);
                    setOpen(false);
                    document.querySelector(
                        "." + CSS.escape(elementName)  + "_" + index +
                        "_form .bottom_section").
                        classList.
                        add("hidden");
                }

                setShowLoader({show: false, icon: null, position: "", progress: null})
            }).catch((error) => {
                console.error(error);
                EventBus.dispatch("error", { message: "There was an error saving your file." });
                setShowLoader({show: false, icon: null, position: "", progress: null})
            });
        });
    }

    const handleCancel = (e) => {
        e.preventDefault();
        setUpFile(null);
        setFileName(currentFileName);
        document.querySelector("." + CSS.escape(elementName) + "_form .bottom_section").classList.add("hidden");
    }

    return (
        <section className="my_row page_settings">

                <form onSubmit={handleSubmit} className={`${elementName}_${index}_form w-full`}>
                    {!upFile &&
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragActive(true);
                            }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={onSelectFile}
                            // Animated dotted box (grid trick)
                            className={[
                                // container: NO padding in collapsed state
                                'group relative grid rounded-xl border-2 border-dashed text-center p-0',
                                'transition-[grid-template-rows] duration-1000 ease-out',
                                open ? 'grid-rows-[125px_1fr] pb-8' : 'grid-rows-[56px_0fr]',
                                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white',
                            ].join(' ')}
                        >
                            {/* Row 1 — collapsed header / Change Image bar */}
                            <button
                                type="button"
                                className="shadow-none relative flex h-14 w-full items-center justify-between px-4"
                                onClick={() => setOpen(true)}
                                aria-expanded={open}
                            >
                                {/* CHANGE IMAGE text fades out when open */}
                                <span
                                    className={`text-sm font-semibold tracking-wide text-gray-500 transition-opacity duration-300 ${
                                        open ? 'opacity-0' : 'opacity-100'
                                    }`}
                                >
                                {startCollapsed ? 'CHANGE FILE' : 'Add a File'}
                              </span>

                                {/* Single icon that moves from right → above text in the expanded area */}
                                <span
                                    className="pointer-events-none absolute transition-all duration-1000 ease-in-out text-gray-400"
                                    style={
                                        open
                                            ? { left: '50%', top: 'calc(56px + 1rem)', transform: 'translateX(-50%)' } // above helper copy
                                            : { right: '1rem', top: '50%', transform: 'translateY(-50%)' } // right side of header
                                    }
                                >
                                <FiUploadCloud className="h-8 w-8" />
                              </span>
                            </button>

                            {/* Row 2 — expanding content */}
                            <div
                                className={[
                                    'overflow-hidden',
                                    // Add padding ONLY when open; none when collapsed (so dashed box is p-0)
                                    'transition-[padding,opacity] duration-1000 ease-out',
                                    open ? 'px-6 pb-6 opacity-100' : 'p-0 opacity-0',
                                    'min-h-[var(--open-h)]',
                                ].join(' ')}
                            >
                                <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center">
                                    {/* no duplicate icon here—header icon slides into position */}
                                    <p className="text-sm font-medium text-gray-600">
                                        Drop your <span className="font-bold">file</span> here, or{' '}
                                        <label
                                            htmlFor={`file-upload-${elementName}`}
                                            className="text-blue-600 !lowercase !text-sm underline cursor-pointer"
                                        >
                                            browse
                                        </label>
                                    </p>
                                    <div className="my_row info_text file_types w-full text-center">
                                        <p className="m-0 char_count text-xs text-gray-400">
                                            Allowed File Types: <span>.pdf, .doc, .docx, msword, .mp4, .mp3</span>
                                        </p>
                                    </div>
                                    <input
                                        id={`file-upload-${elementName}`}
                                        type="file"
                                        accept=".doc,.docx,application/msword,application/pdf,.mp4,.mp3"
                                        onChange={onSelectFile}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>
                    }
                    <div className="bottom_section hidden w-full">
                        <p className="text-sm text-gray-500">{
                            fileName ? fileName.toLowerCase() : "Upload File"
                        }
                        </p>
                        <div className="bottom_row w-full">
                            <button
                                type="submit"
                                className="button blue"
                                disabled={disableButton}
                            >
                                Upload
                            </button>
                            <a
                                className="button transparent gray"
                                href="#"
                                onClick={(e) => {
                                    handleCancel(e);
                                }}
                            >
                                Cancel
                            </a>
                            <a
                                className="help_link"
                                href="mailto:help@link.pro"
                            >
                                Need Help?
                            </a>
                        </div>
                    </div>
                </form>

        </section>
    );
};

export default FileComponent;
