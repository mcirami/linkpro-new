import React, {useEffect, useState} from 'react';
import {usePageContext} from '@/Context/PageContext.jsx';

const ProfileText = () => {

    const {pageSettings} = usePageContext();
    const [styles, setStyles] = useState({})

    useEffect(() => {
        if(!pageSettings.profile_img_active) {
            setStyles({
                width: '100%',
                textAlign: "center",
                paddingLeft: '0'
            })
        } else {
            setStyles({})
        }

    }, [pageSettings.profile_img_active]);

    return (
        <div className="profile_text" style={styles}>
            <h2>{pageSettings["title"] || "Add Title"}</h2>
            <p>{pageSettings["bio"] ||
            "Add Bio or Slogan"}</p>
        </div>
    )
}

export default ProfileText;
