import React, {
    useState,
    useRef,
    forwardRef,
    useEffect,
    useMemo
} from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import {
    useDebounceEffect,
    onImageLoad,
    createImage,
    getFileToUpload,
} from '@/Services/ImageService.jsx';
import CropTools from '@/Utils/CropTools';
import EventBus from '@/Utils/Bus';
import {resizeFile} from '@/Services/ImageService.jsx';
import Compressor from 'compressorjs';
import { FiUploadCloud } from "react-icons/fi";

const cropKeys = ['unit', 'aspect', 'width', 'height', 'x', 'y'];

const areCropsEqual = (a, b) => {
    return cropKeys.every((key) => {
        const aValue = a?.[key] ?? null;
        const bValue = b?.[key] ?? null;

        return aValue === bValue;
    });
};

const ImageUploader = forwardRef(function ImageUploader(props, ref) {

    const {
        completedCrop,
        setCompletedCrop,
        setShowLoader,
        elementName,
        imageType = null,
        cropSettings,
        label,
        startCollapsed,
        onUpload
    } = props;

    const defaultCrop = useMemo(() => cropSettings ?? {}, [
        imageType,
        cropSettings?.unit,
        cropSettings?.width,
        cropSettings?.height,
        cropSettings?.x,
        cropSettings?.y,
        cropSettings?.aspect,
    ]);

    const [aspect, setAspect] = useState(defaultCrop?.aspect ?? null)
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        setAspect(defaultCrop?.aspect || null);
    }, [defaultCrop?.aspect]);

    const [disableButton, setDisableButton] = useState(true);

    const [upImg, setUpImg] = useState(null);
    const imgRef = useRef();
    const previewCanvasRef = ref;
    const [crop, setCrop] = useState(defaultCrop);
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);

    const [open, setOpen] = useState(!startCollapsed);

    useEffect(() => {
        setCrop((prev) => (areCropsEqual(prev, defaultCrop) ? prev : defaultCrop));
    }, [defaultCrop]);

    useDebounceEffect(
        completedCrop,
        null,
        elementName,
        imgRef,
        previewCanvasRef,
        scale,
        rotate
    )

    const onSelectFile = async (e) => {
        let file = e.target.files || e.dataTransfer.files;

        if (!file.length) {
            return;
        }

        await resizeFile(file[0]).then((image) => {
            new Compressor(image, {
                quality: 0.8,
                success(result) {
                    /*const formData = new FormData();
                    formData.append('file', result, result.name);*/
                    createImage(result, setUpImg);
                },
            });
            setCrop(undefined);
            setDisableButton(false);
            const el = document.querySelector(`form.${elementName} .bottom_section`);
            if (el) el.classList.remove("hidden");
            if (window.innerWidth < 993) {
                document.querySelector(`${elementName}`).scrollIntoView({
                    behavior: "smooth",
                });
            }
        })

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setDisableButton(true);
        const image = getFileToUpload(previewCanvasRef?.current[elementName])
        image.then((value) => {
            fileUpload(value);
        }).catch((error) => {
            console.error(error);
            setDisableButton(false);
        });
    };

    const fileUpload = (image) => {
        setShowLoader({show: true, icon: "upload", position: "fixed"})
        window.Vapor.store(
            image,
            {
                visibility: "public-read",
                progress: (progress) => {
                    setShowLoader(prev => ({
                        ...prev,
                        progress: Math.round(progress * 100)
                    }))
                },
            }
        )
        .then((response) => {
            const maybePromise = onUpload ? onUpload(response) : Promise.resolve();
            return Promise.resolve(maybePromise).then(() => {
                cleanup();
            });

        })
        .catch((error) => {
            console.error(error);
            EventBus.dispatch("error", { message: "There was an error saving your image." });
            setDisableButton(false);
            setShowLoader({show: false, icon: null, position: "", progress: null})
        });
    };

    const cleanup = () => {
        setShowLoader?.({ show: false, icon: null, position: '', progress: null });
        setUpImg(null);
        /*if (setCompletedCrop) {
            setCompletedCrop((prev) => ({ ...prev, [elementName]: {} }));
        }*/
        delete completedCrop[elementName];
        setCompletedCrop(completedCrop);
        setOpen(false);
    };

    const handleCancel = () => {
        setUpImg(null);

        const copy = {...completedCrop};
        delete copy[elementName];
        setCompletedCrop(copy);

        document.querySelector(`form.${elementName} .bottom_section`).classList.add("hidden");
    };

    return (
        <div className="my_row ">
            <div className="column_wrap">
                <form onSubmit={handleSubmit} className={elementName}>
                    {!upImg && (
                        <>
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={onSelectFile}
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
                                        className={`text-gray-500 text-sm font-semibold tracking-wide transition-opacity duration-300 ${
                                            open ? 'opacity-0' : 'opacity-100'
                                        }`}
                                    > {startCollapsed ? 'CHANGE IMAGE' : 'Add an Image'}
                                    </span>

                                    {/* Single icon that moves from right → above text in the expanded area */}
                                    <span
                                        className="pointer-events-none absolute transition-all duration-1000 ease-out text-gray-400"
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
                                            Drop your <span className="font-bold">{label}</span> here, or{' '}
                                            <label
                                                htmlFor={`file-upload-${elementName}`}
                                                className="text-blue-600 underline cursor-pointer"
                                            >
                                                browse
                                            </label>
                                        </p>
                                        <div className="my_row info_text file_types w-full text-center">
                                            <p className="m-0 char_count text-xs text-gray-400">
                                                Allowed File Types: <span>png, jpg, jpeg, gif</span>
                                            </p>
                                        </div>
                                        <input
                                            id={`file-upload-${elementName}`}
                                            type="file"
                                            accept="image/*"
                                            onChange={onSelectFile}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="bottom_section hidden">
                        <div className="crop_section">
                            <CropTools
                                rotate={rotate}
                                setRotate={setRotate}
                                scale={scale}
                                setScale={setScale}
                            />
                            <ReactCrop
                                crop={crop}
                                aspect={aspect}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) =>  setCompletedCrop({
                                    ...completedCrop,
                                    [`${elementName}`]: {
                                        isCompleted: c
                                    }
                                })}
                            >
                                <img
                                    onLoad={(e) => onImageLoad(e, aspect, setCrop)}
                                    src={upImg}
                                    ref={imgRef}
                                    style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                    alt="Crop Me" />
                            </ReactCrop>
                        </div>
                        <div className="button_row w-full flex justify-between items-center flex-wrap gap-1">

                            <a className="!uppercase button blue" href="#" onClick={handleSubmit}>
                                Upload
                            </a>
                            {/*<button
                                type="submit"
                                className="button green"
                                disabled={disableButton}
                            >
                                Save
                            </button>*/}
                            <a className="!uppercase button transparent gray" href="#"
                               onClick={(e) => {
                                   e.preventDefault();
                                   handleCancel();
                            }}>
                                Cancel
                            </a>
                           {/* <a
                                className="button transparent gray"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCancel();
                                }}
                            >
                                Cancel
                            </a>*/}
                            <a
                                className="help_link w-full flex justify-end mt-3"
                                href="mailto:help@link.pro"
                            >
                                Need Help?
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
});

export default ImageUploader;
