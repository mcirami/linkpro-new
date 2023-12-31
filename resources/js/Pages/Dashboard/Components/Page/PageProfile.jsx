import React, {
    useState,
    useContext,
    useRef,
    forwardRef,
} from 'react';
import {MdEdit} from 'react-icons/md';
import {PageContext} from '../../Dashboard.jsx';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import {profileImage} from '@/Services/PageRequests.jsx';
import {
    canvasPreview,
    useDebounceEffect,
    onImageLoad,
    createImage, getFileToUpload,
} from '@/Services/ImageService.jsx';
import ToolTipIcon from '@/Utils/ToolTips/ToolTipIcon';
import CropTools from '@/Utils/CropTools';
import EventBus from '@/Utils/Bus';

const PageProfile = forwardRef(function PageProfile(props, ref) {

    const {
        completedCrop,
        setCompletedCrop,
        setShowLoader,
        elementName
    } = props

    const { pageSettings, setPageSettings } = useContext(PageContext);

    const [disableButton, setDisableButton] = useState(true);
    const [upImg, setUpImg] = useState(null);
    const imgRef = useRef();
    const previewCanvasRef = ref;
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 });
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState(1)

    useDebounceEffect(
        async () => {
            if (
                completedCrop[elementName]?.isCompleted.width &&
                completedCrop[elementName]?.isCompleted.height &&
                imgRef.current &&
                previewCanvasRef.current[elementName]
            ) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current[elementName],
                    completedCrop[elementName].isCompleted,
                    scale,
                    rotate,
                )
            }
        },
        100,
        [completedCrop[elementName]?.isCompleted, scale, rotate],
    )

    const onSelectFile = e => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }
        setCrop(undefined);
        setDisableButton(false);
        document.querySelector('form.profile_img_form .bottom_section').classList.remove('hidden');
        if (window.innerWidth < 993) {
            document.querySelector('.profile_img_form').scrollIntoView({
                behavior: 'smooth',
            });
        }
        createImage(files[0], setUpImg);
    }

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
    }

    const fileUpload = (image) => {

        setShowLoader({show: true, icon: "upload", position: "fixed"})
        window.Vapor.store(
            image,
            {
                visibility: "public-read"
            },
            {
                progress: progress => {
                    this.uploadProgress = Math.round(progress * 100);
                }
            }
        ).then(response => {

            const packets = {
                profile_img: response.key,
                ext: response.extension
            };

            profileImage(packets, pageSettings["id"], pageSettings["default"])
            .then((data) => {
                setShowLoader({show: false, icon: null, position: ""})
                if (data.success) {
                    setUpImg(null)
                    const newArray = {...pageSettings};
                    newArray.profile_img = data.imgPath;
                    setPageSettings(newArray);
                    document.querySelector('form.profile_img_form .bottom_section').classList.add('hidden');
                }
            })
        }).catch(error => {
            console.error(error);
            setDisableButton(false);
            EventBus.dispatch("error", { message: "There was an error saving your image." });
        });

    }
    const handleCancel = () => {
        setUpImg(null)

        const copy = {...completedCrop};
        delete copy[elementName];
        setCompletedCrop(copy);

        document.querySelector('form.profile_img_form .bottom_section').classList.add('hidden');
    }

    return (
        <div className="my_row page_settings">
            <div className="column_wrap">
                <form onSubmit={handleSubmit} className="profile_img_form">

                    {!upImg &&
                        <>
                            <div className="top_section">

                                <label htmlFor="profile_file_upload" className="custom">
                                    Profile Image
                                    <span className="edit_icon">
                                            <MdEdit/>
                                        <div className="hover_text edit_image"><p>Edit Profile Image</p></div>
                                    </span>
                                </label>
                                <input className="custom" id="profile_file_upload" type="file" accept="image/png, image/jpeg, image/jpg, image/gif"
                                       onChange={onSelectFile}
                                />
                            </div>
                            <div className="my_row info_text file_types">
                                <p className="m-0 char_count w-100 ">Allowed File Types: <span>png, jpg, jpeg, gif</span></p>
                            </div>
                        </>
                    }
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
                                    onLoad={(e) => onImageLoad(e,aspect, setCrop)}
                                    src={upImg}
                                    ref={imgRef}
                                    style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                    alt="Crop me"/>
                            </ReactCrop>
                        </div>
                        <div className="bottom_row">
                            <button type="submit"
                                    className="button green"
                                    disabled={disableButton}>
                                Save
                            </button>
                            <a className="button transparent gray" href="#"
                               onClick={(e) => {
                                   e.preventDefault();
                                   handleCancel();
                               }}
                            >
                                Cancel
                            </a>
                            <a className="help_link" href="mailto:help@link.pro">Need Help?</a>
                        </div>
                    </div>
                </form>
            </div>
            {!upImg &&
                <ToolTipIcon section="profile" />
            }
        </div>

    )
})

export default PageProfile;
