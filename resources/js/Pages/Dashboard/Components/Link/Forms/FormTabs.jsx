import React, {useEffect, useState} from 'react';
import EventBus from '@/Utils/Bus.jsx';
import SelectorComponent
    from "@/Pages/Dashboard/Components/SelectorComponent.jsx";

const FormTabs = ({
                      showFormTab,
                      setShowFormTab,
                      setShowIconList,
                      pageLayout,
                      editLink
                 }) => {

    const [hasList, setHasList] = useState(true);
    const [options, setOptions] = useState([]);

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

    useEffect(() => {
        const optionsArray = [];
        if(editLink.type === "offer") {
            optionsArray.push({
                value: "offers",
                label: "Offer List",
            });
        }

        optionsArray.push({
            value: "icon",
            label: pageLayout === "layout_two" ? "Button Settings" : "Icon Settings"
        })

        if (pageLayout === "layout_two") {
            optionsArray.push({
                value: "image",
                label: "Button Image"
            })
        }

        if (editLink.type === "mailchimp") {
            optionsArray.push({
                value: "integration",
                label: "Integration"
            })
        }

        setOptions(optionsArray);
    },[])

    const handleOnClick = (e, type) => {
        e.preventDefault();

        if(!hasList && editLink.type === "mailchimp" && (type === "icon" || type === "image")) {
            EventBus.dispatch("error", {message: "Connect a Mailchimp List to enable more options"});
        } else if (!e.target.classList.contains("active")) {
            //document.querySelector('.tab_link.active').classList.remove('active');
            setShowFormTab(type);
            setShowIconList((prev) => ({
                ...prev,
                type: type,
            }));
            //e.target.classList.add('active');
        }
    }


    return (
        <div className="form_nav relative">
            <SelectorComponent
                value={showFormTab}
                onChange={setShowFormTab}
                commit={handleOnClick}
                options={options}
            />
            {/*{ editLink.type === "offer" &&
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
                    {pageLayout === "layout_two" ? "Button" : "Icon"} Settings
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
            }*/}
        </div>
    );
};

export default FormTabs;
