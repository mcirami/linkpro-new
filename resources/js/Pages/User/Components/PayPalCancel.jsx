import React from 'react';
import { MdCancel } from "react-icons/md";
const PayPalCancel = ({subName}) => {
    return (
        <div id="popup_choose_level" className="inline-block relative w-full">
            <div className="icon_wrap">
                <MdCancel className="text-red-600"/>
            </div>
            <h3 className="mb-4">In order to cancel your subscription follow these steps:</h3>
            <ol className="mb-4 max-w-96 list-decimal text-left mx-auto">
                <li>
                    <p>Login to your PayPal account</p>
                </li>
                <li>
                    <p>Click gear icon</p>
                </li>
                <li>
                    <p>Click Payments tab</p>
                </li>
                <li>
                    <p>Click Automatic Payments</p>
                </li>
                <li>
                    <p>Click on the Active LinkPro Subscription</p>
                </li>
                <li>
                    <p>Click Cancel</p>
                </li>
            </ol>
            {subName === "pro" ?
            <h3>NOTE: By cancelling your subscription, your icons will be limited to 8 and you will no longer be able to use custom icons.</h3>
            :
            <h3 className="max-w-screen-md mx-auto">NOTE: By cancelling your subscription, you will be limited to 1 unique link, your icons will be limited to 8, and you will no longer be able to use custom icons.</h3>
            }
        </div>
    );
};

export default PayPalCancel;
