import React from 'react';
import {redirectToOnboarding} from '@/Services/UserService.jsx';
import {router} from '@inertiajs/react';
import { Card, CardHeader } from "@mui/material";

const PayOutComponent = ({setShowLoader, total, setShowMessageAlertPopup}) => {

    const handleClick = (e) => {
        e.preventDefault();

        if (total > 100) {
            setShowLoader({
                show: true,
                position: 'fixed',
                icon: ""
            })
            redirectToOnboarding().then(response => {
                if (response.success) {
                    window.location.href = response.url
                }

                setShowLoader({
                    show: false,
                    position: "",
                    icon: ""
                })
            })
        } else {
            setShowMessageAlertPopup({
                show: true,
                text: "You must earn at least $100 before setting up your payment information.",
                buttonText: "OK",
            })
        }
    }

    return (
        <div className="flex flex-col items-center justify-start h-full">
            <CardHeader title="Payout Information" />
            <div className="px-5 py-5 flex flex-col gap-4 md:items-center md:justify-between">
                <p className="text-sm text-gray-600 md:max-w-3xl text-left">
                    In order to be paid out as an affiliate or course creator, submit your payout details.
                    Once you earn $100 or more we will send your payment.
                </p>
            </div>
            <div className="w-full mt-auto">
                <a target="_blank"
                   href="#"
                   className="button blue text-uppercase self-center"
                   onClick={handleClick}
                >
                    Submit Payout Details
                </a>
            </div>
        </div>
    );
};

export default PayOutComponent;
