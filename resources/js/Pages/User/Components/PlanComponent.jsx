import React, {useEffect, useState} from 'react';
import {resumeSubscription} from '@/Services/SubscriptionRequests.jsx';
import {Link} from '@inertiajs/react';

const PlanComponent = ({
                           subscription,
                           setSubscription,
                           userInfo,
                           setShowSection,
                           setShowLoader
}) => {

    const [currentDateTime, setCurrentDateTime] = useState("");
    const [subEnd, setSubEnd]   = useState("");

    useEffect(() => {
        const today = new Date();
        setCurrentDateTime(today.setHours(0,0,0));
    }, []);

    useEffect(() => {
        const date = new Date(subscription.ends_at);
        setSubEnd(date.setHours(23,59,59))

    }, [])

    const handleResumeClick = (e) => {
        e.preventDefault();

        setShowLoader({
            show: true,
            position: 'absolute',
            icon: ""
        })

        const packets = {
            subId: subscription.sub_id,
            plan: subscription.name
        }

        resumeSubscription(packets).then((response) => {
            if(response.success) {
                setSubscription((prev) => ({
                    ...prev,
                    ends_at: null,
                    status: "active"
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
            { (subscription && subscription.status === "active") || (subscription && subscription.status === "pending") ?

                <>
                    <div className="plan_name">
                        <p className="text-capitalize">{subscription.name}</p>
                        <img src={ Vapor.asset('images/plan-type-bg.png')} alt="" />
                    </div>
                    {userInfo.sub_id !== "bypass" &&
                        <a href="#"
                           className="cancel_link"
                           data-plan={subscription.sub_id}
                           onClick={(e) => setShowSection(["cancel"])}
                        >Cancel Subscription</a>
                    }
                </>
                :
                subscription && (subEnd > currentDateTime) ?
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
            { (subscription && subscription.status === "active") || (subscription && subscription.status === "pending") ?
                userInfo.sub_id !== "bypass" &&
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
                subscription && subEnd > currentDateTime ?
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
