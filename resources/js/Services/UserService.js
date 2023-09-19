import axios from 'axios';
import EventBus from '../Utils/Bus';
import {isEmpty} from 'lodash';

const userSub = user.userSub;

export const checkSubStatus = () => {

    if (userSub) {

        const {braintree_status, ends_at, braintree_id} = {...userSub};
        if (braintree_id === "bypass") {
            return true;
        } else {

            if ( (braintree_status === 'active' || braintree_status ===
                'pending')) {
                return true;
            }

            if (ends_at) {
                const currentDate = new Date().valueOf();
                let t = ends_at.split(/[- :]/);
                let d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
                const endsAt = new Date(d);

                if (endsAt > currentDate) {
                    return true;
                }
            }
        }
    }

    return false;
}

export const checkIcon = (icon, type) => {
    let asset;

    if(type === "preview") {
        asset = Vapor.asset('images/icon-placeholder-preview.png')
    } else {
        asset = Vapor.asset('images/icon-placeholder.png');
    }

    if (icon && icon.toString().includes('custom')) {
        return checkSubStatus() ? icon : asset;
    } else {
        return icon;
    }
}

export const getMailchimpLists = () => {

    return axios.get('/mailchimp/list').then(
        (response) => {
            const lists = response.data.lists;
            return {
                success : true,
                lists : lists,
            }
        },

    ).catch(error => {
        if (error.response) {
            if(error.response.data.errors) {
                EventBus.dispatch("error", { message: error.response.data.errors });
            } else {
                console.error(error.response);
            }

        } else {
            console.error("ERROR:: ", error);
        }

        return {
            success : false
        }
    });
}

export const removeMailchimpConnection = () => {

    return axios.post('/mailchimp/remove-connection').then(
        (response) => {

            return {
                success : true,
            }
        },

    ).catch(error => {
        if (error.response) {
            if(error.response.data.errors) {
                EventBus.dispatch("error", { message: error.response.data.errors });
            } else {
                console.error(error.response);
            }

        } else {
            console.error("ERROR:: ", error);
        }

        return {
            success : false
        }
    });
}

export const getAllProducts = (storeId) => {

    return axios.get('/shopify/get-products/' + storeId).then(
        (response) => {
            const products = response.data.products

            return {
                success : true,
                products : !isEmpty(products) ? products : null,
            }
        },

    ).catch(error => {
        if (error.response) {
            if(error.response.data.errors) {
                EventBus.dispatch("error", { message: error.response.data.errors });
            } else {
                console.error(error.response);
            }

        } else {
            console.error("ERROR:: ", error);
        }

        return {
            success : false
        }
    });
}

export const getStores = () => {

    return axios.get('/shopify/get-stores').then(
        (response) => {
            const stores = response.data.stores

            return {
                success : true,
                stores : !isEmpty(stores) ? stores : null,
            }
        },

    ).catch(error => {
        if (error.response) {
            if(error.response.data.errors) {
                EventBus.dispatch("error", { message: error.response.data.errors });
            } else {
                console.error(error.response);
            }

        } else {
            console.error("ERROR:: ", error);
        }

        return {
            success : false
        }
    });
}

export const acceptTerms = () => {

    return axios.post('/store-affiliate').then(
        (response) => {
            console.log(JSON.stringify(response.data.success));

            return {
                success : true,
            }
        },

    ).catch(error => {
        if (error.response) {
            if(error.response.data.errors) {
                EventBus.dispatch("error", { message: error.response.data.errors });
            } else {
                console.error(error.response);
            }

        } else {
            console.error("ERROR:: ", error);
        }

        return {
            success : false
        }
    });
}
