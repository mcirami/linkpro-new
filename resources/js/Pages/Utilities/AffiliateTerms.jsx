import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import PrivacyPolicy from "@/Pages/Utilities/Components/PrivacyPolicy.jsx";
import GuestLayout from "@/Layouts/GuestLayout.jsx";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/PageHeader.jsx";

const AffiliateTerms = () => {
    return (

        <AuthenticatedLayout>
            <div className="container">
                <div className="my_row terms form_page">
                    <Head title="Affiliate Terms"/>
                    <div className="pb-6 gap-3 flex justify-between align-bottom items-baseline mt-3 border-b border-gray-100">
                        <PageHeader
                            heading="LinkPro, LLC Affiliate Terms and Conditions"
                        />
                    </div>
                    <div className="card guest shadow-md !mt-10 w-full">
                        <div className="card-body">
                            <h4 className="mb-5">Last Updated: November 2025</h4>
                            <p>
                                These Affiliate Terms and Conditions (“Agreement”) govern your participation in the LinkPro, LLC
                                (“LinkPro”) Affiliate Program. By signing up or participating, you agree to comply with and be bound by
                                this Agreement.</p>
                            <h4 className="mb-5">1. Eligibility</h4>
                            <p>
                                You must be at least 18, have a valid LinkPro account, provide accurate information, and not have prior violations. LinkPro may deny applicants at its discretion.</p>
                            <h4 className="mb-5">2. Enrollment</h4>
                            <p>
                                Once approved, you will receive access to your affiliate dashboard and tracking tools. You must use
                                them lawfully and follow these Terms.
                            </p>
                            <h4 className="mb-5">3. Affiliate Commissions</h4>
                            <p>
                                Commissions are earned when referred users make qualifying course purchases. Commission rates
                                may vary. Fraudulent, refunded, or cancelled transactions are excluded. LinkPro may review or reverse
                                commissions for suspicious activity.
                            </p>
                            <h4 className="mb-5">4. Payout Requirements</h4>
                            <p>
                                Minimum payout threshold: $100. Payouts are issued through Stripe once onboarding is
                                complete. You are responsible for providing correct payout information.
                            </p>
                            <h4 className="mb-5">5. Promotional Rules</h4>
                            <p>You agree NOT to:</p>
                            <ul className="list-disc ml-5">
                                <li>
                                    <p>
                                        Use spam or unsolicited messages
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Use misleading claims
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Create fake accounts or generate fraudulent traffic
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Bid on LinkPro-branded search terms
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Time of the server request
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Use unapproved incentives
                                    </p>
                                </li>
                            </ul>
                            <h4 className="mb-5">6. Disclosure Requirements</h4>
                            <p>
                                Affiliates MUST include FTC-compliant disclosures when promoting LinkPro content or products.
                            </p>
                            <h4 className="mb-5">7. Termination</h4>
                            <p>
                                LinkPro may suspend or terminate your affiliate access at any time for violations, fraud, or inactivity.
                                Unpaid commissions may be forfeited.
                            </p>
                            <h4 className="mb-5">8. Independent Contractor</h4>
                            <p>
                                You are not an employee, partner, or agent of LinkPro.
                            </p>
                            <h4 className="mb-5">9. Limitation of Liability</h4>
                            <p>
                                LinkPro is not liable for indirect damages. Liability is limited to commissions earned within the last 90
                                days.
                            </p>
                            <h4 className="mb-5">10. Amendments</h4>
                            <p>
                                LinkPro may modify these Terms at any time. Continued participation indicates acceptance.
                            </p>
                            <h4 className="mb-5">11. Governing Law</h4>
                            <p>
                                This Agreement is governed by Missouri law.
                            </p>
                            <h4 className="mb-5">12. Acceptance</h4>
                            <p>By clicking “I Agree” or participating in the program, you accept and agree to these Terms.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>

    );
};

export default AffiliateTerms;
