import React, {useEffect, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {Head, usePage} from '@inertiajs/react';
import PaymentComponent from '@/Pages/User/Components/PaymentComponent.jsx';
import UserForm from '@/Pages/User/Components/UserForm.jsx';
import SetFlash from '@/Utils/SetFlash.jsx';
import ChoosePlanContent from '@/Pages/User/Components/ChoosePlanContent.jsx';
import PlanComponent from '@/Pages/User/Components/PlanComponent.jsx';
import BreadCrumbs from '@/Pages/User/Components/BreadCrumbs.jsx';
import {isEmpty} from 'lodash';
import {Loader} from '@/Utils/Loader.jsx';
import {
    SubscriptionPaymentButtons
} from '@/Components/Payments/SubscriptionPaymentButtons.jsx';
import EventBus from '@/Utils/Bus.jsx';
import {getFutureTime} from '@/Services/TimeRequests.jsx';

const User = ({message = null}) => {

    const { auth } = usePage().props;
    const permissions = auth.user.permissions;
    const [userInfo, setUserInfo] = useState(auth.user.userInfo);

    const [showSection, setShowSection] = useState([]);
    const [subscription, setSubscription] = useState(auth.user.subscription);
    const [showPaymentButtons, setShowPaymentButtons] = useState({
        show: false,
        type: "",
        plan: "",
        pmType: "",
        stripeUrl: "https://checkout.link.pro/p/login/test_3cs6pE5zK02p6Nq145?prefilled_email=" + userInfo.email,
        subStartDate: subscription?.created_at || null
    });

    const [showLoader, setShowLoader] = useState({
        show: false,
        icon: "",
        position: ""
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
                <div className={`user_account my_row text-center form_page plans ${permissions.includes('view subscription details') ? "mt-4" : "" }`}>
                    <h2 className="page_title">Update Account Settings</h2>
                    <div className={`card inline-block relative ${(showSection.includes("changePlan") || showSection.includes("changePayPalPlan") || showPaymentButtons.show) && 'active'}`}>

                        {showLoader.show &&
                            <Loader
                                showLoader={showLoader}
                            />
                        }

                        {!isEmpty(showSection) &&
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
                                />
                                :
                            <div className={`w-full inline-block ${ (permissions.includes("view subscription details") &&
                                (!subscription || subscription.sub_id === "bypass") ) || (!permissions.includes("view subscription details") && permissions.includes('view courses')) ? "two_columns" : ""}`}>
                                <div className="card-body w-full inline-block">
                                    <div className=
                                             {`my_row ${permissions.includes("view subscription details") && (subscription && subscription.sub_id !== "bypass") ? "three_columns " : ""} ${ (!subscription || subscription.sub_id === "bypass") ? "two_columns" : ""}`}>
                                        <div className={`column update_info ${!permissions.includes('view subscription details') ? "!w-full" : ""}`}>
                                            <UserForm
                                                userInfo={userInfo}
                                                setUserInfo={setUserInfo}
                                            />
                                        </div>
                                        {permissions.includes('view subscription details') &&

                                            <div className="column">
                                                <PlanComponent
                                                    subscription={subscription}
                                                    setSubscription={setSubscription}
                                                    userInfo={userInfo}
                                                    showSection={showSection}
                                                    setShowSection={setShowSection}
                                                    setShowLoader={setShowLoader}
                                                    pmType={userInfo.pm_type}
                                                />
                                            </div>
                                        }
                                        { (subscription && subscription.sub_id !== "bypass") &&
                                            <div className="column payment">
                                                <PaymentComponent
                                                    userInfo={userInfo}
                                                    plan={subscription.name}
                                                    setShowPaymentButtons={setShowPaymentButtons}
                                                />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default User;
