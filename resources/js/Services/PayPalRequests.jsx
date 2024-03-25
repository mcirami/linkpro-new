import axios from 'axios';
import EventBus from '@/Utils/Bus.jsx';

export const saveSubscription = (packets) => {

    return axios.post('/subscribe/paypal-success', packets).then(
        (response) => {

            return {
                success : response.data.success,
            }
        },

    ).catch(error => {
        if (error.response) {
            if (error.response.data.errors) {
                EventBus.dispatch("error",
                    {message: error.response.data.errors});
            } else {
                console.error(error.response);
            }

        } else {
            console.error("ERROR:: ", error);
        }

        return {
            success: false
        }
    });
}
