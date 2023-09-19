import ContactForm from './ContactForm';
import {Head} from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
function Contact({auth}) {

    return (

        <GuestLayout>
            <Head title="Contact Us" />

            <div className="container" id="contact_page">
                <div className="my_row form_page">
                    <div className="card guest">
                        <h2 className="page_title text-center">Contact Us</h2>
                        <div id="contact_form" className="card-body text-center">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>

    )
}

export default Contact;
