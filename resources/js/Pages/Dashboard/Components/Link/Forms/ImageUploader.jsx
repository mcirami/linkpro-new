import React, {useContext, useEffect, useRef, useState} from 'react';
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
import {UserLinksContext} from '@/Pages/Dashboard/Dashboard.jsx';

const ImageUploader = ({
                           currentLink,
                           setShowLoader,
                           pageSettings,
                           setShowBGUpload
}) => {

    const { userLinks, dispatch } = useContext(UserLinksContext);

    const [completedIconCrop, setCompletedIconCrop] = useState({});
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState(16 / 5)

    // if a custom icon is selected
    const [imageSelected, setImageSelected] = useState(false);

    //image cropping
    const [upImg, setUpImg] = useState(null);
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: "%", width: 100, aspect: 16 / 5 });

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
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }

        await resizeFile(files[0]).then((image) => {
            createImage(image, setUpImg);
            setCrop(undefined)
            setImageSelected(true);
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
                    bg_image: response.key,
                    ext: response.extension,
                };
                updateLink(packets, currentLink.id)
                .then((data) => {
                    setShowLoader({
                        show: false,
                        icon: "",
                        position: "",
                        progress: null
                    });
                    setShowBGUpload(false);

                    dispatch({
                        type: LINKS_ACTIONS.UPDATE_LINK,
                        payload: {
                            editID: currentLink.id,
                            bg_image: data.imagePath.bg_image,
                        }})
                });
            });
        });
    }

    return (
        <>
            {imageSelected &&
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
                    <div className="icon_col relative">
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
                            <img className="max-w-10 rounded-lg" src={currentLink.icon || Vapor.asset('images/icon-placeholder.png')} alt=""/>
                            <p>{currentLink.name || "Icon Name"}</p>
                        </div>
                    </div>
                </div>
            }
            <div className="icon_row">
                <div className="icon_box">
                    <div className="uploader">
                        {imageSelected ?
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
                            <>
                                <p className="mb-2 text-center">Upload a background image for your button</p>
                                <label htmlFor="custom_icon_upload" className="custom !uppercase button blue">
                                    Select Image
                                </label>
                            </>
                        }
                        <input id="custom_icon_upload" type="file" className="custom" onChange={selectImage} accept="image/png, image/jpeg, image/jpg, image/gif"/>
                        <div className="my_row info_text file_types text-center mb-2 !pl-0 !pr-0">
                            <p className="m-0 char_count w-100">Allowed File Types: <span>png, jpg, jpeg, gif</span>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default ImageUploader;
