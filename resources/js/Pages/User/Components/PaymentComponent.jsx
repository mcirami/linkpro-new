import React, {useEffect, useState, useRef} from 'react';
import {router, useForm} from '@inertiajs/react';
import axios from 'axios';
import EventBus from '@/Utils/Bus.jsx';
import {toLower} from 'lodash';
//import { Braintree, HostedField } from 'react-braintree-fields';

const PaymentComponent = ({
                              paymentMethod,
                              userInfo,
                              setUserInfo,
                              authToken,
                              setShowSection
}) => {

/*    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        nonce: '',
        postal_code: ''
    });*/

    const [braintreeInstance, setBraintreeInstance] = useState(undefined);

    /*const [tokenize, setTokenizeFunc] = useState();
    const [cardType, setCardType] = useState('');
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const [focusedFieldName, setFocusedField] = useState('');
    const numberField = useRef();
    const cvvField = useRef();
    const postalCode = useRef();

    const onAuthorizationSuccess = () => {
        numberField.current.focus();
    };
    const onDataCollectorInstanceReady = (collector) => {
        // DO SOMETHING with Braintree collector as needed
        console.log("collector: ", collector)
    };

    const handleError = (newError) => {
        setError(newError.message || String(newError));
    };

    const onFieldBlur = (field, event) => setFocusedField('');
    const onFieldFocus = (field, event) => setFocusedField(event.emittedBy);

    const onCardTypeChange = ({ cards }) => {
        if (1 === cards.length) {
            const [card] = cards;

            setCardType(card.type);

            if (card.code && card.code.name) {
                cvvField.current.setPlaceholder(card.code.name);
            } else {
                cvvField.current.setPlaceholder('CVV');
            }
        } else {
            setCardType('');
            cvvField.current.setPlaceholder('CVV');
        }
    };

    const getToken = () => {
        tokenize()
        .then(setToken)
        .catch(handleError);

        //handleSubmit();
    };

    const renderResult = (title, obj) => {
        if (!obj) { return null; }
        return (
            <div>
                <b>{title}:</b>
                <pre>{JSON.stringify(obj, null, 4)}</pre>
            </div>
        );
    };*/

    useEffect(() => {

        var updateForm = document.querySelector('#update-cc-form');
        if(updateForm) {

            braintree.client.create({
                authorization: authToken
            }, function(clientErr, clientInstance) {
                if (clientErr) {
                    console.error("client" + clientErr);
                    return;
                }
                // This example shows Hosted Fields, but you can also use this
                // client instance to create additional components here, such as
                // PayPal or Data Collector.
                braintree.hostedFields.create({
                    client: clientInstance,
                    styles: {
                        'input': {
                            'font-size': '14px'
                        },
                        'input.invalid': {
                            'color': 'red'
                        },
                        'input.valid': {
                            'color': 'green'
                        }
                    },
                    fields: {
                        number: {
                            selector: '#card_number',
                            placeholder: 'xxxx xxxx xxxx ' +  userInfo.pm_last_four,
                        },
                        cvv: {
                            selector: '#cvv',
                            placeholder: 'xxx'
                        },
                        expirationDate: {
                            selector: '#expiration-date',
                            placeholder: 'MM/YY'
                        },
                        /*postalCode: {
                            selector: '#postal_code',
                            placeholder: 'xxxxx',
                        }*/
                    }
                },function (err, hostedFieldsInstance) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    setBraintreeInstance(hostedFieldsInstance);

                    /*updateForm.addEventListener('submit', function(event) {
                        event.preventDefault();
                        hostedFieldsInstance.tokenize(function(tokenizeErr, payload) {
                            if (tokenizeErr) {
                                console.error(tokenizeErr);
                                return;
                            }
                            // If this was a real integration, this is where you would
                            // send the nonce to your server.
                            // console.log('Got a nonce: ' + payload.nonce);
                            document.querySelector('#nonce').value = payload.nonce;
                            updateForm.submit();
                        });
                    }, false);*/
                    /*document.querySelector('#update-cc-form button').removeAttribute('disabled')
                    hostedFieldsInstance.on('validityChange', function (event) {
                        var field = event.fields[event.emittedBy];

                        if (field.isValid) {
                            if (event.emittedBy === 'expirationMonth' || event.emittedBy === 'expirationYear') {
                                if (!event.fields.expirationMonth.isValid || !event.fields.expirationYear.isValid) {
                                    return;
                                }
                            } else if (event.emittedBy === 'number') {
                                $('#card-number').next('span').text('');
                            }

                            // Remove any previously applied error or warning classes
                            $(field.container).parents('.form-group').removeClass('has-warning');
                            $(field.container).parents('.form-group').removeClass('has-success');
                            // Apply styling for a valid field
                            $(field.container).parents('.form-group').addClass('has-success');
                        } else if (field.isPotentiallyValid) {
                            // Remove styling  from potentially valid fields
                            $(field.container).parents('.form-group').removeClass('has-warning');
                            $(field.container).parents('.form-group').removeClass('has-success');
                            if (event.emittedBy === 'number') {
                                $('#card-number').next('span').text('');
                            }
                        } else {
                            // Add styling to invalid fields
                            $(field.container).parents('.form-group').addClass('has-warning');
                            // Add helper text for an invalid card number
                            if (event.emittedBy === 'number') {
                                $('#card-number').next('span').text('Looks like this card number has an error.');
                            }
                        }
                    });

                    hostedFieldsInstance.on('cardTypeChange', function (event) {
                        // Handle a field's change, such as a change in validity or credit card type
                        if (event.cards.length === 1) {
                            $('#card-type').text(event.cards[0].niceType);
                        } else {
                            $('#card-type').text('Card');
                        }
                    });

                    setBraintreeInstance(hostedFieldsInstance);*/
                });
            });
        }
    },[userInfo])

    /*useEffect(() => {

        if (token) {
            console.log("nonce: ", token.nonce)

        }
    },[token])*/

    const handleSubmit = (e) => {
        e.preventDefault();
        var updateForm = document.querySelector('#update-cc-form');
        braintreeInstance.tokenize(function(tokenizeErr, payload) {
            if (tokenizeErr) {
                console.error(tokenizeErr);
                return;
            }

            const postalCode = document.querySelector('#postal_code').value;
            console.log("payload: ", payload);
            console.log("postalCode: ", postalCode);


            // If this was a real integration, this is where you would
            // send the nonce to your server.
            //updateForm.submit();
            /*router.post('/update-card',
                {
                    nonce: payload.nonce,
                },
                {
                    onSuccess: (data) => {
                        console.log("response", data)
                        setUserInfo({
                            ...userInfo,
                            pm_last_four: payload.details.lastFour
                        })
                    }
                },
            )*/
            const packets = {
                nonce: payload.nonce,
                postalCode: postalCode
            }
            return axios.post('/update-card', packets)
            .then(
                (response) => {
                    const returnMessage = JSON.stringify(response.data.message);
                    EventBus.dispatch("success", { message: returnMessage.replace("_", " ") });

                    console.log(response.data);

                    setUserInfo({
                        ...userInfo,
                        pm_last_four: payload.details.lastFour
                    })
                    /*return {
                        success : true,
                    }*/
                }
            )
            .catch((error) => {
                if (error.response !== undefined) {
                    EventBus.dispatch("error",
                        {message: "There was an error updating your credit card."});
                    console.error("ERROR:: ", error.response.data);
                } else {
                    console.error("ERROR:: ", error);
                }

                /*return {
                    success : false,
                }*/

            });
        });
    }

    return (
        <>
            <h2 className="text-uppercase">Billing Info</h2>
            {toLower(paymentMethod).includes("credit") ?
                <>
                    <form id="update-cc-form" className="mb-0" method="" action="">
                        <h4 className="mb-4">Your current payment type is</h4>
                        {/*<input id="nonce" name="payment_method_nonce" type="hidden" />*/}
                        <div className="form-group form_inputs mt-0 mb-4 relative">
                            <div className="animate active bg-white" id="card_number"></div>
                            <label>Card Number</label>
                        </div>
                        <div className="form_inputs mb-4 columns-2">
                            <div className="w-full relative">
                                <div className="animate active bg-white" id="expiration-date"></div>
                                <label>Expiration Date</label>
                            </div>
                            <div className="w-full relative">
                                <div className="animate active bg-white" id="cvv"></div>
                                <label>CVV (3 digits)</label>
                            </div>
                        </div>
                        <div className="form_inputs relative mb-4">
                            {/*<div id="postal_code" className="hosted-field animate active bg-white"></div>*/}
                            <input className="w-full animate active bg-white" type="text" id="postal_code" placeholder="xxxxx"/>
                            <label>Postal Code</label>
                        </div>
                        {/*{@error('card')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $errors->first('card')  }}</strong>
                            </span>
                         @enderror}*/}
                        <div className="form-group row form_buttons">
                            <div className="col-12">
                                <a href="#"
                                   className="button blue text-uppercase"
                                   onClick={(event) => handleSubmit(event)}
                                >
                                    Update Card
                                </a>
                            </div>
                        </div>
                    </form>

                </>
                :
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
                </div>
            }
            <a href="#"
               className="button blue text-uppercase"
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
