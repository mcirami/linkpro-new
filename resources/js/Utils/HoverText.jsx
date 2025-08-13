import React, {createRef, useEffect} from 'react';

const HoverText = ({ text }) => {

    const hoverText = createRef();

    useEffect(() => {

        const width = hoverText.current.clientWidth + 15;
        hoverText.current.style.right = "-" + width + "px";

    },[])

    return (
        <div className="hover_text transition" ref={hoverText}>
            <p className="uppercase">{text}</p>
        </div>
    );
};

export default HoverText;
