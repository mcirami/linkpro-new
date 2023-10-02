import GuestLayout from '@/Layouts/GuestLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ContactLayout from '@/Pages/Contact/ContactLayout.jsx';
import {Head} from '@inertiajs/react';
function Contact({auth}) {

    return (
        <>
            { auth.user.username ?

                    <AuthenticatedLayout>
                        <Head title="Contact Us" />
                        <ContactLayout />
                    </AuthenticatedLayout>

                    :

                    <GuestLayout>
                        <Head title="Contact Us" />
                        <ContactLayout />
                    </GuestLayout>
            }
        </>
    )
}

export default Contact;
