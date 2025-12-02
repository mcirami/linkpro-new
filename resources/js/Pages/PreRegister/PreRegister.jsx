import React from 'react';
import {Head} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import StandardButton from "@/Components/StandardButton.jsx";
import { RiPagesLine } from "react-icons/ri";

const PreRegister = () => {
    return (
        <AuthenticatedLayout>
            <Head title="Pre Register" />

            <div className="container">

                <div className="px-6 pt-6">
                    <div className="flex items-center">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">LinkPro Pages</h1>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Your hub for all your LinkPro Pages. Add all your social media links in one spot.</p>
                    <div className="mt-3 border-b border-gray-100"></div>
                </div>
                <section className="mx-auto flex flex-col items-center max-w-4xl mt-5 md:mt-10 min-h-lvh">
                    <div className="rounded-2xl bg-white shadow-md w-full">
                        <div className="flex items-start flex-wrap md:flex-nowrap gap-3 border-b border-gray-100 px-6 py-5 sm:items-center">
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200">
                                <RiPagesLine className="h-6 w-6" aria-hidden="true"/>
                            </span>
                            <div className="min-w-0 w-full md:w-auto" aria-hidden="true">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Build a LinkPro Page to create one link to promote all of your social media.
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Follow these three quick steps to launch.
                                </p>
                            </div>
                        </div>
                        <ol className="px-6 py-6">
                            <div className="grid gap-6">
                                <li className="flex gap-4">
                                    <div className="relative shrink-0">
                                        <span className="grid h-12 w-12 place-items-center rounded-full bg-indigo-500 text-white text-lg font-semibold shadow-md">
                                            1
                                        </span>
                                        <span
                                            className="absolute left-1/2 top-12 -ml-px hidden h-8 w-0.5 bg-indigo-100 sm:block"
                                            aria-hidden
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-900">Create your LinkPro Page</h3>
                                        <p className="mt-1 text-gray-700">Add images, text and all of your social media or contact icons to your Page.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="relative shrink-0">
                                        <span className="grid h-12 w-12 place-items-center rounded-full bg-indigo-500 text-white text-lg font-semibold shadow-md">
                                            2
                                        </span>
                                        <span
                                            className="absolute left-1/2 top-12 -ml-px hidden h-8 w-0.5 bg-indigo-100 sm:block"
                                            aria-hidden
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-900">Share your Page</h3>
                                        <p className="mt-1 text-gray-700">Add your Page link to any social or email accounts to link all of your followers with one simple link.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="relative shrink-0">
                                        <span className="grid h-12 w-12 place-items-center rounded-full bg-indigo-500 text-white text-lg font-semibold shadow-md">
                                            3
                                        </span>
                                    </div>
                                    <div className="text_wrap">
                                        <h3 className="text-lg font-semibold text-gray-900">Create or market LinkPro Courses</h3>
                                        <p className="mt-1 text-gray-700">Create your own video Courses or market other public Courses to generate Income!</p>
                                    </div>
                                </li>
                            </div>
                        </ol>
                        <div className="mt-6 flex items-center justify-start p-10 pt-0">
                            <StandardButton
                                classes="w-full md:w-1/4"
                                text="Get Started!"
                                onClick={() => {
                                    window.location.href = route('create.page')
                                }}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
};

export default PreRegister;
