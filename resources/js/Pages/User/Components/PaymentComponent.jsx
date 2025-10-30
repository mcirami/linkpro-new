import React from 'react';
import { BsFillCreditCard2FrontFill } from "react-icons/bs";
import {router} from '@inertiajs/react';
import { CardHeader } from "@mui/material";

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
                    {pm_type === 'card' ?
                        <div className="p-5">
                            <div className="mb-3 mx-auto inline-flex text-4xl h-[5rem] w-[5rem] items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-semibold shadow-inner">
                                <BsFillCreditCard2FrontFill  />
                            </div>
                            <p className="text-sm text-gray-600">
                                Last 4 numbers of card on file:
                                <span className="font-semibold">
                                    {pm_last_four ?? '-'}
                                </span>
                            </p>
                        </div>
                        :
                        <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-600/90 text-white grid place-items-center shadow-md">
                            {pm_type && pm_type.includes('apple') &&
                                <img src={Vapor.asset('images/apple-pay.svg')} alt=""/>
                            }
                            {pm_type && pm_type.includes('google') &&
                                <img src={Vapor.asset('images/googlepay.png')} alt=""/>
                            }
                            {pm_type && pm_type.includes('cashapp') &&
                                <img src={Vapor.asset('images/cashapp.png')} alt=""/>
                            }
                            {pm_type && pm_type.includes('link') &&
                                <img src={Vapor.asset('images/link-by-stripe.png')} alt="" />
                            }
                            {pm_type && pm_type.includes('paypal') &&
                                <img src={Vapor.asset('images/paypal.png')} alt=""/>
                            }
                        </div>
                    }

                </div>
                <div className="text-center w-full mt-auto">
                    {status !== 'canceled' &&
                        <a target="_blank"
                           href="#"
                           className="button blue text-uppercase mt-auto"
                           onClick={handleButtonClick}
                        >
                            Change Payment Method
                        </a>
                    }
                </div>
        </div>
    );
};

export default PaymentComponent;
