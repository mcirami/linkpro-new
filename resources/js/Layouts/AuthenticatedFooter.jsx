import React from 'react';
import {Link} from '@inertiajs/react';

const AuthenticatedFooter = () => {
    return (
        <footer className="mt-10 flex flex-col justify-center gap-3 border-t border-slate-200 p-6 text-[0.75rem] text-slate-500 md:flex-row items-center md:justify-between">
            <p className="md:ml-20">© {new Date().getFullYear()} LinkPro. All rights reserved.</p>

            <div className="flex flex-wrap gap-4">
                <Link href={route("contact")} className="hover:text-slate-800">
                    Contact Us
                </Link>
                <Link href={route("user.edit")} className="hover:text-slate-800">
                    Settings
                </Link>
               {/* <Link href={route("how-it-works")} className="hover:text-slate-800">
                    How It Works
                </Link>*/}
                {/*<Link href={route("setup.page")} className="hover:text-slate-800">
                    Setup
                </Link>*/}
            </div>
            <div>
                <p><small><Link href={route('terms')}>Terms And Conditions</Link> | <Link href={route('privacy')}>Privacy Policy</Link></small></p>
            </div>
        </footer>
    );
};

export default AuthenticatedFooter;
