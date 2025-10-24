import React, {useState} from 'react';
import { ToolTipContextProvider } from '@/Utils/ToolTips/ToolTipContext';
import TableComponent from './Components/TableComponent';
import {FaPlus} from 'react-icons/fa';
import ToolTipIcon from '@/Utils/ToolTips/ToolTipIcon';
import IOSSwitch from '@/Utils/IOSSwitch';
import {activatePage} from '@/Services/LandingPageRequests';
import Preview from './Components/Preview';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {Head, Link} from '@inertiajs/react';
import { RiEdit2Fill } from "react-icons/ri";

function CreatorCenter({offers, landingPage}) {

    const [infoText, setInfoText] = useState({section:'', text:[]});
    const [infoTextOpen, setInfoTextOpen] = useState(false)
    const [infoLocation, setInfoLocation] = useState({})
    const [infoClicked, setInfoClicked] = useState(null);
    const [triangleRef, setTriangleRef] = useState(null);

    const [lpActive, setLpActive] = useState(landingPage ? Boolean(landingPage['active']) : Boolean(0));

    const handleChange = () => {

        activatePage(landingPage["id"])
        .then((response) => {
            if (response.success) {
                setLpActive(!lpActive);
            }
        });
    }

    return (
        <AuthenticatedLayout>

            <Head title="Creator Center" />

            <div className="container">
                <div className="px-6 pt-6">
                    <div className="flex items-center">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Creator Center</h1>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Your hub for all your course landing pages. Change status, make public, or navigate to edit or add a new.</p>
                    <div className="mt-3 border-b border-gray-100"></div>
                </div>
                <section id="creator_center" className="card edit_page">
                    <ToolTipContextProvider value={{
                        infoText,
                        setInfoText,
                        infoTextOpen,
                        setInfoTextOpen,
                        infoLocation,
                        setInfoLocation,
                        infoClicked,
                        setInfoClicked,
                        setTriangleRef,
                        triangleRef
                    }}>
                        {offers?.length === 0 ?
                            <>
                                <h3>Become a LinkPro Course Creator to generate revenue from your social following and beyond!</h3>
                                <ul>
                                    <li>
                                        <span className="number">1</span>
                                        <div className="text_wrap">
                                            <h4>Add A Course</h4>
                                            <p>Create and upload your proprietary Course videos and charge for customers to access your content.</p>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="number">2</span>
                                        <div className="text_wrap">
                                            <h4>Create A Landing Page</h4>
                                            <p>A Landing Page is your exclusive page and link you build to help market the Courses you create.</p>
                                        </div>
                                    </li>
                                    <li>
                                        <span className="number">3</span>
                                        <div className="text_wrap">
                                            <h4>Promote your Course link and get paid!</h4>
                                            <p>Publish and market your Course to generate income. Recruit others to sell your Course to earn shared profits!</p>
                                        </div>
                                    </li>
                                </ul>
                                <a className="button blue" href="/creator-center/add-course">
                                    Get Started!
                                </a>
                            </>
                            :
                            <div className="grid_columns">
                                <div className="column">
                                    <div className="column_title w-full !pt-5 border-b border-gray-100">
                                        <h3>
                                            <span>Global Course Page</span>
                                            <ToolTipIcon section="creator_lp" />
                                        </h3>
                                    </div>
                                    <div className="content_wrap flex-wrap shadow-md w-full p-5 rounded-xl flex relative">
                                        <div className="buttons_wrap w-full flex justify-between gap-2 items-center mb-5">
                                            <h3 className="!p-0 font-medium text-gray-900 truncate">{landingPage['title']}</h3>
                                            <div className="button_wrap !mb-0">
                                                <Link className="flex items-center gap-2 text-sm text-indigo-600"
                                                      href={landingPage ? `/creator-center/landing-page/${landingPage["id"]}` : '/creator-center/add-landing-page'}>
                                                    <RiEdit2Fill className="h-4 w-4" />{landingPage ? "" : "Create"}
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            {landingPage ?
                                                <Preview
                                                    landingPage={landingPage}
                                                />
                                                :
                                                <div className="image_wrap">
                                                    <img src={Vapor.asset('images/blank-lp.png')} alt=""/>
                                                </div>
                                        }
                                            <div className="switch_wrap flex items-center justify-center gap-2">
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <p>Active</p>
                                                </div>
                                                <IOSSwitch
                                                    onChange={handleChange}
                                                    disabled={landingPage && landingPage['published'] ? Boolean(0) : Boolean(1)}
                                                    checked={lpActive}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="column">
                                    <div className="column_title flex justify-between items-baseline border-b border-gray-100">
                                        <h3 className="!mt-auto">
                                            Courses
                                            <ToolTipIcon section="creator_course" />
                                        </h3>
                                        <Link className="
                                                transform-none flex items-start group rounded-xl bg-white p-2 md:p-4 text-left shadow-md
                                                 transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none
                                                 focus-visible:ring-2 focus-visible:ring-[#424fcf]/30
                                        " href={route('add.course')}>
                                            <div className="flex-col items-start gap-3">
                                                <div className="text-base font-semibold flex items-center gap-2 text-gray-900">
                                                    <div className="w-7 h-7 md:h-9 md:w-9 rounded-lg grid place-items-center bg-[#424fcf]/10">
                                                        {/* link icon */}
                                                        <FaPlus className="h-3 w-3 md:h-4 md:w-4 text-[#424fcf]" aria-hidden="true" />
                                                    </div>
                                                    <h3 className="uppercase !text-xs !md:text-sm">New Course</h3>
                                                </div>
                                            </div>

                                        </Link>
                                    </div>
                                    {/* Legend */}
                                    <section className="mb-10 rounded-2xl bg-white/60 p-4 shadow-md">
                                        {/*<div className="mb-4 text-sm font-medium text-gray-700">Legend</div>*/}

                                        <dl className="grid gap-4 sm:grid-cols-2">
                                            {/* PRP */}
                                            <div className="flex items-start gap-3">
                                                <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-indigo-50 px-2 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
                                                    PRP
                                                </span>
                                                <div className="min-w-0">
                                                    <dt className="text-sm font-medium text-gray-900">Personal Referral Payout</dt>
                                                    <dd className="text-sm text-gray-600">
                                                        Your payout will be <span className="font-semibold">80%</span> of the price you set when you
                                                        personally refer someone to your course.
                                                    </dd>
                                                </div>
                                            </div>

                                            {/* ARP */}
                                            <div className="flex items-start gap-3">
      <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-indigo-50 px-2 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
        ARP
      </span>
                                                <div className="min-w-0">
                                                    <dt className="text-sm font-medium text-gray-900">Affiliate Referral Payout</dt>
                                                    <dd className="text-sm text-gray-600">
                                                        Your payout will be <span className="font-semibold">40%</span> of the price you set when someone
                                                        adds your course to their LinkPro page.
                                                    </dd>
                                                </div>
                                            </div>

                                            {/* Active */}
                                            <div className="flex items-start gap-3">
                                                <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-green-50 px-2 text-xs font-semibold text-green-700 ring-1 ring-green-200">
                                                    Active
                                                </span>
                                                <div className="min-w-0">
                                                    <dt className="text-sm font-medium text-gray-900">Course Activation</dt>
                                                    <dd className="text-sm text-gray-600">
                                                        Activate your course to make it available to be promoted on all LinkPro pages.
                                                    </dd>
                                                    <dd className="text-sm text-gray-600">
                                                        <small>(Course must be Published before activating.)</small>
                                                    </dd>
                                                </div>
                                            </div>

                                            {/* Public */}
                                            <div className="flex items-start gap-3">
                                                  <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-blue-50 px-2 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                                                    Public
                                                  </span>
                                                <div className="min-w-0">
                                                    <dt className="text-sm font-medium text-gray-900">Visibility</dt>
                                                    <dd className="text-sm text-gray-600">
                                                        Making a course public lets any LinkPro user add the course icon to their page and sell it as an affiliate.
                                                    </dd>
                                                    <dd className="text-sm text-gray-600">
                                                        <small>(Course must be Published before being made public.)</small>
                                                    </dd>
                                                </div>
                                            </div>
                                        </dl>
                                    </section>
                                    <div className="content_wrap">
                                        <TableComponent offers={offers}/>
                                    </div>
                                </div>
                            </div>
                        }

                    </ToolTipContextProvider>
                </section>
            </div>
        </AuthenticatedLayout>
    )
}

export default CreatorCenter;
