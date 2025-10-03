import React from "react";
import { map } from "lodash";
import SelectorComponent
    from "@/Components/SelectorComponent.jsx";

const PageTabs = ({
                      tabs,
                      pageTab,
                      setPageTab,
                  }) => {

    const handleOnClick = (e, value) => {
        e.preventDefault();
        setPageTab(value);
    }
    return (
        <SelectorComponent
            value={pageTab}
            onChange={setPageTab}
            commit={handleOnClick}
            options={tabs}
            shadow="shadow-[5px_-5px_12px_-7px_rgba(0,0,0,0.12)]"
        />
    );
};

export default PageTabs;
