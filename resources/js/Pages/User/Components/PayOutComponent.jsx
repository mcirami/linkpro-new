import React from 'react';
import {redirectToOnboarding} from '@/Services/UserService.jsx';
import { CardHeader } from "@mui/material";
import { CiBank } from "react-icons/ci";
import { BsCreditCard2Front } from "react-icons/bs";
import StandardButton from "@/Components/StandardButton.jsx";
const PayOutComponent = ({
                             setShowLoader,
                             total,
                             setShowMessageAlertPopup,
                             payoutInfo,
                             updateMethodLink
}) => {

    const handleClick = () => {

        if (total > 100) {
            setShowLoader({
                show: true,
                position: 'fixed',
                icon: "",
                message: "Redirecting to onboarding..."
            })
            redirectToOnboarding().then(response => {
                if (response.success) {
                    window.location.href = response.url
                }

                setShowLoader({
                    show: false,
                    position: "",
                    icon: ""
                })
            })
        } else {
            setShowMessageAlertPopup({
                show: true,
                text: "You must earn at least $100 before setting up your payment information.",
                buttonText: "OK",
            })
        }
    }

    console.log("updateMethodLink", updateMethodLink);
    return (
        <div className="flex flex-col items-center justify-start h-full">
            <CardHeader title="Payout Information" />
            {payoutInfo ?
                <div className="text-center w-full">
                    <p className="text-sm text-gray-600">Your current payout method is:</p>
                    {payoutInfo.pm_type === "bank" &&
                        <div className="p-5">
                            <div className="mb-3 mx-auto flex flex-col text-4xl h-[8.5rem] w-[8.5rem] items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-semibold shadow-inner">
                                <CiBank />
                                <small className="text-sm">{payoutInfo.pm_brand}</small>
                            </div>
                            <p className="text-sm text-gray-600">
                                Last 4 numbers<br/> of the account on file: <br/>
                                <span className="font-semibold">
                                    {payoutInfo.pm_last_four ?? '-'}
                                </span>
                            </p>
                        </div>
                    }
                    {payoutInfo.pm_type === "card" &&
                        <div className="p-5">
                            <div className="mb-3 mx-auto flex flex-col text-4xl h-[8.5rem] w-[8.5rem] items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-semibold shadow-inner">
                                <BsCreditCard2Front  />
                                <small className="text-sm">{payoutInfo.pm_brand}</small>
                            </div>
                            <p className="text-sm text-gray-600">
                                Last 4 numbers<br/> of the card on file: <br/>
                                <span className="font-semibold">
                                    {payoutInfo.pm_last_four ?? '-'}
                                </span>
                            </p>
                        </div>
                    }
                    {updateMethodLink &&
                        <div className="w-full mt-auto">
                            <StandardButton
                                text="Update Payout Method"
                                classes="w-full text-white"
                                onClick={() => window.open(updateMethodLink.url, "_blank")}
                            />
                        </div>
                    }
                </div>
                :
                <>
                <div className="px-5 py-5 flex flex-col gap-4 md:items-center md:justify-between">
                    <p className="text-sm text-gray-600 md:max-w-3xl text-left">
                        In order to be paid out as an affiliate or course creator, submit your payout details.
                        Once you earn $100 or more we will send your payment.
                    </p>
                    <p className="text-sm text-gray-600 md:max-w-3xl text-left">
                        If you <span className="font-bold italic">have</span> earned $100 or more, click the button below and you will be redirected to the Stripe onboarding page.
                        Submit your payment information and we will set you up to be paid ASAP!
                    </p>
                </div>
                <div className="w-full mt-auto">
                    <StandardButton
                        text="Submit Payout Details"
                        classes="w-full text-white"
                        onClick={handleClick}
                    />
                </div>
                </>
            }
        </div>
    );
};

export default PayOutComponent;
