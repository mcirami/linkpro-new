import React from 'react';
import {Link, usePage} from '@inertiajs/react';
import {isEmpty} from 'lodash';

const ProfileMenu = () => {

    const { auth } = usePage().props;

    const userRoles = auth.user.roles;

    return (
        <div className="nav_links_wrap">
            {/*Right Side Of Navbar*/}
            <ul className="ml-auto">
                {!isEmpty(userRoles) ?
                 (userRoles.includes('admin') || userRoles.includes('lp.user')) &&
                    isEmpty(auth.user.subscription) ||
                    (auth.user.subscription.name !== "premier" && !auth.user.subscription.ends_at) ||
                    (auth.user.subscription.ends_at && auth.user.subscription.ends_at < Date(Date.now())) ?
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
