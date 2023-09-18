import React from 'react';

const GuestFooter = () => {
    return (
        <footer>
            <ul>
                <li><a className="text-sm" href={route('how-it-works')}>How It Works</a></li>
                <li><a className="text-sm" href={route('login')}>Login</a></li>
                <li><a className="text-sm" href={route('register')}>Sign Up</a></li>
                <li><a className="text-sm" href={route('contact')}>Contact Us</a></li>
            </ul>

            <p><small><a href={route('terms')}>Terms And Conditions</a> | <a href={route('privacy')}>Privacy Policy</a></small></p>
            <small>&copy; Copyright LinkPro LLC | All Rights Reserved </small>
        </footer>

    );
};

export default GuestFooter;
