import React, {useRef} from 'react';
import {useForm} from '@inertiajs/react';
import EventBus from '@/Utils/Bus.jsx';
import { CardHeader } from "@mui/material";
import StandardButton from "@/Components/StandardButton.jsx";

const UserForm = ({
                      userInfo,
                      setUserInfo,
                      subscription
}) => {

    const { data, setData, put, processing, errors, clearErrors, reset, setDefaults } = useForm({
        email: null,
        password: null,
        password_confirmation: null
    });

    const passwordInput = useRef();
    const confirmPasswordInput = useRef();

    const handleSubmit = () => {
        clearErrors()

        put('/update-account/', {
            preserveScroll: true,
            onSuccess: () => {
                reset();

                let message = "";
                if (data.email && data.email !== userInfo.email && data.password) {

                    message = "Your email and password have been updated";

                    setUserInfo({
                        ...userInfo,
                        email: data.email
                    })
                } else if (data.email && data.email !== userInfo.email) {
                    setUserInfo({
                        ...userInfo,
                        email: data.email
                    })

                    message = "Your email has been updated";
                } else {
                    message = "Your password has been updated";
                }

                EventBus.dispatch("success", { message: message });
                passwordInput.current.value = null;
                confirmPasswordInput.current.value = null;

            }
        })
    }

    const handleFocus = (e) => {
        e.target.classList.add('active')
    }

    return (
        <div className="rounded-2xl bg-white shadow-md p-5">
            {errors.length > 0 && console.log(errors)}
            <CardHeader className="text-left !pl-0 mb-5" title="Account Info" />
            <form method="POST" onSubmit={handleSubmit} action={`/update-account/${userInfo.id}`}>
                <div className="form_inputs">
                    <div className="user_account mb-5 my_row">
                        <h5 className="my_row mb-5 text-left">Update Email</h5>
                        <div className="input_wrap my_row relative">
                            <input id="email"
                                   type="email"
                                   className={`w-full animate bg-white ${userInfo.email ? "active" : ""} ${errors.email ? "border-danger" : ""} `}
                                   name="email"
                                   defaultValue={ userInfo.email }
                                   autoComplete="email"
                                   onChange={(e) => setData('email', e.target.value)}
                            />
                            <label className="z-2" htmlFor="email">E-Mail Address</label>
                        </div>
                        {errors.email &&
                            <small className="text-red-600 mb-3 block">{errors.email }</small>
                        }
                    </div>
                    <div className="user_account w-full flex flex-col mb-5 gap-5">
                        <h5 className="my_row my_row text-left">Change Password</h5>
                        <div className="input_wrap my_row relative mb-2">
                            <input ref={passwordInput}
                                   id="password"
                                   type="password"
                                   className={`w-full animate bg-white ${data.password && "active"} ${errors.password && "border-danger"} `}
                                   name="password"
                                   autoComplete="new-password"
                                   defaultValue={ data.password }
                                   onChange={(e) => setData('password', e.target.value)}
                                   onFocus={handleFocus}
                            />
                            <label className="z-2" htmlFor="password">New Password</label>
                        </div>

                        <div className="input_wrap my_row relative">
                            <input ref={confirmPasswordInput}
                                   id="password_confirmation"
                                   type="password"
                                   className={`w-full animate bg-white ${data.password && "active"} ${errors.password_confirmation && "border-danger"} `}
                                   name="password_confirmation"
                                   autoComplete="new-password"
                                   defaultValue={ data.password_confirmation }
                                   onChange={(e) => setData('password_confirmation', e.target.value)}
                                   onFocus={handleFocus}
                            />
                            <label className="z-2" htmlFor="password_confirmation">Confirm New Password</label>
                        </div>
                    </div>
                    {errors.password &&
                        <small className="text-red-600 mb-3 block">{errors.password}</small>
                    }
                </div>
                <div className="form_buttons !mb-0">
                    <StandardButton
                        text="Update My Info"
                        classes={`w-full text-white shadow-md bg-indigo-600 hover:bg-indigo-700
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60
                                ${!subscription ? "!w-full !max-w-full" : ""} `}
                        onClick={handleSubmit}
                        disabled={processing}
                    />
                </div>
            </form>
        </div>
    );
};

export default UserForm;
