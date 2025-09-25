import GuestLayout from '@/Layouts/GuestLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ContactLayout from '@/Pages/Contact/ContactLayout.jsx';
import {Head} from '@inertiajs/react';
function Contact({auth, honeypot = null, spamDetected = false}) {

    return (
        <>
            { auth.user.userInfo.length < 1 ?

                <GuestLayout>
                    <Head title="Contact Us" />
                    <ContactLayout
                        honeypot={honeypot}
                        spamDetected={spamDetected}
                    />
                </GuestLayout>

                :

                <AuthenticatedLayout>
                    <Head title="Contact Us" />
                    <ContactLayout
                        honeypot={honeypot}
                        spamDetected={spamDetected}
                    />
                </AuthenticatedLayout>

            }
        </>
    )
}

export default Contact;
