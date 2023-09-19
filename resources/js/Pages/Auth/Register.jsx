import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox.jsx';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />
            <div className="container">
                <div className="my_row form_page">
                    <div className="card guest">
                        <div className="mb-4">
                            <h3>Take control of your social sharing!</h3>
                            <h4 className="text-center">Create your free account below to get started.</h4>
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
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputLabel htmlFor="email" value="Email" />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div className="mt-4 form-group relative">
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <InputLabel htmlFor="password" value="Password" />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div className="mt-4 form-group relative">

                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>

                                <div className="form-group form-check text-center mt-2 flex align-center justify-center">
                                    <Checkbox
                                        className="form-check-input"
                                        name="terms"
                                        checked={data.remember}
                                        onChange={(e) => setData('terms', e.target.checked)}
                                        required
                                    />
                                    {/*<input className="form-check-input" type="checkbox" name="remember" id="remember" required />
*/}
                                    <label className="form-check-label" htmlFor="terms">
                                        Check here to agree to LinkPro's <a target="_blank" href={ route('terms') }>Terms and Conditions</a> and
                                        <a target="_blank" href={ route('privacy') }>Privacy Policy</a>
                                    </label>
                                </div>
                                <div className="block mt-4 text-center">
                                    <PrimaryButton className="button blue text-uppercase mb-4" disabled={processing}>
                                        Let's Do This
                                    </PrimaryButton>
                                    <Link
                                        href={route('login')}
                                        className="text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Already on LinkPro? Login Now
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
