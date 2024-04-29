import React, {
    useEffect,
    useRef,
    useState,
    forwardRef,
} from 'react';
import {MdEdit} from 'react-icons/md';
import 'react-image-crop/src/ReactCrop.scss';
import {
    createImage,
    canvasPreview,
    useDebounceEffect,
    getFileToUpload,
    onImageLoad,
} from '@/Services/ImageService.jsx';
import { updateIcon} from '@/Services/OfferRequests.jsx';
import { updateImage} from '@/Services/CourseRequests.jsx';
import {OFFER_ACTIONS, LP_ACTIONS} from '../Reducer';
import CropTools from '../../../Utils/CropTools';
import ReactCrop from 'react-image-crop';
import {updateSectionImage} from '@/Services/CourseRequests.jsx';

const ImageComponent = forwardRef(function ImageComponent(props, ref) {

    const {
        placeholder,
        completedCrop,
        setCompletedCrop,
        setShowLoader,
        elementName,
        cropArray,
        data = null,
        dispatch = null,
        type,
        sections = null,
        setSections = null,
        currentSection = null
    } = props;

    const [disableButton, setDisableButton] = useState(true);
    const [elementLabel, setElementLabel] = useState(elementName);
    const [upImg, setUpImg] = useState('');
    const imgRef = useRef(null);
    const previewCanvasRef = ref;
    const [crop, setCrop] = useState(cropArray);
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState(cropArray['aspect'] || 16 / 9)

    useDebounceEffect(
        async () => {
            if (
                completedCrop[elementName]?.isCompleted.width &&
                completedCrop[elementName]?.isCompleted.height &&
                imgRef.current &&
                previewCanvasRef?.current[elementName]
            ) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef?.current[elementName],
                    completedCrop[elementName]?.isCompleted,
                    scale,
                    rotate,
                )
            }
        },
        100,
        [completedCrop[elementName]?.isCompleted, scale, rotate],
    )

    useEffect(() => {

        const words = elementName.split("_");
        setElementLabel( words.join(" "));

    },[elementName])

    const onSelectFile = (e) => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }
        setCrop(undefined)
        setDisableButton(false);
        document.querySelector("." + CSS.escape(elementName) + "_form .bottom_section").classList.remove("hidden");
        if (window.innerWidth < 993) {
            document.querySelector("." + CSS.escape(elementName) + "_form").scrollIntoView({
                behavior: "smooth",
            });
        }

        createImage(files[0], setUpImg);

    };

    /*function handleToggleAspectClick() {
        if (aspect) {
            setAspect(undefined)
        } else if (imgRef.current) {
            const { width, height } = imgRef.current
            setAspect(16 / 9)
            const newCrop = centerAspectCrop(width, height, 16 / 9)
            setCrop(newCrop)
            // Updates the preview
            setCompletedCrop(convertToPixelCrop(newCrop, width, height))
        }
    }*/

    const handleSubmit = (e) => {
        e.preventDefault();
        setDisableButton(true);
        const image = getFileToUpload(previewCanvasRef?.current[elementName])
        image.then((value) => {
            fileUpload(value);
        }).catch((error) => {
            console.error("image error: ", error);
            setDisableButton(false);
        });
    };

    const fileUpload = (image) => {
        setShowLoader({
            show: true,
            icon: 'upload',
            position: 'fixed'
        });
        window.Vapor.store(
            image,
            {
                visibility: "public-read",
            }
        ).then((response) => {
            const packets = {
                [`${elementName}`]: response.key,
                ext: response.extension,
            };

            if(elementName.includes('icon')) {
                updateIcon(packets, data["id"]).
                    then((data) => {
                        if (data.success) {
                            dispatch({
                                type: OFFER_ACTIONS.UPDATE_OFFER_DATA,
                                payload: {
                                    value: data.imagePath,
                                    name: elementName
                                }
                            })
                            setShowLoader({
                                show: false,
                                icon: '',
                                position: ''
                            });

                            setUpImg(null);
                            delete completedCrop[elementName];
                            setCompletedCrop(completedCrop);
                            document.querySelector("." + CSS.escape(elementName) +
                                "_form .bottom_section").classList.add("hidden");
                        } else {
                            setShowLoader({
                                show: false,
                                icon: '',
                                position: ''
                            });
                        }
                    })
            } else if (sections) {
                updateSectionImage(packets, currentSection.id)
                .then((data) => {
                    if (data.success) {
                        setSections(sections.map((section) => {
                            if (section.id === currentSection.id) {
                                return {
                                    ...section,
                                    image: data.imagePath,
                                }
                            }
                            return section;
                        }));

                        setShowLoader({
                            show: false,
                            icon: '',
                            position: ''
                        });

                        setUpImg(null);
                        delete completedCrop[elementName];
                        setCompletedCrop(completedCrop);
                        document.querySelector(
                            "." + CSS.escape(elementName) +
                            "_form .bottom_section").
                            classList.
                            add("hidden");
                    }
                })
            } else {
                updateImage(packets, data["id"])
                .then((data) => {
                    if (data.success) {
                        dispatch({
                            type: LP_ACTIONS.UPDATE_PAGE_DATA,
                            payload: {
                                value: data.imagePath,
                                name: elementName
                            }
                        })
                        setShowLoader({
                            show: false,
                            icon: '',
                            position: ''
                        });

                        setUpImg(null);
                        delete completedCrop[elementName];
                        setCompletedCrop(completedCrop);
                        document.querySelector("." + CSS.escape(elementName) +
                            "_form .bottom_section").classList.add("hidden");
                    } else {
                        setShowLoader({
                            show: false,
                            icon: '',
                            position: ''
                        });
                    }
                })
            }

        }).catch((error) => {
            console.error("catch error: ", error);
            setDisableButton(false);
        });
    };

    const handleCancel = (e) => {
        e.preventDefault();

        setUpImg(null);

        const copy = {...completedCrop};
        delete copy[elementName];
        setCompletedCrop(copy);
        document.querySelector("." + CSS.escape(elementName) + "_form .bottom_section").classList.add("hidden");
    };

    return (
        <article className="my_row page_settings">
            <div className="column_wrap">
                <form onSubmit={handleSubmit} className={`${elementName}_form`}>
                    {!completedCrop[elementName]?.isCompleted && (
                        <>
                            <div className="top_section">

                                <label
                                    htmlFor={`${elementName}_file_upload`}
                                    className="custom"
                                >
                                    {(data && data['icon']) || currentSection?.image ?
                                        <img className={currentSection?.image ? "input_image" : ""} src={currentSection?.image || data['icon']} alt=""/>
                                        :
                                        ""
                                    }
                                    { (type === "extPreview" && !currentSection?.image) &&
                                        placeholder
                                    }
                                    <span className="edit_icon">
                                        <MdEdit />
                                        <div className="hover_text edit_image">
                                            <p>Edit {elementLabel}</p>
                                        </div>
                                    </span>
                                </label>

                                <input
                                    className={`custom ${(data && data["icon"]) ? "active" : "" }`}
                                    id={`${elementName}_file_upload`}
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg, image/gif"
                                    onChange={onSelectFile}
                                />
                                {type === "inlinePreview" &&
                                    <label>{placeholder}</label>
                                }
                            </div>
                            <div className="my_row info_text file_types">
                                <p className="m-0 char_count w-100 ">
                                    Allowed File Types:
                                    <span>png, jpg, jpeg, gif</span>
                                </p>
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
                                    alt="Crop me"/>
                            </ReactCrop>
                            {(type === "inlinePreview" && completedCrop[elementName]?.isCompleted) &&
                                <div className="icon_col">
                                    <p>Icon Preview</p>
                                    <canvas
                                        ref={ref => previewCanvasRef.current[elementName] = ref}
                                        // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                        style={{
                                            backgroundSize: `cover`,
                                            backgroundRepeat: `no-repeat`,
                                            width: completedCrop[elementName]?.isCompleted ? `100%` : 0,
                                            height: completedCrop[elementName]?.isCompleted ? `100%` : 0,
                                            borderRadius: `20px`,
                                        }}

                                    />
                                </div>
                            }
                        </div>
                        <div className="bottom_row">
                            <button
                                type="submit"
                                className="button green"
                                disabled={disableButton}
                            >
                                Save
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
            </div>
        </article>
    );
});

export default ImageComponent;
