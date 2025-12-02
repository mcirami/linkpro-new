import React from 'react';
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {IoCheckmarkCircle} from 'react-icons/io5';
import PageHeader from "@/Components/PageHeader.jsx";
import StandardButton from "@/Components/StandardButton.jsx";

const Success = () => {
    return (
        <AuthenticatedLayout>
            <Head title="Subscription Plans"/>
            <div className="container mx-auto px-4 py-12 md:py-20">
                {/* Page title row */}
                <div className="pb-6 gap-3 flex justify-between align-bottom items-baseline my-3 border-b border-gray-100 text-left">
                    <PageHeader
                        heading="Success!"
                        description={"Your Payout Account Is Now Connected 🎉"}
                    />
                </div>
                <div className="max-w-4xl mx-auto mt-10">
                    <div className="bg-white rounded-3xl shadow-md px-6 py-7">
                        {/* Header row */}
                        <div className="flex flex-row items-center gap-4">
                            {/* Icon */}
                            <div className="flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[#424fcf]/10">
                                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-emerald-500 text-white text-xl">
                                    ✓
                                </div>
                            </div>

                            {/* Text header */}
                            <div className="flex-1">
                                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                                    You're all set to be paid as a LinkPro affiliate!
                                </h2>
                            </div>
                        </div>
                            {/* Body content */}
                            <div className="mt-6 space-y-4 text-sm md:text-base text-gray-600">
                                <p className="mt-2 text-gray-600 text-sm md:text-base">
                                    We’ve successfully received your payment details.
                                    If anything needs your attention, we’ll reach out — otherwise, keep those commissions rolling in.
                                </p>
                                <h3>What's Next?</h3>
                                <p className="mt-2 text-gray-600 text-sm md:text-base">
                                    Keep promoting, keep creating, and keep pushing — your momentum starts now.
                                    Every click, every sale, and every creator you support helps build your income.
                                </p>
                                <h3>A Few Tips to Maximize Your Earnings:</h3>
                                {/* Optional mini checklist */}
                                <ul className="mt-3 flex flex-col items-start gap-2 text-sm text-gray-600 md:grid-cols-3">
                                    <li className="flex items-center gap-2 md:justify-center">
                                        <span className="mt-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#424fcf]/10 text-[11px] font-semibold text-[#424fcf]">
                                        </span>
                                        <span>Share your affiliate link on your LinkPro page, socials, and bio.</span>
                                    </li>
                                    <li className="flex items-start gap-2 md:justify-center">
                                        <span className="mt-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#424fcf]/10 text-[11px] font-semibold text-[#424fcf]">
                                        </span>
                                        <span>Promote trending courses that creators are already searching for</span>
                                    </li>
                                    <li className="flex items-start gap-2 md:justify-center">
                                        <span className="mt-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#424fcf]/10 text-[11px] font-semibold text-[#424fcf]">
                                        </span>
                                        <span>Add your link to posts, reels, stories, and email signatures</span>
                                    </li>
                                    <li className="flex items-start gap-2 md:justify-center">
                                        <span className="mt-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#424fcf]/10 text-[11px] font-semibold text-[#424fcf]">
                                        </span>
                                        <span>Stay active — consistent effort = consistent payouts</span>
                                    </li>
                                </ul>
                                <h3>The more value you share, the more you earn. Make this month your biggest one yet. 💪</h3>
                            </div>

                            {/* Primary CTA */}
                            <div className="mt-8 flex flex-col items-center gap-3">
                                <StandardButton
                                    classes="w-full md:w-auto"
                                    onClick={() => router.visit(route('dashboard'))}
                                    text="Go to Dashboard"
                                />

                                <p className="text-xs md:text-sm text-gray-500">
                                    or{" "}
                                    <Link
                                        href={route('user.edit')}
                                        className="font-medium text-[#424fcf] hover:underline"
                                    >
                                        manage my account
                                    </Link>
                                </p>
                            </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
);
};

export default Success;
