import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword, course = null }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        let parameter = course ? "?course=" + course.id : "";

        post(route('login') + parameter);
    };

    return (
        <GuestLayout course={course}>
            <Head title="Log in" />

            <div className="container">

            {status && <div className="mb-4">{status}</div>}

                <div className="my_row form_page">
                    <div className="card bg-white guest login_form">

                        <div className={ `${course ? "mb-0" : "mb-4" }`}>
                            <h3>Log in to LinkPro</h3>
                        </div>
                        {course &&
                            <>
                                <p className="text-center">to Access</p>
                                <div className="course_heading" style="background: {{ $course->header_color }}">
                                    {/*<img src="{{ $course->logo }}" alt="{{ $course->title }}">*/}
                                    <h3  style="color: course->header_text_color">course.title</h3>
                                </div>
                            </>
                        }
                        <form onSubmit={submit}>
                            <div className="form-group relative p-0 mb-5">
                                {/*<InputLabel htmlFor="email" value="Email" />*/}

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block w-full animate"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputLabel htmlFor="identity" value="E-mail or UserName" />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="form-group relative p-0 ">
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="block w-full animate"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputLabel htmlFor="password" value="Password" />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="block mt-4">
                                <label className="flex items-center">
                                    <div className="form-check">
                                        <Checkbox
                                            className="form-check-input"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                        />
                                        <span className="ml-2 text-sm text-gray-600 form-check-label">Remember me</span>
                                    </div>
                                </label>
                            </div>

                            <div className="text-center mt-4">
                                <PrimaryButton className="button blue mb-4" disabled={processing}>
                                    Sign in
                                </PrimaryButton>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-blue-600 underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Need your password reset?
                                    </Link>
                                )}
                            </div>

                            <div className="form-group text-center mt-2">
                                <p className='text-sm'>Not on LinkPro?
                                    <Link className="text-blue-600 font-bold text-sm" href={ route('register') }> Start Now Free!</Link>
                                </p>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
