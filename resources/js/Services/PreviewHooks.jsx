import {useLayoutEffect, useState} from 'react';

export function UseLoadPreviewHeight (altPxToMinus = null) {

    let [previewHeight, setPreviewHeight] = useState(null);

    useLayoutEffect(() => {
        if (typeof window !== 'undefined' && document.getElementById('preview_wrap')) {

            setPreviewHeight(resizePreviewHeight(altPxToMinus));
        }
    }, [altPxToMinus]);

    return previewHeight
}

export function UseResizePreviewHeight(altPxToMinus = null) {

    let [previewHeight, setPreviewHeight] = useState(null);

    useLayoutEffect(() => {

        if (typeof window !== 'undefined') {

            function handlePreviewHeight() {
                setPreviewHeight(resizePreviewHeight(altPxToMinus))
            }

            window.addEventListener('resize', handlePreviewHeight);
            return () => {
                window.removeEventListener('resize', handlePreviewHeight);
            }
        }
    }, [altPxToMinus]);

    return previewHeight
}

function resizePreviewHeight(altPxToMinus) {
    const windowWidth = window.outerWidth;

    const innerContent = document.getElementById('preview_wrap');

    let pixelsToMinus;
    if (windowWidth > 551) {
        pixelsToMinus = altPxToMinus || 30
    } else {
        pixelsToMinus = 20;
    }

    return innerContent.offsetHeight - pixelsToMinus;
}
