import React from 'react';
import {Head, Link} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { IoCheckmarkCircle } from "react-icons/io5";

const Success = ({name, type, url = null, courseTitle = null}) => {
    return (
        <AuthenticatedLayout>
            <Head title="Subscription Purchased"/>
            <div className="container">
                <div className="my_row text-center mt-4">
                    <h2 className="page_title">SUCCESS!</h2>
                    <div className="card inline-block relative status_message">
                        <div className="success_icon">
                            <IoCheckmarkCircle />
                        </div>
                        {type === "subscription" ?
                            <>
                                <h3 className="mb-3">Thank you for purchasing a subscription {name}!</h3>
                                <h4 className="mb-4">You’ve taken a serious step to get the most out of LinkPro!</h4>
                                <p className="mb-2">You will be receiving an email confirming your subscription shortly.</p>
                                <p><a href={route('dashboard')}>Click Here</a> to go to your Dashboard and get on your way to becoming a social icon!
                                </p>
                            </>
                            :
                            <>
                                <h3 className="mb-3">Thank you for purchasing the {courseTitle} course, {name}!</h3>
                                <p className="mb-2">You will be receiving an email confirming your purchase shortly.</p>
                                <p>
                                    <a href={url}>Click Here</a> to start learning now!
                                </p>
                            </>
                        }
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Success;
