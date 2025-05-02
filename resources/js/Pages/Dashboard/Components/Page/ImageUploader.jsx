import React, {
    useState,
    useRef,
    forwardRef, useEffect,
} from 'react';
import {MdEdit} from 'react-icons/md';
import {usePageContext} from '@/Context/PageContext.jsx';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import {submitPageImage} from '@/Services/PageRequests.jsx';
import {
    useDebounceEffect,
    onImageLoad,
    createImage,
    getFileToUpload,
} from '@/Services/ImageService.jsx';
import ToolTipIcon from '@/Utils/ToolTips/ToolTipIcon';
import CropTools from '@/Utils/CropTools';
import EventBus from '@/Utils/Bus';
import {resizeFile} from '@/Services/ImageService.jsx';

const ImageUploader = forwardRef(function ImageUploader(props, ref) {

    const {
        completedCrop,
        setCompletedCrop,
        setShowLoader,
        elementName,
        imageType = null,
        cropSettings,
        label
    } = props;

    const [cropSettingsArray, setCropSettingsArray] = useState(cropSettings)
    const {pageSettings, setPageSettings} = usePageContext();
    const [aspect, setAspect] = useState(cropSettingsArray.aspect)

    useEffect(() => {
        setAspect(cropSettingsArray.aspect || null);
    }, [cropSettingsArray]);

    useEffect(() => {
        setCropSettingsArray(cropSettings); // Update cropSettingsArray on imageType change
    }, [imageType, cropSettings]);


    const [disableButton, setDisableButton] = useState(true);

    const [upImg, setUpImg] = useState(null);
    const imgRef = useRef();
    const previewCanvasRef = ref;
    const [crop, setCrop] = useState(cropSettingsArray);
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);

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
            createImage(image, setUpImg);

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
            const packets = {
                [`${elementName}`]: response.key,
                ext: response.extension,
                element: elementName,
                type: imageType,
            };

            submitPageImage(packets, pageSettings["id"])
            .then((data) => {
                setShowLoader({show: false, icon: null, position: ""})
                if (data.success) {
                    setUpImg(null);
                    setCompletedCrop({});
                    const newArray = {...pageSettings};
                    newArray[elementName] = data.imgPath;
                    if (imageType) newArray["main_img_type"] = imageType;
                    setPageSettings(newArray);
                    document.querySelector(`form.${elementName} .bottom_section`).classList.add("hidden");
                }

            });
        })
        .catch((error) => {
            console.error(error);
            EventBus.dispatch("error", { message: "There was an error saving your image." });
            setDisableButton(false);
            setShowLoader({show: false, icon: null, position: "", progress: null})
        });
    };

    const handleCancel = () => {
        setUpImg(null);

        const copy = {...completedCrop};
        delete copy[elementName];
        setCompletedCrop(copy);

        document.querySelector(`form.${elementName} .bottom_section`).classList.add("hidden");
    };

    return (
        <div className="my_row page_settings">
            <div className="column_wrap">
                <form onSubmit={handleSubmit} className={elementName}>
                    {!upImg && (
                        <>
                            <div className="top_section">
                                <label
                                    htmlFor={`${elementName}_upload`}
                                    className="custom"
                                >
                                    Select {label}
                                    <span className="edit_icon">
                                        <MdEdit />
                                        <div className="hover_text edit_image">
                                            <p>Edit {label}</p>
                                        </div>
                                    </span>
                                </label>
                                <input
                                    className="custom"
                                    id={`${elementName}_upload`}
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg, image/gif"
                                    onChange={onSelectFile}
                                />
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
                                    e.preventDefault();
                                    handleCancel();
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
            {!upImg && (
                <ToolTipIcon section={elementName} />
            )}
        </div>
    );
});

export default ImageUploader;
