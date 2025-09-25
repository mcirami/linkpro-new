import React from 'react';
import {Head} from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import PageContent from '@/Pages/Utilities/Components/PageContent.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';

const Privacy = ({auth}) => {
    return (
        <>
            <Head title="Privacy Policy"/>
            {auth.user.userInfo.length < 1 ?
                <GuestLayout>
                    <PageContent pageName="privacy"/>
                </GuestLayout>
                :
                <AuthenticatedLayout>
                    <PageContent pageName="privacy"/>
                </AuthenticatedLayout>
            }
        </>
    );
};

export default Privacy;
