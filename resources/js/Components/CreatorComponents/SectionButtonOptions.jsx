import React, {useEffect, useState} from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Slider from '@mui/material/Slider';
import ColorPicker from '@/Components/CreatorComponents/ColorPicker.jsx';
import InputComponent from '@/Components/CreatorComponents/InputComponent.jsx';
import {updateSectionData} from '@/Services/CourseRequests.jsx';
import {updateSectionData as updateLPSectionData} from '@/Services/LandingPageRequests.jsx';
import DropdownComponent
    from '@/Pages/LPCreator/Components/DropdownComponent.jsx';
import IOSSwitch from '@/Utils/IOSSwitch.jsx';

const SectionButtonOptions = ({
                                  sectionPosition,
                                  sections,
                                  setSections,
                                  currentSection,
                                  id,
                                  courses = null,
                                  buttonCourseId = null,
                                  saveTo
}) => {

    const {
        button_position,
        button,
        button_text,
        button_size
    } = currentSection;

    const [includeButtonValue, setIncludeButtonValue] = useState(false);
    const [buttonPositionValue, setButtonPositionValue] = useState("above");
    const [buttonSizeState, setButtonSizeState] = useState(button_size);

    useEffect(() => {
        setIncludeButtonValue(button)
    },[])

    useEffect(() => {
        setButtonPositionValue(button_position)
    },[])

    const handleSwitchChange = () => {
        setIncludeButtonValue(!includeButtonValue);

        const packets = {
            button: !includeButtonValue,
        };

        const method = saveTo === "course" ?
            updateSectionData(packets, id) :
            updateLPSectionData(packets, id)
        method.then((response) => {
            if(response.success) {
                setSections(
                    sections.map((section) => {
                        if(section.id === id) {
                            section.button = !includeButtonValue;
                        }

                        return section;
                    })
                )
            }
        });
    }

    const handleRadioChange = (value) => {
        setButtonPositionValue(value);

        const packets = {
            button_position: value,
        };

        const method = saveTo === "course" ?
            updateSectionData(packets, id) :
            updateLPSectionData(packets, id)
        method.then((response) => {
            if(response.success) {
                setSections(
                    sections.map((section) => {
                        if(section.id === id) {
                            section.button_position = value;
                        }

                        return section;
                    })
                )
            }
        });
    }

    const handleRangeChange = (value) => {
        setButtonSizeState(value)
    }

    const submitButtonSize = () => {
        const packets = {
            button_size: buttonSizeState,
        };

        const method = saveTo === "course" ?
            updateSectionData(packets, id) :
            updateLPSectionData(packets, id)
        method.then((response) => {
            if(response.success) {
                setSections(
                    sections.map((section) => {
                        if(section.id === id) {
                            section.button_size = buttonSizeState;
                        }

                        return section;
                    })
                )
            }
        });
    }

    const rangePercent = (value) => {
        return value + "%";
    }

    return (
        <>
            <div className={`switch_wrap page_settings border_wrap ${!button ? "mb-4" : "" }`}>
                <h3>Include Button</h3>
                <IOSSwitch
                    onChange={handleSwitchChange}
                    checked={Boolean(includeButtonValue)}
                />
            </div>
            <div className={`button_options ${includeButtonValue ? "open" : ""}`}>
                <article className="page_settings border_wrap">
                    <div className="radios_wrap">
                        <FormControl>
                            <FormLabel
                                id={`section_${sectionPosition}_above`}
                                sx={{
                                    color: '#000'
                                }}
                            >
                                <h3>Button Location</h3>
                            </FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby={`section_${sectionPosition}_above`}
                                name={`section_${sectionPosition}_above`}
                                onChange={(e) => {handleRadioChange(e.target.value)}}
                            >
                                <FormControlLabel
                                    value="above"
                                    control={
                                        <Radio
                                            checked={ (buttonPositionValue === "above" || !buttonPositionValue) && true}
                                        />}
                                    label="Above"
                                />
                                <FormControlLabel
                                    value="below"
                                    control={
                                        <Radio
                                            checked={buttonPositionValue === "below" && true}
                                        />}
                                    label="Below"
                                />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </article>
                <article className="my_row page_settings border_wrap">
                    <h3>Button Size</h3>
                    <div className="slider_wrap">
                        <Slider
                            value={buttonSizeState}
                            aria-label="Default"
                            valueLabelDisplay="auto"
                            valueLabelFormat={rangePercent}
                            color="primary"
                            step={1}
                            min={25}
                            max={100}
                            sx={{
                                color: '#424fcf'
                            }}
                            onChange={(e) => handleRangeChange(e.target.value)}
                            onChangeCommitted={submitButtonSize}
                        />
                    </div>
                </article>
                <ColorPicker
                    label="Button Text Color"
                    sections={sections}
                    setSections={setSections}
                    currentSection={currentSection}
                    elementName={`section_${sectionPosition}_button_text_color`}
                    saveTo={saveTo}
                />
                <ColorPicker
                    label="Button Color"
                    sections={sections}
                    setSections={setSections}
                    currentSection={currentSection}
                    elementName={`section_${sectionPosition}_button_color`}
                    saveTo={saveTo}
                />
                <InputComponent
                    placeholder="Update Button Text (optional)"
                    type="text"
                    maxChar={15}
                    hoverText="Submit Button Text"
                    elementName={`section_${sectionPosition}_button_text`}
                    sections={sections}
                    setSections={setSections}
                    currentSection={currentSection}
                    value={button_text}
                    submitType={saveTo}
                />
                {courses &&
                    <DropdownComponent
                        courses={courses}
                        buttonCourseId={buttonCourseId}
                        sections={sections}
                        setSections={setSections}
                        id={id}
                    />
                }
            </div>
        </>
    );
};

export default SectionButtonOptions;