import React from 'react';
import {Head} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IoCheckmarkCircle } from "react-icons/io5";

const Success = ({name}) => {
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
                        <h3 className="mb-3">Thank you for purchasing a subscription {name}!</h3>
                        <h4 className="mb-4">You’ve taken a serious step to get the most out of LinkPro!</h4>
                        <p className="mb-2">You will be receiving an email confirming your subscription shortly.</p>
                        <p><a href={route('dashboard')}>Click Here</a> to go to your Dashboard and get on your way to becoming a social icon!
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Success;
