import React, {useEffect, useState} from 'react';
import {usePageContext} from '@/Context/PageContext.jsx';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/fi';
import {submitPageSetting} from '@/Services/PageRequests.jsx';
import ToolTipIcon from '@/Utils/ToolTips/ToolTipIcon';

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

        setCharactersLeft(maxChar - value?.length);

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

        <div className="edit_form !mb-10">
            <div className="section_title w-full flex justify-between items-baseline gap-2">
                <div  className="flex items-center justify-start gap-2">
                    <h4 className="capitalize">Page {element}</h4>
                    <ToolTipIcon section={element} />
                </div>
                <div className="info_text">
                    <p className="char_count">
                       <span className="count"> {charactersLeft} </span> / {maxChar}
                    </p>
                </div>
            </div>
            <form className="w-full" onSubmit={handleSubmit}>
                <input
                    className="active"
                    maxLength={maxChar}
                    name={element}
                    type="text"
                    placeholder={`Add ${element}`}
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
                {charactersLeft < maxChar ?
                    <a className="submit_circle" href="#"
                       onClick={(e) => handleSubmit(e)}
                    >
                        <FiThumbsUp />
                        <div className="hover_text submit_button">
                            <p>Submit {element} Text</p>
                        </div>
                    </a>
                    :
                    <span className="cancel_icon">
                        <FiThumbsDown />
                    </span>
                }
                {charactersLeft < 0 &&
                    <div className="my_row info_text title">
                        <p className="char_count">
                            <span className="over">Over Character Limit</span>
                        </p>
                    </div>
                }
            </form>
        </div>

    );
}

export default PageSettingComponent;
