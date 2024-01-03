import React from 'react';
import {checkIcon} from '@/Services/UserService.jsx';

const FolderLinks = ({icons, subStatus, type}) => {

    const {name, icon, active_status} = icons

    return (

        <div className="image_col">
            {active_status ?
                <img src={checkIcon(icon, type, subStatus)} alt={name} title={name}/>
                :
                ""
            }
        </div>
    )
}

export default FolderLinks;
