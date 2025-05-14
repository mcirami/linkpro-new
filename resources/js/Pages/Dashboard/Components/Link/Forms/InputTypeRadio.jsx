import React, {useEffect} from 'react';

const InputTypeRadio = ({showLinkForm, currentLink, setCurrentLink}) => {

    useEffect(() => {
        if (currentLink.url) {
            setCurrentLink((prev) => ({
                ...prev,
                type: "url"
            }))
        } else if (currentLink.email) {
            setCurrentLink((prev) => ({
                ...prev,
                type: "email"
            }))
        } else if (currentLink.phone) {
            setCurrentLink((prev) => ({
                ...prev,
                type: "phone"
            }))
        }
    }, [])

     const handleOnChange = (e) => {
         setCurrentLink(prev => ({
             ...prev,
             type: e.target.value
         }));
     }

    return (
        <div className="my_row radios_wrap input_types mb-1">
            <div className={currentLink.type === "url" || !currentLink.type ? "radio_wrap active" : "radio_wrap" }>
                <label htmlFor="url">
                    <input id="url"
                           type="radio"
                           value="url"
                           name="input_type"
                           checked={currentLink.type === "url" || !currentLink.type}
                           onChange={(e) => {handleOnChange(e) }}/>
                    URL
                </label>
            </div>
            <div className={currentLink.type === "email" ? "radio_wrap active" : "radio_wrap" }>
                <label htmlFor="email">
                    <input id="email"
                           type="radio"
                           value="email"
                           name="input_type"
                           onChange={(e) => { handleOnChange(e) }}
                           checked={currentLink.type === "email"}
                    />
                    Email
                </label>
            </div>
            <div className={currentLink.type === "phone" ? "radio_wrap active" : "radio_wrap" }>
                <label htmlFor="phone">
                    <input id="phone"
                           type="radio"
                           value="phone"
                           name="input_type"
                           onChange={(e) => { handleOnChange(e) }}
                           checked={currentLink.type === "phone"}
                    />
                    Phone
                </label>
            </div>
        </div>
    );
};

export default InputTypeRadio;
