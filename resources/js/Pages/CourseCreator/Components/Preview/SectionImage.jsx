import React, {useEffect, useState} from 'react';

const SectionImage = ({
                          nodesRef,
                          completedCrop,
                          elementName,
                          imgUrl,

}) => {

    const [sectionImageStyle, setSectionImageStyle] = useState(null);

    useEffect(() => {
        setSectionImageStyle (
            completedCrop[elementName]?.isCompleted ?
                {
                    width: (completedCrop[elementName]?.isCompleted) ? `100%` : 0,
                    height: (completedCrop[elementName]?.isCompleted) ? `auto` : 0,
                    maxHeight: '232px',
                    overflow:'hidden'
                }
                :
                {
                    background: "url(" + imgUrl + ") center 25% no-repeat",
                    backgroundSize: 'cover',
                    padding: '29%'
                }
        )
    },[completedCrop[elementName]])

    return (
        <div style={sectionImageStyle}>
            {completedCrop[elementName]?.isCompleted ?
                <canvas
                    className={`${elementName}_bg_image`}
                    ref={ref => nodesRef.current[elementName] = ref}
                    // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                    style={{
                        /*backgroundImage: nodesRef.current[elementName],*/
                        /*width: Math.round(completedCrop?.width ?? 0),
                        height: Math.round(completedCrop?.height ?? 0)*/
                        backgroundSize: `cover`,
                        backgroundRepeat: `no-repeat`,
                        width: completedCrop[elementName]?.isCompleted ? `100%` : 0,
                        height: completedCrop[elementName]?.isCompleted ? `auto` : 0,
                    }}
                />
                :
                ""
            }
        </div>
    );
};

export default SectionImage;
