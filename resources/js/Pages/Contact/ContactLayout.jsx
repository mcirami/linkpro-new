import React from 'react';
import {Head} from '@inertiajs/react';
import ContactForm from '@/Pages/Contact/ContactForm.jsx';

const ContactLayout = () => {
    return (
        <>
            <Head title="Contact Us"/>

            <div className="container" id="contact_page">
                <div className="my_row form_page">
                    <div className="card guest">
                        <h2 className="page_title text-center !mb-2">Contact Us</h2>
                        <div id="contact_form" className="card-body text-center">
                            <ContactForm/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactLayout;
