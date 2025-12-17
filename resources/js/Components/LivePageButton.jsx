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
            colors="bg-gradient-to-r from-green-600 via-green-600 to-green-600 shadow-green-500/20 focus-visible:ring-2 focus-visible:ring-green-400"
            icon={<IoOpenOutline />}
            onClick={() => window.open(buttonLink, '_blank')}
        />
    );
};

export default LivePageButton;
