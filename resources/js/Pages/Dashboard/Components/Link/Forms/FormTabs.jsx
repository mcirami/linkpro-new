import React, {useEffect, useState} from 'react';
import EventBus from '@/Utils/Bus.jsx';

const FormTabs = ({
                      showFormTab,
                      setShowFormTab,
                      setShowIconList,
                      pageLayout,
                      editLink
                 }) => {

    const [hasList, setHasList] = useState(true);

    useEffect(() => {
        if (editLink.type === "mailchimp") {
            if (!editLink.mailchimp_list_id) {
                setHasList(false);
                setShowFormTab("integration");
            } else {
                setHasList(true);
            }
        }

        if (editLink.type === "offer") {
            setShowFormTab("offers");
        }
    },[])

    const handleOnClick = (e, type) => {
        e.preventDefault();

        if(!hasList && editLink.type === "mailchimp" && (type === "icon" || type === "image")) {
            EventBus.dispatch("error", {message: "Connect a Mailchimp List to enable more options"});
        } else if (!e.target.classList.contains("active")) {
            document.querySelector('.tab_link.active').classList.remove('active');
            setShowFormTab(type);
            setShowIconList((prev) => ({
                ...prev,
                type: type,
            }));
            e.target.classList.add('active');
        }
    }


    return (
        <div className="form_nav relative">
            { editLink.type === "offer" &&
                <div className="relative">
                    <a className={`relative block tab_link ${showFormTab === "offers" ? "active" : ""} `}
                       href="#"
                       onClick={(e) => handleOnClick(e, "offers")}>
                        Offer List
                    </a>
                </div>
            }
            <div className="relative">
                <a className={`relative block tab_link ${
                     editLink.type === "mailchimp" && !hasList ? "disabled" :
                        (editLink.type === "mailchimp" && hasList && showFormTab !== "integration") ||
                        editLink.type !== "mailchimp" && editLink.type !== "offer" ? "active" : ""
                }`}
                   href="#"
                   onClick={(e) => handleOnClick(e, "icon")}
                >
                    Button Icon
                </a>
            </div>

            { pageLayout === "layout_two" &&
                <div className="relative flex items-center gap-3">
                    <a className={` relative block tab_link ${!hasList && editLink.type === "mailchimp" ? "disabled" : ""}`}
                       href="#"
                       onClick={(e) => handleOnClick(e, "image")}>
                        Button Image
                    </a>
                </div>
            }

            { editLink.type === "mailchimp" &&
                <div className="relative">
                    <a className={`relative block tab_link ${(editLink.type === "mailchimp" && !hasList) || showFormTab === "integration" ? "active" : ""} `}
                       href="#"
                       onClick={(e) => handleOnClick(e, "integration")}>
                        Integration
                    </a>
                </div>
            }
        </div>
    );
};

export default FormTabs;
