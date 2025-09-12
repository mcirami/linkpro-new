import React, {useEffect, useRef, useState} from 'react';
import CropTools from '@/Utils/CropTools.jsx';
import ReactCrop from 'react-image-crop';
import {
    createImage, getFileToUpload,
    onImageLoad,
    resizeFile,
    useDebounceEffect,
} from '@/Services/ImageService.jsx';
import {updateLink} from '@/Services/LinksRequest.jsx';
import {LINKS_ACTIONS} from '@/Services/Reducer.jsx';
import {usePageContext} from '@/Context/PageContext.jsx';
import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';
import Compressor from "compressorjs";
import {FiUploadCloud} from 'react-icons/fi';

const ImageUploader = ({
                           editLink,
                           setEditLink,
                           setShowLoader,
                           elementName,
                           label,
                           imageCrop,
                           imageAspectRatio,
                           imageSelected,
                           setImageSelected,
                           setCustomIconArray = null
}) => {

    const { userLinks, dispatch } = useUserLinksContext();
    const  { pageSettings } = usePageContext();
    const [completedIconCrop, setCompletedIconCrop] = useState({});
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState(imageAspectRatio)
    const [dragActive, setDragActive] = useState(false);

    //image cropping
    const [upImg, setUpImg] = useState(null);
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState(imageCrop);

    useDebounceEffect(
        null,
        completedIconCrop,
        null,
        imgRef,
        previewCanvasRef,
        scale,
        rotate
    )

    const selectImage = async (e) => {
        e.preventDefault();
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }
        setImageSelected(true);
        await resizeFile(files[0]).then((image) => {
            new Compressor(image, {
                quality: 0.8,
                success(result) {
                    /*const formData = new FormData();
                    formData.append('file', result, result.name);*/
                    createImage(result, setUpImg);
                },
            });
            setCrop(undefined);
            const el = document.querySelector(`form.${elementName} .bottom_section`);
            if (el) el.classList.remove("hidden");
            if (window.innerWidth < 993) {
                document.querySelector(`${elementName}`).scrollIntoView({
                    behavior: "smooth",
                });
            }
        })
    }

    const uploadImage = async (e) => {

        e.preventDefault();
        const image = getFileToUpload(previewCanvasRef?.current);
        image.then((value) => {
            setShowLoader({show: true, icon: "upload", position: "fixed"})

            window.Vapor.store(
                value,
                {
                    visibility: "public-read",
                    progress: progress => {
                        setShowLoader(prev => ({
                            ...prev,
                            progress: Math.round(progress * 100)
                        }))
                    }
                }
            ).then(response => {

                //console.log("Vapor Response: ", response);
                const packets = {
                    [`${elementName}`]: response.key,
                    ext: response.extension,
                    bg_active: elementName === "bg_image",
                };
                updateLink(packets, editLink.id)
                .then((data) => {
                    setShowLoader({
                        show: false,
                        icon: "",
                        position: "",
                        progress: null
                    });
                    setImageSelected(false);
                    setUpImg(null);

                    dispatch({
                        type: LINKS_ACTIONS.UPDATE_LINK,
                        payload: {
                            id: editLink.id,
                            [`${elementName}`]: data.imagePath[elementName],
                            bg_active: elementName === "bg_image"
                        }})

                    setEditLink((prev) => ({
                        ...prev,
                        [`${elementName}`]: data.imagePath[elementName],
                        bg_active: elementName === "bg_image"
                    }))
                    if (elementName === "icon" && setCustomIconArray) {
                        setCustomIconArray((prev) => ([...prev, data.imagePath.icon]))
                    }

                });
            });
        });
    }

    return (
        <>
            {upImg &&
                <div className={`crop_section ${pageSettings.page_layout}`}>
                    <CropTools
                        rotate={rotate}
                        setRotate={setRotate}
                        scale={scale}
                        setScale={setScale}
                    />
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedIconCrop(c)}
                        aspect={aspect}
                    >
                        <img
                            onLoad={(e) => onImageLoad(e, aspect, setCrop)}
                            src={upImg}
                            ref={imgRef}
                            style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                            alt="Crop Me"/>
                    </ReactCrop>

                    <div className={`icon_col relative ${elementName}`}>
                        {elementName === "bg_image" &&
                            <>
                            <p>Button Preview</p>
                            <div className="canvas_wrap relative">
                                <canvas
                                    ref={previewCanvasRef}
                                    // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                    style={{
                                        backgroundSize: `cover`,
                                        backgroundRepeat: `no-repeat`,
                                        width: imageSelected ? `100%` : 0,
                                        height: imageSelected ? `auto` : 0,
                                        borderRadius: `8px`,
                                    }}
                                />
                            </div>
                            <div className="icon_info absolute left-2 bottom-2 flex items-center justify-center gap-2">
                                <img className="max-w-10 rounded-lg" src={editLink.icon || Vapor.asset('images/icon-placeholder.png')} alt=""/>
                                <p>{editLink.name || "Icon Name"}</p>
                            </div>
                                </>
                        }
                        {elementName === "icon" &&
                            <>
                                <p>Icon Preview</p>
                                <div className="canvas_wrap relative">
                                    <canvas
                                        ref={previewCanvasRef}
                                        // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                        style={{
                                            backgroundSize: `cover`,
                                            backgroundRepeat: `no-repeat`,
                                            width: imageSelected ? `100%` : 0,
                                            height: imageSelected ? `100%` : 0,
                                            borderRadius: `20px`,
                                        }}
                                    />
                                </div>
                            </>
                        }
                    </div>
                </div>
            }
            <div className="icon_row">
                <div className="icon_box">
                    <div className="uploader">
                        {upImg ?
                            <div className="my_row button_row mt-2">
                                <a className="!uppercase button blue" href="#" onClick={uploadImage}>
                                    Upload
                                </a>
                                <a className="!uppercase button transparent gray" href="#" onClick={(e) => {
                                    e.preventDefault();
                                    setImageSelected(false);
                                }}>
                                    Cancel
                                </a>
                            </div>
                            :
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={selectImage}
                                className={`rounded-xl border-2 border-dashed p-6 text-center transition
                              ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
                              relative`}
                            >
                                <FiUploadCloud size={48} className="mx-auto text-gray-400 mb-3"/>
                                <p className="text-sm font-medium text-gray-600">
                                    Drop your {label} here, or{' '}
                                    <label htmlFor={elementName} className="text-blue-600 underline cursor-pointer">
                                        browse
                                    </label>
                                </p>
                                <input
                                    id={elementName}
                                    type="file"
                                    accept="image/*"
                                    onChange={selectImage}
                                    className="hidden"
                                />
                            </div>
                            /*<>
                                <p className="mt-2 text-center label">Upload a {elementName === "bg_image" ? "background image" : "icon"} for your button</p>
                                <label htmlFor="custom_icon_upload" className="custom !uppercase button blue">
                                    Select Image
                                </label>
                            </>*/
                        }
                        {/*<input id="custom_icon_upload" type="file" className="custom" onChange={selectImage} accept="image/png, image/jpeg, image/jpg, image/gif"/>*/}
                        <div className="my_row info_text file_types text-left mb-2 !pl-0 !pr-0">
                            <small className="m-0 char_count w-100">Allowed File Types: <span>png, jpg, jpeg, gif</span>
                            </small>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default ImageUploader;
