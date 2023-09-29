import React, {useEffect, useRef, useState} from 'react';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
//import NumberFormat from 'react-currency-format';
import validator from 'validator/es';
import {
    updateData,
    updateSectionData,
} from '@/Services/CourseRequests.jsx';
import {LP_ACTIONS, OFFER_ACTIONS} from '../Reducer';
import {updateOfferData} from '@/Services/OfferRequests.jsx';
import EditorComponent from '../../LPCreator/Components/EditorComponent';
import {HandleFocus} from '@/Utils/InputAnimations.jsx';

const InputComponent = ({
                            placeholder,
                            type,
                            maxChar = null,
                            hoverText,
                            elementName,
                            value,
                            courseData = null,
                            offerData = null,
                            dispatch = null,
                            dispatchOffer = null,
                            sections = null,
                            setSections = null,
                            currentSection = null,
                            showTiny = null,
                            setShowTiny = null,
}) => {

    const [charactersLeft, setCharactersLeft] = useState(maxChar);
    const [isValid, setIsValid] = useState(false)
    let dollarUSLocale = Intl.NumberFormat('en-US');

    useEffect(() => {
        if(maxChar) {
            if (value) {
                setCharactersLeft(maxChar - value.length);
                if (maxChar - value.length >= 0) {
                    setIsValid(true);
                }
            } else {
                setCharactersLeft(maxChar);
            }
        }
    },[])

    useEffect(() => {
        if ( ( (type === "url" && checkValidity(value, "url") ) || type === "textarea") && value ) {
            setIsValid(true);
        }
    },[])

    useEffect(() => {
        if (type === "currency" && value) {
            setIsValid(true);
        }
    },[])

    const handleChange = (e) => {
        let value;

        if (type === "currency") {
            value = e.floatValue;
            if (isNaN(value)) {
                setIsValid(false);
            } else {
                setIsValid(true);
            }
        } else {
            value = e.target.value;
        }

        let check;

        if(maxChar) {
            check = checkValidity(value, "maxChar");
            setCharactersLeft(maxChar - value.length);
        }

        if ( type === "url" ) {
            check = checkValidity(value, "url");
            if(check) {
                value = checkEmbedLink(value);
                e.target.value = value;
            }
        }

        if (check || type === "textarea" || type === "text") {

            if (elementName === "title" && value === "") {
                setIsValid(false)
            } else {
                setIsValid(true);
            }

            if (sections) {

                let element = elementName.split(/(\d+)/);
                if (elementName.includes("video")) {
                    element = element[0] + element[2].replace('_', '');
                } else {
                    element = element[2].replace('_', '');
                }

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
        } else if (type === "currency") {

            dispatchOffer({
                type: OFFER_ACTIONS.UPDATE_OFFER_DATA,
                payload: {
                    value: value,
                    name: elementName
                }
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (e.target.value === "") {
            e.target.classList.remove('active');
        }

        if (isValid) {
            if (sections) {

                //remove section_number from element name to save in section data
                let element = elementName.split(/(\d+)/);
                if (elementName.includes("video")) {
                    element = element[0] + element[2].replace('_', '');
                } else {
                    element = element[2].replace('_', '');
                }

                const packets = {
                    [`${element}`]: e.target.value,
                };

                updateSectionData(packets, currentSection.id);

            } else if (offerData) {

                const packets = {
                    [`${elementName}`]: offerData[elementName],
                };

                updateOfferData(packets, offerData["id"]);

            } else {
                const packets = {
                    [`${elementName}`]: courseData[elementName],
                };

                updateData(packets, courseData["id"], elementName)
                .then((response) => {
                    if(response.success && response.slug) {
                        dispatch({
                            type: LP_ACTIONS.UPDATE_PAGE_DATA,
                            payload: {
                                value: response.slug,
                                name: 'slug'
                            }
                        })
                    }
                });
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

    const checkEmbedLink = (link) => {

        //return proper embed link with video code.
        if(link.includes("embed")) {
            return link;
        } else if(link.includes("youtube") && link.includes("v=")) {
            const split = link.split("v=");
            return "https://www.youtube.com/embed/" + split[1];
        } else if (link.includes("youtu.be")) {
            const split = link.split("youtu.be/");
            return "https://www.youtube.com/embed/" + split[1];
        } else if (link.includes("vimeo") && !link.includes("player.vimeo")) {
            const split = link.split("vimeo.com/");
            return "https://player.vimeo.com/video/" + split[1];
        }
        return link;
    }

    const switchStatement = () => {
        switch(type) {
            case 'text' || 'url' :
                return (
                    <>
                        <input className={ value !== "" ? "active" : ""}
                               maxLength={maxChar}
                               name={elementName}
                               type={type}
                               defaultValue={value || ""}
                               onChange={(e) => handleChange(e)}
                               onKeyDown={event => {
                                   if (event.key === 'Enter') {
                                       handleSubmit(event);
                                   }
                               }}
                               onBlur={(e) => handleSubmit(e)}
                               onFocus={(e) => HandleFocus(e.target)}
                               onPaste={(e) => handleChange(e)}
                        />
                        <label htmlFor={elementName}>{placeholder}</label>
                    </>
                )
            case 'textarea':
                return (
                    <>
                        <textarea
                            className={value !== "" ? "active" : ""}
                            name={elementName}
                            defaultValue={value || ""}
                            rows={5}
                            onChange={(e) => handleChange(e)}
                            onKeyDown={event => {
                                if (event.key === 'Enter') {
                                    handleSubmit(event);
                                }
                            }}
                            onBlur={(e) => handleSubmit(e)}
                            onFocus={(e) => HandleFocus(e.target)}
                            onPaste={(e) => handleChange(e)}
                        ></textarea>
                        <label htmlFor={elementName}>{placeholder}</label>
                    </>
                )
            case 'wysiwyg':
                return (
                    <EditorComponent
                        dispatch={dispatch}
                        sections={sections}
                        setSections={setSections}
                        currentSection={currentSection}
                        elementName={elementName}
                        data={courseData}
                        isValid={isValid}
                        setIsValid={setIsValid}
                        showTiny={showTiny}
                        setShowTiny={setShowTiny}
                    />
                )
            case 'currency' :

                return (
                    <>
                        <input
                            className={`animate ${offerData[elementName]} && active`}
                            type="text"
                            value={offerData[elementName] ? "$" + dollarUSLocale.format(offerData[elementName]) : ""}
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
                    </>
                )
            default:
                return (
                    <>
                        <input className={value !== "" ? "active" : ""}
                               maxLength={maxChar}
                               name={elementName}
                               type={type}
                               defaultValue={value || ""}
                               onChange={(e) => handleChange(e)}
                               onKeyDown={event => {
                                   if (event.key === 'Enter') {
                                       handleSubmit(event);
                                   }
                               }}
                               onBlur={(e) => handleSubmit(e)}
                               onFocus={(e) => HandleFocus(e.target)}
                        />
                        <label htmlFor={elementName}>{placeholder}</label>
                    </>
                )
        }
    }

    return (

        <div className="edit_form">
            <form>
                {switchStatement()}
                {isValid ?
                    <a className={`submit_circle ${type === "textarea" || type === "wysiwyg" ?
                    "textarea" : ""}`} href="#"
                       onClick={(e) => handleSubmit(e)}
                    >
                        <FiThumbsUp/>
                        <div className="hover_text submit_button">
                            <p>{hoverText}</p></div>
                    </a>
                    :
                    <span className={`cancel_icon ${type === "textarea" || type === "wysiwyg" ?
                    "textarea" : ""}`}>
                        <FiThumbsDown/>
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
