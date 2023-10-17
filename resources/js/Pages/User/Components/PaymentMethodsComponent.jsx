import React, {useEffect, useState} from 'react';
import axios from 'axios';
import EventBus from '@/Utils/Bus.jsx';

const PaymentMethodsComponent = ({
                                     token,
                                     subscription,
                                     userInfo,
                                     setUserInfo,
                                     setShowSection
}) => {


    useEffect(() => {
        const updatePaymentForm = document.querySelector('#update_payment_method_form');
        /*const pmType = document.querySelector('#pm_type');
        const pmLastFour = document.querySelector('#pm_last_four');*/
        const client_token =  token;
        const subscriptionName = subscription.name;
        let amount;
        if (subscriptionName === "pro") {
            amount = '4.99'
        } else {
            amount = '19.99'
        }

        braintree.dropin.create({
            authorization: client_token,
            selector: '#bt-dropin-update',
            paypal: {
                flow: 'vault'
            },
            googlePay: {
                googlePayVersion: 2,
                merchantId: '0764-6991-5982',
                transactionInfo: {
                    totalPriceStatus: 'FINAL',
                    totalPrice: amount,
                    currencyCode: 'USD'
                },
            },
            venmo: {
                allowDesktop: true,
                paymentMethodUsage: 'multi_use',
            },
            applePay: {
                displayName: 'LinkPro',
                paymentRequest: {
                    total: {
                        label: 'LinkPro',
                        amount: amount
                    },
                    // We recommend collecting billing address information, at minimum
                    // billing postal code, and passing that billing postal code with all
                    // Apple Pay transactions as a best practice.
                    //requiredBillingContactFields: ["postalAddress"]
                }
            },
        }, function (createErr, instance) {
            if (createErr) {
                console.log('Create Error', createErr);
                return;
            }
            updatePaymentForm.addEventListener('submit', function (event) {
                event.preventDefault();
                instance.requestPaymentMethod(function (err, payload) {
                    if (err) {
                        console.log('Request Payment Method Error', err);
                        return;
                    }

                    /*pmType.value = payload.type;

                    // Add the nonce to the form and submit
                    document.querySelector('#method_nonce').value = payload.nonce;*/
                    //updatePaymentForm.submit();

                    let pmLastFour = null;
                    if ( payload.details.lastFour !== undefined) {
                        pmLastFour = payload.details.lastFour;
                    }

                    const packets = {
                        payment_method_nonce: payload.nonce,
                        pm_last_four: pmLastFour,
                        pm_type: payload.type
                    }
                    return axios.post('/update-payment-method', packets)
                    .then(
                        (response) => {
                            const returnMessage = JSON.stringify(response.data.message);
                            EventBus.dispatch("success", { message: returnMessage.replace("_", " ") });

                            setUserInfo({
                                ...userInfo,
                                pm_last_four: pmLastFour,
                                pm_type: payload.type
                            })

                            setShowSection([]);
                            /*return {
                                success : true,
                            }*/
                        }
                    )
                    .catch((error) => {
                        if (error.response !== undefined) {
                            EventBus.dispatch("error",
                                {message: "There was an error updating your credit card."});
                            console.error("ERROR:: ", error.response.data);
                        } else {
                            console.error("ERROR:: ", error);
                        }

                        /*return {
                            success : false,
                        }*/

                    });

                });
            });
        });
    },[])

    return (
        <div id="popup_payment_method" className="form_page checkout">
            <div className="content_wrap">
                <div className="icon_wrap blue_icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-credit-card-2-front-fill" viewBox="0 0 16 16">
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-2zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
                    </svg>
                </div>
                <h2>Choose Another Way to Pay</h2>
                <div className="text_wrap form_wrap">
                    <form id="update_payment_method_form" action="" method="">
                        <input id="method_nonce" name="payment_method_nonce" type="hidden"/>
                        <input id="pm_type" type="hidden" name="pm_type" value="" />
                        <input id="pm_last_four" type="hidden" name="pm_last_four" value="" />
                        <div className="bt-drop-in-wrapper">
                            <div id="bt-dropin-update"></div>
                        </div>
                        <button type="submit" className='button blue'>
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodsComponent;
