import React, {useEffect, useState, useRef} from 'react';
import { BsFillCreditCard2FrontFill } from "react-icons/bs";

const PaymentComponent = ({userInfo}) => {

    const {pm_type, pm_last_four, email} = userInfo;

    return (
        <>
            <h2 className="text-uppercase">Billing Info</h2>
            <p className="mb-4">Your current payment method is: </p>
            {pm_type === 'card' ?
                <>
                    <h3>Credit</h3>
                    <div className="image_wrap !p-0">
                        <BsFillCreditCard2FrontFill />
                    </div>
                    <p>Last 4 numbers of card on file: </p>
                    <p><span>{pm_last_four || ""}</span></p>
                </>
                :
                <div className="image_wrap">
                    {pm_type && pm_type.includes('apple') &&
                        <img src={Vapor.asset('/images/apple-pay.svg')} alt=""/>
                    }
                    {pm_type && pm_type.includes('google') &&
                        <img src={Vapor.asset('/images/googlepay.png')} alt=""/>
                    }
                    {pm_type && pm_type.includes('cashapp') &&
                        <img src={Vapor.asset('/images/cashapp.png')} alt=""/>
                    }
                    {pm_type && pm_type.includes('link') &&
                        <img src={Vapor.asset('/images/link-by-stripe.png')} alt="" />
                    }
                </div>
            }
            <a target="_blank" href={`https://checkout.link.pro/p/login/test_3cs6pE5zK02p6Nq145?prefilled_email=` + email}
               className="button blue text-uppercase mt-auto"
            >
                Change Payment Method
            </a>
        </>
    );
};

export default PaymentComponent;
