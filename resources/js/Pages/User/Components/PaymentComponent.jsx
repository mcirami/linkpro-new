import React, {useEffect, useState, useRef} from 'react';
import {router, useForm} from '@inertiajs/react';
import axios from 'axios';
import EventBus from '@/Utils/Bus.jsx';
import {toLower} from 'lodash';
//import { Braintree, HostedField } from 'react-braintree-fields';

const PaymentComponent = ({
                              paymentMethod,
                              authToken,
                              setShowSection
}) => {

/*    const [showCardForm, setShowCardForm] = useState(toLower(paymentMethod).includes("credit"));*/
    const [braintreeInstance, setBraintreeInstance] = useState(undefined);
    const dropInRef = useRef(null);
    const loadRef = useRef(true);

    useEffect(() => {
        const firstRender = loadRef.current;

        console.log(dropInRef.current.innerHTML);
        if( firstRender || dropInRef.current.innerHTML === "" ) {
            loadRef.current = false;

            braintree.dropin.create({
                authorization: authToken,
                selector: '#bt-dropin',
            }, function(createErr, instance) {
                if (createErr) {
                    console.log('Create Error', createErr);
                    return;
                }
                setBraintreeInstance(instance);
            });
        }
    },[])

    return (
        <>
            <h2 className="text-uppercase">Billing Info</h2>
            {/*{showCardForm ?*/}
                <div className="drop_in_wrap">
                    <div className="bt-drop-in-wrapper">
                        <div ref={dropInRef} id="bt-dropin"></div>
                    </div>
                </div>
            {/* :
                <div className="other_methods text-center my-auto">
                    <h4>Your current payment type is</h4>
                    {paymentMethod.includes("paypal") ?
                        <a href="https://paypal.com" className="my-4 my-xl-0 px-3 px-md-5 px-lg-4 d-block" target="_blank">
                            <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_200x51.png" alt="PayPal"/>
                        </a>
                        :
                        paymentMethod.includes("android") || paymentMethod.includes("google") ?
                            <a href="https://pay.google.com/" className="my-4 my-xl-0 px-3 px-md-5 px-lg-4 d-block" target="_blank">
                                <img src={ Vapor.asset('images/googlepay.png') } alt="GooglePay"/>
                            </a>
                            :
                            paymentMethod.includes("venmo") ?
                                <a href="https://venmo.com/" className="my-4 my-xl-0 px-3 px-md-5 px-lg-4 d-block" target="_blank">
                                    <img src={ Vapor.asset('images/venmo.png') } alt="Venmo"/>
                                </a>
                                :
                                paymentMethod.includes("apple") ?
                                    <a href="https://www.apple.com/apple-pay/" className="my-4 my-xl-0 px-3 px-md-5 px-lg-4 d-block" target="_blank">
                                        <img src={ Vapor.asset('images/apple-pay.svg') } alt="ApplePay"/>
                                    </a>
                                    :
                                    ""
                    }
                </div>*/
            }
            <a href="#"
               className="button blue text-uppercase mt-auto"
               onClick={(e) => setShowSection((prev) => [
                   ...prev,
                   "methods"
               ])}
            >
                Change Payment Method
            </a>
        </>
    );
};

export default PaymentComponent;
