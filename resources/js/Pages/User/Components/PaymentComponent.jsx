import React, {useEffect, useState, useRef} from 'react';
import { BsFillCreditCard2FrontFill } from "react-icons/bs";

const PaymentComponent = ({
                              authToken,
                              setShowSection,
                              userInfo
}) => {

    const dropInRef = useRef(null);
    const loadRef = useRef(true);

    /*useEffect(() => {
        const firstRender = loadRef.current;

        if( firstRender || dropInRef.current.innerHTML === "" ) {
            loadRef.current = false;

            braintree.dropin.create({
                authorization: authToken,
                selector: '#bt-dropin',
            }, function(createErr, instance) {
                if (createErr) {
                    console.log('Create Error', createErr);
                }
            });
        }
    },[])*/

    return (
        <>
            <h2 className="text-uppercase">Billing Info</h2>
            {/*<div className="drop_in_wrap">
                <div className="bt-drop-in-wrapper">
                    <div ref={dropInRef} id="bt-dropin"></div>
                </div>
            </div>*/}
            <p className="mb-4">Your current payment method is: </p>
            {userInfo.pm_type === 'card' ?
                <>
                    <h3>Credit</h3>
                    <div className="image_wrap !p-0">
                        <BsFillCreditCard2FrontFill />
                    </div>
                    <p>Last 4 numbers of card on file: </p>
                    <p><span>{userInfo.pm_last_four}</span></p>
                </>
                :
                <div className="image_wrap">
                    {userInfo.pm_type.includes('apple') &&
                        <img src={Vapor.asset('/images/apple-pay.svg')} alt=""/>
                    }
                    {userInfo.pm_type.includes('google') &&
                        <img src={Vapor.asset('/images/googlepay.png')} alt=""/>
                    }
                    {userInfo.pm_type.includes('cashapp') &&
                        <img src={Vapor.asset('/images/cashapp.png')} alt=""/>
                    }
                    {userInfo.pm_type.includes('link') &&
                        <img src={Vapor.asset('/images/link-by-stripe.png')} alt="" />
                    }
                </div>
            }
            <a target="_blank" href={`https://billing.stripe.com/p/login/test_5kA01g0fq5mJ6Nq4gg?prefilled_email=` + userInfo.email}
               className="button blue text-uppercase mt-auto"
               /*onClick={(e) => setShowSection((prev) => [
                   ...prev,
                   "methods"
               ])}*/
            >
                Change Payment Method
            </a>
        </>
    );
};

export default PaymentComponent;
