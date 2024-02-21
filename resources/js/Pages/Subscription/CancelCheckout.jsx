import React from 'react';
import {Head} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { IoIosCloseCircle } from "react-icons/io";

const CancelCheckout = () => {
    return (
        <AuthenticatedLayout>
            <Head title="Subscription Purchased"/>
            <div className="container">
                <div className="my_row text-center mt-4">
                    <h2 className="page_title">Checkout Canceled</h2>
                    <div className="card inline-block relative status_message">
                        <div className="cancel_icon">
                            <IoIosCloseCircle />
                        </div>
                        <h3 className="mb-3">Change your mind?</h3>
                        <p className="mb-4">You can still continue to use LinkPro on your current plan.</p>
                        <p><a href={route('dashboard')}>Go to your Dashboard</a></p>
                        <p>OR</p>
                        <p><a href={route('plans.get')}>CLICK HERE</a> to try a different plan.</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CancelCheckout;
