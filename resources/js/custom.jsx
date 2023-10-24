'use strict'
import axios from 'axios';

window.addEventListener("load", function(){

    /*const flashMessage = document.getElementById('laravel_flash');

    if (flashMessage) {

        setTimeout(function() {
            let fadeEffect = setInterval(function() {
                if (!flashMessage.style.opacity) {
                    flashMessage.style.opacity = 1;
                }
                if (flashMessage.style.opacity > 0) {
                    flashMessage.style.opacity -= .1;
                } else {
                    clearInterval(fadeEffect);
                }
            },200)
        }, 3000)
    }

    const confirmPopup = document.getElementById('confirm_popup');

    if (confirmPopup) {
        const openPopupButton = document.querySelectorAll('.open_popup');
        openPopupButton.forEach((button) => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const planName = e.target.dataset.plan;
                const type = e.target.dataset.type;
                const level = e.target.dataset.level;
                confirmPopup.classList.add('open');

                document.querySelector('#confirm_popup .plan').value = planName;
                document.querySelector('#confirm_popup .level').value = level;

                switch (type) {
                    case 'cancel':
                        document.querySelector('#popup_form').action = '/subscribe/cancel';
                        document.querySelector('#confirm_popup #text_type').textContent = 'cancel';
                        break;
                    case 'upgrade':
                        document.querySelector('#popup_form').action = '/change-plan';
                        document.querySelector('#confirm_popup #text_type').textContent = 'upgrade';
                        break;
                    default:
                        console.log('Default');
                }

            });
        })

        document.querySelector('#confirm_popup .close_popup').addEventListener('click', function(e) {
            e.preventDefault();
            confirmPopup.classList.remove('open');
        })
    }

    const chooseLevelPopup = document.getElementById('popup_choose_level');

    if (chooseLevelPopup) {
        if (document.querySelector('.open_popup_choose')) {
            document.querySelector('.open_popup_choose').
                addEventListener('click', function(e) {
                    e.preventDefault();
                    chooseLevelPopup.classList.add('open');
                });
        }

        document.querySelector('#popup_choose_level .close_popup').addEventListener('click', function(e) {
            e.preventDefault();

            const changePlanDetails = document.querySelector('#confirm_change_plan_details');
            const confirmCancelDetails = document.querySelector('#confirm_cancel_details');

            if(changePlanDetails.classList.contains("open")) {
                changePlanDetails.classList.remove('open');
            }

            if(confirmCancelDetails.classList.contains('open')) {
                confirmCancelDetails.classList.remove('open');
            }

            chooseLevelPopup.classList.remove('open');
            document.querySelector('#popup_choose_level .box').classList.remove('size_adjust');
        });
    }

    const paymentMethodPopup = document.getElementById('popup_payment_method');

    if (paymentMethodPopup) {
        document.querySelector('.open_payment_method').addEventListener('click', function(e){
            e.preventDefault();
            paymentMethodPopup.classList.add('open');
        });

        document.querySelector('#popup_payment_method .close_popup').addEventListener('click', function(e) {
            e.preventDefault();
            paymentMethodPopup.classList.remove('open');
        })
    }

    const confirmCancelPopup = document.getElementById('confirm_cancel_popup');

    if (confirmCancelPopup) {
        document.querySelector('.cancel_popup').addEventListener('click', function(e) {
            e.preventDefault();
            confirmCancelPopup.classList.add('open');
        });

        document.querySelector('#confirm_cancel_popup .close_popup').addEventListener('click', function(e) {
            e.preventDefault();
            confirmCancelPopup.classList.remove('open');
        });
    }*/

    /*const discountLink = document.querySelector('.discount_link');

    if (discountLink) {
        discountLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.discount_wrap').classList.add('open');
        });
    }*/

    /*const promoCodeForm = document.querySelector('#submit_discount_code');
    if (promoCodeForm) {
        promoCodeForm.addEventListener('submit', function(event) {
            event.preventDefault();
            document.querySelector('#promo_success_message').classList.remove('active');
            document.querySelector('#promo_error_message').classList.remove('active');
            document.querySelector('#payment-form').classList.remove('adjust');
            const code = document.querySelector('#discount_code').value;
            const codePlan = document.querySelector('#code_plan').value;
            const packets = {
                planId: codePlan,
                code: code
            }

            axios.post("/subscribe/check-code", packets)
            .then(
                (response) => {
                    const message = response.data.message;
                    const success = response.data.success;

                    if (success) {
                        let successDiv = document.querySelector('#promo_success_message');
                        if (message.includes("Lifetime")) {
                            document.querySelector('#payment-form .bt-drop-in-wrapper').remove();
                            document.querySelector('#payment-form #nonce').remove();
                            successDiv.innerHTML = "<p class='success'>" + message  + "</p>" +
                            "<p><span>NEXT:</span> Click 'Submit' below to activate your membership:</p>";
                        } else {
                            document.querySelector('#payment-form').classList.add('adjust');
                            successDiv.innerHTML =
                                "<p class='success'>" + message  + "</p>" +
                                "<p><span>NEXT:</span> Choose a way to pay for future billing. If you cancel before the next billing cycle you will never be charged.</p>"
                        }

                        successDiv.classList.add('active');

                        document.querySelector('#form_discount_code').value = code;
                    } else {
                        const errorDiv = document.querySelector('#promo_error_message');
                        errorDiv.innerHTML = "<p class='error'>" + message + "</p>";
                        errorDiv.classList.add('active');
                    }

                }
            )
            .catch((error) => {
                if (error.response !== undefined) {
                    console.error("ERROR:: ", error.response.data);
                } else {
                    console.error("ERROR:: ", error);
                }

                return {
                    success : false,
                }

            });

        })
    }*/

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

    /*let row = null;
    function insertContent(content, element, cb) {

        const currentRow = element.dataset.row * 4;
        if (row && currentRow === row) {
            content.classList.add('open');
            element.classList.add('open');
        } else {
            setTimeout(() => {
                content.classList.add('open');
                element.classList.add('open');
            }, 100)

        }

        row = currentRow;

        let iconsWrap = document.querySelectorAll(
            '.icons_wrap.main > .icon_col:nth-child(' + currentRow + ')');
        if (iconsWrap.length < 1) {
            iconsWrap = document.querySelectorAll(
                '.icons_wrap.main > .icon_col:last-child');
        }
        iconsWrap[0].after(content);
        cb();
    }*/

    /*const folders = document.querySelectorAll('.live_page .icon_col.folder');
    if (folders.length > 0) {
        let content = null;
        folders.forEach((element) => {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                if (content) {
                    if (element.classList.contains('open')) {
                        element.classList.remove('open');

                        setTimeout(() => {
                            content.classList.remove('open');
                        }, 50)

                        setTimeout(() => {
                            element.lastElementChild.after(content);
                            content = null;
                        }, 500)

                        row = null;

                    } else {
                        const folder = document.querySelector('.my_row.folder.open');
                        folder.classList.remove('open');
                        const folderParent = document.querySelector(folder.dataset.parent);
                        folderParent.classList.remove('open');
                        folderParent.lastElementChild.after(folder);

                        content = element.lastElementChild;

                        insertContent(content, element, function() {

                            content.scrollIntoView({
                                behavior: 'smooth',
                                block: "center",
                                inline: "center"
                            });
                        });

                        const folderID = element.dataset.id
                        trackFolderClick(folderID);
                    }

                } else {
                    document.querySelectorAll('.my_row.folder').
                        forEach((element) => {
                            element.classList.remove('open');
                        })
                    content = element.lastElementChild;

                    insertContent(content, element, function() {

                        content.scrollIntoView({
                            behavior: 'smooth',
                            block: "center",
                            inline: "center"
                        });
                    });

                    const folderID = element.dataset.id;
                    const folderType = element.dataset.type;
                    if (folderType === "folder") {
                        trackFolderClick(folderID);
                    }
                }
            })
        });
    }
*/
    /*const linkTrackers = document.querySelectorAll('.link_tracker');

    if (linkTrackers) {

        linkTrackers.forEach((link) => {
            link.addEventListener('click', function(e) {

                const linkID = this.dataset.id;

                axios.post('/link-click/' + linkID).then(
                    (response) => {
                        console.log("click tracked");
                    },

                ).catch(error => {
                    if (error.response) {
                        console.error(error.response);
                    } else {
                        console.error("ERROR:: ", error);
                    }
                });
            })
        })
    }*/

   /* function trackFolderClick(folderID) {
        axios.post('/folder-click/' + folderID,).then(
            (response) => {
                //console.log(JSON.stringify(response.data.message));
            },
        ).catch(error => {
            if (error.response) {
                console.error(error.response);
            } else {
                console.error("ERROR:: ", error);
            }
        });
    }*/

    const mcSubscribeForm = document.querySelector('#mc_subscribe_form');
    if (mcSubscribeForm) {
        mcSubscribeForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.querySelector('#email').value;
            const listId = document.querySelector('#list_id').value;
            const user = document.querySelector('#user_id').value;

            const packets = {
                email: email,
                listId: listId,
                user: user
            }

            axios.post("/mailchimp/subscribe", packets)
            .then(
                (response) => {
                    const mcResponse = response.data.mcResponse;

                    document.querySelector('.my_row.folder .form_content').innerHTML =
                        "<h3>Success!</h3>" +
                        "<p>Check your email to confirm and/or a welcome message.</p>";
                }
            )
            .catch((error) => {
                const errorDiv = document.querySelector('#subscribe_error');

                if (error.response !== undefined) {
                    const mcResponse = error.response.data.message.split("response:");
                    errorDiv.innerHTML = "<p>" + mcResponse[1] + "</p>";
                    console.error("ERROR:: ", error.response.data.message);
                } else {
                    console.error("ERROR:: ", error);
                }

                return {
                    success : false,
                }

            });

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
