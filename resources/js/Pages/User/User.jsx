import React, {useState} from 'react';
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

const User = ({env}) => {

    const { auth } = usePage().props;
    const permissions = auth.user.permissions;
    const [userInfo, setUserInfo] = useState(auth.user.userInfo);

    const [showSection, setShowSection] = useState([]);
    const [subscription, setSubscription] = useState(auth.user.subscription);

    const [showLoader, setShowLoader] = useState({
        show: false,
        icon: "",
        position: ""
    });

    return (

        <AuthenticatedLayout>
            <Head title="Edit Accouunt" />
            <SetFlash />
            <div className="container">
                <div className={`user_account my_row text-center form_page plans ${permissions.includes('view subscription details') ? "mt-4" : "" }`}>
                    <h2 className="page_title">Update Account Settings</h2>
                    <div className={`card inline-block relative ${(showSection.includes("changePlan") || showSection.includes("changePayPalPlan")) && 'active'}`}>

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
                        {showSection.includes("plans") || showSection.includes("cancel") ?

                            <ChoosePlanContent
                                showSection={showSection}
                                setShowSection={setShowSection}
                                subscription={subscription}
                                setSubscription={setSubscription}
                                setShowLoader={setShowLoader}
                                pmType={userInfo.pm_type}
                                env={env}
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
                                                />
                                            </div>
                                        }
                                        { (subscription && subscription.sub_id !== "bypass") &&
                                            <div className="column payment">
                                                <PaymentComponent
                                                    userInfo={userInfo}
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
