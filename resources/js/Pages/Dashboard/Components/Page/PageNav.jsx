import React, {useContext, useState} from 'react';
import {MdAddCircleOutline} from 'react-icons/md';
import {FiChevronDown} from 'react-icons/Fi';
import {PageContext} from '../../App';
import AddPageForm from './AddPageForm';

const PageNav = ({ allUserPages, setAllUserPages, userSub, subStatus, setShowUpgradePopup, setOptionText }) => {

    const { pageSettings, setPageSettings } = useContext(PageContext);

    const [isEditing, setIsEditing] = useState(false);

    const pageList = allUserPages.filter(element => element.id !== pageSettings["id"]);

    const handleClick = (e) => {
        e.preventDefault();

        const type = e.target.dataset.type

        if (type !== undefined && type === 'disabled') {

            enablePopup("access this link");

        } else if (userSub) {

            const {name} = {...userSub};

            if ( subStatus && name === "premier") {

                if (allUserPages.length === 5) {
                    enablePopup("a custom plan to add more links");
                } else {
                    setIsEditing(true);
                }

            } else {
                enablePopup("add more links");
            }

        } else {
            enablePopup("add more links");
        }
    }

    const enablePopup = (text) => {

        setShowUpgradePopup(true);
        setOptionText(text);
    }

    return (
        <div className="page_menu_row">
            <div className="current_page" id={pageSettings["id"]} key={pageSettings["id"]}>
                <p>{pageSettings["name"]}</p>
            </div>
            <div className="menu_wrap">

                <div className={allUserPages.length > 1 ? "menu_icon add_border" : "menu_icon"}>
                    {allUserPages.length > 1 ?
                        <FiChevronDown/>
                        :
                        <MdAddCircleOutline/>
                    }

                    <div className="menu_content">
                        <ul className="page_menu">
                            <li>
                                <a onClick={(e) => { handleClick(e) }} href="#">Add New Link</a>
                            </li>
                            { pageList.map((page) => {

                                return (
                                    page["disabled"] || !userSub || userSub.name !== "premier" ?
                                        <li key={page["id"]} className="disabled_link" data-type="disabled" onClick={(e) => { handleClick(e) }} >
                                            {page["name"]}
                                        </li>
                                        :
                                        <li id={page["id"]} key={page["id"]}>
                                            <a href={"/dashboard/pages/" + page["id"]}>{page["name"]}</a>
                                        </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>

            </div>

            {isEditing ?
                <div className="edit_form popup new_page_form">
                    <div className="form_wrap">
                        <AddPageForm
                            setIsEditing={setIsEditing}
                            setAllUserPages={setAllUserPages}
                            allUserPages={allUserPages}
                        />
                    </div>

                </div>
                :
                ""
            }
        </div>
    );
}

export default PageNav;
