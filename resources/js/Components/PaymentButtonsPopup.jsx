import React, {useEffect, useState} from 'react';
import {Link, router} from '@inertiajs/react';
import {BiChevronLeft} from 'react-icons/bi';
import {PayPalButtons, usePayPalScriptReducer, PayPalScriptProvider} from "@paypal/react-paypal-js";
import {saveSubscription} from '@/Services/PayPalRequests.jsx';

export const PaymentButtonsPopup = ({showPaymentButtonPopup, setShowPaymentButtonPopup}) => {
    //const PayPalClientId = process.env.PAYPAL_SANDBOX_CLIENT_ID;

    const [message, setMessage] = useState(null);
    const initialOptions = {
        clientId : "",
        intent: "subscription",
        components: "buttons",
        vault: "true",
        "disable-funding": "paylater,card",
        "data-sdk-integration-source":"integrationbuilder_sc",
    };

    const ButtonWrapper = ({type}) => {
        const [{ options }, dispatch] = usePayPalScriptReducer();

        useEffect(() => {
            dispatch({
                type: "resetOptions",
                value: {
                    ...options,
                    intent: "subscription",
                },
            });
        }, [type]);

        return (<PayPalButtons
            style={{
                shape: "rect",
                layout: "vertical",
                height: 45,
                disableMaxWidth: true,
                label: "checkout"
            }}
            createSubscription={(data, actions) => createSubscription(data, actions)}
            onApprove={(data, actions) => onApprove(data, actions)}
        />);
    }

    const createSubscription = (data, actions) => {

        //TODO: Dynamic plan ID
        return actions.subscription.create({
            plan_id: "P-8TP42972M2139103JMX624OI",
            userAction: "SUBSCRIBE_NOW"
        }).catch(error => {
            console.error(error);
            setMessage(`Could not initiate PayPal Subscription...`);
        })
    }

    const onApprove = (data, actions) => {
        /*
        * AVAILABLE VARIABLES
        * data.facilitatorAccessToken
        * data.orderID
        * data.paymentSource
        * data.subscriptionID
        *
        * */

        const packets = {
            'order_id' : data.orderID,
            'subId' : data.subscriptionID,
            'paymentType' : data.paymentSource,
            'planId' : showPaymentButtonPopup.plan
        }

        saveSubscription(packets).then((response) => {

            if(response.success) {
                router.visit(route('show.subscribe.success'), {
                    method: 'get',
                    data: {
                        type: "subscription"
                    }
                })
            }
        });

        /*actions.subscription.activate(data.subscriptionID).then(() => {
            const redirectURL = route('dashboard');
            actions.redirect(redirectURL);
        });*/

    }

    return (
        <>
            <div className="breadcrumb_links">
                <ul className="breadcrumb_list">
                    <li>
                        <a className="back" href="#" onClick={(e) => {
                            e.preventDefault();
                            setShowPaymentButtonPopup({
                                show: false,
                                plan: ""
                            });
                        }}>
                            <BiChevronLeft/>BACK TO PLANS
                        </a>
                    </li>
                </ul>
            </div>
            <div className="buttons_wrap mt-5">
                <PayPalScriptProvider options={initialOptions}>
                    <ButtonWrapper type="subscription" />
                </PayPalScriptProvider>
                {message &&
                    <p>{message}</p>
                }

                <div className="button_row mt-3">
                    <Link className='button black_gradient' href={'/subscribe?plan=' + showPaymentButtonPopup.plan}>
                        Checkout With Card
                    </Link>
                    <p>(Credit Card, GooglePay, ApplePay, CashApp)</p>
                </div>
            </div>
        </>
    );
};
