import React, {useState} from 'react';
import {useForm} from '@inertiajs/react';
import {isEmpty} from 'lodash';
import {updateUserInfo} from '@/Services/UserService.jsx';

const UserForm = ({userInfo}) => {

    const [userEmail, setUserEmail] = useState(userInfo.email)

    const { data, setData, put, processing, errors, reset } = useForm({
        email: null,
        password: null,
        password_confirmation: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const packets = {
            email: data.email,
            password: data.password,
            password_confirmation: data.password_confirmation
        }
        updateUserInfo(packets, userInfo.id)
        .then((data) => {
            if (data.success) {

                reset('password', 'password_confirmation')
                setUserEmail(data.email)
            }
        })
    }

    const handleFocus = (e) => {
        e.target.classList.add('active')
    }

    return (
        <>
            {!isEmpty(errors) && console.log(errors)}
            <h2 className="text-uppercase">Account Info</h2>
            <form method="POST" onSubmit={handleSubmit} action={`/update-account/${userInfo.id}`}>
                <div className="form_inputs">
                    <div className="user_account mb-5 my_row">
                        <h5 className="my_row mb-4 text-left">Update Email</h5>
                        <div className="input_wrap my_row relative">
                            <input id="email"
                                   type="email"
                                   className={`w-full animate bg-white ${userEmail ? "active" : ""} ${errors.email ? "border-danger" : ""} `}
                                   name="email"
                                   defaultValue={ userEmail }
                                   autoComplete="email"
                                   onChange={(e) => setData('email', e.target.value)}
                            />
                            <label className="z-2" htmlFor="email">E-Mail Address</label>
                        </div>
                        {errors.email &&
                            <small className="text-red-600 mb-3 block">{errors.email }</small>
                        }
                    </div>
                    <div className="user_account">
                        <h5 className="my_row my_row mb-4 text-left">Change Password</h5>
                        <div className="input_wrap my_row relative mb-2">
                            <input id="password"
                                   type="password"
                                   className={`w-full animate bg-white ${data.password && "active"} ${errors.password && "border-danger"} `}
                                   name="password"
                                   autoComplete="new-password"
                                   onChange={(e) => setData('password', e.target.value)}
                                   onFocus={handleFocus}
                            />
                            <label className="z-2" htmlFor="password">New Password</label>
                        </div>
                    </div>
                    <div className="input_wrap my_row relative">
                        <input id="password_confirmation"
                               type="password"
                               className={`w-full animate bg-white ${data.password && "active"} ${errors.password_confirmation && "border-danger"} `}
                               name="password_confirmation"
                               autoComplete="new-password"
                               onChange={(e) => setData('password_confirmation', e.target.value)}
                               onFocus={handleFocus}
                        />
                        <label className="z-2" htmlFor="password_confirmation">Confirm New Password</label>
                    </div>
                    {errors.password &&
                        <small className="text-red-600 mb-3 block">{errors.password}</small>
                    }
                </div>
                <div className="form_buttons">
                    <button disabled={processing} type="submit" className="button blue text-uppercase">
                        Update My Info
                    </button>
                </div>
            </form>
        </>
    );
};

export default UserForm;
