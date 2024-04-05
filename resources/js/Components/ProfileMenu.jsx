import React, {useEffect, useState} from 'react';
import {Link, usePage} from '@inertiajs/react';
import {isEmpty} from 'lodash';

const ProfileMenu = () => {

    const { auth } = usePage().props;

    const userRoles = auth.user.roles;

    const [currentDateTime, setCurrentDateTime] = useState("");
    const [subEnd, setSubEnd]   = useState("");

    useEffect(() => {
        const today = new Date();
        setCurrentDateTime(today.setHours(0,0,0));
    }, []);

    useEffect(() => {
        if(auth.user.subscription) {
            const date = new Date(auth.user.subscription.ends_at);
            setSubEnd(date.setHours(23, 59, 59))
        }

    }, [])

    return (
        <div className="nav_links_wrap">
            {/*Right Side Of Navbar*/}
            <ul className="ml-auto">
                {!isEmpty(userRoles) ?
                     ( (userRoles.includes('admin') || userRoles.includes('lp.user')) && !auth.user.subscription ) ||
                    (auth.user.subscription.name && auth.user.subscription.name !== "premier" && !auth.user.subscription.ends_at) ||
                    (auth.user.subscription.ends_at && subEnd < currentDateTime)  ?
                    <li className="upgrade_link">
                        <Link className="button blue" href={route('plans.get')}>Upgrade</Link>
                    </li>
                    :
                    ""
                    :
                    ""
                }
                <li className="nav-item">
                    {!isEmpty(userRoles) ?
                        <Link className="nav-link" href={ route('user.edit') } role="button">
                            <img id="user_image" src={
                                auth.user.userInfo?.avatar.includes('default') ?
                                    Vapor.asset('images/profile-placeholder-img.png') : auth.user.userInfo?.avatar }
                                 alt="User Profile" />
                            <span id="username">{auth.user.userInfo?.username}</span>
                        </Link>
                        :
                        <>
                            <img id="user_image" src={Vapor.asset('images/profile-placeholder-img.png') } alt="User Profile" />
                            <span id="username">{auth.user.userInfo?.username}</span>
                        </>
                    }
                </li>
            </ul>
        </div>
    );
};

export default ProfileMenu;
