import React, {useEffect, useRef, useState} from 'react';
import {isEmpty} from 'lodash';
import InputAnimations from '@/Utils/InputAnimations.jsx';
import LoginModal from '@/Pages/Checkout/Components/LoginModal.jsx';
import {router, useForm} from '@inertiajs/react';
import {registerUser, purchaseCourse} from '@/Services/UserService.jsx';
import EventBus from '@/Utils/Bus.jsx';
import SetFlash from '@/Utils/SetFlash.jsx';
import {Loader} from '@/Utils/Loader.jsx';

const CheckoutLayout = ({
                            auth,
                            token,
                            offer,
                            course,
                            creator,
                            affRef,
                            clickId
}) => {

    const [showLoader, setShowLoader] = useState({
        show: false,
        icon: "",
        position: ""
    });

    const [ registerData, setRegisterData ] = useState({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showLogin, setShowLogin] = useState(false);
    const [braintreeInstance, setBraintreeInstance] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [showRegisterForm, setShowRegisterForm] = useState(true);

    const loadRef = useRef(true);

    useEffect(() => {

        const firstRender = loadRef.current;

        if (firstRender) {
            braintree.dropin.create({
                authorization: token,
                selector: '#bt-dropin',
                paypal: {
                    flow: 'vault'
                },
                googlePay: {
                    googlePayVersion: 2,
                    merchantId: '0764-6991-5982',
                    transactionInfo: {
                        totalPriceStatus: 'FINAL',
                        totalPrice: offer.price,
                        currencyCode: 'USD'
                    },
                },
                venmo: {
                    allowDesktop: true,
                    paymentMethodUsage: 'multi_use',
                },
                applePay: {
                    displayName: 'LinkPro',
                    paymentRequest: {
                        total: {
                            label: 'LinkPro',
                            amount: offer.price
                        },
                        // We recommend collecting billing address information, at minimum
                        // billing postal code, and passing that billing postal code with all
                        // Apple Pay transactions as a best practice.
                        requiredBillingContactFields: ["postalAddress"]
                    }
                }
            }, function(createErr, instance) {

                if (createErr) {
                    console.log('Create Error', createErr);
                    return;
                }

                setBraintreeInstance(instance);

            });
        } else {
            console.log('Not a first Render');
        }

    },[])

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowLoader({
            show: true,
            position: 'absolute',
            icon: ""
        })
        setFormErrors({});
        if (!auth.user.userInfo) {

            const packets = {
                username: registerData.username,
                email: registerData.email,
                password: registerData.password,
                password_confirmation: registerData.password_confirmation,
                course_creator: creator,
                course_id: course.id
            }

            registerUser(packets).then((response) => {

                console.log("response: ", response)
                if (response.success) {

                    readyForPurchase(response.user);

                } else {

                    if (response.errors.username) {
                        setFormErrors((prev) => ({
                            ...prev,
                            username: response.errors.username[0]
                        }));
                    }

                    if (response.errors.email) {
                        setFormErrors((prev) => ({
                            ...prev,
                            email: response.errors.email[0]
                        }));
                    }

                    if (response.errors.password) {
                        setFormErrors((prev) => ({
                            ...prev,
                            password: response.errors.password[0]
                        }));
                    }

                    setShowLoader({
                        show: false,
                        position: "",
                        icon: ""
                    })
                }
            });
        } else {
            readyForPurchase();
        }
    }

    const readyForPurchase = (user = null) => {

        braintreeInstance.requestPaymentMethod(
            function(err, payload) {
                if (err) {
                    console.log('Request Payment Method Error', err);
                    EventBus.dispatch("error", { message: "Request Payment Method Error" });
                    setShowRegisterForm(false);
                    setShowLoader({
                        show: false,
                        position: "",
                        icon: ""
                    })
                    return;
                }
                // Add the nonce to the form and submit
                //document.querySelector('#nonce').value = payload.nonce;

                const packets = {
                    payment_method_nonce: payload.nonce,
                    offer: offer.id,
                    user: user,
                    clickId: clickId,
                    affRef: affRef
                }

                purchaseCourse(packets).then((response) => {

                    if (response.success) {
                        router.get(response.url, {message: JSON.stringify(response.message)})
                    } else {
                        EventBus.dispatch("error", { message: JSON.stringify(response.message) });
                    }

                    setShowLoader({
                        show: false,
                        position: "",
                        icon: ""
                    })

                })
            });
    }

    return (

        <div className="container">
            <InputAnimations />
            <SetFlash />
            <div className="my_row form_page checkout course_purchase text-center">
                <h2 className="page_title text-center !mb-10">Checkout Now</h2>
                <div className={`card w-full inline-block my-auto ${isEmpty(auth.user.userInfo) && "guest" }`}>
                    <div className="card-body text-left w-full inline-block">
                        <div className="course_banner" style={{ background: course.header_color}}>
                            <div className="image_wrap w-50 mx-auto">
                                <img src={course.logo} alt="" />
                            </div>
                        </div>
                        <form method="post"
                              action=""
                              className="my_row !min-w-full"
                              id="payment-form"
                        >
                            <div className="text_wrap text-center">
                                <h3>You are purchasing {course.title} course for ${offer.price}</h3>
                            </div>
                            <div className={`column_wrap ${isEmpty(auth.user.userInfo) ? "columns-1 md:columns-2" : "columns-1" } `}>
                                {isEmpty(auth.user.userInfo) &&
                                    showRegisterForm &&
                                    <section id="account_register" className="w-full inline-block">
                                        <h4>Register for an account</h4>
                                        <div className="relative mb-5">
                                            <input
                                                id="username"
                                                type="text"
                                                className={`animate w-full ${formErrors.username && "error"} ${registerData.username && " active"}`}
                                                name="username"
                                                value={registerData.username}
                                                required
                                                autoComplete="username"
                                                onChange={(e) => setRegisterData(
                                                    (prev) => ({
                                                        ...prev,
                                                        username: e.target.value
                                                    }))}
                                            />
                                            <label htmlFor="username">Username</label>
                                            {formErrors.username &&
                                                <span id="username_error" className="invalid-feedback" role="alert">
                                                    {formErrors.username}
                                                </span>
                                            }
                                        </div>
                                        <div className="relative mb-5">
                                            <input
                                                id="email"
                                                type="email"
                                                className={`animate w-full ${formErrors.email && "error"} ${registerData.username && " active"}`}
                                                name="email"
                                                value={registerData.email}
                                                required
                                                autoComplete="email"
                                                onChange={(e) => setRegisterData(
                                                    (prev) => ({
                                                        ...prev,
                                                        email: e.target.value
                                                    }))}
                                            />
                                            <label htmlFor="email">E-mail Address</label>
                                            {formErrors.email &&
                                                <span id="email_error" className="invalid-feedback" role="alert">
                                                    {formErrors.email}
                                                </span>
                                            }
                                        </div>
                                        <div className="relative mb-5">
                                            <input
                                                id="password"
                                                type="password"
                                                value={registerData.password}
                                                className={`animate w-full ${formErrors.password && "error"} ${registerData.username && " active"}`}
                                                name="password"
                                                required
                                                autoComplete="new-password"
                                                onChange={(e) => setRegisterData(
                                                    (prev) => ({
                                                        ...prev,
                                                        password: e.target.value
                                                    }))}
                                            />
                                            <label htmlFor="password">Password</label>
                                            {formErrors.password &&
                                                <span id="password_error" className="invalid-feedback" role="alert">
                                                    {formErrors.password}
                                                </span>
                                            }
                                        </div>
                                        <div className="mb-5 relative">
                                            <input
                                                id="password-confirm"
                                                value={registerData.password_confirmation}
                                                type="password"
                                                className="animate w-full"
                                                name="password_confirmation"
                                                required
                                                autoComplete="new-password"
                                                onChange={(e) => setRegisterData(
                                                    (prev) => ({
                                                        ...prev,
                                                        password_confirmation: e.target.value
                                                    }))}
                                            />
                                            <label htmlFor="password-confirm">Confirm Password</label>
                                        </div>
                                        <p>Already have an account?<br/>
                                            <a style={{cursor: 'pointer'}}
                                               href="#"
                                               onClick={e => {
                                                   e.preventDefault()
                                                   setShowLogin(true);
                                               }}
                                            >
                                                Click Here To Login</a>
                                        </p>
                                    </section>
                                }
                                <section className="w-full">
                                    <div className="drop_in_wrap">
                                        <div className="bt-drop-in-wrapper">
                                            <div id="bt-dropin"></div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div className="button_wrap my_row">
                                <a
                                    className="button blue"
                                    href="#"
                                    onClick={(e) => handleSubmit(e)}
                                >
                                    Submit
                                </a>
                            </div>
                        </form>
                        {showLoader.show &&
                            <Loader
                                showLoader={showLoader}
                            />
                        }
                    </div>
                </div>
            </div>

            {showLogin &&
                <LoginModal
                    setShowLogin={setShowLogin}
                />
            }
        </div>
    );
};

export default CheckoutLayout;
