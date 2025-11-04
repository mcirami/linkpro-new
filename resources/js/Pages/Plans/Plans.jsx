import React, { useCallback, useEffect, useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import ConfirmChange from "./ConfirmChange.jsx";
import { Loader } from "@/Utils/Loader.jsx";
import { SubscriptionPaymentButtons } from "@/Components/Payments/SubscriptionPaymentButtons.jsx";

import PageHeader from "@/Components/PageHeader.jsx";
import PlanCard from "@/Pages/Plans/PlanCard.jsx";
function Plans({ type }) {
    const { auth } = usePage().props;
    const env = auth.env;

    const [showLoader, setShowLoader] = useState({
        show: false,
        icon: "",
        position: "",
        progress: null,
    });

    const [error, setError] = useState({
        show: false,
        message: "",
    });

    const [confirmChange, setConfirmChange] = useState({
        show: false,
        type: "",
        plan: "",
        subId: "",
    });

    const [showPaymentButtons, setShowPaymentButtons] = useState({
        show: false,
        plan: "",
    });

   /* const [currentDateTime, setCurrentDateTime] = useState("");
    const [subEnd, setSubEnd] = useState("");

    useEffect(() => {
        setCurrentDateTime(GetCurrentTime);
    }, []);

    useEffect(() => {
        if (auth.user.subscription) {
            setSubEnd(GetHumanReadableTime(auth.user.subscription.ends_at));
        }
    }, []);*/

    /*const isCurrentPremier =
        subscriptionName === "premier" &&
        (status === "active" ||
            (status === "canceled" && currentDateTime < subEnd));*/

    /*const handleUpgradeClick = useCallback((e, plan) => {
        e.preventDefault();

        if (pmType === "paypal") {
            setShowPaymentButtons({
                show: true,
                type: "changePlan",
                plan: plan,
                pmType: pmType,
            });
        } else {
            setConfirmChange({
                show: true,
                type: "changePlan",
                plan: plan,
                subId: subId,
                pmType: pmType,
            });
        }
    }, []);*/

    const handlePurchaseClick = useCallback((e, type, planName) => {
        e.preventDefault();
        setShowPaymentButtons({
            show: true,
            type: "purchase",
            plan: planName,
        });
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Subscription Plans" />
            <div className="container">
                <div className="my_row form_page plans text-center">
                    <div
                        className={`card inline-block relative ${showPaymentButtons.show ? "active" : ""} `}
                    >
                        {showPaymentButtons.show ? (
                            <SubscriptionPaymentButtons
                                showPaymentButtons={showPaymentButtons}
                                setShowPaymentButtons={setShowPaymentButtons}
                                env={env}
                            />
                        ) : (
                            <>
                                {type === "register" ? (
                                    <div className="pb-6 gap-3 flex justify-between align-bottom items-baseline my-3 border-b border-gray-100">
                                        <PageHeader
                                            heading="Welcome to Link Pro!"
                                            description="Continue free forever or upgrade for advanced features!"
                                        />
                                    </div>
                                ) : (
                                    <div className="pb-6 gap-3 flex justify-between align-bottom items-baseline my-3 border-b border-gray-100 text-left">
                                        <PageHeader
                                            heading="Subscribe to Link Pro"
                                            description="Upgrade Now For Advanced Features!"
                                        />
                                    </div>
                                )}

                                {showLoader.show && (
                                    <Loader showLoader={showLoader} />
                                )}

                                <div className="card-body inline-block w-full">
                                    {error.show && (
                                        <div className="my_row block text-center mb-5 p-3 border rounded-lg border-red-500">
                                            <p className="text-red-500">
                                                {error.message}
                                            </p>
                                        </div>
                                    )}

                                    {confirmChange.show ? (
                                        <ConfirmChange
                                            confirmChange={confirmChange}
                                            setConfirmChange={setConfirmChange}
                                            setError={setError}
                                            setShowLoader={setShowLoader}
                                        />
                                    ) : (
                                        <div className="inline-block relative w-full max-w-5xl pt-10">
                                            <div className="mt-6 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
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
                                                    ctaLabel="Choose Pro"
                                                    isCurrent={false}
                                                    onClick={(e) => {
                                                        handlePurchaseClick(e, "purchase", "pro");
                                                    }}
                                                    ctaProps={{ 'data-level': 'pro' }}
                                                />
                                                <PlanCard
                                                    name="Premier"
                                                    price="$19.99"
                                                    period="/ mo"
                                                    accent="violet"
                                                    features={[
                                                        'Pro Features PLUS',
                                                        'Up to 5 Unique Links',
                                                        'Access to Affiliate Program',
                                                    ]}
                                                    ctaLabel="Choose Premier"
                                                    isCurrent={false}
                                                    onClick={(e) => {
                                                        handlePurchaseClick(e, "purchase", "premier");
                                                    }}
                                                    ctaProps={{ 'data-level': 'premier' }}
                                                />
                                                <PlanCard
                                                    name="Custom"
                                                    price="Ask For Pricing"
                                                    period=""
                                                    accent="gray"
                                                    features={[
                                                        'Premier Features PLUS',
                                                        'Dedicated Account',
                                                        'Unlimited Links',
                                                    ]}
                                                    ctaLabel="Contact Us"
                                                    isCurrent={false}
                                                    onClick={() => {
                                                        window.location.href = "mailto:admin@link.pro?subject=Ask About Custom Pricing";
                                                    }}
                                                    ctaProps={{ 'data-level': 'custom' }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {type === "register" && (
                                    <div className="inline-block relative w-full max-w-5xl mt-10">
                                        <PlanCard
                                            name="Free"
                                            price=""
                                            period=""
                                            size="full"
                                            accent="green"
                                            features={[
                                                '1 Unique Link',
                                                'Up To 8 Icons',
                                                'Add Social Links',
                                            ]}
                                            extraText={[{
                                                'title' :'Having trouble choosing?',
                                                'desc' :'No Problem! Continue now free and upgrade later!'
                                            }]}
                                            ctaLabel="Continue"
                                            isCurrent={false}
                                            onClick={() => {
                                                window.location.href = route("dashboard");
                                            }}
                                            ctaProps={{ 'data-level': 'free' }}
                                        />
                                    </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Plans;
