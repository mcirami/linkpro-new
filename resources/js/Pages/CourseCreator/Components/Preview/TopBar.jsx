import React from 'react';

const TopBar = ({
                    courseData,
                    completedCrop,
                    nodesRef
}) => {

    return (
        <div className="top_section" style={{
            background: courseData['header_color']
        }}>
            <div className="logo">
                {completedCrop?.logo ?
                    <canvas
                        ref={ref => nodesRef.current["logo"] = ref}
                        style={{
                            width: completedCrop["logo"]?.isCompleted ? `100%` : 0,
                            height: completedCrop["logo"]?.isCompleted ? `auto` : 0,
                            backgroundSize: `cover`,
                            backgroundRepeat: `no-repeat`,
                        }}
                    />
                    :
                    <img src={courseData["logo"] || Vapor.asset("images/logo.png") } alt=""/>
                }
            </div>
            {courseData['title'] &&
                <h2 id="preview_title_section" className="title" style={{
                    color: courseData['header_text_color']
                }}>{courseData['title']}</h2>
            }
        </div>

    );
};

export default TopBar;
