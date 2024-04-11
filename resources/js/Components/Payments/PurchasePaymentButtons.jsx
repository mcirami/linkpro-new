import React, {useEffect, useState} from 'react';
import {getClientId} from '@/Services/PayPalRequests.jsx';
import {
    PayPalButtons,
    PayPalScriptProvider,
    usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {Link, router} from '@inertiajs/react';

const PurchasePaymentButtons = ({showPaymentButtons}) => {

    const [initialOptions, setInitialOptions] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getClientId().then((response) => {
            if(response.success) {

                setInitialOptions({
                    clientId : response.client,
                    intent: "capture",
                    components: "buttons",
                    vault: "false",
                    "disable-funding": "paylater,card",
                    "data-sdk-integration-source":"integrationbuilder_sc",
                })

                setIsLoading(false);
            }
        })

    }, []);

    const ButtonWrapper = ({type}) => {
        const [{ options }, dispatch] = usePayPalScriptReducer();

        useEffect(() => {
            dispatch({
                type: "resetOptions",
                value: {
                    ...options,
                    intent: "capture",
                },
            });
        }, [type]);

        return (<PayPalButtons
            style={{
                shape: "rect",
                layout: "vertical",
                height: 45,
                disableMaxWidth: true,
                label: "paypal"
            }}
            createOrder={(data, actions) => createOrder(data, actions)}
            onApprove={(data, actions) => onApprove(data, actions)}
        />);
    }

    const createOrder = (data, actions) => {

        return actions.order.create({
            "purchase_units": [{
                "amount": {
                    "currency_code": "USD",
                    "value": showPaymentButtons.price
                }
            }],
            "application_context": {
                "shipping_preference": "NO_SHIPPING",
                "user_action": "PAY_NOW",
                "brand_name": "LinkPro",
                "locale": "en-US",
            },
        });
    }

    const onApprove = (data, actions) => {

        actions.order.get(data.orderID)
        .then((response) => {
            router.visit(route('course.purchase.success'), {
                method: 'get',
                data: {
                    price: showPaymentButtons.price,
                    affRef: showPaymentButtons.affRef,
                    cid: showPaymentButtons.clickId,
                    offer: showPaymentButtons.offerId,
                    orderId: data.orderID,
                    pmType: "paypal",
                    status: response.status,
                    customerId: data.payerID,
                    customerName: response.payer.name.given_name
                }
            })
        })

    }

    return (
        !isLoading &&
        <>
            <PayPalScriptProvider options={initialOptions}>
                <ButtonWrapper type="subscription"/>
            </PayPalScriptProvider>

            <div className="button_row mt-3 w-full">
                <Link className='button black_gradient !w-full' href={showPaymentButtons.url}>
                    Checkout With Card
                </Link>
                <p>(Credit Card, GooglePay, ApplePay, CashApp)</p>
            </div>
        </>
    );
};

export default PurchasePaymentButtons;
