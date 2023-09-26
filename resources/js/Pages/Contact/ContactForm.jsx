import React, {useState} from 'react';
//import {SubmitContactForm} from '@/Services/ContactRequests.js';
import {BiMailSend} from 'react-icons/bi';
import {useForm} from '@inertiajs/react';
import TextInput from '@/Components/TextInput.jsx';
import InputLabel from '@/Components/InputLabel.jsx';
import InputError from '@/Components/InputError.jsx';

const ContactForm = () => {

    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        name: '',
        email: '',
        reason: 'general',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('contact.send'))
    }

    return (
        <>
        {wasSuccessful ?

            <div className="success_message">
                <BiMailSend />
                <h3>Your Inquiry Has Been Sent.</h3>
                <p>We will get back to you soon!</p>
            </div>

            :

            <>
                <p className="form_text mb-5 px-5">Got questions? Need Support? Want to inquire about business opportunities? Send us a message and we'll respond as soon as possible</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group relative p-0 mb-5">
                        {/*<InputLabel htmlFor="email" value="Email" />*/}

                        <TextInput
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className="block w-full animate"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputLabel htmlFor="name" value="Name" />
                        <InputError message={errors.name} className="mt-2 text-left" />
                    </div>
                    <div className="form-group relative p-0 mb-5">
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full animate"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputLabel htmlFor="email" value="E-mail Address" />
                        <InputError message={errors.email} className="mt-2 text-left" />
                    </div>
                    <div className="form-group relative p-0 mb-5">
                        <select
                            className="active"
                            name="reason"
                            id="reason"
                            onChange={(e) => setData('reason', e.target.value)}
                            value={data.reason}
                        >
                            <option value="general">General</option>
                            <option value="support">Account Support</option>
                            <option value="business">Business Inquiries</option>
                        </select>
                        <label htmlFor="reason">Reason For Contact</label>
                        <InputError message={errors.reason} className="mt-2 text-left" />
                    </div>
                    <div className="form-group row relative">
                        <textarea
                            className="animate"
                            name="message"
                            rows="10"
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                        >
                        </textarea>
                        <label htmlFor="message">Message</label>
                        <InputError message={errors.message} className="mt-2 text-left" />
                    </div>

                    <div className="form-group row">
                        <div className="col-sm-10 mx-auto">
                            <button className="button blue" type="submit" disabled={processing}>
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </>
        }
        </>
    );
};

export default ContactForm;
