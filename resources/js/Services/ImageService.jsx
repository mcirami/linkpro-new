import {useEffect} from 'react';
import {centerCrop, makeAspectCrop} from 'react-image-crop';
import Resizer from 'react-image-file-resizer';

const DEFAULT_PREVIEW_MAX_DIMENSION = 1920;
const DEFAULT_UPLOAD_MAX_DIMENSION = 1920;
const DEFAULT_UPLOAD_QUALITY = 0.82;
const DEFAULT_UPLOAD_TYPES = ['image/webp', 'image/jpeg', 'image/png'];

const socialArray = [
    "facebook",
    "instagram",
    "x",
    "tiktok",
    "snapchat",
    "youtube",
    "onlyfans",
    "email",
    "google mail",
    "phone",
    "slack",
    "telegram",
    "skype"
]

const TO_RADIANS = Math.PI / 180

export async function canvasPreview(
    image,
    canvas,
    crop,
    scale = 1,
    rotate = 0,
) {
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('No 2d context')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    // devicePixelRatio slightly increases sharpness on retina devices
    // at the expense of slightly slower render times and needing to
    // size the image back down if you want to download/upload and be
    // true to the images natural size.
    //const pixelRatio = window.devicePixelRatio
    const pixelRatio = 2

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'

    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY

    const rotateRads = rotate * TO_RADIANS
    const centerX = image.naturalWidth / 2
    const centerY = image.naturalHeight / 2

    ctx.save()

    // 5) Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY)
    // 4) Move the origin to the center of the original position
    ctx.translate(centerX, centerY)
    // 3) Rotate around the origin
    ctx.rotate(rotateRads)
    // 2) Scale the image
    ctx.scale(scale, scale)
    // 1) Move the center of the image to the origin (0,0)
    ctx.translate(-centerX, -centerY)
    ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
    )

    ctx.restore()
}

export const createImage = (
    file,
    setUpImg,
) => {
    let reader = new FileReader();
    reader.addEventListener('load', (e) => {
        setUpImg(e.target.result);
    });
    reader.readAsDataURL(file);
};

export const resizeFile = (file) => new Promise(resolve => {
    const format = file?.type === 'image/png' ? 'PNG' : 'WEBP';
    Resizer.imageFileResizer(
        file,
        DEFAULT_PREVIEW_MAX_DIMENSION,
        DEFAULT_PREVIEW_MAX_DIMENSION,
        format,
        90,
        0,
        (uri) => {
            resolve(uri);
        },
        'blob',
    );
});

export const getIconPaths = (iconPaths) => {

    let iconArray = [];

    iconPaths.map((iconPath) => {
        const end = iconPath.lastIndexOf("/");
        const newPath = iconPath.slice(end);
        const newArray = newPath.split(".")
        const iconName = newArray[0].replace("/", "");
        let type = "";
        const name = iconName.toLowerCase();
        if(name.includes("phone") || name.includes("facetime")) {
            type = "phone";
        }else if (name.includes("mail") && !name.includes("mailchimp") ) {
            type = "email";
        } else {
            type = "url";
        }
        const tmp = {"name": iconName.replace("-", " "), "path" : iconPath, "type": type}
        iconArray.push(tmp);
    });

    let count = 0;
    socialArray.map((name, index) => {
        const iconIndex = iconArray.findIndex(object => {
            return object.name.toLowerCase() === name
        })

        move(iconArray, iconIndex, count);
        ++count;
    })

    return iconArray;
}

export function useDebounceEffect(
    completedCrop,
    completedIconCrop,
    elementName,
    imgRef,
    previewCanvasRef,
    scale,
    rotate
) {

    const useEffectDeps = completedCrop && elementName ?
        [completedCrop[elementName]?.isCompleted, scale, rotate] :
        [completedIconCrop, scale, rotate]

    useEffect(() => {
        const t = setTimeout(() => {
            if(elementName && completedCrop) {
                (async () => {
                    if (
                        completedCrop[elementName]?.isCompleted.width &&
                        completedCrop[elementName]?.isCompleted.height &&
                        imgRef.current &&
                        previewCanvasRef?.current[elementName]
                    ) {
                        // We use canvasPreview as it's much faster than imgPreview.
                        await canvasPreview(
                            imgRef.current,
                            previewCanvasRef?.current[elementName],
                            completedCrop[elementName]?.isCompleted,
                            scale,
                            rotate,
                        )
                    }
                }).apply(undefined, [completedCrop[elementName]?.isCompleted, scale, rotate])
            } else {
                (async () => {
                    if (
                        completedIconCrop?.width &&
                        completedIconCrop?.height &&
                        imgRef.current &&
                        previewCanvasRef.current
                    ) {
                        // We use canvasPreview as it's much faster than imgPreview.
                        await canvasPreview(
                            imgRef.current,
                            previewCanvasRef.current,
                            completedIconCrop,
                            scale,
                            rotate,
                        )
                    }
                }).apply(undefined, [completedIconCrop, scale, rotate])
            }

        }, 100)

        return () => {
            clearTimeout(t)
        }
    }, useEffectDeps)
}

export function centerAspectCrop(
    mediaWidth,
    mediaHeight,
    aspect,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

export function onImageLoad(e, aspect, setCrop) {
    if (aspect) {
        const {width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, aspect))
    }
}

export const getFileToUpload = async (ref, options = {}) => {
    if (!ref) {
        throw new Error('Canvas reference missing when attempting to export image');
    }

    const {
        maxDimension = DEFAULT_UPLOAD_MAX_DIMENSION,
        quality = DEFAULT_UPLOAD_QUALITY,
        outputTypes = DEFAULT_UPLOAD_TYPES,
    } = options;

    const scaledCanvas = scaleCanvas(ref, maxDimension);
    const { blob, type } = await toBlobWithFallback(scaledCanvas, outputTypes, quality);

    const extension = type?.split('/')?.[1] || 'webp';
    return new File([blob], `cropped.${extension}`, { type });
}

const scaleCanvas = (canvas, maxDimension) => {
    if (!maxDimension || typeof document === 'undefined') {
        return canvas;
    }

    const { width, height } = canvas;
    const largestSide = Math.max(width, height);

    if (!largestSide || largestSide <= maxDimension) {
        return canvas;
    }

    const ratio = maxDimension / largestSide;
    const offscreen = document.createElement('canvas');
    offscreen.width = Math.round(width * ratio);
    offscreen.height = Math.round(height * ratio);

    const context = offscreen.getContext('2d');

    if (!context) {
        return canvas;
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(canvas, 0, 0, offscreen.width, offscreen.height);

    return offscreen;
};

const toBlobWithFallback = (canvas, outputTypes, quality) => {
    const tryCreateBlob = (types) => new Promise((resolve, reject) => {
        if (!types.length) {
            canvas.toBlob((fallbackBlob) => {
                if (fallbackBlob) {
                    resolve({ blob: fallbackBlob, type: fallbackBlob.type || 'image/png' });
                } else {
                    reject(new Error('Unable to export image from canvas'));
                }
            });
            return;
        }

        const [currentType, ...rest] = types;
        canvas.toBlob((blob) => {
            if (blob) {
                resolve({ blob, type: blob.type || currentType });
                return;
            }

            tryCreateBlob(rest).then(resolve).catch(reject);
        }, currentType, quality);
    });

    return tryCreateBlob(Array.isArray(outputTypes) ? outputTypes : DEFAULT_UPLOAD_TYPES);
};


export const handleScaleChange = (
    e,
    scale,
    setScale,
    action
) => {
    e.preventDefault();
    let result = null;

    if(action === "increase") {
        result = Math.round( (scale + .1) * 10) / 10;
    }

    if (action === "decrease") {
        result = Math.round((scale - .1) * 10) / 10;
    }

    setScale(result);
}

export const handleRotateChange = (
    e,
    rotate,
    setRotate,
    action
) => {
    e.preventDefault();
    let result = null;
    if (action === "increase") {
        result = Math.min(180, Math.max(-180, Number(rotate + 1)))
    }

    if (action === "decrease") {
        result = Math.min(180, Math.max(-180, Number(rotate - 1)))
    }

    setRotate(result)
}

function move(arr, old_index, new_index) {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        let k = new_index - arr.length;
        while ((k--) + 1) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}


