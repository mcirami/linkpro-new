import React, {useRef, useState} from 'react';
import {Link} from '@inertiajs/react';
import {IoIosPlayCircle} from 'react-icons/io';
const ColumnComponent = ({course, type}) => {

    const {intro_video, video_link, username, slug, title, logo} = course;
    const [hovered, setHovered] = useState(null);
    const columnRef = useRef();

    const videoLink = intro_video || video_link;

    const getImageUrl = (videoLink) => {

        let imageUrl = null;
        if (videoLink?.includes('youtube')) {
            const videoCode = videoLink.split("embed/");
            imageUrl = "https://img.youtube.com/vi/" + videoCode[1] + "/mqdefault.jpg";
        } else if (videoLink?.includes("vimeo")) {
            const videoCode = videoLink.split("video/");
            imageUrl = "https://vumbnail.com/" + videoCode[1] + ".jpg";
        } else {
            imageUrl = logo;
        }

        return imageUrl;
    }

    const imageUrl = getImageUrl(videoLink);

    return (
        <div ref={columnRef}
             className={`column ${hovered === columnRef && "active"}`}
             onMouseOver={() =>  setHovered(columnRef)}
             onMouseLeave={() => setHovered(null)}
        >
            <Link href={username + "/course/" + slug}>
                <div className="column_image relative">
                    <img src={ imageUrl } alt={title} />
                    <div className="icon_box">
                        {type === "purchased" ?
                            <IoIosPlayCircle />
                            :
                            <Link className="button blue" href={username + "/course/" + slug}>
                                Learn More
                            </Link>
                        }
                    </div>

                </div>
                <div className="column_title">
                    <h3>{title}</h3>
                    <p>{username}</p>
                </div>

            </Link>
        </div>
    );
};

export default ColumnComponent;
