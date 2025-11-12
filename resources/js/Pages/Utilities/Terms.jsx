import React from 'react';
import {Head} from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import TermsAndConditions
    from "@/Pages/Utilities/Components/TermsAndConditions.jsx";

const Terms = ({auth}) => {

    return (

        <>
            <Head title="Terms and Conditions" />
            { auth?.user.userInfo ?
                <AuthenticatedLayout>
                    <TermsAndConditions />
                </AuthenticatedLayout>
                :
                <GuestLayout>
                    <TermsAndConditions />
                </GuestLayout>
            }
            </>

    );
};

export default Terms;
