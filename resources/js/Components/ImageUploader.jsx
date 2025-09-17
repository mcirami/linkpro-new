import React, { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import Compressor from 'compressorjs';
import { FiUploadCloud } from 'react-icons/fi';
import {
    useDebounceEffect,
    onImageLoad,
    createImage,
    getFileToUpload,
    resizeFile,
} from '@/Services/ImageService.jsx';
import CropTools from '@/Utils/CropTools.jsx';
import EventBus from '@/Utils/Bus.jsx';

const ImageUploader = ({
                           elementName,
                           label,
                           cropSettings = { unit: '%', width: 30 },
                           aspect = null,
                           onUpload,
                           setShowLoader,
                           previewCanvasRef = null,
                           completedCrop = null,
                           setCompletedCrop = null,
                           onImageSelect = null,
                       }) => {
    const [upImg, setUpImg] = useState(null);
    const imgRef = useRef(null);
    const internalPreviewCanvasRef = useRef(null);
    const previewRef = previewCanvasRef || internalPreviewCanvasRef;

    const [crop, setCrop] = useState(cropSettings);
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const [disableButton, setDisableButton] = useState(true);
    const [internalCompletedCrop, setInternalCompletedCrop] = useState(null);

    useEffect(() => {
        setCrop(cropSettings);
    }, [cropSettings]);

    useEffect(() => {
        if (aspect !== undefined && aspect !== null) {
            setCrop((prev) => ({ ...prev, aspect: aspect }));
        }
    }, [aspect]);

    if (setCompletedCrop) {
        useDebounceEffect(
            completedCrop,
            null,
            elementName,
            imgRef,
            previewCanvasRef,
            scale,
            rotate
        );
    } else {
        useDebounceEffect(
            null,
            internalCompletedCrop,
            null,
            imgRef,
            previewRef,
            scale,
            rotate
        );
    }

    const onSelectFile = async (e) => {
        e.preventDefault();
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }
        onImageSelect?.(true);
        await resizeFile(files[0]).then((image) => {
            new Compressor(image, {
                quality: 0.8,
                success(result) {
                    createImage(result, setUpImg);
                },
            });
            setCrop(undefined);
            setDisableButton(false);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setDisableButton(true);
        const canvas = previewRef?.current[elementName] || previewRef?.current;
        const image = getFileToUpload(canvas);
        image
        .then((value) => {
            fileUpload(value);
        })
        .catch((error) => {
            console.error(error);
            setDisableButton(false);
        });
    };

    const fileUpload = (image) => {
        setShowLoader?.({ show: true, icon: 'upload', position: 'fixed', progress: null });
        window.Vapor.store(image, {
            visibility: 'public-read',
            progress: (progress) => {
                setShowLoader?.((prev) => ({
                    ...prev,
                    progress: Math.round(progress * 100),
                }));
            },
        })
        .then((response) => {
            const maybePromise = onUpload ? onUpload(response) : Promise.resolve();
            return Promise.resolve(maybePromise).then(() => {
                cleanup();
            });
        })
        .catch((error) => {
            console.error(error);
            EventBus.dispatch('error', { message: 'There was an error saving your image.' });
            setDisableButton(false);
            setShowLoader?.({ show: false, icon: null, position: '', progress: null });
        });
    };

    const cleanup = () => {
        setShowLoader?.({ show: false, icon: null, position: '', progress: null });
        setUpImg(null);
        onImageSelect?.(false);
        if (setCompletedCrop) {
            setCompletedCrop((prev) => ({ ...prev, [elementName]: {} }));
        } else {
            setInternalCompletedCrop(null);
        }
    };

    const handleCancel = () => {
        setUpImg(null);
        onImageSelect?.(false);
        if (setCompletedCrop) {
            setCompletedCrop((prev) => {
                const copy = { ...prev };
                delete copy[elementName];
                return copy;
            });
        } else {
            setInternalCompletedCrop(null);
        }
    };

    return (
        <div className="my_row ">
            <div className="column_wrap">
                <form onSubmit={handleSubmit} className={elementName}>
                    {!upImg && (
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragActive(true);
                            }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={onSelectFile}
                            className={`rounded-xl border-2 border-dashed p-12 text-center transition ${
                                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
                            }`}
                        >
                            <FiUploadCloud size={48} className="mx-auto text-gray-400 mb-3" />
                            <p className="text-sm font-medium text-gray-600">
                                Drop your <span className="font-bold">{label}</span> here, or{' '}
                                <label htmlFor={`file-upload-${elementName}`} className="text-blue-600 underline cursor-pointer">
                                    browse
                                </label>
                            </p>
                            <div className="my_row info_text file_types w-full text-center">
                                <p className="m-0 char_count  ">
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
                    )}
                    {upImg && (
                        <div className="bottom_section">
                            <div className="crop_section">
                                <CropTools rotate={rotate} setRotate={setRotate} scale={scale} setScale={setScale} />
                                <ReactCrop
                                    crop={crop}
                                    aspect={aspect}
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    onComplete={(c) => {
                                        if (setCompletedCrop) {
                                            setCompletedCrop((prev) => ({
                                                ...prev,
                                                [elementName]: { isCompleted: c },
                                            }));
                                        } else {
                                            setInternalCompletedCrop(c);
                                        }
                                    }}
                                >
                                    <img
                                        onLoad={(e) => onImageLoad(e, aspect, setCrop)}
                                        src={upImg}
                                        ref={imgRef}
                                        style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                        alt="Crop Me"
                                    />
                                </ReactCrop>
                            </div>
                            {!previewCanvasRef && (
                                <>
                                <p className="capitalize text-center text-sm">Preview</p>
                                <div className={`canvas_wrap ml-auto mr-auto mb-5 relative ${elementName}`}>
                                    <canvas
                                        ref={previewRef}
                                        style={{
                                            backgroundSize: 'cover',
                                            backgroundRepeat: 'no-repeat',
                                            width: upImg ? '100%' : 0,
                                            height: upImg ? '100%' : 0,
                                            borderRadius: elementName === 'icon' ? '20px' : '8px',
                                        }}
                                    />
                                </div>
                                </>
                            )}
                            <div className="bottom_row w-full flex justify-between items-center flex-wrap">
                                <button type="submit" className="button green" disabled={disableButton}>
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
                                <a className="help_link w-full flex justify-end mt-3" href="mailto:help@link.pro">
                                    Need Help?
                                </a>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ImageUploader;
