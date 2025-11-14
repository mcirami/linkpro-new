import React, {useEffect, useState} from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox.jsx';
import {useGoogleRecaptchaV3, checkRecaptcha} from '@/Utils/useGoogleRecaptchaV3.jsx';
import {Loader} from '@/Utils/Loader.jsx';
import {IoWarningOutline} from 'react-icons/io5';
import PageHeader from "@/Components/PageHeader.jsx";
import StandardButton from "@/Components/StandardButton.jsx";
import { MdOutlineLink } from "react-icons/md";

export default function Register({honeypot, spamDetected = false}) {

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        password_confirmation: '',
        [`${honeypot.nameFieldName}`]: '',
        [`${honeypot.validFromFieldName}`] : honeypot.encryptedValidFrom
    });

    const [showLoader, setShowLoader] = useState({
        show: false,
        position: 'absolute',
        progress: null,
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const executeRecaptcha = useGoogleRecaptchaV3()

    const submit = async (e) => {
        e.preventDefault();
        setShowLoader(prevState => ({
            ...prevState,
            show: true
        }));

        const action = 'register'
        const token = await executeRecaptcha(action);
        checkRecaptcha(token, action).then((response)=> {
            if (response.valid) {
                post(route('register'));
            }
            setShowLoader(prevState => ({
                ...prevState,
                show: false
            }));
        })
    };

    return (
        <GuestLayout>
            <Head title="Register" />
            <div className="container">
                <div className="pb-6 gap-3 flex justify-between align-bottom items-baseline mt-3 border-b border-gray-100">
                    <PageHeader
                        heading="Register"
                        description="Create your free account below to get access to the most exciting social sharing features on the internet!"
                    />
                </div>
                <div className="my_row form_page mt-10">
                    <div className="card guest relative shadow-md">
                        {showLoader.show &&
                            <Loader showLoader={showLoader} />}
                        {spamDetected ?
                            <div className="warning_message">
                                <div className="icon_wrap red">
                                    <IoWarningOutline />
                                </div>
                                <h3>You have been flagged!</h3>
                                <h3>GO AWAY!</h3>
                            </div>
                        :
                            <>
                            <div className="flex items-center gap-3 border-b border-gray-100 p-5">
                                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#424fcf]/10 ring-1 ring-indigo-200">
                                    <img src={Vapor.asset('images/preview-device-bg.png')} alt="LinkPro Logo" className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="!text-left !text-2xl font-semibold text-gray-900">
                                        Take control of your social sharing!
                                    </h2>
                                    <p className="text-sm text-gray-700">
                                        Join LinkPro today and start sharing your content with the world!
                                    </p>
                                </div>
                            </div>
                            <div className="card-body">
                                <form onSubmit={submit}>

                                    <div className="form-group relative">
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="mt-1 block w-full animate"
                                            autoComplete="username"
                                            onChange={(e) => setData('email',
                                                e.target.value)}
                                            required
                                        />
                                        <InputLabel htmlFor="email" value="Email"/>
                                        <InputError message={errors.email} className="mt-2"/>
                                    </div>

                                    <div className="mt-4 form-group relative">
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="mt-1 block w-full animate"
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password',
                                                e.target.value)}
                                            required
                                        />
                                        <InputLabel htmlFor="password" value="Password"/>
                                        <InputError message={errors.password} className="mt-2"/>
                                    </div>

                                    <div className="mt-4 form-group relative">

                                        <TextInput
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="mt-1 block w-full animate"
                                            autoComplete="new-password"
                                            onChange={(e) => setData(
                                                'password_confirmation',
                                                e.target.value)}
                                            required
                                        />
                                        <InputLabel htmlFor="password_confirmation" value="Confirm Password"/>
                                        <InputError message={errors.password_confirmation} className="mt-2"/>
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
                                               name={honeypot.nameFieldName}
                                               id={honeypot.nameFieldName}
                                               onChange={(e) => setData(
                                                   honeypot.nameFieldName,
                                                   e.target.value)}
                                        />
                                        <input autoComplete="off"
                                               type="text"
                                               name={honeypot.validFromFieldName}
                                        />
                                    </div>
                                    <div className="form-group form-check mt-2 flex align-center">
                                        <Checkbox
                                            className="form-check-input mr-2"
                                            name="terms"
                                            checked={data.remember}
                                            onChange={(e) => setData('terms',
                                                e.target.checked)}
                                            required
                                        />
                                        {/*<input className="form-check-input" type="checkbox" name="remember" id="remember" required />
    */}
                                        <label className="form-check-label flex gap-2 flex-col md:flex-row" htmlFor="terms">
                                            Check here to agree to LinkPro's
                                            <div className="flex gap-2">
                                                <Link target="_blank" href={route(
                                                    'terms')}>Terms and Conditions</Link> and
                                                <Link target="_blank" href={route(
                                                    'privacy')}> Privacy Policy</Link>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="block mt-4 text-right">
                                        <StandardButton
                                            classes="w-full md:w-1/3 ml-auto mb-2 text-white shadow-md bg-indigo-600 hover:bg-indigo-700
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                                            text="Let's Do This"
                                            onClick={submit}
                                            disabled={processing} />
                                        <Link
                                            href={route('login')}
                                            className="text-blue-600 font-bold text-sm hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Already on LinkPro? Login Now
                                        </Link>
                                    </div>
                                </form>
                            </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
