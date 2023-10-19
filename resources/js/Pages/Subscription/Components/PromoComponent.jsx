import React, {useRef, useState} from 'react';
import {isEmpty, toLower} from 'lodash';
import {checkPromoCode} from '@/Services/SubscriptionRequests.jsx';
import {Loader} from '@/Utils/Loader.jsx';

const PromoComponent = ({
                            plan,
                            setShowLoader,
                            promoCode,
                            setPromoCode
}) => {

    const promoRef = useRef(null);

    const [message, setMessage] = useState({
        text: null,
        subText: null,
        success: false,
    });


    const handlePromoSubmit = (e) => {
        e.preventDefault();
        setMessage({});

        setShowLoader({
            show: true,
            icon: "",
            position: 'absolute'
        })

        const packets = {
            planId: plan,
            code: promoCode
        }

        checkPromoCode(packets)
        .then(response => {
            if(response.success) {

                setMessage((prev) => ({
                    ...prev,
                    success : true
                }))
                if(response.message.includes('Lifetime')) {
                    setMessage((prev) => ({
                        ...prev,
                        subText : "Click 'Submit' below to activate your membership:"
                    }))
                } else {
                    setMessage((prev) => ({
                        ...prev,
                        subText : "Choose a way to pay for future billing. If you cancel before the next billing cycle you will never be charged."
                    }));
                }
            } else {
                setMessage((prev) => ({
                    ...prev,
                    success : false
                }));
            }

            setMessage((prev) => ({
                ...prev,
                text : response.message
            }));

            setShowLoader({
                show: false,
                icon: "",
                position: ""
            })
        })
    }

    return (
        <div className="my_row">
            <a className="discount_link"
               href="#"
               onClick={(e) => promoRef.current.classList.add('open')}
            >
                Have a Promo Code? Click Here!
            </a>
            <div className="discount_wrap my_row" ref={promoRef}>
                <form id="submit_discount_code" action="" method="">
                    <input type="text"
                           name="discountCode"
                           id="discount_code"
                           onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <a href="#"
                       className="button blue"
                       onClick={(e) => handlePromoSubmit(e)}
                    >
                        Apply
                    </a>
                </form>
                {!isEmpty(message) &&
                    <div id={`promo_response`} className="my_row" role="alert">
                        <p className={` ${message.success ? "success" : "error"}`}>{message.text}</p>
                        {message.subText &&
                            <p><span>NEXT: </span> {message.subText}</p>
                        }
                    </div>
                }
            </div>
        </div>
    );
};

export default PromoComponent;
