import React from 'react';
import {Link} from '@inertiajs/react';

const GuestFooter = () => {
    return (
        <footer className="mt-10 flex flex-col justify-center gap-3 border-t border-slate-200 pt-6 text-[0.75rem] text-slate-500 md:flex-row items-center md:justify-between">
            <p>© {new Date().getFullYear()} LinkPro. All rights reserved.</p>

            <div className="flex flex-wrap gap-4">
                <Link href={route("login")} className="hover:text-slate-800">
                    Log in
                </Link>
                <Link href={route("register")} className="hover:text-slate-800">
                    Sign up free
                </Link>
                <a href={route("contact")} className="hover:text-slate-800">
                    Contact Us
                </a>
                {/*<Link className="hover:text-slate-800" href={route('how-it-works')}>How It Works</Link>*/}
            </div>
            <div>
                <p><small><Link href={route('terms')}>Terms And Conditions</Link> | <Link href={route('privacy')}>Privacy Policy</Link></small></p>
            </div>
        </footer>
    );
};

export default GuestFooter;
