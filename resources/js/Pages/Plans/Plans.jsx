import React from 'react';
import {Head, router, usePage} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';

function Plans({path}) {

    const { auth } = usePage().props;
    const subscriptionName = auth.user.subscription.name;
    const braintreeStatus = auth.user.subscription.braintree_status;
    const braintreeID = auth.user.subscription.braintree_id;

    return (
        <AuthenticatedLayout>
            <Head title="Subscription Plans"/>
            <div className="container">
                <div className="my_row form_page plans text-center">
                    {path.includes('create-page') ?
                        <>
                            <h2 className="page_title !m-0">Welcome to Link Pro!</h2>
                            <p className="sub_title mb-5">Continue free forever or upgrade for advanced features!</p>
                        </>
                        :
                        <h2 className="page_title">Upgrade Now For Advanced Features!</h2>
                    }
                    <div className="card inline-block">
                        <div className="card-body">
                            <div className={`my_row  ${
                                (subscriptionName === "premier") && (braintreeStatus === "active" ||
                                    braintreeStatus === "pending") ? "two_columns" : "three_columns"}`}>
                                { (!subscriptionName || (subscriptionName !== "premier") ) || (braintreeStatus !== "active" && braintreeStatus !== "pending") ?
                                    <div className="column pro">
                                        <h2 className="text-uppercase">Pro</h2>
                                        <ul>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                                    <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                                                </svg>
                                                <p>Free Features PLUS</p>
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
                                                <p>Group Icons In Folders</p>
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                                    <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                                                </svg>
                                                <p>Custom Icons</p>
                                            </li>
                                        </ul>
                                        <div className="pricing">
                                            <h3><sup>$</sup>4.99<span>/ mo</span></h3>
                                        </div>
                                        <div className="button_row">

                                            { (subscriptionName === "pro") &&
                                            (braintreeStatus === "active" ||
                                                braintreeStatus === "pending") ?
                                                <span className='button disabled'>Current</span>
                                                :
                                                braintreeStatus === "active" ?
                                                    <button className='button blue open_popup' data-type="downgrade" data-level="pro">
                                                        Downgrade My Plan
                                                    </button>
                                                :
                                                    <a className='button blue_gradient' href='/subscribe?plan=pro'>
                                                        Get Pro
                                                    </a>
                                            }
                                        </div>
                                    </div>
                                    :
                                    ""
                                }
                                <div className="column premier">
                                    <h2 className="text-uppercase">Premier</h2>
                                    <ul>
                                        <li>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                                <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                                            </svg>
                                            <p>Pro Features PLUS</p>
                                        </li>
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
                                            <p>Password Protected Links</p>
                                        </li>
                                    </ul>
                                    <div className="pricing">
                                        <h3><sup>$</sup>19.99<span>/ mo</span></h3>
                                    </div>
                                    <div className="button_row">
                                        {
                                            (subscriptionName === "premier") &&
                                            (braintreeStatus === "active" || braintreeStatus === "pending") ?
                                                <span className='button disabled'>Current</span>
                                            :
                                                subscriptionName &&
                                                (braintreeStatus === "active" || braintreeStatus === "pending") &&
                                                braintreeID !== "bypass" ?
                                                <button className="open_popup button black_gradient" data-type="upgrade" data-level="premier">
                                                    Go Premier
                                                </button>
                                           :
                                            <a className='button black_gradient' href='/subscribe?plan=premier'>
                                                Go Premier
                                            </a>
                                        }
                                    </div>
                                </div>
                                <div className="column custom">
                                    <h2 className="text-uppercase">Custom</h2>
                                    <ul>
                                        <li>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                                <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                                            </svg>
                                            <p>Unlimited Links</p>
                                        </li>
                                        <li>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                                <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                                            </svg>
                                            <p>Dedicated Account Manager</p>
                                        </li>
                                    </ul>
                                    <div className="pricing">
                                        <h3>ASK</h3>
                                    </div>
                                    <div className="button_row">
                                        <a className="button gray_gradient" href="mailto:admin@link.pro">Contact Us</a>
                                    </div>
                                </div>
                            </div>
                            {path.includes('create-page') &&
                                <div className="my_row">
                                    <div className="column free plans_page">
                                        <h2 className="text-uppercase">Free</h2>
                                        <div className="my_row three_columns">
                                            <div className="column">
                                                <h4>Having trouble choosing?</h4>
                                                <p>No Problem! Continue now free and upgrade later!</p>
                                            </div>
                                            <div className="column">
                                                <ul>
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
                                                        <p>Up To 8 Icons</p>
                                                    </li>
                                                    <li>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                                            <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
                                                        </svg>
                                                        <p>Add Social Links</p>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="column">
                                                <a className="button green_gradient" href={ route('dashboard') }>Continue</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Plans;
