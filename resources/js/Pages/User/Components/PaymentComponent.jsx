import React from 'react';
import { BsCreditCard2Front } from "react-icons/bs";
import {router} from '@inertiajs/react';
import { CardHeader } from "@mui/material";
import StandardButton from "@/Components/StandardButton.jsx";

const PaymentComponent = ({
                              userInfo,
                              plan,
                              status,
                              setShowPaymentButtons,
}) => {

    const {pm_type, pm_last_four} = userInfo;

    const handleButtonClick = (e) => {
        e.preventDefault();
        if(pm_type === "paypal") {
            router.get("/subscribe?plan=" + plan + "&type=change_payment_method");
        } else {
            setShowPaymentButtons((prev) => ({
                ...prev,
                show: true,
                type: "change_payment_method",
                plan: plan,
                pmType: pm_type
            }));
        }
    }

    return (

            <div className="flex flex-col items-center justify-start h-full">
                <CardHeader title="Billing Info" />
                <div className="p-5 text-center">
                    <p className="text-sm text-gray-600">Your current payment method is:</p>
                        <div className="p-5">
                            <div className="mb-3 mx-auto inline-flex text-4xl h-[8.5rem] w-[8.5rem] items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-semibold shadow-inner">

                                {pm_type && pm_type.includes('card') &&
                                    <BsCreditCard2Front className={"w-14 h-auto"} />
                                }
                                {pm_type && pm_type.includes('apple') &&
                                    <img className={"w-20 h-auto"} src={Vapor.asset('images/apple-pay.svg')} alt=""/>
                                }
                                {pm_type && pm_type.includes('google') &&
                                    <img className={"w-20 h-auto"} src={Vapor.asset('images/googlepay.png')} alt=""/>
                                }
                                {pm_type && pm_type.includes('cashapp') &&
                                    <img className={"w-20 h-auto"} src={Vapor.asset('images/cashapp.png')} alt=""/>
                                }
                                {pm_type && pm_type.includes('link') &&
                                    <img className={"w-20 h-auto"} src={Vapor.asset('images/link-by-stripe.png')} alt="" />
                                }
                                {pm_type && pm_type.includes('paypal') &&
                                    <img className={"w-20 h-auto"} src={Vapor.asset('images/paypal.png')} alt=""/>
                                }
                            </div>
                            {pm_last_four && pm_type?.includes('card') &&
                                <p className="text-sm text-gray-600">
                                    Last 4 numbers of card on file:
                                    <span className="font-semibold">
                                        {pm_last_four}
                                    </span>
                                </p>
                            }
                        </div>

                </div>
                <div className="text-center w-full mt-auto">
                    {status !== 'canceled' &&
                        <StandardButton
                            text="Change Payment Method"
                            classes="w-full text-white shadow-md bg-indigo-600 hover:bg-indigo-700
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                            onClick={handleButtonClick}
                        />
                    }
                </div>
        </div>
    );
};

export default PaymentComponent;
