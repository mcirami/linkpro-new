import React, {useEffect, useState} from 'react';
import {getClientId} from '@/Services/PayPalRequests.jsx';
import {
    PayPalButtons,
    PayPalScriptProvider,
    usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {Link, router} from '@inertiajs/react';
import {Loader} from '@/Utils/Loader.jsx';
import PageHeader from "@/Components/PageHeader.jsx";

const PurchasePaymentButtons = ({showPaymentButtons}) => {

    const [initialOptions, setInitialOptions] = useState({});
    const [showLoader, setShowLoader] = useState({
        show: true,
        icon: null,
        position: "absolute",
        progress: null
    });

    useEffect(() => {
        getClientId().then((response) => {
            if(response.success) {
                setInitialOptions({
                    clientId : response.client,
                    intent: "capture",
                    components: "buttons",
                    vault: "false",
                    "disable-funding": "paylater,card",
                    "data-sdk-integration-source":"integrationbuilder_sc",
                })

                setShowLoader((prevState) => {
                    return {
                        ...prevState,
                        show: false
                    }
                });
            }
        }).catch((error) => {
            console.log("getClientId error", error);
        })

    }, [showPaymentButtons]);

    const ButtonWrapper = ({type}) => {
        const [{ options }, dispatch] = usePayPalScriptReducer();

        useEffect(() => {
            dispatch({
                type: "resetOptions",
                value: {
                    ...options,
                    intent: "capture",
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
            createOrder={(data, actions) => createOrder(data, actions)}
            onApprove={(data, actions) => onApprove(data, actions)}
        />);
    }

    const createOrder = (data, actions) => {

        return actions.order.create({
            "purchase_units": [{
                "amount": {
                    "currency_code": "USD",
                    "value": showPaymentButtons.price
                }
            }],
            "application_context": {
                "shipping_preference": "NO_SHIPPING",
                "user_action": "PAY_NOW",
                "brand_name": "LinkPro",
                "locale": "en-US",
            },
        });
    }

    const onApprove = (data, actions) => {

        actions.order.get(data.orderID)
        .then((response) => {
            router.visit(route('course.purchase.success'), {
                method: 'get',
                data: {
                    price: showPaymentButtons.price,
                    affRef: showPaymentButtons.affRef,
                    cid: showPaymentButtons.clickId,
                    offer: showPaymentButtons.offerId,
                    orderId: data.orderID,
                    pmType: "paypal",
                    status: response.status,
                    customerId: data.payerID,
                    customerName: response.payer.name.given_name
                }
            })
        })

    }

    return (
        showLoader.show ?
            <Loader
                showLoader={showLoader}
            />
            :
            <>
                <div className="pb-6 gap-3 flex justify-between align-bottom items-baseline mt-3 border-b border-gray-100">
                    <PageHeader
                        heading="Purchase Course"
                        description="Complete your purchase to unlock the full course content."
                    />
                </div>
                <div className="container">
                    <div className="payment_buttons rounded-2xl bg-white shadow-md pt-10 mt-10 max-w-3xl mx-auto p-5">
                        <div className="border-b border-gray-100 flex justify-start gap-3 pb-8 mb-8">
                            <div className="image_wrap w-1/3 md:w-1/5 mr-auto">
                                <img className="rounded-xl" src={showPaymentButtons.logo || Vapor.asset('images/logo.png') } alt={showPaymentButtons.title ?? ''} />
                            </div>
                            <div className="flex flex-col justify-start gap-2 w-full md:w-4/5">
                                <h2 className="!text-left !text-2xl text-gray-900 font-semibold italic capitalize">{showPaymentButtons.title}</h2>
                                <p className="text-sm text-gray-700">
                                    Purchase course now to start learning!
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-start gap-3 mb-5">
                            <div className="h-9 w-9 rounded-lg bg-indigo-50 grid text-indigo-700 place-items-center ring-1 ring-indigo-200">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-credit-card-2-front-fill" viewBox="0 0 16 16">
                                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-2zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900">Choose Your Payment Method</h2>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                            <div className="flex flex-col w-full">
                                <PayPalScriptProvider options={initialOptions}>
                                    <ButtonWrapper type="subscription"/>
                                </PayPalScriptProvider>
                            </div>
                            <Link className="text-sm !py-3 button black_gradient !w-full" href={showPaymentButtons.url}>
                                Checkout With Card
                            </Link>
                        </div>
                        <p className="text-center mt-3 md:mt-0 md:text-right text-xs text-gray-500">(Credit Card, GooglePay, ApplePay, CashApp)</p>
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
                </div>
            </>
    );
};

export default PurchasePaymentButtons;
