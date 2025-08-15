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
        const windowWidth = window.innerWidth

        setTimeout(() => {
            const {center, top} = infoLocation;
            const vert = windowWidth < 850 ? (top - infoBox.offsetHeight) - 10 : (top - infoBox.offsetHeight / 2);
            let horz = windowWidth < 850 ? (center - infoBox.offsetWidth) + 15 : (center + infoBox.offsetWidth / 15 );

            if (horz < 80 && windowWidth > 768) {
                horz = 80;
            }

            if (horz < 0 && windowWidth < 769) {
                horz = 20;
            }

            infoBox.style.left = ` ${horz}px`;
            infoBox.style.top = `${vert}px`;
        })

        if (infoText?.section.includes('creator') || infoText?.section.includes('course')) {
            if (windowWidth < 600) {
                infoBox.style.maxWidth = '80%';
            } else {
                infoBox.style.maxWidth = `${divRef.current.offsetWidth * .62}px`
            }

        } else {
            infoBox.style.maxWidth = `${divRef.current.offsetWidth * .82}px`
        }
    }, [infoLocation, infoText])

    useEffect(() => {

        function handleResize() {
            const infoBox = infoDiv.current;
            const {center, top} = infoLocation;
            const windowWidth = window.innerWidth
            setTriangleType();
            let wrapWidth;
            if (infoText.section.includes('creator')) {
                if (windowWidth < 600) {
                    infoBox.style.maxWidth = '80%';
                } else {
                    wrapWidth = divRef.current.offsetWidth * .62;
                }
            } else {
                wrapWidth = divRef.current.offsetWidth * .82;
            }

            //const wrapWidth = divRef.current.offsetWidth * .92;

            const vert =  windowWidth < 850 ? (top - infoDiv.current.offsetHeight) - 10 : (top - infoDiv.current.offsetHeight  / 2 );
            let horz = windowWidth < 850 ? (center - infoDiv.current.offsetWidth) + 15 : (center - infoDiv.current.offsetWidth / 15);

            if (horz < 80 && windowWidth > 768) {
                horz = 80;
            }

            if (horz < 0 && windowWidth < 769) {
                horz = 20;
            }

            infoBox.style.left = `${horz}px`;
            infoBox.style.top = `${vert}px`;
            infoBox.style.maxWidth = `${wrapWidth}px`;
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    },[])

    const setTriangleType = () => {
        if(window.innerWidth < 850) {
            return (
                <VscTriangleDown />
            )
        } else {
            return (
                <VscTriangleLeft />
            )
        }

    }

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
                {setTriangleType()}
            </div>
        </div>

    );
};

export default InfoText;
