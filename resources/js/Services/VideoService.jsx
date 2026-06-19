import React from "react";

/**
 * Convert a pasted YouTube/Vimeo URL into a proper embeddable iframe src.
 * Already-embeddable URLs are returned unchanged.
 */
export const checkEmbedLink = (link) => {
    if (!link) {
        return link;
    }

    //return proper embed link with video code.
    if (link.includes("embed")) {
        return link;
    } else if (link.includes("youtube") && link.includes("v=")) {
        let split = link.split("v=")[1];
        if (split.includes("&")) {
            split = split.split("&")[0];
        }
        return "https://www.youtube.com/embed/" + split;
    } else if (link.includes("youtu.be")) {
        const split = link.split("youtu.be/");
        return "https://www.youtube.com/embed/" + split[1];
    } else if (link.includes("vimeo") && !link.includes("player")) {
        const split = link.split("vimeo.com/");
        return "https://player.vimeo.com/video/" + split[1];
    }
    return link;
};

export const getVideoScreenshot = (videoUrl) => {
    let split;
    if (videoUrl.includes("youtube")) {
        let embedCode = "";
        split = videoUrl.split("/embed/")[1];

        if (split.includes("?")) {
            embedCode = split.split("?")[0];
        } else {
            embedCode = split;
        }

        return "https://img.youtube.com/vi/" + embedCode + "/mqdefault.jpg";
    } else {
        if (videoUrl.includes("/video/")) {
            split = videoUrl.split("/video/")[1];
        } else if (videoUrl.includes("vimeo.com")) {
            split = videoUrl.split("vimeo.com/")[1];
        }

        return "https://vumbnail.com/" + split + ".jpg";
    }
};
