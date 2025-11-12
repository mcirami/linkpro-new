import {Head} from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import PageLayout from '@/Pages/HowItWorks/PageLayout.jsx';
function Contact({auth}) {

    return (
        <>
            <Head title="Contact Us" />
            { auth?.user.userInfo ?
                <AuthenticatedLayout>
                    <PageLayout />
                </AuthenticatedLayout>
                :
                <GuestLayout>
                    <PageLayout />
                </GuestLayout>
            }
        </>
    )
}

export default Contact;
