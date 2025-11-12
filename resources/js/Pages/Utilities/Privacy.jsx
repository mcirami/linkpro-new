import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import PrivacyPolicy from "@/Pages/Utilities/Components/PrivacyPolicy.jsx";

const Privacy = ({auth}) => {
    return (
        <>
            {auth?.user.userInfo ?
                <AuthenticatedLayout>
                    <PrivacyPolicy/>
                </AuthenticatedLayout>
                :
                <GuestLayout>
                    <PrivacyPolicy />
                </GuestLayout>
            }
        </>
    );
};

export default Privacy;
