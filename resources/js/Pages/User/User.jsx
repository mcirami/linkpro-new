import React, {useEffect, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {Head, usePage} from '@inertiajs/react';
import PaymentComponent from '@/Pages/User/Components/PaymentComponent.jsx';

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

    const handleChange = () => {

    }

    return (

        <AuthenticatedLayout>
            <Head title="Edit Accouunt" />
            <div className="container">
                <div className={`my_row text-center form_page plans ${permissions.includes('view subscription details') ? "mt-4" : "" }`}>
                    <h2 className="page_title">Update Account Settings</h2>
                    <div className={`card inline-block ${permissions.includes("view subscription details") &&
                    (!subscription || subscription.braintree_id === " bypass" ? " two_columns" : "")}`}>
                        {/*@if (count($errors) > 0)
                        <div className="alert alert-danger">
                            <ul>
                                @foreach($errors->all() as $error)
                                <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                        @endif*/}
                        <div className="card-body">
                            <div className={`my_row ${permissions.includes("view subscription details") && " three_columns "} ${!subscription || subscription.braintree_id === "bypass" ? "two_columns" : ""}`}>
                                <div className={`column update_info ${!permissions.includes('view subscription details') ? "w-full" : ""}`}>
                                    <h2 className="text-uppercase">Account Info</h2>
                                    <form method="POST" action={`/update-account/${userInfo.id}`}>
                                        <div className="form_inputs">
                                            <div className="user_account mb-5 my_row">
                                                <h5 className="my_row mb-4 text-left">Update Email</h5>
                                                <div className="input_wrap my_row relative">
                                                    <input id="email"
                                                           type="email"
                                                           className="w-full animate bg-white @error('email') is-invalid @enderror"
                                                           name="email"
                                                           value={ userInfo.email }
                                                           autoComplete="email"
                                                           required
                                                           onChange={handleChange}
                                                    />
                                                    <label className="z-2" htmlFor="email">E-Mail Address</label>
                                                </div>
                                               {/* @if ($errors->has('email'))
                                                <span className="invalid-feedback" role="alert">
                                                                <strong>{{ $errors->first('email')  }}</strong>
                                                            </span>
                                                @endif*/}
                                            </div>
                                            <div className="user_account">
                                                <h5 className="my_row my_row mb-4 text-left">Change Password</h5>
                                                <div className="input_wrap my_row relative mb-2">
                                                    <input id="password" type="password" className="w-full animate bg-white @error('password') is-invalid @enderror" name="password" autoComplete="new-password" />
                                                    <label className="z-2" htmlFor="password">New Password</label>
                                                </div>
                                               {/* @error($errors->has('password'))
                                                <span className="invalid-feedback" role="alert">
                                                                <strong>{{ $errors->first('password')  }}</strong>
                                                            </span>
                                                @enderror*/}
                                            </div>
                                            <div className="input_wrap my_row relative">
                                                <input id="password-confirm" type="password" className="w-full animate bg-white" name="password_confirmation" autoComplete="new-password" />
                                                <label className="z-2" htmlFor="password-confirm">Confirm New Password</label>
                                            </div>
                                        </div>
                                        <div className="form_buttons">
                                            <button type="submit" className="button blue text-uppercase">
                                                Update My Info
                                            </button>
                                        </div>
                                    </form>
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
                                                            <span>{/*{{\Carbon\Carbon::createFromDate($subscription->ends_at)->format('F j, Y')}}*/}
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
