import React, {useContext, useEffect, useRef} from 'react';
import ToolTipContext from './ToolTipContext'
import {VscTriangleDown, VscTriangleLeft} from 'react-icons/vsc';

const InfoText = ({divRef}) => {

    const infoDiv = useRef();

    const {
        infoText,
        infoLocation,
        infoTextOpen,
        setTriangleRef
    } = useContext(ToolTipContext);

    useEffect(() => {

        const infoBox = infoDiv.current;

        if(!infoBox || !infoLocation || typeof infoLocation.center !== 'number') {
            return;
        }
        const handleResize = () => {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const margin = 16;
            const pointerOffset = 12;

            const menuWrapper = document.querySelector('.menu_wrap');
            const menuRect = menuWrapper ? menuWrapper.getBoundingClientRect() : null;
            const menuStyles = menuWrapper ? window.getComputedStyle(menuWrapper) : null;
            const isMenuVisible = menuRect && menuStyles && menuStyles.display !== 'none' && menuStyles.visibility !== 'hidden' && menuRect.width > 0;
            const leftBoundary = isMenuVisible ? Math.max(margin, menuRect.left + menuRect.width + margin) : margin;
            const rightBoundary = windowWidth - margin;

            if (divRef?.current) {
                if (infoText?.section?.includes('creator') || infoText?.section?.includes('course')) {
                    if (windowWidth < 600) {
                        infoBox.style.maxWidth = '80%';
                    } else {
                        infoBox.style.maxWidth = `${divRef.current.offsetWidth * .62}px`;
                    }
                } else {
                    infoBox.style.maxWidth = `${divRef.current.offsetWidth * .82}px`;
                }
            } else if (windowWidth < 600) {
                infoBox.style.maxWidth = '80%';
            } else {
                infoBox.style.maxWidth = '600px';
            }

            const boxWidth = infoBox.offsetWidth;
            const boxHeight = infoBox.offsetHeight;
            const {center, top} = infoLocation;

            let leftPosition = center - boxWidth / 2;
            const availableWidth = rightBoundary - leftBoundary;
            const maxLeft = rightBoundary - boxWidth;


            if (availableWidth <= 0) {
                leftPosition = leftBoundary;
            } else if (boxWidth > availableWidth) {
                leftPosition = leftBoundary;
            } else {
                leftPosition = Math.min(Math.max(leftPosition, leftBoundary), maxLeft);

                if (center < leftPosition + pointerOffset) {
                    leftPosition = Math.max(leftBoundary, center - pointerOffset);
                } else if (center > leftPosition + boxWidth - pointerOffset) {
                    leftPosition = Math.min(center + pointerOffset - boxWidth, maxLeft);
                }
                leftPosition = Math.min(Math.max(leftPosition, leftBoundary), maxLeft);
            }

            let topPosition = top - boxHeight - 10;
            const maxTop = windowHeight - margin - boxHeight;
            topPosition = Math.min(Math.max(topPosition, margin), maxTop);

            infoBox.style.left = `${leftPosition}px`;
            infoBox.style.top = `${topPosition}px`;
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    },[divRef, infoLocation, infoText])

    return (

        <div ref={infoDiv} className={`${infoTextOpen ?
            "hover_text help open" :
            "hover_text help"}`}>

                {infoText?.text?.map((text, index) => {
                    return (
                        <React.Fragment key={index}>
                            {text.title &&
                                <h3>{text.title}</h3>
                            }
                            <p>{text.description}</p>
                            {text.subTitle &&
                                <h5>{text.subTitle}</h5>
                            }
                            {text.tip &&
                                <p>{text.tip}</p>
                            }
                        </React.Fragment>
                    )
                })}

            <div ref={newRef => setTriangleRef(newRef)} className="info_text_triangle">
                <VscTriangleDown />
            </div>
        </div>

    );
};

export default InfoText;
