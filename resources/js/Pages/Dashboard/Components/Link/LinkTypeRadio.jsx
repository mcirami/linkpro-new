import React from 'react';

const LinkTypeRadio = ({
                           setShowLinkForm,
                           setEditLink,
                           setShowLinkTypeRadio,
                           pageId
}) => {

    const handleOnChange = (type) => {
        setEditLink((prev) => ({
            ...prev,
            type: type,
            page_id: pageId,
        }));
        setShowLinkForm({show: true});
        setShowLinkTypeRadio(false);
    }

    return (
        <div className="my_row radios_wrap mb-1">
            <div className="radio_wrap">
                <label htmlFor="link_type">
                    <input type="radio"
                           name="link_type"
                           id="personal_button"
                           value="url"
                           onChange={(e) => handleOnChange("url")}
                    />
                    Personal Button
                </label>
            </div>
            <div className="radio_wrap">
                <label htmlFor="link_type">
                    <input type="radio"
                           name="link_type"
                           id="offer_button"
                           value="offer"
                           onChange={(e) => handleOnChange(e.target.value)}
                    />
                    Creator Offer
                </label>
            </div>
            <div className="radio_wrap">
                <label htmlFor="link_type">
                    <input type="radio"
                           name="link_type"
                           id="mailchimp_button"
                           value="mailchimp"
                           onChange={(e) => handleOnChange(e.target.value)}
                    />
                    MailChimp
                </label>
            </div>
        </div>
    );
};

export default LinkTypeRadio;
