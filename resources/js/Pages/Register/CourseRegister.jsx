import React, {useState} from 'react';
import {registerUser} from '@/Services/UserService.jsx';
import InputAnimations from '@/Utils/InputAnimations.jsx';
import SetFlash from '@/Utils/SetFlash.jsx';
import {Loader} from '@/Utils/Loader.jsx';
import LoginModal from '@/Pages/Checkout/Components/LoginModal.jsx';
import {Head, router} from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

const CourseRegister = ({course, clickInfo, creator}) => {

    const [showLoader, setShowLoader] = useState({
        show: false,
        icon: "",
        position: "",
        progress: null
    });

    const [ registerData, setRegisterData ] = useState({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showLogin, setShowLogin] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowLoader({
            show: true,
            position: 'absolute',
            icon: ""
        })
        setFormErrors({});

        const packets = {
            username: registerData.username,
            email: registerData.email,
            password: registerData.password,
            password_confirmation: registerData.password_confirmation,
            course_creator: creator,
            course_id: course.id,
            cid: clickInfo.cid,
            a: clickInfo.a
        }

        registerUser(packets).then((response) => {

            if(response.success) {
                router.visit(response.url);
            }

            if (response.errors?.username) {
                setFormErrors((prev) => ({
                    ...prev,
                    username: response.errors.username[0]
                }));
            }

            if (response.errors?.email) {
                setFormErrors((prev) => ({
                    ...prev,
                    email: response.errors.email[0]
                }));
            }

            if (response.errors?.password) {
                setFormErrors((prev) => ({
                    ...prev,
                    password: response.errors.password[0]
                }));
            }

            setShowLoader({
                show: false,
                position: "",
                icon: ""
            })

        });
    }

    return (
        <GuestLayout>
            <Head title="Register For Course" />
            <div className="container">
                <InputAnimations/>
                <SetFlash/>
                <div className="my_row form_page course_register text-center">
                    <h2 className="page_title text-center !mb-10">Register For An Account</h2>
                    <div className="card my-auto guest relative">
                        <div className="card-body text-left w-full inline-block">
                            <div className="course_banner" style={{background: course.header_color}}>
                                <div className="image_wrap w-1/2 mx-auto mb-5">
                                    <img src={course.logo} alt=""/>
                                </div>
                            </div>
                            <form method="post"
                                  action=""
                                  className="my_row !min-w-full"
                                  id="payment-form"
                            >
                                <div className="text_wrap text-center mb-5">
                                    <h3>In order to access the {course.title} course you'll need to create an account.</h3>
                                </div>
                                <div className={`column_wrap columns-1`}>
                                    <section id="account_register" className="w-full inline-block">
                                        <div className="relative mb-5">
                                            <input
                                                id="username"
                                                type="text"
                                                className={`animate w-full ${formErrors.username &&
                                                "error"} ${registerData.username &&
                                                " active"}`}
                                                name="username"
                                                value={registerData.username}
                                                required
                                                autoComplete="username"
                                                onChange={(e) => setRegisterData(
                                                    (prev) => ({
                                                        ...prev,
                                                        username: e.target.value
                                                    }))}
                                            />
                                            <label htmlFor="username">Username</label>
                                            {formErrors.username &&
                                                <span id="username_error" className="invalid-feedback" role="alert">
                                                    {formErrors.username}
                                                </span>
                                            }
                                        </div>
                                        <div className="relative mb-5">
                                            <input
                                                id="email"
                                                type="email"
                                                className={`animate w-full ${formErrors.email &&
                                                "error"} ${registerData.username &&
                                                " active"}`}
                                                name="email"
                                                value={registerData.email}
                                                required
                                                autoComplete="email"
                                                onChange={(e) => setRegisterData(
                                                    (prev) => ({
                                                        ...prev,
                                                        email: e.target.value
                                                    }))}
                                            />
                                            <label htmlFor="email">E-mail Address</label>
                                            {formErrors.email &&
                                                <span id="email_error" className="invalid-feedback" role="alert">
                                                    {formErrors.email}
                                                </span>
                                            }
                                        </div>
                                        <div className="relative mb-5">
                                            <input
                                                id="password"
                                                type="password"
                                                value={registerData.password}
                                                className={`animate w-full ${formErrors.password &&
                                                "error"} ${registerData.username &&
                                                " active"}`}
                                                name="password"
                                                required
                                                autoComplete="new-password"
                                                onChange={(e) => setRegisterData(
                                                    (prev) => ({
                                                        ...prev,
                                                        password: e.target.value
                                                    }))}
                                            />
                                            <label htmlFor="password">Password</label>
                                            {formErrors.password &&
                                                <span id="password_error" className="invalid-feedback" role="alert">
                                                    {formErrors.password}
                                                </span>
                                            }
                                        </div>
                                        <div className="mb-5 relative">
                                            <input
                                                id="password-confirm"
                                                value={registerData.password_confirmation}
                                                type="password"
                                                className="animate w-full"
                                                name="password_confirmation"
                                                required
                                                autoComplete="new-password"
                                                onChange={(e) => setRegisterData(
                                                    (prev) => ({
                                                        ...prev,
                                                        password_confirmation: e.target.value
                                                    }))}
                                            />
                                            <label htmlFor="password-confirm">Confirm Password</label>
                                        </div>
                                        <p>Already have an account?<br/>
                                            <a style={{cursor: 'pointer'}}
                                               href="#"
                                               onClick={e => {
                                                   e.preventDefault()
                                                   setShowLogin(true);
                                               }}
                                            >
                                                Click Here To Login</a>
                                        </p>
                                    </section>

                                </div>
                                <div className="button_wrap my_row mt-5">
                                    <a
                                        className="button blue"
                                        href="#"
                                        onClick={(e) => handleSubmit(e)}
                                    >
                                        Submit
                                    </a>
                                </div>
                            </form>
                            {showLoader.show &&
                                <Loader
                                    showLoader={showLoader}
                                />
                            }
                        </div>
                    </div>
                </div>

                {showLogin &&
                    <LoginModal
                        setShowLogin={setShowLogin}
                    />
                }
            </div>
        </GuestLayout>
    );
};

export default CourseRegister;
