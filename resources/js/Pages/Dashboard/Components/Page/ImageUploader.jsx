import React, {
    useState,
    useRef,
    forwardRef,
    useEffect,
    useMemo
} from 'react';
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
        label
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
    const {pageSettings, setPageSettings} = usePageContext();
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
        <div className="my_row ">
            <div className="column_wrap">
                <form onSubmit={handleSubmit} className={elementName}>
                    {!upImg && (
                        <>
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={onSelectFile}
                                className={`rounded-xl border-2 border-dashed p-12 text-center transition
                              ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
                              relative`}
                            >
                                <FiUploadCloud size={48} className="mx-auto text-gray-400 mb-3"/>
                                <p className="text-sm font-medium text-gray-600">
                                    Drop your <span className="font-bold">{label}</span> here, or{' '}
                                    <label htmlFor={elementName} className="text-blue-600 underline cursor-pointer">
                                        browse
                                    </label>
                                </p>
                                <div className="my_row info_text file_types w-full text-center">
                                    <p className="m-0 char_count  ">
                                        Allowed File Types:{" "}
                                        <span>png, jpg, jpeg, gif</span>
                                    </p>
                                </div>
                                <input
                                    id={elementName}
                                    type="file"
                                    accept="image/*"
                                    onChange={onSelectFile}
                                    className="hidden"
                                />
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
