import React from 'react';
import {Head} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { IoIosCloseCircle, IoMdAlert } from "react-icons/io";
import PageHeader from "@/Components/PageHeader.jsx";
import { MdOutlineDashboard } from "react-icons/md";
import StandardButton from "@/Components/StandardButton.jsx";

const CancelCheckout = ({type}) => {
    return (
        <AuthenticatedLayout>
            <Head title="Subscription Purchased"/>
            <div className="container">
                <div className="my_row text-center mt-4">
                    <div className="pb-6 gap-3 flex justify-between align-bottom items-baseline my-3 border-b border-gray-100 text-left">
                        <PageHeader
                            heading="Checkout Cancelled"
                        />
                    </div>
                    <div className="inline-block relative w-full max-w-5xl mt-10">
                        <div className="rounded-2xl bg-white shadow-md">
                            <div className="flex items-start gap-3 border-b border-gray-100 px-6 py-5 sm:items-center text-left">
                                <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50  text-amber-800  ring-amber-200">
                                    <IoMdAlert className="h-6 w-6" />
                                </span>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Change your mind?
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {type === 'subscription' ?
                                            "No worries — your current LinkPro plan is still active and ready to use. When you're ready, upgrading is just a few clicks away."
                                            :
                                            "If you're not ready to purchase this course. Check out other courses that are available"
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-center flex-wrap gap-4 p-10">

                                    {type === 'subscription' ?
                                        <>
                                            <StandardButton
                                                classes={`w-full md:w-1/4 text-white shadow-md bg-indigo-600 hover:bg-indigo-700
                                                focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60`}
                                                text="Go To Dashboard"
                                                onClick={() => window.location.href = route('dashboard')}
                                            />
                                            <StandardButton
                                                classes="w-full md:w-1/4 shadow-md border border-solid !border-indigo-600 !text-indigo-600 px-6 py-3 hover:bg-indigo-400 hover:!text-white transition"
                                                text="View Plans"
                                                onClick={() => window.location.href = route('plans.get')}
                                            />
                                            <p className="text-sm text-gray-400 mt-6 w-full">
                                                💡 Tip: You can upgrade anytime from your Account Settings → Change My Plan.
                                            </p>
                                        </>
                                        :
                                        <>
                                            <StandardButton
                                                classes="w-full md:w-1/4
                                                text-white shadow-md bg-indigo-600 hover:bg-indigo-700
                                                focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                                                text="View Courses"
                                                onClick={() => window.location.href = route('all.courses')}
                                            />
                                            <p className="text-sm text-gray-400 mt-6 w-full">
                                                💡 Tip: You can check out courses anytime by clicking on "Courses" in the navigation menu.
                                            </p>
                                        </>
                                    }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CancelCheckout;
