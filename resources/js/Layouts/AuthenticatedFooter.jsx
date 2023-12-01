import React from 'react';
import {Link} from '@inertiajs/react';

const AuthenticatedFooter = () => {
    return (
        <footer>
            <ul>
                <li><Link className="text-sm" href={route('contact')}>Contact Us</Link></li>
                <li><Link className="text-sm" href={route('user.edit')}>Settings</Link></li>
                <li><Link className="text-sm" href={route('how-it-works')}>How It Works</Link></li>
                <li><Link className="text-sm" href={route('setup.page')}>Setup</Link></li>
            </ul>

            <p><small><a href={route('terms')}>Terms And Conditions</a> | <a href={route('privacy')}>Privacy Policy</a></small></p>
            <small>&copy; Copyright LinkPro LLC | All Rights Reserved </small>
        </footer>
    );
};

export default AuthenticatedFooter;
