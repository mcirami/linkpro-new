import React, {useEffect, useState} from 'react';
import {resumeSubscription} from '@/Services/SubscriptionRequests.jsx';
import {Link} from '@inertiajs/react';
import {
    GetCurrentTime,
    GetHumanReadableTime,
} from '@/Services/TimeRequests.jsx';
import { CardHeader } from "@mui/material";
import StandardButton from "@/Components/StandardButton.jsx";

const PlanComponent = ({
                           subscription,
                           setSubscription,
                           userInfo,
                           setShowSection,
                           setShowLoader,
                           pmType,
                           setShowPaymentButtons
}) => {

    const [currentDateTime, setCurrentDateTime] = useState("");
    const [subEnd, setSubEnd]   = useState("");

    useEffect(() => {
        setCurrentDateTime(GetCurrentTime);
    }, []);

    useEffect(() => {
        if (subscription && subscription.ends_at) {
            setSubEnd(GetHumanReadableTime(subscription.ends_at))
        }

    }, [])

    const handleResumeClick = () => {

        if(pmType === 'paypal') {
            setShowPaymentButtons((prev) => ({
                ...prev,
                show: true,
                type: "resumePaypalSub",
                plan: subscription.name,
                pmType: pmType,
            }));
        } else {
            setShowLoader({
                show: true,
                position: 'absolute',
                icon: ""
            })

            const packets = {
                subId: subscription.sub_id,
                plan: subscription.name,
                pmType: pmType,
                ends_at: subscription.ends_at,
            }

            resumeSubscription(packets).then((response) => {
                if (response.success) {
                    setSubscription((prev) => ({
                        ...prev,
                        ends_at: null,
                        status: "active",
                        sub_id: response.sub_id
                    }));
                }

                setShowLoader({
                    show: false,
                    position: "",
                    icon: ""
                })
            })
        }
    }

    return (
        <div  className="flex flex-col items-center justify-start h-full">
            <CardHeader title="Plan Type" />
            <div className="text-center p-5 w-full">
                <p className="text-sm text-gray-600 mb-5">Your Current Plan is</p>
                <div className="text-lg uppercase mx-auto inline-flex h-[8.5rem] w-[8.5rem] items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-semibold shadow-inner">
                    {subscription?.name ??
                        "Free"
                    }
                </div>

                { (subscription && subscription.status !== "active" && (subEnd > currentDateTime) ) &&
                    <div className="canceled_text">
                        <p>Your subscription has been cancelled. It will end on:<br />
                            <span>
                                {new Date(subscription.ends_at).toLocaleDateString()}
                            </span>
                        </p>
                    </div>
                }
            </div>
            <div className="buttons_wrap w-full mt-auto">
                { (subscription && subscription.status === "active") &&

                    userInfo.sub_id !== "bypass" &&
                    <div className="space-y-2 text-sm mb-2">
                        <a
                            className="font-medium hover:underline text-red-600"
                            data-plan={subscription.sub_id}
                            onClick={(e) => {
                                e.preventDefault();
                                setShowSection(["cancel"])
                            }}
                            href="#"
                        >
                            Cancel Subscription
                        </a>
                    </div>
                }
                { (subscription && subscription.status === "active") ?
                    <div className="space-y-2">
                        <StandardButton
                            text="Change My Plan"
                            classes="w-full text-white shadow-md bg-indigo-600 hover:bg-indigo-700
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowSection((prev) => [
                                    ...prev,
                                    "plans"])
                            }}
                        />
                    </div>
                    :
                    subscription && subEnd > currentDateTime ?
                        <div className="space-y-2">
                            <StandardButton
                                text="Resume"
                                classes="w-full text-white shadow-md bg-indigo-600 hover:bg-indigo-700
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                                onClick={handleResumeClick}
                            />
                        </div>
                        :
                        <div className="space-y-2 ">
                            <StandardButton
                                text=" Change My Plan"
                                classes="w-full text-white shadow-md bg-indigo-600 hover:bg-indigo-700
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                                onClick={() => { window.location.href = route('plans.get')}}
                            />
                        </div>
                }
            </div>
        </div>
    );
};

export default PlanComponent;
