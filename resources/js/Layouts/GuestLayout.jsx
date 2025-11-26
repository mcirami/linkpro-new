import { Link } from '@inertiajs/react';
import GuestFooter from '@/Layouts/GuestFooter.jsx';
import InputAnimations from '@/Utils/InputAnimations.jsx';
import {useEffect, useState} from 'react';
export default function Guest({ children = null, ...props }) {

    const {course} = props;

    const loginUrl = course ? "/" + course.slug : "";

    const [linkClasses, setLinkClasses] = useState("");

    useEffect(() => {

        if(window.innerWidth < 550) {
            setLinkClasses("");
        } else {
            setLinkClasses("button blue");
        }

    },[])

    useEffect(() => {

        function setMobileClasses() {

            if(window.innerWidth < 550) {
                setLinkClasses("");
            } else {
                setLinkClasses("button blue");
            }
        }

        window.addEventListener('resize', setMobileClasses);

        return () => {
            window.removeEventListener('resize', setMobileClasses);
        }

    }, []);

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleClick = (e, targetId) => {
        e.preventDefault();

        const el = document.getElementById(targetId);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            window.location.href = route('home') + "/#" + targetId;
        }

        // Always close mobile menu after click
        setMobileOpen(false);
    };


    return (
        <div className="relative min-h-screen bg-white text-slate-900 selection:bg-blue-500 selection:text-white">
            <InputAnimations />
            {/* subtle page background */}
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(79,70,229,0.06),_transparent_55%)] opacity-80"
                aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-0 bg-[url('/images/dots-light.svg')] mix-blend-soft-light opacity-40" aria-hidden="true" />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10">
                {/* Nav */}
                <header className="mb-8 flex items-center justify-between sm:mb-12">
                    {/* Logo */}
                    <a href={route("home")} className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl shadow-md shadow-blue-500/30">
                            <img
                                src={Vapor.asset("images/preview-device-bg.png")}
                                alt="LinkPro Logo"
                                className="w-5"
                            />
                        </div>
                        <div className="leading-tight">
                            <div className="text-xl font-semibold tracking-[0.18em] text-slate-600">
                                Link<span className="text-black font-semibold">Pro</span>
                            </div>
                            <p className="text-[0.9rem] text-slate-500">Link-in-bio for serious creators</p>
                        </div>
                    </a>

                    {/* Desktop nav */}
                    <nav className="hidden items-center gap-6 text-sm text-slate-600 lg:flex">
                        <a
                            href="#"
                            className="transition hover:text-slate-900"
                            onClick={(e) => handleClick(e, "how-it-works")}
                        >
                            How It Works
                        </a>
                        <a
                            href="#"
                            className="transition hover:text-slate-900"
                            onClick={(e) => handleClick(e, "features")}
                        >
                            Features
                        </a>
                        <a
                            href="#"
                            className="transition hover:text-slate-900"
                            onClick={(e) => handleClick(e, "revenue")}
                        >
                            Revenue tools
                        </a>
                        <Link
                            href={loginUrl + "/login"}
                            className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium tracking-wide text-slate-800 transition hover:border-blue-400 hover:bg-blue-50"
                        >
                            Log in
                        </Link>
                        <Link
                            href={route("register")}
                            className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium tracking-wide text-slate-800 transition hover:border-blue-400 hover:bg-blue-50"
                        >
                            Sign Up
                        </Link>
                    </nav>

                    {/* Mobile toggle */}
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full !border !border-indigo-500 p-2 !text-indigo-500 lg:hidden"
                        onClick={() => setMobileOpen((prev) => !prev)}
                        aria-label="Toggle navigation"
                    >
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                        >
                            {mobileOpen ? (
                                // X icon
                                <path d="M18 6L6 18M6 6l12 12" />
                            ) : (
                                // Hamburger
                                <>
                                    <path d="M4 7h16" />
                                    <path d="M4 12h16" />
                                    <path d="M4 17h16" />
                                </>
                            )}
                        </svg>
                    </button>
                </header>
                {/* Mobile menu panel */}
                {mobileOpen && (
                    <div className="mb-6 mt-2 space-y-3 rounded-2xl !border !border-slate-200 bg-white p-4 text-sm !text-slate-700 shadow-md lg:hidden">
                        <button
                            className="block w-full !text-slate-700 text-left transition hover:!text-slate-900"
                            onClick={(e) => handleClick(e, "how-it-works")}
                        >
                            How It Works
                        </button>
                        <button
                            className="block w-full !text-slate-700 text-left transition hover:!text-slate-900"
                            onClick={(e) => handleClick(e, "features")}
                        >
                            Features
                        </button>
                        <button
                            className="block w-full !text-slate-700 text-left transition hover:!text-slate-900"
                            onClick={(e) => handleClick(e, "revenue")}
                        >
                            Revenue tools
                        </button>
                        <div className="mt-2 flex flex-col gap-2">
                            <Link
                                href={loginUrl + "/login"}
                                className="w-full rounded-full border border-slate-300 px-4 py-2 text-center text-xs font-medium text-slate-800 transition hover:border-blue-400 hover:bg-blue-50"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route("register")}
                                className="w-full rounded-full bg-slate-900 px-4 py-2 text-center text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                )}
                <main className="flex-1 space-y-24 pb-10">
                    {children || ""}
                </main>
                <GuestFooter />
            </div>
        </div>
    );
}
