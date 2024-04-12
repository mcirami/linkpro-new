import React, {useEffect, useState} from 'react';
import {Link, router} from '@inertiajs/react';
import {BiChevronLeft} from 'react-icons/bi';
import {PayPalButtons, usePayPalScriptReducer, PayPalScriptProvider} from "@paypal/react-paypal-js";
import {
    saveSubscription,
    getPlanId,
    updatePlan,
    getClientId
} from '@/Services/PayPalRequests.jsx';

export const SubscriptionPaymentButtons = ({
                                        showPaymentButtons,
                                        setShowPaymentButtons,
                                        env,
                                        subId,
                                        defaultPage = null
                                    }) => {

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [initialOptions, setInitialOptions] = useState({});

    useEffect(() => {
        getClientId().then((response) => {
            if(response.success) {

                setInitialOptions({
                    clientId : response.client,
                    intent: "subscription",
                    components: "buttons",
                    vault: "true",
                    "disable-funding": "paylater,card",
                    "data-sdk-integration-source":"integrationbuilder_sc",
                })

                setIsLoading(false);
            }
        })

    }, []);

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
                label: "paypal"
            }}
            createSubscription={(data, actions) =>
                showPaymentButtons.type === "purchase" ?
                    createSubscription(data, actions) :
                    changePayPalPlan(data,actions)}
            onApprove={(data, actions) => onApprove(data, actions)}
        />);
    }

    const createSubscription = (data, actions) => {

        const planId = getPlanId(showPaymentButtons.plan, env)

        return actions.subscription.create({
            plan_id: planId,
            "application_context": {
                userAction: "SUBSCRIBE_NOW"
            }
        }).catch(error => {
            console.error(error);
            setMessage(`Could not initiate PayPal Subscription...`);
        })
    }

    /*
    * change plan only for PayPal Gateway.
    * **/
    const changePayPalPlan = (data, actions) => {
        const planId = getPlanId(showPaymentButtons.plan, env)

        return actions.subscription.revise(
            subId,
            {
                plan_id: planId
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

        if (showPaymentButtons.type === "changePlan") {
            const packets = {
                plan: showPaymentButtons.plan,
                subId: subId,
                pmType: showPaymentButtons.pmType,
                defaultPage: defaultPage
            }
            updatePlan(packets).then((response) => {
                if(response.success) {
                    router.get(response.url, {message: response.message})
                }
            })
        } else {
            const subscriptionId = data.subscriptionID;
            actions.subscription.get({
                id:  subscriptionId,
            }).then((details) => {

                const userName = details.subscriber.name.given_name;
                const packets = {
                    'order_id'      : data.orderID,
                    'subId'         : subscriptionId,
                    'paymentType'   : data.paymentSource,
                    'planId'        : showPaymentButtons.plan,
                    'userEmail'     : details.subscriber.email_address,
                }

                saveSubscription(packets).then((response) => {

                    if(response.success) {
                        router.visit(route('show.subscribe.success'), {
                            method: 'get',
                            data: {
                                type: "subscription",
                                name: userName
                            }
                        })
                    }
                });

            }).catch(error => {
                console.error(error);
                setMessage(`Could not initiate PayPal Subscription...`);
            })
        }


        /*actions.subscription.activate(data.subscriptionID).then(() => {
            const redirectURL = route('dashboard');
            actions.redirect(redirectURL);
        });*/

    }

    return (

        !isLoading &&
        <div className="payment_buttons">
            {!showPaymentButtons.page &&
                <div className="breadcrumb_links">
                    <ul className="breadcrumb_list">
                        <li>
                            <a className="back" href="#" onClick={(e) => {
                                e.preventDefault();
                                setShowPaymentButtons({
                                    show: false,
                                    plan: ""
                                });
                            }}>
                                <BiChevronLeft/>BACK TO PLANS
                            </a>
                        </li>
                    </ul>
                </div>
            }
            <div className="buttons_wrap mt-5">
                {showPaymentButtons.type === 'changePlan' ?
                    <>
                        <div className="form_icon_wrap image !mb-2">
                            <img src={Vapor.asset(
                                'images/icon-change-plans.png')} alt=""/>
                        </div>
                        <h4 className="mb-3">In order to change your plan, you will need to log into the PayPal account you are using for your subscription.</h4>
                    </>
                    :
                    <>
                        <div className="form_icon_wrap svg blue_icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-credit-card-2-front-fill" viewBox="0 0 16 16">
                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-2zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
                            </svg>
                        </div>
                        <h3 className="text-center mb-4 text-2xl">Choose Your Payment Method Below</h3>
                    </>
                }
                <PayPalScriptProvider options={initialOptions}>
                    <ButtonWrapper type="subscription"/>
                </PayPalScriptProvider>
                {message &&
                    <p>{message}</p>
                }

                {showPaymentButtons.type !== "changePlan" &&
                    <div className="button_row mt-3">
                        <Link className='button black_gradient' href={'/subscribe?plan=' + showPaymentButtons.plan}>
                            Checkout With Card
                        </Link>
                        <p className="text-center text-sm mt-1">(Credit Card, GooglePay, ApplePay, CashApp)</p>
                    </div>
                }
            </div>
        </div>

    );
};
