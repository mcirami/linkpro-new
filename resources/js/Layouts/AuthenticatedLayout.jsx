import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import ProfileMenu from '@/Components/ProfileMenu.jsx';
import Menu from '@/Menu/Menu.jsx';

export default function Authenticated({ children }) {

    return (
        <div className="my_row member">
            <Menu />
            <header className="my_row nav_row">
                <nav>
                    <div className="container">
                        <div className="content_wrap">
                            <div className="left_column">
                                <Link className="logo" href={ route('dashboard')}>
                                    <h1>
                                        <ApplicationLogo />
                                    </h1>
                                </Link>
                            </div>
                            <div className="right_column">
                                <ProfileMenu />
                            </div>

                        </div>
                    </div>
                </nav>
            </header>

            <main>{children}</main>
        </div>
    );
}
