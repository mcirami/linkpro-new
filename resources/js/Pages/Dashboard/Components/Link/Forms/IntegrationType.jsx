import React, {useEffect} from 'react';
import {
    getMailchimpLists,
    getStores,
} from '@/Services/UserService.jsx';

const IntegrationType = ({
                             integrationType,
                             setIntegrationType,
                             setShowLoader,
                             setLists,
                             redirectedType,
                             setShopifyStores
}) => {

    useEffect(() => {

        if (integrationType === "mailchimp") {
            //setIntegrationType("mailchimp");
            fetchLists()
        } else if (integrationType === "shopify") {
            //setIntegrationType("shopify")
            fetchStores()
        }

        if(redirectedType) {
            redirectedType === "mailchimp" ?
                fetchLists() :
                fetchStores()
        }

    },[integrationType])

    const handleChange = (e) => {
        const value = e.target.value;

        setIntegrationType(value);

        if(value === "mailchimp") {
            fetchLists()
        }

        if(value === "shopify") {
            fetchStores()
        }

        setTimeout(function(){
            document.querySelector('#scrollTo').scrollIntoView({
                behavior: 'smooth',
                block: "start",
                inline: "nearest"
            });

        }, 300)
    }

    const fetchLists = () => {

        setShowLoader({show: true, icon: "loading", position: "absolute"});

        getMailchimpLists().then(
            (data) => {
                if (data.success) {
                    data.lists.length > 0 && setLists(data.lists);
                    setShowLoader({show: false, icon: "", position: ""});
                }
            }
        )
    }

    const fetchStores = () => {

        setShowLoader({show: true, icon: "loading", position: "absolute"});

        getStores().then(
            (data) => {
                if (data.success) {
                    data.stores.length > 0 && setShopifyStores(data.stores)
                    setShowLoader({show: false, icon: "", position: ""});
                }
            }
        )
    }

    return (
        <div className="integration_dropdown_wrap">
            <h3>MailChimp</h3>
        </div>
    );
};

export default IntegrationType;
