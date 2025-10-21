import React, { useEffect } from "react";
import { MdAddCircleOutline, MdOutlineSchool } from "react-icons/md";
import {FiChevronDown} from 'react-icons/fi';
import {usePageContext} from '@/Context/PageContext.jsx';

import {Link} from '@inertiajs/react';
import { RiEdit2Fill } from "react-icons/ri";

const PageNav = ({
                     allUserPages,
                     userSub = null,
                     settings,
                     handleClick = null
}) => {

    const getLabelText = (label) => {
        const ellipsis = label.length > 24 ? "..." : ""
        return (
            label.slice(0, 24) + ellipsis
        )
    }

    return (
        <div className="menu_wrap">

            <div className={allUserPages?.length > 1 ? "menu_icon add_border" : "menu_icon"}>

                    {allUserPages?.length > 1 ?
                        <FiChevronDown/>
                        :
                        <MdAddCircleOutline/>
                    }

                <div className="menu_content">
                    <ul className="page_menu">
                        <li className={`border-b border-gray-200 ${!handleClick ? "no_hover" : ""}`}>
                        {handleClick ?

                            <a className="flex items-center justify-start gap-2" onClick={(e) => { handleClick(e) }} href="#">
                                <span className="icon_wrap">
                                    <MdAddCircleOutline className="!w-5 !h-5" />
                                </span>
                                {settings.addNewLabel}
                            </a>

                            :
                            <div className="flex items-center justify-start gap-2 p-5">
                                <MdOutlineSchool />
                                <p className="">{settings.addNewLabel}</p>
                            </div>

                        }
                        </li>
                        { allUserPages.map((page) => {

                            return (
                                (page["disabled"] || !userSub || userSub.name !== "premier") && settings.type === "page" ?
                                    <li key={page["id"]} className="disabled_link flex flex-row gap-2 justify-start items-center" data-type="disabled" onClick={(e) => { handleClick(e) }} >
                                        <div className="icon_wrap">
                                            <RiEdit2Fill />
                                        </div>
                                        <p>{getLabelText(page["name"])}</p>
                                    </li>
                                    :
                                    <li className="border-b border-gray-100 flex justify-start items-center" id={page["id"]} key={page["id"]}>
                                        <Link className="flex flex-row gap-2 justify-start items-center" href={settings.urlPrefix + page["id"]}>
                                            <div className="icon_wrap">
                                                <RiEdit2Fill className="!w-4 !h-4" />
                                            </div>
                                            <span>{getLabelText(page[settings.linkLabel])}</span>
                                        </Link>
                                    </li>
                            )
                        })}
                    </ul>
                </div>
            </div>

        </div>
    );
}

export default PageNav;
