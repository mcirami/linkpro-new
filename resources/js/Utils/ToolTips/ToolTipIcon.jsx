import React, {useContext, useEffect} from 'react';
import {BiHelpCircle} from 'react-icons/bi';
import ToolTipContext from './ToolTipContext'
import data from './data';

const ToolTipIcon = ({section}) => {

    const {
        setInfoText,
        setInfoTextOpen,
        infoLocation,
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

    const handleMouseOver = (e) => {

        const name = e.target.dataset.section;
        const dataText = data.find((text) => text.section === name);
        setInfoText(dataText);
        setInfoTextOpen(true);

        const windowWidth = window.innerWidth;
        const rect = e.target.getBoundingClientRect();
        const center = (rect.left + rect.right) / 2;
        const top = windowWidth < 850 ? rect.top - 2 : rect.top + 10;
        setInfoLocation({center, top});

        const triangleTop = windowWidth < 850 ? rect.top - 25 : rect.top;
        const triangleLeft = windowWidth < 850 ? rect.left - 5 : rect.left + 38;
        triangleRef.style.top = `${triangleTop}px`;
        triangleRef.style.bottom = `${rect.bottom}px`;
        triangleRef.style.left = `${triangleLeft}px`;
        //triangleRef.style.right = `${rect.right}px`;
    }

    const handleClick = (e) => {

        if (!infoClicked) {
            setInfoClicked(e.target);
        } else {
            setInfoClicked(null)
            setInfoTextOpen(false);
            return;
        }

        const name = e.target.dataset.section;
        const dataText = data.find((text) => text.section === name);
        setInfoText(dataText);
        setInfoTextOpen(true);

        const windowWidth = window.innerWidth;
        const rect = e.target.getBoundingClientRect();
        const center = (rect.left + rect.right) / 2;
        const top = windowWidth < 850 ? rect.top - 2 : rect.top;
        setInfoLocation({center, top});

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
                    className="h-6 w-6 grid place-items-center rounded-full border border-gray-300 text-gray-500
                   hover:text-indigo-600 hover:border-indigo-300 focus:outline-none focus:ring-2
                   focus:ring-indigo-200 transition"
                >
                    ?
                </span>
            </div>

        </div>

    );
};

export default ToolTipIcon;
