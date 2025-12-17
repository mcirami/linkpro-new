import { Link, Head, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import {useEffect} from "react";

export default function Welcome({ auth }) {
    const { url } = usePage();

    useEffect(() => {
        if (url.includes("#")) {
            const hash = url.split("#")[1];
            const el = document.getElementById(hash);
            if (el) {
                // Delay is required so Inertia finishes page swap
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                    });
                });
            }
        }
    }, [url]);

    return (
        <GuestLayout>
            <Head title="Home" />
           <>
               {/* Hero */}
               <section
                   className="grid items-center gap-10 rounded-3xl bg-white/80 px-5 md:py-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] sm:px-8 sm:py-10"
                   aria-labelledby="hero-heading"
               >
                   {/* Text */}
                   <div className="space-y-6">
                       <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-sky-700">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[0.6rem] font-bold text-white">
                                ●
                            </span>
                           Unite your audience in one powerful link
                       </div>

                       <h1
                           id="hero-heading"
                           className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl sm:leading-tight lg:text-5xl"
                       >
                           Turn your bio link into a
                           <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-400 bg-clip-text text-transparent">
                                {" "}revenue engine.
                            </span>
                       </h1>

                       <p className="max-w-xl text-balance text-sm leading-relaxed text-slate-600 sm:text-base">
                           Connect every social profile, funnel traffic where you need it most, and track what’s actually driving clicks.
                           LinkPro gives creators and brands a single place to send everyone—and clear data to grow what works.
                       </p>

                       <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                           <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                               <Link
                                   href={route("register")}
                                   className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                               >
                                   Sign up free
                               </Link>
                              {/* <button
                                   type="button"
                                   className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-2.5 text-xs font-medium text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                                   onClick={() => {
                                       const el = document.getElementById("how-it-works");
                                       if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                                   }}
                               >
                                   Watch it in action
                               </button>*/}
                           </div>
                           <p className="text-xs text-slate-500">
                               <span className="font-semibold text-slate-800">Already on LinkPro?</span>{" "}
                               <Link href={route("login")} className="font-medium text-sky-600 hover:text-sky-500">
                                   Log in
                               </Link>
                           </p>
                       </div>

                       <dl className="mt-2 grid max-w-md grid-cols-3 gap-4 text-[0.7rem] text-slate-600 sm:text-xs">
                           <div>
                               <dt className="font-semibold text-slate-900">All your links</dt>
                               <dd className="text-slate-500">Socials, funnels, offers & more in one place.</dd>
                           </div>
                           <div>
                               <dt className="font-semibold text-slate-900">Real-time analytics</dt>
                               <dd className="text-slate-500">See what content actually drives clicks.</dd>
                           </div>
                           <div>
                               <dt className="font-semibold text-slate-900">Built to convert</dt>
                               <dd className="text-slate-500">Optimized layouts for higher CTR.</dd>
                           </div>
                       </dl>
                   </div>

                   {/* Hero video card */}
                   <div className="relative">
                       <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-sky-200 via-indigo-100 to-transparent blur-3xl" aria-hidden="true" />

                       <div className="relative rounded-[2rem] border border-slate-200 bg-slate-50 p-2 shadow-xl">
                           <div className="rounded-[1.4rem] border border-slate-200 bg-white px-3 pt-3 pb-2">
                               {/* window chrome */}
                               <div className="mb-3 flex items-center justify-between text-[0.6rem] text-slate-400">
                                   <div className="flex gap-1.5">
                                       <span className="h-2 w-2 rounded-full bg-rose-400" />
                                       <span className="h-2 w-2 rounded-full bg-amber-400" />
                                       <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                   </div>
                                   <span className="truncate rounded-full bg-slate-50 px-2 py-0.5 text-[0.62rem] text-slate-500">
                                                link.pro/yourname
                                            </span>
                               </div>

                               {/* Desktop video */}
                               <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-slate-950/90 shadow-inner md:block">
                                   <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                                       <source src={Vapor.asset("videos/home-image-loop-top-2.mp4")} type="video/mp4" />
                                       <source src={Vapor.asset("videos/home-image-loop-top-2.webm")} type="video/webm" />
                                   </video>
                               </div>

                               {/* Mobile video */}
                               <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950/90 shadow-inner md:hidden">
                                   <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                                       <source src={Vapor.asset("videos/home-image-loop-top-2.mp4")} type="video/mp4" />
                                       <source src={Vapor.asset("videos/home-image-loop-top-2.webm")} type="video/webm" />
                                   </video>
                               </div>
                           </div>
                       </div>

                       {/* floating stat cards */}
                       <div className="pointer-events-none absolute -bottom-4 left-3 hidden w-40 rounded-2xl border border-emerald-200 bg-white/95 p-3 text-[0.65rem] text-emerald-700 shadow-lg md:block">
                           <p className="text-[0.6rem] uppercase tracking-[0.16em] text-emerald-500/90">Last 7 days</p>
                           <p className="mt-1 text-lg font-semibold text-emerald-700">+184% clicks</p>
                           <p className="text-[0.65rem] text-emerald-500/90">after switching to LinkPro</p>
                       </div>

                       <div className="pointer-events-none absolute -top-4 right-0 hidden w-36 rounded-2xl border border-sky-200 bg-white/95 p-3 text-[0.65rem] text-sky-700 shadow-lg sm:right-4 md:block">
                           <p className="text-[0.6rem] uppercase tracking-[0.16em] text-sky-500/90">Live clicks</p>
                           <p className="mt-1 flex items-baseline gap-1 text-lg font-semibold">
                               1,284
                               <span className="text-[0.6rem] font-medium text-slate-400">today</span>
                           </p>
                       </div>
                   </div>
               </section>

               {/* How it works with social media video */}
               <section
                   id="how-it-works"
                   className="grid items-center gap-10 rounded-3xl bg-sky-50/80 px-5 py-10 ring-1 ring-sky-100 sm:px-8 lg:grid-cols-2"
               >
                   <div className="relative order-2 lg:order-1">
                       <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-sky-200/70 via-sky-100 to-transparent blur-3xl" aria-hidden="true" />

                       <div className="relative overflow-hidden rounded-[1.75rem] border border-sky-100 bg-white p-2 shadow-xl">
                           <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950/90">
                               <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                                   <source src={Vapor.asset("videos/home-image-loop-bottom.mp4")} type="video/mp4" />
                                   <source src={Vapor.asset("videos/home-image-loop-bottom.webm")} type="video/webm" />
                               </video>
                           </div>
                       </div>
                   </div>

                   <div className="order-1 space-y-5 lg:order-2">
                       <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                           Link every platform. Send traffic exactly where you need it.
                       </h2>
                       <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                           Drop your LinkPro URL in your Instagram bio, TikTok profile, YouTube description—anywhere you show up online. Give
                           followers an instant way to discover your content, offers, and communities without getting lost in the scroll.
                       </p>

                       <ol className="space-y-3 text-sm text-slate-900">
                           <li className="flex gap-3">
                                        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
                                            1
                                        </span>
                               <div>
                                   <p className="font-semibold">Create your LinkPro page in minutes</p>
                                   <p className="text-xs text-slate-500">Add your profile, branding, buttons, and featured content.</p>
                               </div>
                           </li>
                           <li className="flex gap-3">
                                        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
                                            2
                                        </span>
                               <div>
                                   <p className="font-semibold">Drop one link everywhere</p>
                                   <p className="text-xs text-slate-500">Use the same URL across all your social platforms.</p>
                               </div>
                           </li>
                           <li className="flex gap-3">
                                        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
                                            3
                                        </span>
                               <div>
                                   <p className="font-semibold">Watch your clicks and revenue grow</p>
                                   <p className="text-xs text-slate-500">Measure performance and optimize where you send traffic.</p>
                               </div>
                           </li>
                       </ol>
                   </div>
               </section>

               {/* Features grid (laptop/phone/bottom content re-imagined) */}
               <section id="features" className="space-y-8">
                   <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                       <div>
                           <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                               Built for creators who mean business.
                           </h2>
                           <p className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-base">
                               LinkPro is more than a pretty landing page. It’s a conversion-focused hub for your brand, your offers, and your
                               revenue.
                           </p>
                       </div>
                       <p className="text-xs text-slate-500">No coding. No design degree. Just plug in your content and go live.</p>
                   </div>

                   <div className="grid gap-6 md:grid-cols-3">
                       {/* Get Down To Business */}
                       <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                           <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
                               <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                                   <path
                                       d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
                                       className="fill-sky-400"
                                   />
                                   <path
                                       d="M6.75 8.25h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1 0-1.5Zm0 3h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1 0-1.5Z"
                                       className="fill-white"
                                   />
                               </svg>
                           </div>
                           <h3 className="text-sm font-semibold text-slate-900">Get down to business</h3>
                           <p className="mt-2 text-xs leading-relaxed text-slate-600">
                               LinkPro is built to grow your bottom line. Highlight launches, offers, and partners in layouts tuned for clicks and
                               conversions.
                           </p>
                           <div className="mt-4 flex-1 rounded-xl bg-gradient-to-tr from-sky-50 via-slate-50 to-slate-100 p-3">
                               <img
                                   src={Vapor.asset("images/laptop-image.png")}
                                   alt="LinkPro analytics on a laptop"
                                   className="mx-auto max-h-40 w-auto object-contain"
                               />
                           </div>
                       </article>

                       {/* Self-Managed Platform */}
                       <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                           <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                               <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                                   <path
                                       d="M5 5.75A1.75 1.75 0 0 1 6.75 4h10.5A1.75 1.75 0 0 1 19 5.75v12.5a.75.75 0 0 1-1.28.53L14 15.06l-3.72 3.72A.75.75 0 0 1 9 18.25V5.75A1.75 1.75 0 0 0 7.25 4H6.75A1.75 1.75 0 0 0 5 5.75v0Z"
                                       className="fill-emerald-500"
                                   />
                               </svg>
                           </div>
                           <h3 className="text-sm font-semibold text-slate-900">Self-managed platform</h3>
                           <p className="mt-2 text-xs leading-relaxed text-slate-600">
                               Customize your LinkPro page with your own branding, profile, backgrounds, and link buttons—and update it anytime in
                               seconds.
                           </p>
                           <div className="mt-4 flex-1 rounded-xl bg-gradient-to-tr from-emerald-50 via-slate-50 to-slate-100 p-3">
                               <img
                                   src={Vapor.asset("images/img-phone.png")}
                                   alt="LinkPro mobile preview"
                                   className="mx-auto max-h-40 w-auto object-contain"
                               />
                           </div>
                       </article>

                       {/* Cross Promote */}
                       <article
                           id="revenue"
                           className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                       >
                           <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-500">
                               <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                                   <path
                                       d="M4.75 6.5A1.75 1.75 0 0 1 6.5 4.75h3A1.75 1.75 0 0 1 11.25 6.5v11a.75.75 0 0 1-1.28.53l-1.97-1.97a.25.25 0 0 0-.35 0l-1.97 1.97A.75.75 0 0 1 4.75 17.5v-11Z"
                                       className="fill-fuchsia-400"
                                   />
                                   <path
                                       d="M12.75 6.5A1.75 1.75 0 0 1 14.5 4.75h3A1.75 1.75 0 0 1 19.25 6.5v11a.75.75 0 0 1-1.28.53l-1.97-1.97a.25.25 0 0 0-.35 0l-1.97 1.97a.75.75 0 0 1-1.28-.53v-11Z"
                                       className="fill-fuchsia-500"
                                   />
                               </svg>
                           </div>
                           <h3 className="text-sm font-semibold text-slate-900">Cross promote & increase revenue</h3>
                           <p className="mt-2 text-xs leading-relaxed text-slate-600">
                               Work directly with LinkPro to promote partner products and services. Earn weekly payouts on all revenue generated
                               through your LinkPro page.
                           </p>
                           <div className="mt-4 flex-1 rounded-xl bg-gradient-to-tr from-fuchsia-50 via-slate-50 to-slate-100 p-3">
                               <img
                                   src={Vapor.asset("images/bottom-image.png")}
                                   alt="Cross-promotion visuals"
                                   className="mx-auto max-h-40 w-auto object-contain"
                               />
                           </div>
                       </article>
                   </div>
               </section>

               {/* Final CTA */}
               <section className="mt-4 rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-500 to-slate-900 px-6 py-8 text-white shadow-[0_18px_60px_rgba(15,23,42,0.35)] sm:px-10 sm:py-10">
                   <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
                       <div className="space-y-3">
                           <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ready to make every click count?</h2>
                           <p className="text-sm text-slate-100/95 sm:text-base">
                               Create your free LinkPro account, plug in your platforms, and start turning traffic into trackable, scalable revenue—in
                               under 10 minutes.
                           </p>
                           <div className="mt-4 flex flex-wrap items-center gap-4">
                               <Link
                                   href={route("register")}
                                   className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-3 text-sm font-semibold text-sky-600 shadow-lg shadow-slate-900/60 transition hover:bg-slate-50"
                               >
                                   Get started free
                               </Link>
                               <p className="text-xs text-slate-100/90">No credit card required. Upgrade only when you’re ready to scale.</p>
                           </div>
                       </div>
                       <div className="space-y-3 rounded-2xl bg-slate-950/40 p-4 ring-1 ring-slate-700/70">
                           <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">Perfect for</p>
                           <ul className="grid grid-cols-2 gap-2 text-[0.7rem] text-slate-50">
                               <li className="rounded-xl bg-slate-900/70 px-3 py-2">Creators & influencers</li>
                               <li className="rounded-xl bg-slate-900/70 px-3 py-2">Coaches & educators</li>
                               <li className="rounded-xl bg-slate-900/70 px-3 py-2">Ecommerce brands</li>
                               <li className="rounded-xl bg-slate-900/70 px-3 py-2">Agencies & marketers</li>
                           </ul>
                       </div>
                   </div>
               </section>
            </>
        </GuestLayout>
    );
}
