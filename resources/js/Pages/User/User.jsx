import React, {useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {Head, usePage} from '@inertiajs/react';
import PaymentComponent from '@/Pages/User/Components/PaymentComponent.jsx';
import UserForm from '@/Pages/User/Components/UserForm.jsx';
import SetFlash from '@/Utils/SetFlash.jsx';
import ChoosePlanContent from '@/Pages/User/Components/ChoosePlanContent.jsx';
import PlanComponent from '@/Pages/User/Components/PlanComponent.jsx';
import PaymentMethodsComponent from '@/Pages/User/Components/PaymentMethodsComponent.jsx';
import BreadCrumbs from '@/Pages/User/Components/BreadCrumbs.jsx';
import {isEmpty} from 'lodash';

const User = ({
                  subscriptionInfo,
                  payment_method,
                  token,
                  payment_method_token
}) => {

    const { auth } = usePage().props;
    const permissions = auth.user.permissions;
    //const userInfo = auth.user.userInfo;
    const [userInfo, setUserInfo] = useState(auth.user.userInfo);

    const [showSection, setShowSection] = useState([]);
    const [subscription, setSubscription] = useState(subscriptionInfo);

    return (

        <AuthenticatedLayout>
            <Head title="Edit Accouunt" />
            <SetFlash />
            <div className="container">
                <div className={`user_account my_row text-center form_page plans ${permissions.includes('view subscription details') ? "mt-4" : "" }`}>
                    <h2 className="page_title">Update Account Settings</h2>
                    <div className={`card inline-block relative`}>
                        {!isEmpty(showSection) &&
                            <BreadCrumbs
                                showSection={showSection}
                                setShowSection={setShowSection}
                            />
                        }
                        {showSection.includes("plans") || showSection.includes("cancel") ?

                            <ChoosePlanContent
                                showSection={showSection}
                                setShowSection={setShowSection}
                                subscription={subscription}
                                setSubscription={setSubscription}
                            />

                        :
                            showSection.includes("methods") ?

                                <PaymentMethodsComponent
                                    token={token}
                                    subscription={subscription}
                                    userInfo={userInfo}
                                    setUserInfo={setUserInfo}
                                    setShowSection={setShowSection}
                                />

                                :
                                <div className={`${showSection && "inactive"} ${permissions.includes("view subscription details") &&
                                (!subscription || subscription.braintree_id === " bypass" ? " two_columns" : "")}`}>
                                    <div className="card-body">
                                        <div className={`my_row ${permissions.includes("view subscription details") && " three_columns "} ${!subscription || subscription.braintree_id === "bypass" ? "two_columns" : ""}`}>
                                            <div className={`column update_info ${!permissions.includes('view subscription details') ? "w-full" : ""}`}>
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
                                                        payment_method_token={payment_method_token}
                                                        showSection={showSection}
                                                        setShowSection={setShowSection}
                                                    />
                                                </div>
                                            }
                                            { (subscription && subscription.braintree_id !== "bypass") &&
                                                <div className="column">
                                                    <PaymentComponent
                                                        paymentMethod={payment_method}
                                                        userInfo={userInfo}
                                                        setUserInfo={setUserInfo}
                                                        authToken={token}
                                                        setShowSection={setShowSection}
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
