import React, {useEffect} from 'react';
import {LINKS_ACTIONS} from '@/Services/Reducer.jsx';
import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';

const InputTypeRadio = ({
                            editLink,
                            setEditLink
}) => {

    const { dispatch } = useUserLinksContext();

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

     const handleOnClick = (e, value) => {
        console.log(value);
        e.preventDefault();
         setEditLink(prev => ({
             ...prev,
             type: value
         }));

         dispatch({
             type: LINKS_ACTIONS.UPDATE_LINK,
             payload: {
                 id: editLink.id,
                 editLink: editLink,
                 type: value,
                 [`${value}`] : editLink[`${value}`]
             }
         })
     }

    return (
        <div className="radios_wrap relative">
            <div className={editLink.type === "url" || !editLink.type ? "radio_wrap active" : "radio_wrap" }>
                <button
                    className={`group mr-5 flex-1 rounded-lg border text-center transition
                        ${editLink.type === "url" ? 'border-indigo-600 bg-indigo-50 shadow-md active' : 'shadow-md '}
                        `}
                    onClick={(e) => {handleOnClick(e, "url")}}
                >
                    <p className="text-sm font-medium text-gray-800">URL</p>
                </button>
                <button
                    className={`group mr-5 flex-1 rounded-lg border text-center transition
                        ${editLink.type === "email" ? 'border-indigo-600 bg-indigo-50 shadow-md active' : 'shadow-md '}
                        `}
                    onClick={(e) => {handleOnClick(e, "email")}}
                >
                    <p className="text-sm font-medium text-gray-800">Email</p>
                </button>
                <button
                    className={`group mr-5 flex-1 rounded-lg border text-center transition
                        ${editLink.type === "phone" ? 'border-indigo-600 bg-indigo-50 shadow-md active' : 'shadow-md '}
                        `}
                    onClick={(e) => {handleOnClick(e, "phone")}}
                >
                    <p className="text-sm font-medium text-gray-800">Phone</p>
                </button>
                {/*<label htmlFor="url">
                    <input id="url"
                           type="radio"
                           value="url"
                           name="input_type"
                           checked={editLink.type === "url" || !editLink.type}
                           onChange={(e) => {handleOnChange(e) }}/>
                    URL
                </label>*/}
            </div>
            {/*<div className={editLink.type === "email" ? "radio_wrap active" : "radio_wrap" }>
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
            </div>*/}
        </div>
    );
};

export default InputTypeRadio;
