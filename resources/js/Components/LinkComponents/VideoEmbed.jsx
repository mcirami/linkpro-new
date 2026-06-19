import React from 'react';
import { TrackIconClick } from '@/Services/TrackClicks.jsx';
import { IoOpenOutline } from "react-icons/io5";

/**
 * Drop-down video embed used on the grid layout (layout_one). Opens beneath the
 * tile icon the same way the Mailchimp form / folder accordion does, and holds
 * the embedded player plus the optional title and call-to-action link.
 */
const VideoEmbed = ({ dataRow, row, id, name, embedUrl, url, viewType }) => {

    // Mount only on the matching row. Rendering a collapsed wrapper at every row
    // boundary (like StoreProducts does) would insert empty grid cells and break
    // the layout — the folder accordion avoids this by mounting conditionally.
    if (!embedUrl || dataRow !== row) {
        return null;
    }

    return (
        <div className="my_row folder video open">
            <div className="folder_content">
                <div className="video_wrapper">
                    <iframe
                        src={embedUrl}
                        title={name || "Video"}
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="video_info">
                    {name && <h3>{name}</h3>}
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
        </div>
    );
};

export default VideoEmbed;
