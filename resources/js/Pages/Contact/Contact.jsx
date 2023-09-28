import GuestLayout from '@/Layouts/GuestLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ContactLayout from '@/Pages/Contact/ContactLayout.jsx';
function Contact({auth}) {

    return (
        <>
            { auth.user.username ?

                    <AuthenticatedLayout>
                        <ContactLayout />
                    </AuthenticatedLayout>

                    :

                    <GuestLayout>
                        <ContactLayout />
                    </GuestLayout>
            }
        </>
    )
}

export default Contact;
