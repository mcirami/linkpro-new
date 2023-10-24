import React from 'react';
import {checkIcon} from '@/Services/UserService.jsx';

const FolderLinks = ({icons}) => {

    const {name, icon, active_status} = icons

    return (

        <div className="image_col">
            {active_status ?
                <img src={checkIcon(icon, "preview")} alt={name} title={name}/>
                :
                ""
            }
        </div>
    )
}

export default FolderLinks;
