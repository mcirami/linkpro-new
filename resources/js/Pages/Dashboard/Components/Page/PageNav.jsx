import React from 'react';
import {MdAddCircleOutline} from 'react-icons/md';
import {FiChevronDown} from 'react-icons/fi';
import {usePageContext} from '@/Context/PageContext.jsx';

import {Link} from '@inertiajs/react';

const PageNav = ({
                     allUserPages,
                     userSub = null,
                     settings,
                     handleClick
}) => {

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
                        <li>
                            <a onClick={(e) => { handleClick(e) }} href="#">{settings.addNewLabel}</a>
                        </li>
                        { allUserPages.map((page) => {

                            return (
                                (page["disabled"] || !userSub || userSub.name !== "premier") && settings.type === "page" ?
                                    <li key={page["id"]} className="disabled_link" data-type="disabled" onClick={(e) => { handleClick(e) }} >
                                        {page["name"]}
                                    </li>
                                    :
                                    <li id={page["id"]} key={page["id"]}>
                                        <Link href={settings.urlPrefix + page["id"]}>{page[settings.linkLabel]}</Link>
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
