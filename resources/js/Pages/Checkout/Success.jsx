import React, {useEffect, useState} from 'react';
import {Head, Link, router} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import PageHeader from "@/Components/PageHeader.jsx";
import StandardButton from "@/Components/StandardButton.jsx";

const Success = ({
                     type,
                     name = null,
                     url = null,
                     courseTitle = "",
}) => {

    const [purchaseType, setPurchaseType] = useState(type);

    const [plan, setPlan] = useState(null)
    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const paramPurchaseType = urlParams?.get('type');
        const plan = urlParams?.get('plan');
        if(paramPurchaseType) {
            setPurchaseType(paramPurchaseType);
        }
        if(plan) {
            setPlan(plan);
        }

    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Subscription Purchased"/>
            <div className="container mx-auto px-4 py-12 md:py-20">
                {/* Page title row */}
                <div className="pb-6 gap-3 flex justify-between align-bottom items-baseline my-3 border-b border-gray-100 text-left">
                    <PageHeader
                        heading="Success!"
                        description={purchaseType === "subscription" ? "Your subscription has been activated." : "Your course purchase is complete."}
                    />
                </div>


                    <div className="max-w-4xl mx-auto mt-10">
                        <div className="bg-white rounded-3xl shadow-md px-6 py-7">
                            {/* Header row */}
                            <div className="flex flex-row items-center gap-4">
                                {/* Icon */}
                                <div className="flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-[#424fcf]/10">
                                    <div className="flex items-center justify-center h-7 w-7 rounded-full bg-emerald-500 text-white text-xl">
                                        ✓
                                    </div>
                                </div>

                                {/* Text header */}
                                <div className="flex-1">
                                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                                        You’re all set, {name}!
                                    </h2>
                                </div>
                            </div>
                            {purchaseType === "subscription" ?
                                <>
                                    {/* Body content */}
                                    <div className="mt-6 space-y-4 text-sm md:text-base text-gray-600">
                                        <p className="mt-2 text-gray-600 text-sm md:text-base">
                                            Thank you for subscribing to the{" "}
                                            <span className="italic capitalize font-bold">{plan}</span>{" "}
                                            plan on LinkPro. You’ve unlocked powerful tools
                                            to grow your audience and turn clicks into
                                            customers.
                                        </p>
                                        <p>
                                            You’ll receive an email confirming your subscription
                                            shortly. From your dashboard you can customize your
                                            page, add links or offers, and start sharing your
                                            LinkPro URL.
                                        </p>

                                        {/* Optional mini checklist */}
                                        <ul className="mt-3 grid gap-2 text-sm text-gray-600 md:grid-cols-3">
                                            <li className="flex items-start gap-2 md:justify-center">
                                                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#424fcf]/10 text-[11px] font-semibold text-[#424fcf]">
                                                    1
                                                </span>
                                                <span>Create or update your LinkPro page.</span>
                                            </li>
                                            <li className="flex items-start gap-2 md:justify-center">
                                                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#424fcf]/10 text-[11px] font-semibold text-[#424fcf]">
                                                    2
                                                </span>
                                                <span>Add your links, integrations, or offers.</span>
                                            </li>
                                            <li className="flex items-start gap-2 md:justify-center">
                                                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#424fcf]/10 text-[11px] font-semibold text-[#424fcf]">
                                                    3
                                                </span>
                                                <span>Share your link and track performance.</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Primary CTA */}
                                    <div className="mt-8 flex flex-col items-center gap-3">
                                        <StandardButton
                                            classes="w-full md:w-auto bg-[#424fcf] hover:bg-[#353fbe] text-white"
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

                                    {/* Tip banner */}
                                    <div className="mt-6 rounded-2xl bg-[#424fcf]/5 px-4 py-3 text-xs md:text-sm text-gray-600">
                                        <span className="font-semibold text-gray-800">
                                            Tip:
                                        </span>{" "}
                                        Add your LinkPro URL to your social profiles right away
                                        so new followers can always find your latest content.
                                    </div>
                                </>
                            :
                                <>
                                    <div className="mt-6 space-y-4 text-sm md:text-base text-gray-600">
                                        <p className="mt-2 text-gray-600 text-sm md:text-base">
                                            Thank you for purchasing the{" "}
                                            <span className="italic capitalize font-bold">{courseTitle}</span>{" "}
                                            course on LinkPro. You now have full access to the training materials and can begin learning immediately. This course is now available anytime under the <span className="italic capitalize font-bold">Courses</span> item on the main menu.
                                        </p>
                                        <p>
                                            You’ll receive an email with your purchase confirmation
                                            shortly. You can access all lessons, media, and downloadable files by click the
                                            <span className="italic capitalize font-bold"> Start Learning Now</span> button below.
                                        </p>

                                        <p className="font-semibold">Start your journey in three simple steps:</p>
                                        {/* Optional mini checklist */}
                                        <ul className="mt-3 grid gap-2 text-sm text-gray-600 md:grid-cols-3">
                                            <li className="flex items-start gap-2 md:justify-center">
                                                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#424fcf]/10 text-[11px] font-semibold text-[#424fcf]">
                                                    1
                                                </span>
                                                <span>Open your course by clicking the button below.</span>
                                            </li>
                                            <li className="flex items-start gap-2 md:justify-center">
                                                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#424fcf]/10 text-[11px] font-semibold text-[#424fcf]">
                                                    2
                                                </span>
                                                <span>Move through each lesson at your own pace.</span>
                                            </li>
                                            <li className="flex items-start gap-2 md:justify-center">
                                                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#424fcf]/10 text-[11px] font-semibold text-[#424fcf]">
                                                    3
                                                </span>
                                                <span>Track your progress and revisit any section anytime.</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Primary CTA */}
                                    <div className="mt-8 flex flex-col items-center gap-3">
                                        <StandardButton
                                            classes="w-full md:w-auto bg-[#424fcf] hover:bg-[#353fbe] text-white"
                                            onClick={() => window.location.href = url}
                                            text="Start Learning Now"
                                        />

                                        <p className="text-xs md:text-sm text-gray-500">
                                            or{" "}
                                            <Link
                                                href={route('all.courses')}
                                                className="font-medium text-[#424fcf] hover:underline"
                                            >
                                                View all courses
                                            </Link>
                                        </p>
                                    </div>

                                    {/* Tip banner */}
                                    <div className="mt-6 rounded-2xl bg-[#424fcf]/5 px-4 py-3 text-xs md:text-sm text-gray-600">
                                        <span className="font-semibold text-gray-800">
                                            Tip:
                                        </span>{" "}
                                        Bookmark your course page so you can easily return and continue learning whenever you want.
                                    </div>
                                </>
                            }
                        </div>
                    </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Success;
