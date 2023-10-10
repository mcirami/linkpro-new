import React, {useEffect, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {Head, usePage} from '@inertiajs/react';
import PaymentComponent from '@/Pages/User/Components/PaymentComponent.jsx';
import UserForm from '@/Pages/User/Components/UserForm.jsx';

const User = ({
                  subscription,
                  payment_method,
                  token,
                  payment_method_token
}) => {

    const { auth } = usePage().props;
    const permissions = auth.user.permissions;
    const userInfo = auth.user.userInfo;

    const [currentDateTime, setCurrentDateTime] = useState("");

    useEffect(() => {
        const today = new Date();
        const date = today.getFullYear() + '-' +
            (today.getMonth() + 1) + '-' + today.getDate() + " " +
            ("0" + today.getHours()).slice(-2) + ":" +
            ("0" + today.getMinutes()).slice(-2) + ":" +
            ("0" + today.getSeconds()).slice(-2);
        setCurrentDateTime(date);
    }, [])

    return (

        <AuthenticatedLayout>
            <Head title="Edit Accouunt" />
            <div className="container">
                <div className={`my_row text-center form_page plans ${permissions.includes('view subscription details') ? "mt-4" : "" }`}>
                    <h2 className="page_title">Update Account Settings</h2>
                    <div className={`card inline-block ${permissions.includes("view subscription details") &&
                    (!subscription || subscription.braintree_id === " bypass" ? " two_columns" : "")}`}>
                        <div className="card-body">
                            <div className={`my_row ${permissions.includes("view subscription details") && " three_columns "} ${!subscription || subscription.braintree_id === "bypass" ? "two_columns" : ""}`}>
                                <div className={`column update_info ${!permissions.includes('view subscription details') ? "w-full" : ""}`}>

                                    <UserForm
                                        userInfo={userInfo}
                                    />

                                </div>
                                {permissions.includes('view subscription details') &&

                                    <div className="column">
                                        <h2 className="text-uppercase">Plan Type</h2>
                                        <h4>Your Current Plan is</h4>
                                        { (subscription && subscription.braintree_status === "active") || (subscription && subscription.braintree_status === "pending") ?

                                            <>
                                                <div className="plan_name">
                                                    <p className="text-capitalize">{subscription.name}</p>
                                                    <img src={ Vapor.asset('images/plan-type-bg.png')} alt="" />
                                                </div>
                                                {userInfo.braintree_id !== "bypass" &&
                                                    <a href="#" className="cancel_popup cancel_link" data-plan={subscription.braintree_id} data-type="cancel">Cancel Subscription</a>
                                                }
                                            </>
                                            :
                                            subscription && subscription.ends_at > currentDateTime ?
                                                <>
                                                    <div className="plan_name">
                                                        <p className="text-capitalize">{subscription.name}</p>
                                                        <img src={ Vapor.asset('images/plan-type-bg.png') } alt="" />
                                                    </div>
                                                    <div className="canceled_text">
                                                        <p>Your subscrition has been cancelled. It will end on:<br />
                                                            <span>
                                                                {new Date(subscription.ends_at).toLocaleDateString()}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </>
                                                :
                                                <div className="plan_name">
                                                    <p>Free</p>
                                                    <img src={ Vapor.asset('images/plan-type-bg.png') } alt="" />
                                                </div>
                                        }
                                        { (subscription && subscription.braintree_status === "active") || (subscription && subscription.braintree_status === "pending") ?
                                            userInfo.braintree_id !== "bypass" &&
                                                <a href="#" className='button blue open_popup_choose'>
                                                    Change My Plan
                                                </a>
                                            :
                                            subscription && subscription.ends_at > currentDateTime ?
                                                <form action={ route('subscribe.resume') } method="post">
                                                    <input name="discountCode" type="hidden" value=""/>
                                                    <input name="payment_method_token" type="hidden" value={payment_method_token}/>
                                                    <input className="level" name="planId" type="hidden" value={subscription.name} />
                                                        <button type="submit" className='button blue'>
                                                            Resume
                                                        </button>
                                                </form>
                                                :
                                                <a className='button blue' href={ route('plans.get') }>
                                                    Change My Plan
                                                </a>
                                        }
                                    </div>
                                }
                                { (subscription && subscription.braintree_id !== "bypass") &&
                                    <div className="column">
                                        <PaymentComponent
                                            paymentMethod={payment_method}
                                            user={userInfo}
                                            authToken={token}
                                        />
                                    </div>

                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default User;
