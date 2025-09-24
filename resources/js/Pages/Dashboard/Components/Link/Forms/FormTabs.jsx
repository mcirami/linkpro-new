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
    },[editLink])

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
                size={options.length > 2 ? "max-w-xl" : "max-w-sm"}
            />
        </div>
    );
};

export default FormTabs;
