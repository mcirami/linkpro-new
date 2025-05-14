import React, {useContext, useEffect, useState} from 'react';
import {HandleBlur, HandleFocus} from '@/Utils/InputAnimations.jsx';
import {usePageContext} from '@/Context/PageContext.jsx';
import {updateLink} from '@/Services/LinksRequest.jsx';
import {LINKS_ACTIONS} from '@/Services/Reducer.jsx';
import {UserLinksContext} from '@/Pages/Dashboard/Dashboard.jsx';
const IconSettingComponent = ({
                                  inputType,
                                  currentLink,
                                  setCurrentLink,
                                  elementName,
                                  label,
                                  maxChar = null
}) => {

    const [charactersLeft, setCharactersLeft] = useState(maxChar);
    const { pageSettings } = usePageContext();
    const { userLinks, dispatch } = useContext(UserLinksContext);


    //console.log("currentLink", currentLink);
    useEffect(() => {
        if(currentLink[elementName] && maxChar) {
            setCharactersLeft(maxChar - currentLink[elementName].length);
        }
    },[charactersLeft])

    const handleChange = (e) => {
        const value = e.target.value;

        setCharactersLeft(maxChar - value.length);

        setCurrentLink({
            ...currentLink,
            [`${elementName}`]: value,
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (currentLink[elementName] != null) {

            const packets = {
                [`${elementName}`]: currentLink[elementName],
                page_id: pageSettings.id,
                folder_id: currentLink.folder_id,
                type: currentLink.type,
            };

            updateLink(packets, currentLink.id).then((data) => {
                if(data.success) {
                    dispatch({
                        type: LINKS_ACTIONS.UPDATE_LINK,
                        payload: {
                            editID: currentLink.id,
                            currentLink: currentLink,
                            [`${elementName}`]: currentLink[elementName]
                        }
                    })
                }
            });
        }
    }

    return (
        <>
            <div className="input_wrap mt-2">
                <input
                    className={`${currentLink[elementName] ? "active" : ""}`}
                    name={elementName}
                    type={inputType === "phone" ? "tel" : inputType}
                    value={currentLink[elementName] || ""}
                    onChange={(e) => handleChange(e)}
                    onFocus={(e) => HandleFocus(e.target)}
                    onBlur={(e) => {HandleBlur(e.target); handleSubmit(e); }}
                    onKeyDown={ event => {
                        if(event.key === 'Enter') {
                            handleSubmit(event);
                        }
                    }}
                />
                <label>{label}</label>
            </div>
            {(pageSettings.page_layout === "layout_one" && maxChar) &&
                <div className="my_row info_text title">
                    <p className="char_max">Max {maxChar} Characters Shown</p>
                    <p className="char_count">
                        {charactersLeft < 0 ?
                            <span className="over">Only {maxChar} Characters Will Be Shown</span>
                            :
                            "Characters Left: " +
                            charactersLeft
                        }
                    </p>
                </div>
            }
        </>
    );
};

export default IconSettingComponent;
