import React from 'react';

const ConfirmCancel = () => {

    return (
        <div id="confirm_cancel_details" className={`change_plan_message ${ (pages.length === 1 || subscription.name === "pro") && "adjust_height"} `}>
            <div className="icon_wrap check">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
            </div>
            <h2>Confirm</h2>
            <form action="" method="post">
                <input className="plan" name="plan" type="hidden" value={subscription.braintree_id} />
                {subscription.name === "premier" ?
                    <>
                        <h3>By downgrading your plan to Free your subscription will be cancelled. You will be limited to 1 unique link, your icons will be limited to 8, and you will no longer be able to use custom icons..</h3>
                        {pages.length > 1 &&
                            <>
                                <p>You currently have {pages.length} links.</p>
                                <label htmlFor="defaultPage">Select which link you would like to keep active:</label>
                                <select name="defaultPage">
                                    {pages.map(page => {
                                        return (
                                            <option value={page.id}>{page.name}</option>
                                        )
                                    })}
                                </select>
                            </>
                        }
                    </>
                    :
                    <h3>By downgrading your plan to Free your subscription will be cancelled, your icons will be limited to 8 and you will no longer be able to use custom icons.</h3>
                }
                <p>Do you want to continue?</p>
                <div className="button_row">
                    <button type="submit" className='button green'>
                        Yes
                    </button>
                    <a className="close_cancel_details button transparent gray" href="#">No</a>
                </div>
            </form>
        </div>

    );
};

export default ConfirmCancel;
