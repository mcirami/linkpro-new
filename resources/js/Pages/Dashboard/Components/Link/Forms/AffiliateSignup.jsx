import React, { useState } from "react";
import {acceptTerms} from '@/Services/UserService.jsx';

const AffiliateSignup = ({
                             commit,
                             setAffStatusState
}) => {

    const [ showTerms, setShowTerms ] = useState(false);
    const [agree, setAgree] = useState(false);
    const handleSubmitTerms = (e) => {
        e.preventDefault()

        acceptTerms().then((data) => {

            if (data.success) {
                setAffStatusState("approved")
                commit("offer")
                setShowTerms(false);
            }
        });

    }

    return (

        /*showTerms ?
            <div className="aff_terms">
                <h3>Terms and Conditions</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, aspernatur dignissimos doloribus itaque quaerat rem repellendus vel voluptates. Aliquam doloribus eligendi iste, labore molestias nisi omnis saepe voluptatibus. Consequuntur, esse.</p>
                <form action="" onSubmit={handleSubmitTerms}>
                    {/!*<div className="checkbox_wrap">
                        <input
                            name="terms"
                            type="checkbox"
                            onChange={() => setTermsChecked(!termsChecked)}
                        />
                        <label htmlFor="terms">I Agree</label>
                    </div>*!/}
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
            :*/

            <section className="mt-6 rounded-2xl bg-white shadow-md">
                <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_.8fr] md:items-center">
                    {/* Left: copy */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Share lessons. Get paid.</h3>
                        <p className="mt-1 text-gray-600">
                            Add an <span className="font-medium text-gray-900">Offer</span> link to your page and earn a commission when visitors buy
                            creator courses—like <span className="font-medium">music</span>, <span className="font-medium">fitness</span>, or <span className="font-medium">cooking</span>.
                        </p>

                        <ul className="mt-4 space-y-2 text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="mt-2 inline-block h-2 w-2 rounded-full bg-indigo-500"></span>
                                <span><strong>Choose</strong> a creator’s lesson</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-2 inline-block h-2 w-2 rounded-full bg-indigo-500"></span>
                                <span><strong>Add</strong> the link to your page or site</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-2 inline-block h-2 w-2 rounded-full bg-indigo-500"></span>
                                <span><strong>Earn</strong> a commission on each purchase</span>
                            </li>
                        </ul>

                        <p className="mt-3 text-sm text-gray-500">
                            Commission rates and payouts are set by each creator. Approval required.
                        </p>
                    </div>

                    {/* Right: acceptance + CTA */}
                    <div className="rounded-xl bg-indigo-50/60 p-4">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                checked={agree}
                                onChange={(e) => setAgree(e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">
                              I’ve read and agree to the{" "}
                                <a href="/terms/affiliate" className="font-medium text-indigo-700 hover:underline">Affiliate Terms & Conditions
                              </a>.
                            </span>
                        </label>

                        <button
                            type="button"
                            disabled={!agree}
                            onClick={handleSubmitTerms}
                            className="mt-4 w-full rounded-xl bg-indigo-600 px-5 py-3 text-white font-semibold shadow hover:bg-indigo-700 disabled:opacity-50"
                        >
                            Accept Terms
                        </button>

                        {/* Optional small example line */}
                        <p className="mt-2 text-center text-xs text-gray-500">
                            Example only: if a $40 lesson offered 20% commission, you’d earn $8 per sale.
                        </p>
                    </div>
                </div>
            </section>

    );
};

export default AffiliateSignup;
