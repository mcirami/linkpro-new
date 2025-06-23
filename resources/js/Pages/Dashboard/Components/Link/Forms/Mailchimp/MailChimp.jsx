import React, {useEffect, useState} from 'react';
import MailchimpIntegration
    from '@/Pages/Dashboard/Components/Link/Forms/Mailchimp/MailchimpIntegration.jsx';
import MailchimpLists
    from '@/Pages/Dashboard/Components/Link/Forms/Mailchimp/MailchimpLists.jsx';
import {usePageContext} from '@/Context/PageContext.jsx';
import {isEmpty} from 'lodash';
import {getMailchimpLists} from '@/Services/UserService.jsx';

const MailChimp = ({
                       editLink,
                       setEditLink,
                       connectionError,
                       index
                   }) => {

    const [lists, setLists] = useState([]);
    const  { pageSettings } = usePageContext();

    useEffect(() => {
        fetchLists()
    },[])

    const fetchLists = () => {

        //setShowLoader({show: true, icon: "loading", position: "absolute"});

        getMailchimpLists().then(
            (data) => {
                if (data.success) {
                    !isEmpty(data.lists) && setLists(data.lists);
                    //setShowLoader({show: false, icon: "", position: ""});
                }
            }
        )
    }
    console.log("lists: ", lists);
    return (

       isEmpty(lists) ?

        <MailchimpIntegration
            connectionError={connectionError}
            editID={editLink.id}
            pageID={pageSettings.id}
            index={index}
        />
        :
        <MailchimpLists
            lists={lists}
            setLists={setLists}
            currentLink={editLink}
            setCurrentLink={setEditLink}
        />

    );
};

export default MailChimp;
