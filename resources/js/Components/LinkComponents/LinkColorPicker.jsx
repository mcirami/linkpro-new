import React, {useContext} from 'react';
import ColorPickerBase from '@/Components/CreatorComponents/ColorPickerBase.jsx';
import {applyLinkUpdate, commitLinkUpdate} from '@/Services/LinksRequest.jsx';
import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';
import {FolderLinksContext} from '@/Pages/Dashboard/Dashboard.jsx';
import {usePageContext} from '@/Context/PageContext.jsx';

/**
 * Link flavour of the color picker. Same swatch/popover as the creator pages,
 * saving a single column on the link being edited.
 *
 * Mount with key={editLink.id} so it re-initialises when a different link is
 * opened - ColorPickerBase reads its starting value once.
 */
const LinkColorPicker = ({
                             label,
                             elementName,
                             editLink,
                             setEditLink,
                             fallback = 'rgba(255,255,255,1)',
                         }) => {

    const { dispatch } = useUserLinksContext();
    const { dispatchFolderLinks } = useContext(FolderLinksContext);
    const { pageSettings } = usePageContext();

    // live preview while dragging: the form reads editLink, the preview pane
    // reads the reducer, so both need the in-flight value. Nothing is saved
    // until Save, and Close feeds the previous value back through here.
    const applyValue = (value) => {
        setEditLink((prev) => ({
            ...prev,
            [elementName]: value,
        }));

        applyLinkUpdate({ [elementName]: value }, {
            editLink,
            dispatch,
            dispatchFolderLinks,
        });
    };

    const handleSave = (value) => {
        return commitLinkUpdate({ [elementName]: value }, {
            editLink,
            dispatch,
            dispatchFolderLinks,
            pageId: pageSettings.id,
        });
    };

    return (
        <ColorPickerBase
            label={label}
            initialValue={editLink[elementName]}
            fallback={fallback}
            onChange={applyValue}
            onSave={handleSave}
            onCancel={applyValue}
        />
    );
};

export default LinkColorPicker;
