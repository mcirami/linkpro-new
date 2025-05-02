import React from 'react';

const PageBackground = ({
                            nodesRef,
                            completedCrop,
                        }) => {

    return (
        completedCrop["page_img"] &&
        <div className="canvas"
             style={{
                 width: completedCrop["page_img"]?.isCompleted ? `100%` : 0,
                 height: completedCrop["page_img"]?.isCompleted ? `100%` : 0,
                 position: "absolute",
                 top:"0",
                 left:"0",
                 right:"0",
                 bottom:"0",
             }}>
            <canvas
                ref={ref => nodesRef.current["page_img"] = ref}
                // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                style={{
                    objectFit: `cover`,
                    width: completedCrop["page_img"]?.isCompleted ? `100%` : 0,
                    height: completedCrop["page_img"]?.isCompleted ? `100%` : 0,
                    borderRadius: `4%`,
                }}
            />
        </div>

    );
};

export default PageBackground;
