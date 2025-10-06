import React, {useEffect, useState} from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import ColorPicker from '@/Components/CreatorComponents/ColorPicker.jsx';
import InputComponent from '@/Components/CreatorComponents/InputComponent.jsx';
import SliderComponent from '@/Components/CreatorComponents/SliderComponent.jsx';
import {updateSectionData} from '@/Services/CourseRequests.jsx';
import {updateSectionData as updateLPSectionData} from '@/Services/LandingPageRequests.jsx';
import DropdownComponent
    from '@/Pages/LPCreator/Components/DropdownComponent.jsx';
import IOSSwitch from '@/Utils/IOSSwitch.jsx';
import RadioGroup from '@/Components/RadioGroup.jsx';

const SectionButtonOptions = ({
                                  sectionPosition,
                                  sections,
                                  setSections,
                                  currentSection,
                                  id,
                                  courses = null,
                                  buttonCourseId = null,
                                  buttonType,
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

    useEffect(() => {
        setIncludeButtonValue(button || buttonType === "download")
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

    const handleRadioChange = (e, value) => {
        e.preventDefault();
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

    return (
        <>
            {buttonType === "purchase" ?
                <div className={`switch_wrap flex justify-between items-center ${!button ? "mb-4" : "" }`}>
                    <div className="section_title w-full">
                        <h4>Show</h4>
                    </div>
                    <IOSSwitch
                        onChange={handleSwitchChange}
                        checked={Boolean(includeButtonValue)}
                    />
                </div>
                :
                ""
            }
            <div className={`button_options open ${buttonType === "download" ? "!border-0" : ""}`}>
                <div className="mb-5 flex justify-between items-center">
                    {buttonType === "purchase" ?
                        <article className="w-1/2 pr-5 border-r border-gray-200">
                            <div className="radios_wrap">
                                <FormControl>
                                    <div className="section_title w-full !mb-5" id={`section_${sectionPosition}_above`}>
                                        <h4>Location</h4>
                                    </div>
                                    <RadioGroup
                                        value={buttonPositionValue || "above"}
                                        options={["above", "below"]}
                                        onChange={handleRadioChange}
                                    />
                                </FormControl>
                            </div>

                        </article>
                        :
                        ""
                    }
                    <div className="w-1/2 pl-5">
                        <div className="section_title w-full !mb-5">
                            <h4>Size</h4>
                        </div>
                        <SliderComponent
                            label="Button Size"
                            id={id}
                            value={button_size}
                            elementName="button_size"
                            sliderValues={{
                                step: 1,
                                min: 25,
                                max: 100,
                                unit: "%",
                            }}
                            saveTo={saveTo}
                            sections={sections}
                            setSections={setSections}
                        />
                    </div>
                </div>
                <div className="mb-5">
                    <div className="section_title w-full !mb-5">
                        <h4>Colors</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                        <ColorPicker
                            label="Text"
                            sections={sections}
                            setSections={setSections}
                            currentSection={currentSection}
                            elementName={`button_text_color`}
                            saveTo={saveTo}
                        />
                        <ColorPicker
                            label="Background"
                            sections={sections}
                            setSections={setSections}
                            currentSection={currentSection}
                            elementName={`button_color`}
                            saveTo={saveTo}
                        />
                    </div>
                </div>
                <InputComponent
                    placeholder="Text"
                    type="text"
                    maxChar={20}
                    hoverText="Submit Button Text"
                    elementName={`button_text`}
                    sections={sections}
                    setSections={setSections}
                    currentSection={currentSection}
                    value={button_text || (buttonType === "purchase" ? "Get Course" : "Download File") }
                    saveTo={saveTo}
                />
                {courses &&
                    <>
                        <div className="section_title w-full !mb-5">
                            <h4>Link</h4>
                        </div>
                        <DropdownComponent
                            courses={courses}
                            buttonCourseId={buttonCourseId}
                            sections={sections}
                            setSections={setSections}
                            id={id}
                        />
                    </>
                }
            </div>
        </>
    );
};

export default SectionButtonOptions;
