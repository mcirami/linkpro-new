import React from 'react';

const MailchimpIntegration = ({
                                  connectionError,
                                  integrationType,
                                  editID,
                                  pageID
}) => {

    const handleMailchimpClick = (e) => {
        e.preventDefault();
        const url = "/auth/mailchimp";

        if (editID) {
            localStorage.setItem('editID', editID);
        } else {
            localStorage.setItem('showLinkForm', true);
        }

        localStorage.setItem('integrationType', integrationType);

        //set cookie to grab page ID in controller
        const date = new Date();
        date.setTime(date.getTime() + (24*60*60*1000));
        const expires = "; expires=" + date.toUTCString();
        document.cookie = 'pageId=' + pageID + expires;

        window.location.href = url;
    }

    return (
        <div className="integration_wrap">
            <h3>Add your Mailchimp account as a LinkPro button!</h3>
            <p className="mb-4">Connect your Mailchimp account by clicking the button below.</p>
            <p className="small">Note: You will be redirected away from Link Pro to log into Mailchimp. You will need to either already have or create a new MailChimp account of your own to use this integration.</p>
            <div id="scrollTo" className="button_wrap mt-4">
                <a className="button blue"
                   href="#"
                   onClick={(e) => handleMailchimpClick(e)}
                >
                    Login To Mailchimp
                </a>
            </div>
            <div className="connection_error">
                <p>{connectionError}</p>
            </div>
        </div>
    );
};

export default MailchimpIntegration;
