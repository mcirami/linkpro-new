import React, {
    forwardRef,
    useEffect,
    useRef,
    useState,
} from 'react';
import {MdEdit} from 'react-icons/md';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import {
    canvasPreview,
    createImage,
    useDebounceEffect,
    onImageLoad,
    getFileToUpload,
} from '@/Services/ImageService.jsx';
import {
    updateImage,
    updateSectionImage,
} from '@/Services/LandingPageRequests.jsx';
import {updateSectionImage as updateCourseSectionImage} from '@/Services/CourseRequests.jsx';
import { updateImage as updateCourseImage} from '@/Services/CourseRequests.jsx';
import {LP_ACTIONS} from '../../Pages/LPCreator/Reducer.jsx';
import CropTools from '@/Utils/CropTools.jsx';
import {updateIcon} from '@/Services/OfferRequests.jsx';
import {OFFER_ACTIONS} from '@/Pages/CourseCreator/Reducer.jsx';

const ImageComponent = forwardRef(function ImageComponent(props, ref) {

    const {
        completedCrop,
        setCompletedCrop,
        setShowLoader,
        elementName,
        cropArray,
        data = null,
        dispatch = null,
        previewType,
        sections = null,
        setSections = null,
        currentSection = null,
        saveTo
    } = props;

    const [disableButton, setDisableButton] = useState(true);
    const [elementLabel, setElementLabel] = useState(elementName);
    const [upImg, setUpImg] = useState();
    const imgRef = useRef();
    const previewCanvasRef = ref;

    const [crop, setCrop] = useState(cropArray);
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState(cropArray['aspect'] || "")

    useEffect(() => {

        const words = elementName.split("_");
        setElementLabel( elementName === "hero" ? "Header Image" : words.join(" "));

    },[elementName])

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
        setShowLoader({
            show: true,
            icon: 'upload',
            position: 'fixed'
        });
        window.Vapor.store(
            image,
            {
                visibility: "public-read",
            },
            {
                progress: (progress) => {
                    this.uploadProgress = Math.round(progress * 100);
                },
            }
        ).then((response) => {

            const packets = {
                [`${elementName}`]: response.key,
                ext: response.extension,
            };

            if(saveTo === "offer") {
                updateIcon(packets, data["id"]).
                    then((response) => {
                        if (response.success) {
                            dispatch({
                                type: OFFER_ACTIONS.UPDATE_OFFER_DATA,
                                payload: {
                                    value: response.imagePath,
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

                const method = saveTo === "landingPage" ?
                    updateSectionImage(packets, currentSection.id) :
                    updateCourseSectionImage(packets, currentSection.id)
                method.then((response) => {
                    if (response.success) {
                        setSections(sections.map((section) => {
                            if (section.id === currentSection.id) {
                                return {
                                    ...section,
                                    image: response.imagePath,
                                }
                            }
                            return section;
                        }))

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

                const method = saveTo === "landingPage" ?
                    updateImage(packets, data["id"]) :
                    updateCourseImage(packets, data["id"])
                method.then((response) => {
                        if (response.success) {
                            dispatch({
                                type: LP_ACTIONS.UPDATE_PAGE_DATA,
                                payload: {
                                    value: response.imagePath,
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
                            document.querySelector(
                                "." + CSS.escape(elementName) +
                                "_form .bottom_section").
                                classList.
                                add("hidden");
                        }
                    })
            }
        }).catch((error) => {
            console.error(error);
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
                    {!completedCrop[elementName] && (
                        <>
                            <div className="top_section">
                                <label
                                    htmlFor={`${elementName}_file_upload`}
                                    className="custom"
                                >
                                    {(data && data['icon']) || currentSection?.image ?
                                        <img className={currentSection?.image ? "input_image" : ""}
                                             src={currentSection?.image || data['icon']} alt=""
                                        />
                                        :
                                        ""
                                    }
                                    { (previewType === "external" && !currentSection?.image) &&
                                        elementLabel
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
                                {previewType === "inline" &&
                                    <label>{elementLabel}</label>
                                }
                            </div>
                            <div className="my_row info_text file_types">
                                <p className="m-0 char_count w-100 ">
                                    Allowed File Types:{" "}
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
                                onComplete={(c) => setCompletedCrop({
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
                            {(previewType === "inline" && completedCrop[elementName]?.isCompleted) &&
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