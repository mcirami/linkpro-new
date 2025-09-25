import React from 'react';
import {
    getMailchimpLists,
    removeMailchimpConnection,
} from '@/Services/UserService.jsx';
import {updateLink} from '@/Services/LinksRequest.jsx';
import {LINKS_ACTIONS} from '@/Services/Reducer.jsx';
import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';

const MailchimpLists = ({
                            currentLink,
                            setCurrentLink,
                            lists,
                            setLists,
}) => {

    const { dispatch } = useUserLinksContext();

    const handleChange = (e) => {

        const value = e.target.value;
        const packets = {
            mailchimp_list_id: value,
        };
        updateLink(packets, currentLink.id).then((data) => {
            if (data.success) {

                setCurrentLink((prev) => ({
                    ...prev,
                    mailchimp_list_id: value,
                }));

                dispatch({
                    type: LINKS_ACTIONS.UPDATE_LINK,
                    payload: {
                        id: currentLink.id,
                        editLink: currentLink,
                        mailchimp_list_id: value,
                    }
                })
            }
        });
    }

    const handleClick = (e) => {
        e.preventDefault();

        removeMailchimpConnection().then(
            (data) => {
                if (data.success) {
                    setLists([]);
                    setCurrentLink((prev) => ({
                        ...prev,
                        active_status: 0,
                        mailchimp_list_id: null,
                    }))

                    dispatch({
                        type: LINKS_ACTIONS.UPDATE_LINK,
                        payload: {
                            id: currentLink.id,
                            editLink: currentLink,
                            mailchimp_list_id: null,
                        }
                    })
                }
            }
        )
    }

    return (
        <div className="my_row relative form_nav_content p-5">
            <p className="label !text-gray-500 w-full text-center mb-2">Mailchimp List</p>
            <select
                name={"mailchimp_list_id"}
                onChange={(e) => handleChange(e)}
                required
                value={currentLink.mailchimp_list_id || undefined}
            >
                <option>Select Your List</option>
                {lists.length > 0 && lists?.map((list) => {
                    return (
                        <option
                            key={list.list_id}
                            value={list.list_id}>
                            {list.list_name}
                        </option>
                    )
                })}
            </select>
            {lists.length > 0 &&
                <div className="my_row remove_link">
                    <a className="text-red-500 flex justify-end text-sm mt-2" href="#" onClick={(e) => handleClick(e)}>
                        Remove Connection
                    </a>
                </div>
            }
        </div>
    );
};

export default MailchimpLists;
