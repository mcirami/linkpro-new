import {Head} from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import PageLayout from '@/Pages/HowItWorks/PageLayout.jsx';
function Contact({auth}) {

    return (
        <>
            <Head title="Contact Us" />
            { auth.user.userInfo.length < 1 ?

                <GuestLayout>
                    <PageLayout />
                </GuestLayout>

                :

                <AuthenticatedLayout>
                    <PageLayout />
                </AuthenticatedLayout>

            }
        </>
    )
}

export default Contact;
