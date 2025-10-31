import React, {useEffect, useState} from 'react';
import {router} from '@inertiajs/react';
import {BiChevronLeft} from 'react-icons/bi';
import {PayPalButtons, usePayPalScriptReducer, PayPalScriptProvider} from "@paypal/react-paypal-js";
import {
    saveSubscription,
    getPlanId,
    updatePlan,
    getClientId, updatePaymentMethod,
} from '@/Services/PayPalRequests.jsx';
import EventBus from '@/Utils/Bus.jsx';
import {Loader} from '@/Utils/Loader.jsx';
import {getStripeBillingDate} from '@/Services/SubscriptionRequests.jsx';
import {getInternetDateTimeFormat} from '@/Services/TimeRequests.jsx';

export const SubscriptionPaymentButtons = ({
                                               showPaymentButtons,
                                               setShowPaymentButtons,
                                               env,
                                               subId,
                                               defaultPage = null,
                                               setUserInfo = {},
                                               setSubscription = {},
                                               subEndDate = null
}) => {

    const [message, setMessage] = useState(null);
    const [showLoader, setShowLoader] = useState({
        show: true,
        icon: "",
        position: "absolute",
        progress: null
    });
    const [initialOptions, setInitialOptions] = useState({});
    const stripeButtonUrl = showPaymentButtons.type === "change_payment_method" ?
        showPaymentButtons.stripeUrl :
        '/subscribe?plan=' + showPaymentButtons.plan;

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

                setShowLoader({
                    show: false,
                    icon: "",
                    position: "absolute",
                    progress: null
                });
            }
        })

    }, [showPaymentButtons]);

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
                (showPaymentButtons.type === "purchase" || showPaymentButtons.type === "resumePaypalSub") ?
                    createSubscription(data, actions) :
                    showPaymentButtons.type === "change_payment_method" ?
                        changePaymentMethodToPaypal(data, actions) :
                        changePayPalPlan(data,actions)}
            onApprove={(data, actions) => onApprove(data, actions)}
        />);
    }

    const createSubscription = (data, actions) => {

        const planId = getPlanId(showPaymentButtons.plan, env);
        const startTime = getInternetDateTimeFormat(subEndDate);
        if (showPaymentButtons.type === "resumePaypalSub") {
            return actions.subscription.create({
                plan_id:planId,
                start_time: startTime,
                "application_context": {
                    userAction: "SUBSCRIBE_NOW",
                }
            }).catch(error => {
                console.error(error);
                setMessage(`Could not initiate PayPal Subscription...`);
            })
        } else {
            return actions.subscription.create({
                plan_id:planId,
                "application_context": {
                    userAction: "SUBSCRIBE_NOW",
                }
            }).catch(error => {
                console.error(error);
                setMessage(`Could not initiate PayPal Subscription...`);
            })
        }
    }

    const changePaymentMethodToPaypal = (data, actions) => {

        const packets = {
            subId: subId
        }
        return getStripeBillingDate(packets).then(response => {
            if(response.success) {
                const planId = getPlanId(showPaymentButtons.plan, env);
                return actions.subscription.create({
                    plan_id:planId,
                    start_time: response.startDate,
                    "application_context": {
                        userAction: "SUBSCRIBE_NOW",
                    }
                }).catch(error => {
                    console.error(error);
                    setMessage(`Could not initiate PayPal Subscription...`);
                })
            }
        });
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
                    'pmType'        : data.paymentSource,
                    'planId'        : showPaymentButtons.plan,
                    'userEmail'     : details.subscriber.email_address,
                }

                if(showPaymentButtons.type === "change_payment_method") {

                    updatePaymentMethod(packets).then((response) => {
                        if(response.success) {
                            setUserInfo((prev) => ({
                                ...prev,
                                pm_id: null,
                                pm_last_four: null,
                                pm_type: "paypal",
                                billing_id: details.subscriber.email_address
                            }));
                            setSubscription((prev) => ({
                                ...prev,
                                sub_id: subscriptionId,
                            }));
                            setShowPaymentButtons({
                                show: false,
                                plan: ""
                            });
                            EventBus.dispatch("success", {message: response.message});
                        }
                    });

                } else {
                    saveSubscription(packets).then((response) => {

                        if(response.success) {

                            if (showPaymentButtons.type === "resumePaypalSub") {
                                setSubscription((prev) => ({
                                    ...prev,
                                    sub_id: subscriptionId,
                                    ends_at: null,
                                    status: "active"
                                }));
                                setShowPaymentButtons({
                                    show: false,
                                    plan: ""
                                });
                                EventBus.dispatch("success", {message: response.message});
                            } else {
                                router.visit(route('show.subscribe.success'), {
                                    method: 'get',
                                    data: {
                                        type: "subscription",
                                        name: userName
                                    }
                                })
                            }
                        }
                    });
                }
            }).catch(error => {
                console.error(error);
                setMessage(`Your subscription is resumed but an error occurred. Please contact support...`);
            })
        }


        /*actions.subscription.activate(data.subscriptionID).then(() => {
            const redirectURL = route('dashboard');
            actions.redirect(redirectURL);
        });*/

    }

    return (

        showLoader.show ?
            <Loader
                showLoader={showLoader}
            />
            :
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
                                        <BiChevronLeft/>BACK TO {
                                        (showPaymentButtons.type === "change_payment_method" || showPaymentButtons.type === "resumePaypalSub") ?
                                            "SETTINGS" :
                                            "PLANS"}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    }
                    <div className="rounded-2xl bg-white shadow-md pt-10 mt-5 max-w-3xl mx-auto p-5 ">
                        {showPaymentButtons.type === 'changePlan' ?

                            <div className="flex items-center justify-center gap-3 mb-5">
                                <div className="h-9 w-9 rounded-lg bg-indigo-50 grid text-indigo-700 place-items-center ring-1 ring-indigo-200">
                                    <img src={Vapor.asset(
                                            'images/icon-change-plans.png')} alt=""/>
                                </div>
                                <h4 className="mb-3">In order to change your plan, you will need to log into the PayPal account you are using for your subscription.</h4>
                            </div>

                            :
                            <>
                                {showPaymentButtons.type === 'resumePaypalSub' ?
                                    <h4 className="mb-5">In order to reactivate your plan, you will need to log into your PayPal account.</h4>
                                    :
                                    <div className="flex items-center justify-start gap-3 mb-5">
                                        <div className="h-9 w-9 rounded-lg bg-indigo-50 grid text-indigo-700 place-items-center ring-1 ring-indigo-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-credit-card-2-front-fill" viewBox="0 0 16 16">
                                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-2zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-semibold text-gray-900">Choose Your Payment Method</h2>
                                    </div>
                                }

                            </>
                        }
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                            <div className="flex flex-col w-full">
                                <PayPalScriptProvider options={initialOptions}>
                                    <ButtonWrapper type="subscription"/>
                                </PayPalScriptProvider>
                            </div>

                            { (showPaymentButtons.type !== "changePlan" && showPaymentButtons.type !== "resumePaypalSub") &&
                                <a className='button h-11 black_gradient' href={stripeButtonUrl}>
                                    Checkout With Card
                                </a>
                            }
                        </div>
                        <p className="text-right text-sm text-gray-500">(Credit Card, GooglePay, ApplePay, CashApp)</p>
                        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-400" fill="currentColor">
                                    <path d="M12 2l9 5v5c0 5.25-3.438 10.125-9 12-5.562-1.875-9-6.75-9-12V7l9-5zm0 3.09L6 7.5v4.5c0 4.2 2.688 8.1 6 9.69 3.312-1.59 6-5.49 6-9.69V7.5l-6-2.41zM11 9h2v4h-2V9zm0 6h2v2h-2v-2z"/>
                                </svg>
                                Transactions are encrypted & PCI compliant
                            </div>

                            {/* Optional contact/help link */}
                            <a
                                href="mailto:support@link.pro?subject=Support%20Request%20for%20Subscription%20Payment%20Button"
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                Having trouble? Contact support →
                            </a>
                        </div>
                    </div>
                    {message &&
                        <p className="text-sm w-full text-center">{message}</p>
                    }
            </div>

    );
};
