import React, {useEffect} from 'react';
import {BiMailSend} from 'react-icons/bi';
import { Link, router, useForm } from "@inertiajs/react";
import TextInput from '@/Components/TextInput.jsx';
import InputLabel from '@/Components/InputLabel.jsx';
import InputError from '@/Components/InputError.jsx';
import {useGoogleRecaptchaV3, checkRecaptcha} from '@/Utils/useGoogleRecaptchaV3.jsx';
import {IoWarningOutline} from 'react-icons/io5';
import StandardButton from "@/Components/StandardButton.jsx";
const ContactForm = ({honeypot, spamDetected, setShowLoader, loggedIn}) => {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        name: '',
        email: '',
        reason: 'general',
        message: '',
        [`${honeypot.nameFieldName}`]: '',
        [`${honeypot.validFromFieldName}`] : honeypot.encryptedValidFrom
    });

    const executeRecaptcha = useGoogleRecaptchaV3();

    /*useEffect(() => {
        setData(honeypot.nameFieldName, 'fuckface');
    }, []);*/

    useEffect(() => {
        setShowLoader(prevState => ({
            ...prevState,
            show: false
        }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowLoader(prevState => ({
            ...prevState,
            show: true
        }));
        const action = 'contact'
        const token = await executeRecaptcha(action);
        checkRecaptcha(token, action).then((response)=> {
            if (response.valid) {
                post(route('contact.send'));
            }
            setShowLoader(prevState => ({
                ...prevState,
                show: false
            }));
        })
    }

    return (
        <>
        {wasSuccessful ?

            <>
                <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 pb-5 mb-8">
                    <div className="flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[#424fcf]/10">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500 text-white text-xl">
                            ✓
                        </div>
                    </div>
                    <div>
                        <h2 className="!text-left !text-2xl font-semibold text-gray-900">
                            Your Message Has Been Sent.
                        </h2>
                    </div>
                </div>

                <p className="text-lg text-gray-700">
                    Thanks for your inquiry.
                </p>
                <p className="text-lg text-gray-700">
                    We will get back to you as soon as possible!
                </p>
                <div className="mt-8 flex flex-col items-center gap-3">
                    {loggedIn ?
                        <>
                            <StandardButton
                                classes="w-full md:w-auto"
                                onClick={() => router.visit(route('dashboard'))}
                                text="Go to Dashboard"
                            />

                            <p className="text-xs md:text-sm text-gray-500">
                                or{" "}
                                <Link
                                    href={route('user.edit')}
                                    className="font-medium text-[#424fcf] hover:underline"
                                >
                                    manage my account
                                </Link>
                            </p>
                        </>
                        :
                        <>
                            <StandardButton
                                classes="w-full md:w-auto"
                                onClick={() => router.visit(route('login'))}
                                text="Login Now"
                            />

                            <p className="text-xs md:text-sm text-gray-500">
                                or{" "}
                                <Link
                                    href={route('register')}
                                    className="capitalize font-medium text-[#424fcf] hover:underline"
                                >
                                    sign up free
                                </Link>
                            </p>
                        </>
                    }
                </div>
            </>
            :
            spamDetected ?
                    <>
                        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 pb-5 mb-8">
                            <div className="flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-xl bg-red-500/10">
                                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-red-500 text-white text-xl">
                                    <IoWarningOutline className="w-4 h-4" />
                                </div>
                            </div>
                            <div>
                                <h2 className="!text-left !text-2xl font-semibold text-gray-900">
                                    You have been flagged!
                                </h2>
                            </div>
                        </div>
                        <p className="text-lg text-gray-700">
                            We don't like spammers!
                        </p>
                        <p className="text-lg text-gray-700">
                            Go away and take your shenanigans elsewhere!
                        </p>
                    </>
                :

                <>
                    <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 pb-5 mb-8">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#424fcf]/10 ring-1 ring-indigo-200">
                            <BiMailSend className="text-indigo-500 w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="!text-left !text-2xl font-semibold text-gray-900">
                                Submit Your Inquiry
                            </h2>
                            <p className="text-sm text-gray-700 !text-left">
                                Send us a message and we'll respond as soon as possible
                            </p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group relative p-0 mb-5">
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="block w-full animate"
                                isFocused={true}
                                onChange={(e) => setData("name", e.target.value)}
                            />
                            <InputLabel htmlFor="name" value="Name"/>
                            <InputError message={errors.name} className="mt-2 text-left"/>
                        </div>
                        <div className="form-group relative p-0 mb-5">
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full animate"
                                onChange={(e) => setData("email", e.target.value)}
                            />
                            <InputLabel htmlFor="email" value="E-mail Address"/>
                            <InputError message={errors.email} className="mt-2 text-left"/>
                        </div>
                        <div className="form-group relative p-0 mb-5 mt-8">
                            <select
                                className="active"
                                name="reason"
                                id="reason"
                                onChange={(e) => setData("reason", e.target.value)}
                                value={data.reason}
                            >
                                <option value="general">General</option>
                                <option value="support">Account Support</option>
                                <option value="business">Business Inquiries</option>
                            </select>
                            <label htmlFor="reason">Reason For Contact</label>
                            <InputError message={errors.reason} className="mt-2 text-left"/>
                        </div>
                        <div className="form-group row relative" style={{
                            position: 'absolute',
                            opacity: 0,
                            top: 0,
                            left: 0,
                            height: 0,
                            width: 0,
                            zIndex: -1
                        }}>
                            <input type="text"
                                   autoComplete="off"
                                   placeholder="Last Name"
                                   value={data.last_name}
                                   name="last_name"
                                   id="last_name"
                                   onChange={(e) => setData(honeypot.nameFieldName, e.target.value)}
                            />
                            <input autoComplete="off"
                                   type="text"
                                   name={honeypot.validFromFieldName}
                            />
                        </div>
                        <div className="form-group row relative">
                        <textarea
                            className="animate"
                            name="message"
                            rows="10"
                            value={data.message}
                            onChange={(e) => setData("message", e.target.value)}
                        >
                        </textarea>
                            <label htmlFor="message">Message</label>
                            <InputError message={errors.message} className="mt-2 text-left"/>
                        </div>

                        <div className="form-group row !mb-0">
                            <div className="col-sm-10 mx-auto">
                                <StandardButton
                                    onClick={handleSubmit}
                                    text="Submit"
                                    disabled={processing}
                                    classes={"w-full md:w-1/3 ml-auto"}
                                />
                            </div>
                        </div>
                    </form>
                </>
        }
        </>
    );
};

export default ContactForm;
