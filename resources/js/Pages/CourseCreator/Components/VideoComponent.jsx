import React from 'react';
import InputComponent from './InputComponent';

const VideoComponent = ({sections, setSections}) => {
    return (

        <>
            <InputComponent
                placeholder="Video Title"
                type="text"
                maxChar={65}
                hoverText='Add A Video Title'
                elementName={`video_${index + 1}_text`}
                value={text}
                currentSection={section}
                sections={sections}
                setSections={setSections}
            />

        </>

    );
};

export default VideoComponent;
