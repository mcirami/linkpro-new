import React, {useEffect, useState} from 'react';
import {resumeSubscription} from '@/Services/SubscriptionRequests.jsx';
import {Link} from '@inertiajs/react';

const PlanComponent = ({
                           subscription,
                           setSubscription,
                           userInfo,
                           payment_method_token,
                           setShowSection,
                           setShowLoader
}) => {

    const [currentDateTime, setCurrentDateTime] = useState("");

    useEffect(() => {
        const today = new Date();
        const date = today.getFullYear() + '-' +
            (today.getMonth() + 1) + '-' + today.getDate() + " " +
            ("0" + today.getHours()).slice(-2) + ":" +
            ("0" + today.getMinutes()).slice(-2) + ":" +
            ("0" + today.getSeconds()).slice(-2);
        setCurrentDateTime(date);
    }, []);

    const handleResumeClick = (e) => {
        e.preventDefault();

        setShowLoader({
            show: true,
            position: 'absolute',
            icon: ""
        })

        const packets = {
            payment_method_token: payment_method_token,
            planId: subscription.name
        }

        resumeSubscription(packets).then((response) => {
            if(response.success) {
                setSubscription((prev) => ({
                    ...prev,
                    ends_date: null,
                    braintree_status: "active"
                }));
            }

            setShowLoader({
                show: false,
                position: "",
                icon: ""
            })
        })
    }

    return (
        <>
            <h2 className="text-uppercase">Plan Type</h2>
            <h4>Your Current Plan is</h4>
            { (subscription && subscription.braintree_status === "active") || (subscription && subscription.braintree_status === "pending") ?

                <>
                    <div className="plan_name">
                        <p className="text-capitalize">{subscription.name}</p>
                        <img src={ Vapor.asset('images/plan-type-bg.png')} alt="" />
                    </div>
                    {userInfo.braintree_id !== "bypass" &&
                        <a href="#"
                           className="cancel_link"
                           data-plan={subscription.braintree_id}
                           onClick={(e) => setShowSection(["cancel"])}
                        >Cancel Subscription</a>
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
                            <p>Your subscription has been cancelled. It will end on:<br />
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
                <a href="#" className='button blue' onClick={(e) => {
                    e.preventDefault();
                    setShowSection((prev) => [
                        ...prev,
                        "plans"
                    ])
                }}>
                    Change My Plan
                </a>
                :
                subscription && subscription.ends_at > currentDateTime ?
                    <form action="" method="">
                        <a href="#"
                           className='button blue'
                           onClick={(e) => handleResumeClick(e)}
                        >
                            Resume
                        </a>
                    </form>
                    :
                    <Link className='button blue' href={ route('plans.get') }>
                        Change My Plan
                    </Link>
            }
        </>
    );
};

export default PlanComponent;
