import React, {useEffect, useState} from 'react';
import {SketchPicker} from 'react-color';
import {RiCloseCircleFill} from 'react-icons/ri';
import {
    updateData,
    updateSectionData,
} from '../../../Services/LandingPageRequests';
import {LP_ACTIONS} from '../Reducer';


const ColorPicker = ({
                         label,
                         elementName,
                         pageData = null,
                         dispatch = null,
                         sections = null,
                         setSections = null,
                         currentSection = null
}) => {

    const [sketchPickerColor, setSketchPickerColor] = useState({
        r: "",
        g: "",
        b: "",
        a: "0",
    });
    // destructuring rgba from state
    const { r, g, b, a } = sketchPickerColor;

    const [showPicker, setShowPicker] = useState(false);
    const [pickerBg, setPickerBg] = useState({});
    const [colorValues, setColorValues] = useState({
        previous: null,
        current: null
    })

    useEffect(() => {
        setPickerBg({background: `rgba(${r} , ${g} , ${b} , ${a})`});

    },[sketchPickerColor])

    useEffect(() => {

        if(currentSection) {
            let element = elementName.split(/(\d+)/);
            element = element[2].replace('_', '');

            let color;
            if(element === "text_color" && !currentSection[element]) {
                color = 'rgba(0,0,0,1)';
            } else if (element === "bg_color" && !currentSection[element]) {
                color = 'rgba(255,255,255,1)';
            } else {
                color = currentSection[element];
            }

            setPickerBg({background: color});

            setColorValues((prev) => ({
                    ...prev,
                    previous: color
            }))

        } else {
            setPickerBg({ background: pageData[elementName] })
            setColorValues((prev) => ({
                ...prev,
                previous: pageData[elementName]
            }))
        }

    },[])

    const handleOnChange = (color) => {
        setSketchPickerColor(color);
        const value = `rgba(${color.r} , ${color.g} , ${color.b} , ${color.a})`;

        if(sections) {

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

        setColorValues((prev) => ({
            ...prev,
            current: value
        }))
    }

    const handleSave = (e) => {

        e.preventDefault();

        if (sections) {

            let element = elementName.split(/(\d+)/);
            element = element[2].replace('_', '');

            const packets = {
                [`${element}`]: colorValues.current,
            };

            updateSectionData(packets, currentSection.id)
            .then((response) => {
                if (response.success) {
                    setColorValues({
                        previous: colorValues.current,
                        current: colorValues.current
                    })
                    setShowPicker(false);
                }
            });
        } else {

            const packets = {
                [`${elementName}`]: colorValues.current,
            };

            updateData(packets, pageData["id"], elementName).
                then((response) => {
                    if (response.success) {
                        setShowPicker(false);
                        setColorValues({
                            previous: colorValues.current,
                            current:  colorValues.current
                        })
                    }
                })
        }
    }

    const handleClose = (e) => {

        e.preventDefault();

        if(sections) {

            let element = elementName.split(/(\d+)/);
            element = element[2].replace('_', '');

            setSections(sections.map((section) => {
                if (section.id === currentSection.id) {
                    return {
                        ...section,
                        [`${element}`]: colorValues.previous,
                    }
                }
                return section;
            }))

        } else {

            dispatch({
                type: LP_ACTIONS.UPDATE_PAGE_DATA,
                payload: {
                    value: colorValues.previous,
                    name: elementName
                }
            })
        }

        setColorValues({
            previous: colorValues.previous,
            current:  colorValues.previous
        })
        setPickerBg({background: colorValues.previous})

        setShowPicker(false);

    }

    return (
        <article className="my_row page_settings border_wrap">
            <h4>{label}</h4>
            <div className="icon_wrap">
                <a
                   href="#"
                   onClick={(e) => {
                       e.preventDefault();
                       setShowPicker(!showPicker);
                   }}
                >
                    <span className="color_wrap">
                        <span className="color_box"
                              style={pickerBg}>
                        </span>
                    </span>
                    Edit
                </a>
                {showPicker &&
                    <div className="picker_wrapper">
                        <div className="close_icon icon_wrap">
                            <a href="#" onClick={(e) => { handleClose(e) }}>
                                <RiCloseCircleFill />
                            </a>
                        </div>
                        <SketchPicker
                            onChange={(color) => {
                                handleOnChange(color.rgb);
                            }}
                            color={sketchPickerColor}
                            width={300}
                        />
                        <a className="button blue" href="#"
                           onClick={(e) => { handleSave(e)}}>Save</a>
                    </div>
                }
            </div>
        </article>
    );
};

export default ColorPicker;
