import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import {Head, useForm} from '@inertiajs/react';
import StandardButton from "@/Components/StandardButton.jsx";
import React from "react";
import PageHeader from "@/Components/PageHeader.jsx";
import { MdOutlineLockReset } from "react-icons/md";
export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
    });

    const submit = () => {
        post('/send-reset-password-email', {
            preserveScroll: true,
            onSuccess: () => reset('login'),
        })

    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />
            <div className="container">
                <div className="my_row form_page">
                    <div className="pb-6 gap-3 flex justify-between align-bottom items-baseline mt-3 border-b border-gray-100 mb-10">
                        <PageHeader
                            heading="Password Reset"
                            description="Submit your email address below to receive a password reset link."
                        />
                    </div>
                    <div className="mb-4 card guest login_form shadow-md">
                        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 border-b border-gray-100 pb-5 mb-8">
                            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#424fcf]/10 ring-1 ring-indigo-200">
                                <MdOutlineLockReset className="!h-6 !w-6 text-indigo-500" />
                            </div>
                            <div>
                                <h2 className="!text-left !text-2xl font-semibold text-gray-900">
                                    Forgot your password?
                                </h2>
                                <p className="text-sm text-gray-700">
                                    No problem! Submit your email address and we will send you a password reset link.
                                </p>
                            </div>
                        </div>
                        {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
                        <div className="card-body">
                            <form onSubmit={submit}>
                                <div className="relative">
                                    <TextInput
                                        id="login"
                                        type="email"
                                        name="login"
                                        value={data.email}
                                        className="mt-1 block w-full animate"
                                        isFocused={true}
                                        onChange={(e) => setData('login', e.target.value)}
                                    />
                                    <label htmlFor="login">E-mail</label>
                                </div>
                                <InputError message={errors.email} className="mt-2" />

                                <div className="flex items-center justify-end mt-4">
                                    <StandardButton
                                        classes="w-full md:w-1/2 ml-auto mb-2"
                                        text="Send Password Reset Link"
                                        onClick={submit}
                                        disabled={processing}
                                    />

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
