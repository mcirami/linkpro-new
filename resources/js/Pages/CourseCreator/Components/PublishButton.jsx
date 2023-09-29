import React from 'react';
import {publishOffer} from '@/Services/OfferRequests.jsx';
import {OFFER_ACTIONS} from '../Reducer';
import {IoWarningOutline} from 'react-icons/io5';

const PublishButton = ({offerData, dispatchOffer, courseTitle}) => {


   const handleOnClick = (e) => {
       e.preventDefault();

       const packets = {
           published: true,
       };

       publishOffer(packets, offerData["id"])
       .then((response) => {
           if (response.success) {
               dispatchOffer({
                   type: OFFER_ACTIONS.UPDATE_OFFER_DATA,
                   payload: {
                       value: true,
                       name: "published"
                   }
               })
           }
       });
   }

    return (
        <div className="my_row button_wrap">
            <button type="submit" disabled={!offerData["price"] || !offerData["icon"] || !courseTitle ? "disabled" : ""} className={!offerData["price"] || !offerData["icon"] ? "button blue disabled" : "button blue"} onClick={(e) => handleOnClick(e)}>
                Publish
            </button>
            {!offerData["price"] || !offerData["icon"] ?
                <p><IoWarningOutline /> Course requires an Icon, Price and Title before being published</p>
                :
                ""
            }

        </div>
    );
};

export default PublishButton;
