import React from 'react';

// KEEP your imports
import {
    updateData,
    updateSectionData,
} from '@/Services/CourseRequests.jsx';
import {
    updateData as updateLPData,
    updateSectionData as updateLPSectionData,
} from '@/Services/LandingPageRequests.jsx';
import {LP_ACTIONS} from '@/Components/Reducers/CreatorReducers.jsx';
import ColorPickerBase from '@/Components/CreatorComponents/ColorPickerBase.jsx';

/**
 * Course / landing-page flavour of the picker: reads its value out of a
 * section or the page data object and saves through the creator endpoints.
 * All the swatch + popover behaviour lives in ColorPickerBase.
 */
const ColorPicker = ({
                         label,
                         elementName,
                         data = null,
                         dispatch = null,
                         sections = null,
                         setSections = null,
                         currentSection = null,
                         saveTo
                     }) => {

    let initialValue;
    if (currentSection) {
        if (elementName === 'title_color' && !currentSection[elementName]) initialValue = 'rgba(0,0,0,1)';
        else if (elementName === 'bg_color' && !currentSection[elementName]) initialValue = 'rgba(255,255,255,1)';
        else initialValue = currentSection[elementName];
    } else {
        initialValue = data?.[elementName];
    }

    // live preview - push the in-flight color back into section/page state
    const applyValue = (value) => {
        if (sections) {
            setSections(sections.map((section) => (section.id === currentSection.id ? { ...section, [`${elementName}`]: value } : section)));
        } else {
            dispatch?.({ type: LP_ACTIONS.UPDATE_PAGE_DATA, payload: { value, name: elementName } });
        }
    };

    const handleSave = (value) => {
        const packets = { [`${elementName}`]: value };
        const method = sections
            ? (saveTo === 'course' ? updateSectionData(packets, currentSection.id) : updateLPSectionData(packets, currentSection.id))
            : (saveTo === 'course' ? updateData(packets, data.id, elementName) : updateLPData(packets, data.id, elementName));

        return method.then((res) => Boolean(res?.success));
    };

    return (
        <ColorPickerBase
            label={label}
            initialValue={initialValue}
            onChange={applyValue}
            onSave={handleSave}
            onCancel={applyValue}
        />
    );
};

export default ColorPicker;
