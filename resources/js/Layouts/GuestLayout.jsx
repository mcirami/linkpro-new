import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import GuestFooter from '@/Layouts/GuestFooter.jsx';

export default function Guest({ children, ...props }) {

    const {course} = props;

    const loginUrl = course ? "/" + course.slug : "";

    return (
        <div className="guest min-h-screen flex flex-col items-center">
            <header className="guest_header w-full">
                <div className="column left">
                    <h1>
                        <Link href="/">
                            <ApplicationLogo />
                        </Link>
                    </h1>
                </div>
                <div className="column right">
                    <Link href={loginUrl + "/login"}>Log In</Link>
                    <Link href={route('contact')}>Contact Us</Link>
                    <Link className="button transparent" href={route('register')}>Sign Up</Link>
                </div>
            </header>
            <main className="w-full">
                {children}
            </main>
            <GuestFooter />
        </div>
    );
}
