import React, {useEffect, useState} from 'react';

const SectionImage = ({
                          nodesRef,
                          completedCrop,
                          elementName,
                          imgUrl,

}) => {

    //const [sectionImageStyle, setSectionImageStyle] = useState({});
    const cropEntry = completedCrop[elementName];
    const hasCompletedCrop = !!cropEntry?.isCompleted;
    const backgroundImg = imgUrl || Vapor.asset("images/image-placeholder.jpg");

    /*useEffect(() => {

        const backgroundImg = imgUrl || Vapor.asset("images/image-placeholder.jpg");

        setSectionImageStyle (
            completedCrop[elementName]?.isCompleted ?
                {
                    width: (completedCrop[elementName]?.isCompleted) ? `100%` : 0,
                    height: (completedCrop[elementName]?.isCompleted) ? `auto` : 0,
                    minHeight: '130px',
                    overflow:'hidden',
                }
                :
                {
                    background: "url(" + backgroundImg + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: `cover`,
                    minHeight: '130px'
                }
        )
    },[completedCrop[elementName], imgUrl])*/

    const sectionImageStyle = hasCompletedCrop
        ? {
            minHeight: '130px',
            overflow: 'hidden',
            width: '100%',
            height: 'auto',
        }
        : {
            backgroundImage: `url(${backgroundImg})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            minHeight: '130px',
        };

    return (
        <div className="image_bg" style={sectionImageStyle}>
            {cropEntry &&
                <canvas
                    className={`${elementName}_bg_image`}
                    ref={ref => {
                        nodesRef.current[elementName] = ref;
                    }}
                    // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                    style={{
                        backgroundSize: `cover`,
                        backgroundRepeat: `no-repeat`,
                        width: hasCompletedCrop ? `100%` : 0,
                        height: hasCompletedCrop ? `auto` : 0,
                    }}
                />
            }
        </div>
    );
};

export default SectionImage;
