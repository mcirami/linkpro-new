import React, {useEffect, useState} from 'react';
import {getUserPages} from '@/Services/UserService.jsx';
import ConfirmPlanChange from '@/Pages/User/Components/ConfirmPlanChange.jsx';
import {changePlan} from '@/Services/SubscriptionRequests.jsx';
import {PaymentButtonsPopup} from '@/Components/PaymentButtonsPopup.jsx';

const ChoosePlanContent = ({
                               showSection,
                               setShowSection,
                               subscription,
                               setSubscription,
                               setShowLoader,
                               pmType,
                               env
}) => {

    const [pages, setPages] = useState({});

    const [showPaymentButtonPopup, setShowPaymentButtonPopup] = useState({
        show: false,
        type: "",
        plan: "",
        pmType: ""
    });

    useEffect(() => {

        getUserPages().then((response) => {
            if (response.success) {
                setPages(response.pages);
            }
        })
    },[])

    const handleButtonClick = (e, type) => {
        e.preventDefault();
        setShowSection((prev) => ([
            ...prev,
            type
        ]))
    }

    const handleUpgradeClick = (e, subscriptionLevel) => {
        e.preventDefault();

        setShowLoader({
            show: true,
            position: 'absolute',
            icon: ""
        })

        if(pmType === "paypal") {
            setShowSection((prev) => ([
                ...prev,
                "changePayPalPlan"
            ]))
            setShowPaymentButtonPopup({
                show: false,
                type: "changePlan",
                plan: subscriptionLevel,
                pmType: pmType,
                page: "user"
            })
        } else {
            const packets = {
                plan: subscriptionLevel,
                subId: subscription.sub_id
            }

            changePlan(packets).then((response) => {
                if(response.success) {
                    setShowSection([]);
                    setSubscription(prev => ({
                        ...prev,
                        name: subscriptionLevel
                    }))
                }
            })
        }

        setShowLoader({
            show: false,
            position: "",
            icon: ""
        })
    }

    return (
        <div id="popup_choose_level" className="inline-block relative w-full">
            <div className={`form_page plans inline-block w-full`}>

                {showSection.includes("changePlan") || showSection.includes("cancel") ?
                    <ConfirmPlanChange
                        subscription={subscription}
                        pages={pages}
                        showSection={showSection}
                        setShowSection={setShowSection}
                        setSubscription={setSubscription}
                        setShowLoader={setShowLoader}
                        pmType={pmType}
                        env={env}
                    />
                    :
                    showSection.includes("changePayPalPlan") ?
                        <PaymentButtonsPopup
                            showPaymentButtonPopup={showPaymentButtonPopup}
                            setShowPaymentButtonPopup={setShowPaymentButtonPopup}
                            env={env}
                            subId={subscription.sub_id}
                        />
                    :
                    <>
                        <div className="icon_wrap">
                            <img src={ Vapor.asset('images/icon-change-plans.png') } alt="" />
                        </div>
                        <h2>Change Your Plan</h2>
                        <div className="my_row three_columns two_columns popup mt-2">
                            <div className="column free">
                                <h2 className="text-uppercase">Free</h2>
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
                                <div className="pricing">
                                    <h3 className="price"><sup>$</sup>0</h3>
                                </div>
                                <a href="#"
                                   className="button green confirm_change_plan"
                                   data-level="free-cancel"
                                   onClick={(e) => handleButtonClick(e, "cancel")}>
                                    Downgrade To Free
                                </a>
                            </div>
                            { (!subscription.name || subscription.name === "premier") ?
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
                                            <p>Custom Icons</p>
                                        </li>
                                    </ul>
                                    <div className="pricing">
                                        <h3 className="price">
                                            <sup>$</sup>4.99<span>/ mo</span></h3>
                                    </div>
                                    <a href="#"
                                       className="button blue_gradient confirm_change_plan"
                                       data-level="pro"
                                       onClick={(e) => handleButtonClick(e, "changePlan")}
                                    >
                                        Downgrade To Pro
                                    </a>
                                </div>
                                :
                                ""
                            }

                            { (!subscription.name || subscription.name === "pro") ?

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
                                        <h3 className="price">
                                            <sup>$</sup>19.99<span>/ mo</span>
                                        </h3>
                                    </div>
                                    <a href="#"
                                       className='button black_gradient'
                                       onClick={(e) => handleUpgradeClick(e, "premier")}
                                    >
                                        Upgrade To Premier
                                    </a>

                                </div>
                                :
                                ""
                            }

                        </div>
                    </>
                }

            </div>
        </div>
    );
}

export default ChoosePlanContent;
