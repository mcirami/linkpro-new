import React from 'react';
import {checkIcon} from '@/Services/UserService.jsx';
import { IoOpenOutline } from "react-icons/io5";

const FolderLinks = ({
                         icons,
                         subStatus,
                         viewType,
                         layout
}) => {

    const {name, icon, active_status, url} = icons

    return (

        <div className="image_col">
            {active_status ?
                layout === "layout_one" ?
                    <img src={checkIcon(icon, viewType, subStatus)} alt={name} title={name}/>
                    :
                    <a className="w-full flex justify-between items-center" href={url} target="_blank">
                        <span className="flex items-center gap-3">
                            <img src={checkIcon(icon, viewType, subStatus)} alt={name} title={name}/>
                            <h3>{name}</h3>
                        </span>
                        <span><IoOpenOutline /></span>
                    </a>
                :
                ""
            }
        </div>
    )
}

export default FolderLinks;
