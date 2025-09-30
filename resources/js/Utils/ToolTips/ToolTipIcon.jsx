import React, {useContext, useEffect} from 'react';
import ToolTipContext from './ToolTipContext'
import data from './data';

const ToolTipIcon = ({
                         section,
                         circleSize = null,
                         iconSize= null,
}) => {

    const {
        setInfoText,
        setInfoTextOpen,
        setInfoLocation,
        infoClicked,
        setInfoClicked,
        triangleRef
    } = useContext(ToolTipContext);

    useEffect(() => {

        function handleScroll() {
            setInfoTextOpen(false);
            setInfoClicked(null)
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    })

    useEffect(() => {

        function handleResize() {
            setInfoTextOpen(false);
            setInfoClicked(null)
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    })

    //const handleMouseOver = (e) => {

    const updateInfoLocation = (target) => {
        if (!target) {
            return;
        }

        const rect = target.getBoundingClientRect();
        const center = (rect.left + rect.right) / 2;
        const top = rect.top - 2;

        setInfoLocation({
            center,
            top,
            left: rect.left,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
        });

        if (triangleRef) {
            const triangleHeight = triangleRef.offsetHeight || 25;
            const triangleWidth = triangleRef.offsetWidth || 25;
            const triangleTop = rect.top - triangleHeight;
            const triangleLeft = center - triangleWidth / 2;
            triangleRef.style.top = `${triangleTop}px`;
            triangleRef.style.left = `${triangleLeft}px`;
        }
    };

    const openToolTip = (target) => {
        if (!target) {
            return;
        }

        const name = target.dataset.section;

        if (!name) {
            return;
        }

        const dataText = data.find((text) => text.section === name);
        setInfoText(dataText);
        setInfoTextOpen(true);
        updateInfoLocation(target);
    };

    const handleMouseOver = (e) => {
        openToolTip(e.currentTarget);
    }

    const handleClick = (e) => {

        const target = e.currentTarget;

        if (!infoClicked) {
            setInfoClicked(target);
        } else {
            setInfoClicked(null)
            setInfoTextOpen(false);
            return;
        }

        openToolTip(target);
        if (infoClicked === false) {
            setInfoClicked(null)
        }
    }

    const handleMouseLeave = () => {
        if (!infoClicked) {
            setInfoTextOpen(false)
        }
    }

    return (
        <div
            className="tooltip_icon"
        >
            <div className="icon_wrap relative"
                 onMouseLeave={() => {
                     handleMouseLeave()
                 }}
                 onClick={(e) => {
                     handleClick(e)
                 }}
                 onMouseOver={(e) => handleMouseOver(e)}
                 data-section={section}
            >
                <span
                    className={` ${circleSize || 'h-5 w-5'} ${iconSize || 'text-sm'} flex justify-center items-center rounded-full border border-gray-300 text-gray-500
                   hover:text-indigo-600 hover:border-indigo-300 focus:outline-none focus:ring-2
                   focus:ring-indigo-200 transition`}
                >
                    ?
                </span>
            </div>

        </div>

    );
};

export default ToolTipIcon;
