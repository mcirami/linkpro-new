import React from 'react';
import { TrackIconClick } from '@/Services/TrackClicks.jsx';
import { IoOpenOutline } from "react-icons/io5";

/**
 * Full-width inline video embed used on the stacked button layout (layout_two).
 * Shows the embedded player as tall as a 16:9 video needs, with the title and
 * an optional call-to-action link beneath it.
 */
const VideoButton = ({ id, name, embedUrl, url, viewType }) => {

    return (
        <div className="video_button my_row">
            {embedUrl ?
                <div className="video_wrapper">
                    <iframe
                        src={embedUrl}
                        title={name || "Video"}
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
                        allowFullScreen
                    ></iframe>
                </div>
                :
                <div className="video_placeholder">
                    <img src={Vapor.asset('images/image-placeholder.jpg')} alt=""/>
                </div>
            }

            <div className="video_info">
                <h3>{name || "Video Title"}</h3>
                {url &&
                    <a
                        className="video_cta flex items-center justify-between"
                        target="_blank"
                        href={url}
                        onClick={() => viewType === "live" && TrackIconClick(id)}
                    >
                        <span>{url}</span>
                        <IoOpenOutline />
                    </a>
                }
            </div>
        </div>
    );
};

export default VideoButton;
