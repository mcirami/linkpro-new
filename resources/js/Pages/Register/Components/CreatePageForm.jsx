import React, {useState} from 'react';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/fi';
import {addPage} from '@/Services/PageRequests.jsx';
import {router} from '@inertiajs/react';
import StandardButton from "@/Components/StandardButton.jsx";

const CreatePageForm = ({pageNames}) => {

    const [newPageName, setNewPageName] = useState(null);
    const [available, setAvailability] = useState(false);
    const [regexMatch, setRegexMatch] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (available) {
            const packets = {
                name: newPageName,
                createPage: true,
            };

            addPage(packets).then((data) => {

                if (data.success) {
                    router.get('/plans?type=register');
                }
            })
        }
    };

    const checkPageName = (e) => {
        let value = e.target.value.toLowerCase();
        const match = pageNames.indexOf(value);

        const regex = /^[A-Za-z0-9-_.]+$/;
        setRegexMatch(regex.test(value));

        if (match < 0 && value.length > 2 && regex.test(value)) {
            setAvailability(true);
        } else {
            setAvailability(false);
        }

        setNewPageName(value)
    }

    return (

        <form className="new_page edit_form w-full" onSubmit={handleSubmit}>
            <div className="flex justify-center items-center link_name w-full">
                {!regexMatch &&
                    <p className="status not_available char_message register_page">Only letters, numbers, dashes, underscores, periods allowed</p>
                }
                <span className="label mb-5 font-bold mr-2">Link.pro/</span>
                <div className="input_wrap w-full relative">
                    <input className="animate w-full"
                           name="name"
                           type="text"
                           onChange={ checkPageName }
                           onKeyDown={ event => {
                               if(event.key === 'Enter') {
                                   handleSubmit(event);
                               }
                           }}
                           required
                    />
                    <label>Link Name</label>
                    {available ?
                        <a className="submit_circle" href="#"
                           onClick={(e) => handleSubmit(e)}
                        >
                            <FiThumbsUp/>
                        </a>
                        :
                        <span className="cancel_icon">
                             <FiThumbsDown/>
                        </span>

                    }
                    <p className="status text-xs text-red-600 !mt-2">{available ?
                        "Available" :
                        <span className="status not_available">Not Available</span>}
                    </p>
                </div>
            </div>
            <div className="my_row mt-2 md:mt-0">
                <StandardButton
                    classes="w-full md:w-1/2 lg:w-1/4 ml-auto"
                    text="Create Page"
                    onClick={handleSubmit}

                />
            </div>
        </form>
    );
}

export default CreatePageForm;
