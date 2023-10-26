'use strict'
import axios from 'axios';

window.addEventListener("load", function(){

    $(window).on('resize', function() {

        if (window.outerWidth < 769) {
            const videoWrap = document.querySelectorAll('#desktop_video .video_wrap');
            if (videoWrap[0] !== undefined) {
                document.querySelector('#mobile_video').innerHTML = videoWrap[0].outerHTML;
                videoWrap[0].remove();

            }
        } else {
            const videoWrap = document.querySelectorAll('#mobile_video .video_wrap');
            if (videoWrap[0] !== undefined) {
                document.querySelector('#desktop_video').innerHTML = videoWrap[0].outerHTML;
                videoWrap[0].remove();
            }
        }

    });

    if (window.outerWidth < 769) {
        const videoWrap = document.querySelectorAll('#desktop_video .video_wrap');
        if (videoWrap[0] !== undefined) {
            document.querySelector('#mobile_video').innerHTML = videoWrap[0].outerHTML;
            videoWrap[0].remove();
        }
    }

    // prevent click if no url or image on preview icon
    const defaultIcons = document.querySelectorAll('a.default');
    if (defaultIcons.length > 0) {
        defaultIcons.forEach(element => {
            element.addEventListener('click', function(e) {
                e.preventDefault();
            })
        })
    }

    async function registerUser()  {

        const username = document.querySelector('#username').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const passwordConfirm = document.querySelector('#password-confirm').value;
        const creator = document.querySelector('#course_creator').value;
        const courseID = document.querySelector('#course_id').value;

        const packets = {
            username: username,
            email: email,
            password: password,
            password_confirmation: passwordConfirm,
            course_creator: creator,
            course_id: courseID
        }

        //let data = {};

        return await axios.post("/course-register", packets)
        .then(
            (response) => {
                if(response.data.success) {
                    document.querySelector('#user').value = JSON.stringify(response.data.user);

                    return {
                        success: true
                    };

                } else {
                    return {
                        success: false,
                        errors: response.data.errors
                    }
                }
            }
        ).catch((error) => {
            console.log("ERROR: ",error);

            return {
                success: false,
                errors: error
            };

        });

    }
/* STILL MIGHT NEED TO TRANSFER THIS TO REACT
    const braintreeDropin = document.querySelector('#bt-dropin');
    if (braintreeDropin) {
        let spinner = document.querySelector('#loading_spinner');
        var form = document.querySelector('#payment-form');
        var client_token = document.querySelector('#client_nonce').value; //"{{ $token }}";
        const amount = document.querySelector('#offer_price').value;//"{{ $offer->price }}";
        spinner.classList.remove('active');
        braintree.dropin.create({
            authorization: client_token,
            selector: '#bt-dropin',
            paypal: {
                flow: 'vault'
            },
            googlePay: {
                googlePayVersion: 2,
                merchantId: '0764-6991-5982',
                transactionInfo: {
                    totalPriceStatus: 'FINAL',
                    totalPrice: amount,
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
                        amount: amount
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

            form.addEventListener('submit', function(event) {
                event.preventDefault();

                const userGuest = document.querySelector('#user_guest').value.trim();

                if (userGuest === "true") {

                    registerUser().then((response) => {

                        if (response.success) {

                            purchaseCourse(form, instance, spinner);

                        } else {

                            if (response.errors.username) {
                                const usernameError = document.querySelector('#username_error');
                                usernameError.classList.add('active');
                                usernameError.innerHTML = response.errors.username[0]
                            }

                            if (response.errors.email) {
                                const emailError = document.querySelector(
                                    '#email_error');
                                emailError.classList.add('active');
                                emailError.innerHTML = response.errors.email[0];
                            }

                            if (response.errors.password) {
                                const passwordError = document.querySelector(
                                    '#password_error');
                                passwordError.classList.add('active');
                                passwordError.innerHTML = response.errors.password[0];
                            }
                        }
                    });
                } else {
                    purchaseCourse(form, instance, spinner);
                }

            });
        });

        function purchaseCourse(form, instance, spinner) {
            spinner.classList.add('active');
            const code = document.querySelector('#form_discount_code').value;

            if (code.toLowerCase() === "freepremier" ||
                code.toLowerCase() === "freepro") {
                form.submit();
            } else {
                instance.requestPaymentMethod(
                    function(err, payload) {
                        if (err) {
                            console.log('Request Payment Method Error', err);
                            document.querySelector('#account_register').remove();
                            return;
                        }
                        // Add the nonce to the form and submit
                        document.querySelector('#nonce').value = payload.nonce;
                        form.submit();
                    });
            }
        }
    }*/

    const loginForm = document.querySelector('#custom_login_form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            $.ajax({
                url: $(this).attr('action'),
                data: $(this).serialize(),
                type: "POST",
                dataType: 'json',
                success: function(data) {

                    if(data.success) {
                        window.location.reload();
                    } else {
                        const invalidDiv = document.querySelector('#custom_login_form .invalid-feedback');
                        invalidDiv.innerHTML = data.error;
                        invalidDiv.classList.add('d-block');
                    }

                }
            })
        });
    }
});
