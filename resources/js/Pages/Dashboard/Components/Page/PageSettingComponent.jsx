import React, {useEffect, useState} from 'react';
import {usePageContext} from '@/Context/PageContext.jsx';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/fi';
import {submitPageSetting} from '@/Services/PageRequests.jsx';
import ToolTipIcon from '@/Utils/ToolTips/ToolTipIcon';
import {capitalize} from 'lodash';

const PageSettingComponent = ({
                       element,
                       maxChar,
                   }) => {

    const { pageSettings, setPageSettings } = usePageContext();
    const [charactersLeft, setCharactersLeft] = useState(maxChar);

    useEffect(() => {
        if(pageSettings[element]) {
            setCharactersLeft(maxChar - pageSettings[element].length);
        }
    },[charactersLeft])

    const handleChange = (e) => {
        const value = e.target.value;

        setCharactersLeft(maxChar - value.length);

        setPageSettings({
            ...pageSettings,
            [`${element}`]: value,
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (pageSettings[element] != null) {

            const packets = {
                [`${element}`]: pageSettings[element],
            };

            submitPageSetting(packets, pageSettings["id"]);
        }
    }

    return (

        <div className="edit_form">
            <form onSubmit={handleSubmit}>
                <input
                    className="active"
                    maxLength={maxChar}
                    name={element}
                    type="text"
                    placeholder={`Add ${capitalize(element)}`}
                    defaultValue={pageSettings[element] || ""}
                    onChange={(e) => handleChange(e) }
                    onKeyDown={ event => {
                            if(event.key === 'Enter') {
                                handleSubmit(event);
                            }
                        }
                    }
                       onBlur={(e) => handleSubmit(e)}
                />
                <label htmlFor={element} >Page {capitalize(element)}</label>
                {charactersLeft < maxChar ?
                    <a className="submit_circle" href="#"
                       onClick={(e) => handleSubmit(e)}
                    >
                        <FiThumbsUp />
                        <div className="hover_text submit_button"><p>Submit {capitalize(element)} Text</p></div>
                    </a>
                    :
                    <span className="cancel_icon">
                        <FiThumbsDown />
                    </span>
                }
                <div className="my_row info_text title">
                    <p className="char_max">Max {maxChar} Characters</p>
                    <p className="char_count">
                        {charactersLeft < 0 ?
                            <span className="over">Over Character Limit</span>
                            :
                            <>
                                Characters Left: <span className="count"> {charactersLeft} </span>
                            </>
                        }
                    </p>
                </div>
            </form>
            <ToolTipIcon section={element} />
        </div>

    );
}

export default PageSettingComponent;
