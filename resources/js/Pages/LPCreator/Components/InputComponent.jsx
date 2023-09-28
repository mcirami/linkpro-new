import React, {useEffect, useRef, useState} from 'react';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import {
    updateData,
    updateSectionData,
} from '../../../Services/LandingPageRequests';
import {LP_ACTIONS} from '../Reducer';
import EditorComponent from './EditorComponent';
import validator from 'validator/es';
import {HandleFocus} from '../../../Utils/InputAnimations';

const InputComponent = ({
                            placeholder,
                            type,
                            maxChar = null,
                            hoverText,
                            elementName,
                            value,
                            data = null,
                            dispatch = null,
                            sections = null,
                            setSections = null,
                            currentSection = null,
                            showTiny = null,
                            setShowTiny = null
}) => {

    const [charactersLeft, setCharactersLeft] = useState(maxChar);
    const [isValid, setIsValid] = useState(false)
    const [textInputValue, setTextInputValue] = useState(value);

    useEffect(() => {
        if(textInputValue) {
            setCharactersLeft(maxChar - textInputValue.length);
            setIsValid(true);
        } else {
            setCharactersLeft(maxChar);
        }
    },[])

    const handleChange = (e) => {
        const value = e.target.value;
        setTextInputValue(value);
        let check;

        if(maxChar) {
            check = checkValidity(value, "maxChar");
            setCharactersLeft(maxChar - value.length);
        }

        if (check || !maxChar) {

            if (sections) {

                let element = elementName.split(/(\d+)/);
                element = element[2].replace('_', '');

                setSections(sections.map((section) => {
                    if (section.id === currentSection.id) {
                        return {
                            ...section,
                            [`${element}`]: value,
                        }
                    }
                    return section;
                }))

            } else {
                dispatch({
                    type: LP_ACTIONS.UPDATE_PAGE_DATA,
                    payload: {
                        value: value,
                        name: elementName
                    }
                })
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (e.target.value === "") {
            e.target.classList.remove('active');
        }

        if(isValid) {

            if (sections) {
w
                let element = elementName.split(/(\d+)/);
                element = element[2].replace('_', '');

                const packets = {
                    [`${element}`]: textInputValue,
                };

                updateSectionData(packets, currentSection.id);

            } else {

                const packets = {
                    [`${elementName}`]: textInputValue,
                };

                updateData(packets, data["id"], elementName).
                    then((response) => {
                        if (response.success && response.slug) {
                            dispatch({
                                type: LP_ACTIONS.UPDATE_PAGE_DATA,
                                payload: {
                                    value: response.slug,
                                    name: 'slug'
                                }
                            })
                        }
                    })
            }
        }
    }

    const checkValidity = (value, checkType) => {

        if (checkType === "url") {
            if (validator.isURL(value)) {
                setIsValid(true)
                return true;
            } else {
                setIsValid(false)
                return false;
            }
        } else if (checkType === "maxChar") {
            if ( (maxChar - value.length) >= 0 && value.length > 0) {
                setIsValid(true);
                return true;
            } else {
                setIsValid(false)
                return false;
            }
        }
    }

    return (

        <div className="edit_form">
            <form>
                {{
                    "text" :
                        <div>
                            <input className={textInputValue ? "active" : ""}
                                   maxLength={maxChar}
                                   name={elementName}
                                   type="text"
                                   defaultValue={textInputValue || ""}
                                   onChange={(e) => handleChange(e)}
                                   onKeyDown={event => {
                                       if (event.key === 'Enter') {
                                           handleSubmit(event);
                                       }
                                   }}
                                   onBlur={(e) => handleSubmit(e)}
                                   onFocus={(e) => HandleFocus(e.target)}
                            />
                            <label>{placeholder}</label>
                        </div>,
                    "textarea" :
                        <EditorComponent
                            dispatch={dispatch}
                            sections={sections}
                            setSections={setSections}
                            currentSection={currentSection}
                            elementName={elementName}
                            data={data}
                            isValid={isValid}
                            setIsValid={setIsValid}
                            showTiny={showTiny}
                            setShowTiny={setShowTiny}
                        />

                }[type]}
                {isValid ?
                    <a className={ `submit_circle ${type === "textarea" ? "textarea" : ""}`}
                       href="#"
                       onClick={(e) => type !== "textarea" ? handleSubmit(e) : e.preventDefault()}
                    >
                        <FiThumbsUp />
                        <div className="hover_text submit_button"><p>{hoverText}</p></div>
                    </a>
                    :
                    <span className={`cancel_icon ${type === "textarea" ? "textarea" : ""}`}>
                        <FiThumbsDown />
                    </span>
                }
                {maxChar &&
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
                }
            </form>
            {/*<ToolTipIcon section="title" />*/}
        </div>

    );
};

export default InputComponent;
