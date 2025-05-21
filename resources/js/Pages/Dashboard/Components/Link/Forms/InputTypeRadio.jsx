import React, {useContext, useEffect} from 'react';
import {LINKS_ACTIONS} from '@/Services/Reducer.jsx';
import {UserLinksContext} from '@/Pages/Dashboard/Dashboard.jsx';

const InputTypeRadio = ({
                            editLink,
                            setEditLink
}) => {

    const { userLinks, dispatch } = useContext(UserLinksContext);

    useEffect(() => {
        if (editLink.url) {
            setEditLink((prev) => ({
                ...prev,
                type: "url"
            }))
        } else if (editLink.email) {
            setEditLink((prev) => ({
                ...prev,
                type: "email"
            }))
        } else if (editLink.phone) {
            setEditLink((prev) => ({
                ...prev,
                type: "phone"
            }))
        }
    }, [])

     const handleOnChange = (e) => {
         setEditLink(prev => ({
             ...prev,
             type: e.target.value
         }));
         dispatch({
             type: LINKS_ACTIONS.UPDATE_LINK,
             payload: {
                 editID: editLink.id,
                 editLink: editLink,
                 type: e.target.value,
                 [`${e.target.value}`] : editLink[`${e.target.value}`]
             }
         })
     }

    return (
        <div className="my_row radios_wrap input_types mb-1">
            <div className={editLink.type === "url" || !editLink.type ? "radio_wrap active" : "radio_wrap" }>
                <label htmlFor="url">
                    <input id="url"
                           type="radio"
                           value="url"
                           name="input_type"
                           checked={editLink.type === "url" || !editLink.type}
                           onChange={(e) => {handleOnChange(e) }}/>
                    URL
                </label>
            </div>
            <div className={editLink.type === "email" ? "radio_wrap active" : "radio_wrap" }>
                <label htmlFor="email">
                    <input id="email"
                           type="radio"
                           value="email"
                           name="input_type"
                           onChange={(e) => { handleOnChange(e) }}
                           checked={editLink.type === "email"}
                    />
                    Email
                </label>
            </div>
            <div className={editLink.type === "phone" ? "radio_wrap active" : "radio_wrap" }>
                <label htmlFor="phone">
                    <input id="phone"
                           type="radio"
                           value="phone"
                           name="input_type"
                           onChange={(e) => { handleOnChange(e) }}
                           checked={editLink.type === "phone"}
                    />
                    Phone
                </label>
            </div>
        </div>
    );
};

export default InputTypeRadio;
