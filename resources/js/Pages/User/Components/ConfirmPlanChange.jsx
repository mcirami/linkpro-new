import React, {useState} from 'react';
import {cancelSubscription, changePlan} from '@/Services/SubscriptionRequests.jsx';

const ConfirmPlanChange = ({
                               pages,
                               showSection,
                               setShowSection,
                               subscription,
                               setSubscription,
                               setShowLoader
}) => {

    const [defaultPage, setDefaultPage] = useState(null);
    const handleClick = (e) => {

        setShowLoader({
            show: true,
            position: 'absolute',
            icon: ""
        })

        if(showSection.includes("cancel")) {

            const packets = {
                plan: subscription.braintree_id
            }

            cancelSubscription(packets).then((response) => {
                if (response.success) {
                    setShowSection([])
                    setSubscription(prev => ({
                        ...prev,
                        braintree_status: "canceled",
                        ends_at: response.ends_at
                    }))
                }

                setShowLoader({
                    show: false,
                    position: "",
                    icon: ""
                })
            })
        }

        if(showSection.includes("changePlan")) {

            const packets = {
                defaultPage: defaultPage,
                level: "pro"
            }

            changePlan(packets).then((response) => {
                if(response.success) {
                    setSubscription(prev => ({
                        ...prev,
                        name: "pro",
                    }))
                    setShowSection([])
                }

                setShowLoader({
                    show: false,
                    position: "",
                    icon: ""
                })
            })
        }
    }

    return (
        <div id="confirm_change_plan_details" className={`change_plan_message`}>
            <div className="icon_wrap check">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
            </div>
            <h2>Confirm</h2>
            <form action="" method="">

                {showSection.includes("changePlan") ?

                    <h3>By downgrading your account to Pro you will lose access to password protect your links and you will be limited to 1 unique link.</h3>

                    :
                    subscription.name === "pro" ?
                        <h3>By downgrading your account to Free your subscription will be cancelled, your icons will be limited to 8 and you will no longer be able to use custom icons.</h3>
                        :
                        <h3>By downgrading your plan to Free your subscription will be cancelled. You will be limited to 1 unique link, your icons will be limited to 8, and you will no longer be able to use custom icons.</h3>

                }
                {pages.length > 1 && subscription.name === "premier" &&
                    <>
                        <p>You currently have {pages.length} links.</p>
                        <label htmlFor="defaultPage">Select which link you would like to stay active:</label>
                        <select name="defaultPage" onChange={(e) => setDefaultPage(e.target.value)}>
                            {pages.map(page => {
                                return (
                                    <option value={page.id}>{page.name}</option>
                                )
                            })}
                        </select>
                    </>
                }
                <p className="confirm_text">Do you want to continue?</p>
                <div className="button_row">
                    <a href="#"
                       className='button green'
                        onClick={(e) => handleClick()}
                    >
                        Yes
                    </a>
                    <a className="close_details button transparent gray"
                       href="#"
                       onClick={(e) => {
                           setShowSection(showSection.filter((section) => {
                               return section !== "changePlan" && section !== "cancel"
                           }))
                       }}
                    >No</a>
                </div>
            </form>
        </div>
    );
};

export default ConfirmPlanChange;
