import React from "react";

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
