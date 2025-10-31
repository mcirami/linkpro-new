import React, {useEffect, useState} from 'react';
import {cancelSubscription, changePlan} from '@/Services/SubscriptionRequests.jsx';
import {SubscriptionPaymentButtons} from '@/Components/Payments/SubscriptionPaymentButtons.jsx';
import {getUserPages} from '@/Services/UserService.jsx';

const ConfirmPlanChange = ({
                               showSection,
                               setShowSection,
                               subscription,
                               setSubscription,
                               setShowLoader,
                               pmType,
                               env
}) => {

    const [defaultPage, setDefaultPage] = useState("");
    const [showPaymentButtons, setShowPaymentButtons] = useState({
        show: false,
        type: "",
        plan: "",
        pmType: ""
    });
    const [pages, setPages] = useState({});

    useEffect(() => {
        getUserPages().then((response) => {
            if (response.success) {
                const pages = response.pages;
                setPages(pages);
                const page = pages.filter((page) => {
                    if(page.default) {
                        return page;
                    }
                })

                setDefaultPage(page[0].id);
            }
        })
    },[])

    const handleClick = (e) => {

        setShowLoader({
            show: true,
            position: 'absolute',
            icon: ""
        })

        if (showSection.includes("cancel")) {

            const packets = {
                subId: subscription.sub_id,
                pmType: pmType,
                defaultPage: defaultPage,
                plan: subscription.name
            }

            cancelSubscription(packets).then((response) => {
                if (response.success) {
                    setShowSection([])
                    setSubscription(prev => ({
                        ...prev,
                        status: "canceled",
                        ends_at: response.ends_at
                    }))
                }
            })
        } else if (pmType === "paypal" && showSection.includes("changePlan")) {
            setShowSection((prev) => ([
                ...prev,
                "changePayPalPlan"
            ]))
            setShowPaymentButtons({
                show: true,
                type: "changePlan",
                plan: "pro",
                pmType: pmType,
                page: 'user'
            })
        } else {

            const packets = {
                defaultPage: defaultPage,
                plan: "pro",
                subId: subscription.sub_id,
                pmType: pmType
            }

            changePlan(packets).then((response) => {
                if (response.success) {
                    setSubscription(prev => ({
                        ...prev,
                        name: "pro",
                    }))
                    setShowSection([])
                }
            })
        }

        setShowLoader({
            show: false,
            position: "",
            icon: ""
        })
    }

    return (
        <>
            { showPaymentButtons.show ?
                <SubscriptionPaymentButtons
                    showPaymentButtons={showPaymentButtons}
                    setShowPaymentButtons={setShowPaymentButtons}
                    env={env}
                    subId={subscription.sub_id}
                    defaultPage={defaultPage}
                />
            :
                <div id="confirm_change_plan_details" className={`rounded-2xl bg-white shadow-md pt-10`}>
                    <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-50 text-green-700 ring-1 ring-green-200">
                            {/* success/check icon */}
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="!text-left !text-2xl font-semibold text-gray-900">Confirm Downgrade</h2>
                            <p className="!text-lg text-gray-500">
                                Review what changes when moving to the
                                {showSection.includes("changePlan") ?
                                    <span className="font-medium"> Pro </span>
                                    :
                                    <span className="font-medium"> Free </span>
                                }
                                 plan.
                            </p>
                        </div>
                    </div>

                    <div className="px-6 py-6">
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 mb-5">
                            <p className="text-sm leading-7">
                                By downgrading your plan to
                                {showSection.includes("changePlan") ?

                                    <span>Pro you will be limited to <span className="font-semibold">1 unique link.</span></span>
                                    :
                                    subscription.name === "pro" ?
                                        <span>Free your subscription will be cancelled, your icons will be limited to <span className="font-semibold">8</span> and you will no longer be able to use <span className="font-semibold">custom icons.</span></span>
                                        :
                                        <span>Free your subscription will be cancelled. You will be limited to <span className="font-semibold">1 unique link</span>, your icons will be limited to <span className="font-semibold">8</span>, and you will no longer be able to use <span className="font-semibold">custom icons.</span></span>

                                }
                            </p>
                        </div>
                        {pages.length > 1 && subscription.name === "premier" &&
                            <>
                                <p className="text-center text-sm text-gray-700">You currently have <span className="font-semibold"> {pages.length}</span> links.</p>
                                <div className="mx-auto mt-4 max-w-md">
                                    <label htmlFor="defaultPage" className="mb-1 block text-sm font-medium text-gray-700">
                                        Select which link you would like to stay active:
                                    </label>
                                    <div className="relative">
                                        <select name="defaultPage" onChange={(e) => setDefaultPage(e.target.value)} value={defaultPage}>
                                            {pages.map((page, index) => {
                                                return (
                                                    <option key={index} value={page.id}>{page.name}</option>
                                                )
                                            })}
                                        </select>
                                        <svg
                                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                                            viewBox="0 0 20 20" fill="currentColor"
                                        >
                                            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
                                        </svg>
                                    </div>
                                </div>
                            </>
                        }
                        <p className="mt-6 text-center text-base text-gray-800">
                            Do you want to continue?
                        </p>
                        <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <button
                               className='!w-40 button green'
                                onClick={() => handleClick()}
                            >
                                Yes,<br/>downgrade
                            </button>
                            <a className="!w-40 close_details button transparent gray"
                               href="#"
                               onClick={(e) => {
                                   setShowSection(showSection.filter((section) => {
                                       return section !== "changePlan" && section !== "cancel" && section !== "changePayPalPlan"
                                   }))
                               }}
                            >No,<br/>keep my plan</a>
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">
                                You can upgrade again at any time. Your content remains safe.
                            </p>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default ConfirmPlanChange;
