import React, {useState} from 'react';
import {Head} from '@inertiajs/react';
import ContactForm from '@/Pages/Contact/ContactForm.jsx';
import {Loader} from '@/Utils/Loader.jsx';
import PageHeader from "@/Components/PageHeader.jsx";

const ContactLayout = ({honeypot, spamDetected}) => {

    const [showLoader, setShowLoader] = useState({
        show: false,
        position: 'absolute',
        progress: null,
    });

    return (
        <>
            <Head title="Contact Us"/>

            <div className="container" id="contact_page">
                <div className="pb-6 gap-3 flex justify-between align-bottom items-baseline mt-3 border-b border-gray-100">
                    <PageHeader
                        heading="Contact Us"
                        description="Got questions? Need Support? Want to inquire about business opportunities? Send us a message and we'll respond as soon as possible"
                    />
                </div>
                <div className="my_row form_page mt-10">
                    <div className="card guest relative shadow-md">
                        {showLoader.show &&
                            <Loader showLoader={showLoader} />}
                        <div id="contact_form" className="card-body text-center">
                            <ContactForm
                                honeypot={honeypot}
                                spamDetected={spamDetected}
                                setShowLoader={setShowLoader}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactLayout;
