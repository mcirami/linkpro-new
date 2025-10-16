import React from "react";
import HoverText from '../Utils/HoverText';
import {Link, usePage} from '@inertiajs/react';

const MenuItem = ({
                      item,
                      userPermissions,
                      isHovering,
                      isOpen,
                      handleMouseOver,
                      handleMouseOut,
                      defaultPage
}) => {

    const {id, name, pageUrl, icon, permission} = item;
    const { url } = usePage()

    return (
        ( (userPermissions?.includes(permission) || permission === "all") && id !== "pre_register") ||
        (id === "pre_register" && !userPermissions?.includes("view dashboard") ) ||
        (id === "settings" && userPermissions.length > 0) ?
            <li>
                <Link id={id}
                   href={ (name === "pages" && defaultPage) ? pageUrl + defaultPage : pageUrl}
                      className={url.includes(pageUrl) ? 'active' : ''}
                   onMouseOver={() => handleMouseOver(name)}
                   onMouseOut={handleMouseOut}
                >
                    <span className="menu_icon">
                        {icon}
                    </span>
                    <span className="text uppercase">{name}</span>
                </Link>
                {(!isOpen && isHovering.status && isHovering.section === name) ?
                    <HoverText text={name}/>
                    :
                    ""
                }
            </li>
            :
            ""
    );
};

export default MenuItem;
