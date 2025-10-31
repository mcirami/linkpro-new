import React, {useState} from 'react';
import ConfirmPlanChange from '@/Pages/User/Components/ConfirmPlanChange.jsx';
import {changePlan} from '@/Services/SubscriptionRequests.jsx';
import {SubscriptionPaymentButtons} from '@/Components/Payments/SubscriptionPaymentButtons.jsx';
import ProPlan from '@/Components/PlanComponents/ProPlan.jsx';
import PremierPlan from '@/Components/PlanComponents/PremierPlan.jsx';
import PlanCard from "@/Pages/Plans/PlanCard.jsx";

const ChoosePlanContent = ({
                               showSection,
                               setShowSection,
                               subscription,
                               setSubscription,
                               setShowLoader,
                               pmType,
                               env
}) => {

    const [showPaymentButtons, setShowPaymentButtons] = useState({
        show: false,
        type: "",
        plan: "",
        pmType: ""
    });

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
            /*
            * setting this to add class and shrink card for paypal button
            * */
            setShowSection((prev) => ([
                ...prev,
                "changePayPalPlan"
            ]))

            setShowPaymentButtons({
                show: false,
                type: "changePlan",
                plan: subscriptionLevel,
                pmType: pmType,
                page: "user"
            })
        } else {
            const packets = {
                plan: subscriptionLevel,
                subId: subscription.sub_id,
                pmType: pmType
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
        <div id="popup_choose_level" className="inline-block relative w-full max-w-3xl pt-10">
            <div className={`form_page plans inline-block w-full`}>

                {showSection.includes("changePlan") || (showSection.includes("cancel")) ?
                    <ConfirmPlanChange
                        subscription={subscription}
                        showSection={showSection}
                        setShowSection={setShowSection}
                        setSubscription={setSubscription}
                        setShowLoader={setShowLoader}
                        pmType={pmType}
                        env={env}
                    />
                    :
                    showSection.includes("changePayPalPlan") ?
                        <SubscriptionPaymentButtons
                            showPaymentButtons={showPaymentButtons}
                            setShowPaymentButtons={setShowPaymentButtons}
                            env={env}
                            subId={subscription.sub_id}
                        />
                    :
                        <>
                            {/* Header */}
                            <div className="flex items-center justify-center gap-3">
                                <div className="h-9 w-9 rounded-lg bg-indigo-50 grid place-items-center ring-1 ring-indigo-200">
                                    <img
                                        className="h-5 w-5"
                                        src={Vapor.asset('images/icon-change-plans.png')}
                                        alt=""
                                    />
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-900">Change Your Plan</h2>
                            </div>
                            {/* Plans Grid */}
                            <div className="mt-6 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
                                <PlanCard
                                    name="Free"
                                    price="$0"
                                    period=""
                                    accent="green"
                                    features={[
                                        '1 Unique Link',
                                        'Up To 8 Icons',
                                        'Add Social Links',
                                    ]}
                                    isCurrent={subscription?.name === 'free'}
                                    ctaLabel={subscription?.name === 'free' ? 'Current Plan' : 'Downgrade to Free'}
                                    onClick={(e) => {
                                        if (subscription?.name !== 'free') {
                                            e.currentTarget.dataset.level = 'free-cancel';
                                            handleButtonClick(e, 'cancel');
                                        }
                                    }}
                                    ctaProps={{ 'data-level': 'free-cancel' }}
                                />
                                {/* Pro (show when not already premier-only flow) */}
                                {(!subscription?.name || subscription?.name === 'premier' || subscription?.name === 'free') && (
                                    <PlanCard
                                        name="Pro"
                                        price="$4.99"
                                        period="/ mo"
                                        accent="indigo"
                                        features={[
                                            'Free Features PLUS',
                                            'Unlimited Icons',
                                            'Custom Icons',
                                        ]}
                                        isCurrent={subscription?.name === 'pro'}
                                        ctaLabel={subscription?.name === 'pro' ? 'Current Plan' : 'Switch to Pro'}
                                        onClick={(e) => handleButtonClick(e, 'changePlan')}
                                    />
                                )}

                                {/* Premier */}
                                {(!subscription?.name || subscription?.name === 'pro' || subscription?.name === 'free') && (
                                    <PlanCard
                                        name="Premier"
                                        price="$9.99"
                                        period="/ mo"
                                        accent="violet"
                                        features={[
                                            'Everything in Pro',
                                            'Priority Support',
                                            'Advanced Analytics',
                                        ]}
                                        isCurrent={subscription?.name === 'premier'}
                                        ctaLabel={subscription?.name === 'premier' ? 'Current Plan' : 'Upgrade to Premier'}
                                        onClick={(e) => handleUpgradeClick(e, 'premier')}
                                    />
                                )}

                            </div>
                        </>
                }

            </div>
        </div>
    );
}

export default ChoosePlanContent;
