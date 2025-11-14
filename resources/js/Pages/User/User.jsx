import React, {useEffect, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {Head, usePage} from '@inertiajs/react';
import PaymentComponent from '@/Pages/User/Components/PaymentComponent.jsx';
import UserForm from '@/Pages/User/Components/UserForm.jsx';
import SetFlash from '@/Utils/SetFlash.jsx';
import ChoosePlanContent from '@/Pages/User/Components/ChoosePlanContent.jsx';
import PlanComponent from '@/Pages/User/Components/PlanComponent.jsx';
import BreadCrumbs from '@/Pages/User/Components/BreadCrumbs.jsx';
import {Loader} from '@/Utils/Loader.jsx';
import {
    SubscriptionPaymentButtons
} from '@/Components/Payments/SubscriptionPaymentButtons.jsx';
import EventBus from '@/Utils/Bus.jsx';
import PayOutComponent from '@/Pages/User/Components/PayOutComponent.jsx';
import {MessageAlertPopup} from '@/Utils/Popups/MessageAlertPopup.jsx';
import PageHeader from "@/Components/PageHeader.jsx";

const User = ({
                  message = null,
                  isAffiliate = false,
                  hasOffers = false,
                  total = false,
                  payoutInfo,
                  updateMethodLink
}) => {

    const { auth } = usePage().props;
    const permissions = auth.user.permissions;
    const [userInfo, setUserInfo] = useState(auth.user.userInfo);
    const env = auth.env;
    const [showMessageAlertPopup, setShowMessageAlertPopup] = useState({
        show: false,
        text: ""
    });
    const [showSection, setShowSection] = useState([]);
    const [subscription, setSubscription] = useState(auth.user.subscription);

    const stripeUrl = env === "production" ?
        "https://checkout.link.pro/p/login/eVa2aU4q09HyfKg144?prefilled_email=" :
        "https://checkout.link.pro/p/login/test_3cs6pE5zK02p6Nq145?prefilled_email=";

    const [showPaymentButtons, setShowPaymentButtons] = useState({
        show: false,
        type: "",
        plan: "",
        pmType: "",
        stripeUrl: stripeUrl + userInfo.email,
    });

    const [showLoader, setShowLoader] = useState({
        show: false,
        icon: "",
        position: "",
        progress: null,
        message: null
    });

    useEffect(() => {
        if(message) {
            EventBus.dispatch("success", {message: message});
        }
    }, []);

    return (

        <AuthenticatedLayout>
            <Head title="Edit Accouunt" />
            <SetFlash />
            <div className="container">
                {showMessageAlertPopup.show &&
                    <MessageAlertPopup
                        showMessageAlertPopup={showMessageAlertPopup}
                        setShowMessageAlertPopup={setShowMessageAlertPopup}
                    />
                }
                <div className="pb-6 gap-3 flex justify-between align-bottom items-baseline my-3 border-b border-gray-100">
                    <PageHeader
                        heading="Account Settings"
                        description="Update your account settings, manage your subscription, payment methods, and more."
                    />
                </div>
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className={`user_account my_row text-center form_page plans ${permissions.includes('view subscription details') ? "mt-4" : "" }`}>
                        <div className={`card inline-block relative
                        ${(showSection.includes("changePlan") ||
                            showSection.includes("changePayPalPlan") ||
                            showPaymentButtons.show) && 'active'}`}
                        >
                            {auth?.status &&
                                <div className="my-3 p-3 mb-5 bg-red-50 rounded-lg">
                                    <h2 className="text-lg font-bold text-red-500">Please finish onboarding to enable payouts.{/*{auth?.status}*/}</h2>
                                </div>
                             }
                            {showLoader.show &&
                                <Loader
                                    showLoader={showLoader}
                                />
                            }

                            {showSection.length > 0 &&
                                <BreadCrumbs
                                    showSection={showSection}
                                    setShowSection={setShowSection}
                                />
                            }
                            {showSection.includes("plans") || (showSection.includes("cancel")) ?

                                <ChoosePlanContent
                                    showSection={showSection}
                                    setShowSection={setShowSection}
                                    subscription={subscription}
                                    setSubscription={setSubscription}
                                    setShowLoader={setShowLoader}
                                    pmType={userInfo.pm_type}
                                    env={auth.env}
                                />

                            :
                                showPaymentButtons.show ?
                                    <SubscriptionPaymentButtons
                                        showPaymentButtons={showPaymentButtons}
                                        setShowPaymentButtons={setShowPaymentButtons}
                                        env={auth.env}
                                        subId={subscription.sub_id}
                                        setUserInfo={setUserInfo}
                                        setSubscription={setSubscription}
                                        subEndDate={subscription.ends_at}
                                    />
                                    :
                                    <div className="card-body w-full inline-block">
                                        {subscription &&
                                            <div>
                                                <UserForm
                                                    userInfo={userInfo}
                                                    setUserInfo={setUserInfo}
                                                    subscription={subscription}
                                                />
                                            </div>
                                        }
                                        <div className=
                                                 {`mt-8 grid gap-6
                  [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] ${permissions.includes("view subscription details")}`}>

                                            {!subscription &&
                                                <UserForm
                                                    userInfo={userInfo}
                                                    setUserInfo={setUserInfo}
                                                    subscription={subscription}
                                                />
                                            }

                                            {permissions.includes('view subscription details') &&
                                                <div className="rounded-2xl bg-white shadow-md p-5">
                                                    <PlanComponent
                                                        subscription={subscription}
                                                        setSubscription={setSubscription}
                                                        userInfo={userInfo}
                                                        showSection={showSection}
                                                        setShowSection={setShowSection}
                                                        setShowLoader={setShowLoader}
                                                        pmType={userInfo.pm_type}
                                                        setShowPaymentButtons={setShowPaymentButtons}
                                                    />
                                                </div>
                                            }
                                            { (subscription && subscription.sub_id !== "bypass") &&
                                                <div className="rounded-2xl bg-white shadow-md p-5">
                                                    <PaymentComponent
                                                        userInfo={userInfo}
                                                        plan={subscription.name}
                                                        status={subscription.status}
                                                        setShowPaymentButtons={setShowPaymentButtons}
                                                    />
                                                </div>
                                            }
                                            { (hasOffers || isAffiliate) ?
                                                <div className="rounded-2xl bg-white shadow-md p-5">
                                                    <PayOutComponent
                                                        setShowLoader={setShowLoader}
                                                        total={total}
                                                        setShowMessageAlertPopup={setShowMessageAlertPopup}
                                                        payoutInfo={payoutInfo}
                                                        updateMethodLink={updateMethodLink}
                                                    />
                                                </div>
                                                :
                                                ""
                                            }
                                        </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default User;
