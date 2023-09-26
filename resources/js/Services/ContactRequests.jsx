import axios from 'axios';

/**
 * Submit contact form
 * return object
 */
export const SubmitContactForm = (packets) => {

    return axios.post('/contact/send', packets)
    .then(
        (response) => {

            return {
                success : true,
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
