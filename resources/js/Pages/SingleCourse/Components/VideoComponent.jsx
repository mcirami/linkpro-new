import React from 'react';

const VideoComponent = ({indexValue, sections}) => {

    return (
        <div className="video_viewer my_row">
            <div className="video_content" style={{ background: sections[indexValue].background_color}}>
                <div className={`my_row folder open`}>
                    <div className="video_wrapper">
                        <iframe src={sections[indexValue].video_link} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
                    </div>
                </div>
                <div className="video_description my_row">
                    <h3 style={{ color: sections[indexValue].text_color}}>{sections[indexValue].video_title}</h3>
                    <p style={{ color: sections[indexValue].text_color}}>{sections[indexValue].text}</p>
                </div>
            </div>
        </div>
    );
};

export default VideoComponent;
