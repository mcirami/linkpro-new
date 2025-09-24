import React, { useState } from "react";
import {acceptTerms} from '@/Services/UserService.jsx';

const AffiliateSignup = ({
    affStatus
}) => {

    const [ showTerms, setShowTerms ] = useState(false);
    const [affiliateStatus, setAffiliateStatus] = useState(affStatus);
    const handleSubmitTerms = (e) => {
        e.preventDefault()

        acceptTerms().then((data) => {

            if (data.success && setAffiliateStatus) {
                setAffiliateStatus("approved");
                setShowTerms(false);
            }
        });

    }

    return (

        (affiliateStatus !== "approved" || !affiliateStatus) ?
            showTerms ?
                <div className="aff_terms">
                    <h3>Terms and Conditions</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, aspernatur dignissimos doloribus itaque quaerat rem repellendus vel voluptates. Aliquam doloribus eligendi iste, labore molestias nisi omnis saepe voluptatibus. Consequuntur, esse.</p>
                    <form action="" onSubmit={handleSubmitTerms}>
                        {/*<div className="checkbox_wrap">
                            <input
                                name="terms"
                                type="checkbox"
                                onChange={() => setTermsChecked(!termsChecked)}
                            />
                            <label htmlFor="terms">I Agree</label>
                        </div>*/}
                        <div className="buttons_wrap">
                            <button type="submit" className="button green">Accept</button>
                            <a className="button transparent gray" href="#"
                               onClick={(e) => {
                                   e.preventDefault();
                                   setShowTerms(false);
                               }}
                            >Cancel</a>
                        </div>
                    </form>
                </div>
                :
                <div className="info_message">
                    <p>Sign up now to become an affiliate and earn money selling courses!</p>
                    <a className="button blue"
                       href="#"
                       onClick={(e) => {
                           e.preventDefault();
                           setShowTerms(true);
                       }}>Click Here To Get Approved</a>
                </div>
            :
            ""


    );
};

export default AffiliateSignup;
