import React, {useEffect, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import {capitalize} from 'lodash';
import PromoComponent from '@/Pages/Subscription/Components/PromoComponent.jsx';
import {Loader} from '@/Utils/Loader.jsx';
import {purchaseSubscription} from '@/Services/SubscriptionRequests.jsx';

function Purchase({
                      plan,
                      token,
                      price,
                      existing,
                      bypass
}) {

    const [showLoader, setShowLoader] = useState({
        show: false,
        icon: "",
        position: ""
    });

    const [braintreeInstance, setBraintreeInstance] = useState(null);
    const [promoCode, setPromoCode] = useState(null);

    useEffect(() => {

        var form = document.querySelector('#payment-form');
        braintree.dropin.create({
            authorization: token,
            selector: '#bt-dropin',
            paypal: {
                flow: 'vault'
            },
            googlePay: {
                googlePayVersion: 2,
                merchantId: '0764-6991-5982',
                transactionInfo: {
                    totalPriceStatus: 'FINAL',
                    totalPrice: price,
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
                        amount: price
                    },
                    // We recommend collecting billing address information, at minimum
                    // billing postal code, and passing that billing postal code with all
                    // Apple Pay transactions as a best practice.
                    requiredBillingContactFields: ["postalAddress"]
                }
            }
        }, function (createErr, instance) {
            if (createErr) {
                console.log('Create Error', createErr);
                return;
            }
            setBraintreeInstance(instance);
        });
    },[])

    const handleSubmit = (e) => {

        e.preventDefault();
        setShowLoader({
            show: true,
            position: 'absolute',
            icon: ""
        })

        let url = null;
        if (bypass) {
            url = '/subscribe/change-plan';
        } else if (existing) {
            url = '/subscribe/resume';
        } else {
            url = '/subscribe/create';
        }

        if (promoCode && promoCode.toLowerCase() === "freepremier" || promoCode && promoCode.toLowerCase() === "freepro") {
            const packets = {
                level: plan,
            }
            purchaseSubscription(url, packets).then((response) => {
                if(response.success) {
                    router.get('/dashboard')
                }
            })
        } else {
            braintreeInstance.requestPaymentMethod(function(err, payload) {
                if (err) {
                    console.log('Request Payment Method Error', err);
                    return;
                }

                const packets = {
                    payment_method_nonce: payload.nonce,
                    payment_method_token: token,
                    discountCode: promoCode,
                    planId: plan,
                }
                purchaseSubscription(url, packets).then((response) => {

                    if(response.success) {
                        router.get('/dashboard')
                    }
                })
            });
        }

        setShowLoader({
            show: false,
            position: "",
            icon: ""
        })
    }

    const switchStatement = () => {
        switch (plan) {
            case 'pro':
                return (
                    <>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                            </svg>
                            <p>1 Unique Link</p>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                            </svg>
                            <p>Unlimited Icons</p>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                            </svg>
                            <p>Custom Icons</p>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                            </svg>
                            <p>Add Social Links</p>
                        </li>
                    </>
                )
            case 'premier':
                return (
                    <>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                            </svg>
                            <p>Up to 5 Unique Links</p>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                            </svg>
                            <p>Unlimited Icons</p>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                            </svg>
                            <p>Custom Icons</p>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                            </svg>
                            <p>Password Protected Links</p>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                            </svg>
                            <p>Add Social Links</p>
                        </li>
                    </>
                )
        }
    }
    return (
        <AuthenticatedLayout>
            <Head title="Purchase Subscription" />
            <div className="my_row form_page plans checkout">
                <div className="container">
                    <h2 className="page_title mb-0 w-100">
                        Upgrade to <span className="text-capitalize">{capitalize(plan)}</span> For Only
                    </h2>
                    <div className="pricing m-0">
                        <h3><sup>$</sup>{price}<span>/ mo</span></h3>
                    </div>
                    <div className="card">
                        <div className="card-body flex flex-row flex-wrap-reverse lg:flex-nowrap">
                            <div className="w-full plan_details">
                                <div className="my_row three_columns">
                                    <div className={`column ${plan}`}>
                                        <h2 className="text-uppercase">
                                            <span>{capitalize(plan)} Plan</span> Includes
                                        </h2>
                                        <ul>
                                            {switchStatement()}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full credit_card_form">
                                <div className="my_row payment_form_wrap relative">
                                    {showLoader.show &&
                                        <Loader
                                            showLoader={showLoader}
                                        />
                                    }

                                    <PromoComponent
                                        plan={plan}
                                        setShowLoader={setShowLoader}
                                        promoCode={promoCode}
                                        setPromoCode={setPromoCode}
                                    />
                                    <div className="my_row">
                                       {/* @php
                                        if ($bypass == true) {
                                        $route = route('subscribe.change.plan');
                                    } elseif ($existing) {
                                        $route = route('subscribe.resume');
                                    } else {
                                        $route = route('subscribe.post');
                                    }
                                        @endphp*/}

                                        <form method="" id="payment-form" action="">
                                            <section>
                                                <input id="form_discount_code" type="hidden" name="discountCode" />
                                                <input type="hidden" id="bypass" value="null" />
                                                <div className="drop_in_wrap">
                                                    <div className="bt-drop-in-wrapper">
                                                        <div id="bt-dropin"></div>
                                                    </div>
                                                </div>
                                            </section>
                                            <input id="nonce" name="payment_method_nonce" type="hidden"/>
                                            <a
                                                href="#"
                                                className="button blue"
                                                onClick={(e) => handleSubmit(e)}
                                            >
                                                <span>Submit</span>
                                            </a>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}

export default Purchase;
