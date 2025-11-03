import GuestLayout from '@/Layouts/GuestLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ContactLayout from '@/Pages/Contact/ContactLayout.jsx';
import {Head} from '@inertiajs/react';
function Contact({auth, honeypot = null, spamDetected = false}) {

    return (
        <>
            { auth?.user.userInfo ?
                <AuthenticatedLayout>
                    <Head title="Contact Us" />
                    <ContactLayout
                        honeypot={honeypot}
                        spamDetected={spamDetected}
                    />
                </AuthenticatedLayout>
                :
                <GuestLayout>
                    <Head title="Contact Us" />
                    <ContactLayout
                        honeypot={honeypot}
                        spamDetected={spamDetected}
                    />
                </GuestLayout>

            }
        </>
    )
}

export default Contact;
