import React, {useState} from 'react';
import Slider from '@mui/material/Slider';
import {LP_ACTIONS} from '@/Components/Reducers/CreatorReducers.jsx';
import {
    updateData as updateCourseData,
    updateSectionData,
} from '@/Services/CourseRequests.jsx';
import {
    updateData as updateLpData,
    updateSectionData as updateLPSectionData,
} from '@/Services/LandingPageRequests.jsx';

const SliderComponent = ({
                             label,
                             id,
                             dispatch = null,
                             value,
                             elementName,
                             sliderValues,
                             saveTo,
                             sections = null,
                             setSections = null
                         }) => {
    const handleChange = (e) => {
        if(dispatch) {
            dispatch({
                type: LP_ACTIONS.UPDATE_PAGE_DATA,
                payload: {
                    value: e.target.value,
                    name: elementName
                }
            })
        }

        if (sections && setSections) {
            let element = elementName.split(/(\d+)/);
            element = element[2].replace('_', '');

            setSections(
                sections.map((section) => {
                    if(section.id === id) {
                        section[element] = e.target.value;
                    }

                    return section;
                })
            )
        }

    }
    const handleSubmit = (e) => {
        let element = "";
        if (elementName.includes('section')) {
            element = elementName.split(/(\d+)/);
            element = element[2].replace('_', '');
        } else {
            element = elementName;
        }

        const packets = {
            [`${element}`]: value,
        };

        if(sections) {
            saveTo === "course" ?
                updateSectionData(packets, id) :
                updateLPSectionData(packets, id);
        } else {
            saveTo === "course" ?
                updateCourseData(packets, id, element) :
                updateLpData(packets, id, element)
        }

    }

    const sliderValue = (value) => {
        return value + sliderValues["unit"];
    }

    return (
        <div className="my_row page_settings border_wrap">
            <label>{label}</label>
            <div className="slider_wrap">
                <Slider
                    value={value}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    valueLabelFormat={sliderValue}
                    color="primary"
                    step={sliderValues["step"]}
                    min={sliderValues["min"]}
                    max={sliderValues["max"]}
                    sx={{
                        color: '#424fcf',
                    }}
                    onChange={(e) => handleChange(e)}
                    onChangeCommitted={handleSubmit}
                />
            </div>
        </div>
    );
};

export default SliderComponent;
