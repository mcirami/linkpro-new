import axios from 'axios';
import htmlToDraft from 'html-to-draftjs';
import {ContentState, convertToRaw} from 'draft-js';

/**
 * Submit a request to get aff offer icons
 * return object
 */
export const getIcons = (url) => {

    return axios.get(url)
    .then(
        (response) => {
            const iconData = response.data.iconData;
            const authUser = response.data.authUser || null;

            return {
                success : true,
                iconData: iconData,
                authUser: authUser
            }

        })
    .catch(error => {
        if (error.response) {
            //EventBus.dispatch("error", { message: error.response.data.errors.header_img[0] });
            console.error(error.response);
        } else {
            console.error("ERROR:: ", error);
        }

        return {
            success : false,
        }
    });
}

export const getTextValue = (description) => {
    const blocksFromHTML = htmlToDraft(description);

    const { contentBlocks, entityMap } = blocksFromHTML;

    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

    return convertToRaw(contentState);
}
