import React, { useEffect, useState } from "react";
import { IoOpenOutline } from "react-icons/io5";
const LivePageButton = ({
                            pageName = null,
                            url = null
}) => {

    const host = window.location.origin;
    const [buttonLink, setButtonLink] = useState(pageName ?  host + '/' + pageName : url);

    useEffect(() => {
        setButtonLink(pageName ?  host + '/' + pageName : url);
    }, [pageName, url])

    return (
        <a className="button green !w-60 !flex justify-center items-center gap-4 shadow-md" target="_blank" href={buttonLink}>
            <p>Open Live Page</p>
            <IoOpenOutline />
        </a>
    );
};

export default LivePageButton;
