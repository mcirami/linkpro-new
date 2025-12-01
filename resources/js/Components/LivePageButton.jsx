import React, { useEffect, useState } from "react";
import { IoOpenOutline } from "react-icons/io5";
import StandardButton from "@/Components/StandardButton.jsx";
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
        <StandardButton
            text="Open Live Page"
            classes="w-full"
            icon={<IoOpenOutline />}
            onClick={() => window.open(buttonLink, '_blank')}
        />
    );
};

export default LivePageButton;
