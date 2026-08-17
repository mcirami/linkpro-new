import React, {useEffect, useRef, useState} from 'react';
import EventBus from '@/Utils/Bus.jsx';
import SelectorComponent
    from "@/Components/SelectorComponent.jsx";

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
        setHasList(editLink.type !== "mailchimp" || Boolean(editLink.mailchimp_list_id));
    },[editLink.type, editLink.mailchimp_list_id])

    // Identity of the link the tab choice belongs to. Everything else about
    // editLink changes as the user edits, and this effect used to depend on
    // the whole object - which is why picking an icon or a color bounced the
    // form back to the first tab.
    const linkKey = `${editLink.id}-${editLink.type}-${editLink.mailchimp_list_id ? 1 : 0}`;
    const pickedFor = useRef(null);

    useEffect(() => {

        if (pickedFor.current === linkKey) return;

        // showFormTab lives in the parent, so it outlives this component being
        // unmounted while an image is cropped. Coming back from that is not a
        // new link - leave the user on the tab they were already on.
        if (pickedFor.current === null && showFormTab) {
            pickedFor.current = linkKey;
            return;
        }

        pickedFor.current = linkKey;

        if (editLink.type === "mailchimp") {
            setShowFormTab(editLink.mailchimp_list_id ? "icon" : "integration");
        } else if (editLink.type === "offer") {
            setShowFormTab("offers");
        } else if (editLink.type === "video") {
            setShowFormTab("video");
        } else {
            setShowFormTab("icon");
        }

    },[linkKey])

    useEffect(() => {
        const optionsArray = [];

        // Video buttons embed inline; on the grid layout they also need a tile
        // icon, so only that layout gets the extra "Icon" tab.
        if (editLink.type === "video") {
            optionsArray.push({
                value: "video",
                label: "Video Settings"
            });
            if (pageLayout === "layout_one") {
                optionsArray.push({
                    value: "icon",
                    label: "Icon"
                });
            }
            setOptions(optionsArray);
            return;
        }

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
                value: "design",
                label: "Button Design"
            })
        }

        if (editLink.type === "mailchimp") {
            optionsArray.push({
                value: "integration",
                label: "Integration"
            })
        }

        setOptions(optionsArray);
    },[editLink.type, pageLayout])

    const handleOnClick = (e, type) => {
        e.preventDefault();

        if(!hasList && editLink.type === "mailchimp" && (type === "icon" || type === "design")) {
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
                size={options.length > 2 ? "" : ""}
            />
        </div>
    );
};

export default FormTabs;
