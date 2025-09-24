import { ImPlus } from "react-icons/im";
import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';
import { MdOutlineAddLink } from "react-icons/md";
import React from 'react';

const AddLink = ({
                     subStatus,
                     setShowUpgradePopup,
                     setShowLinkTypeRadio
}) => {

    const { userLinks } = useUserLinksContext();

    const handleClick = (e) => {
        e.preventDefault();

        const newUserLinks = userLinks.filter( (element) =>
            element.type !== "folder" && element.type !== "mailchimp" && element.type !== "shopify"
        );
        const count = newUserLinks?.length;

        if (count < 8 || subStatus ) {

            setShowLinkTypeRadio(true);

            setTimeout(function(){
                document.querySelector('#scrollTo').scrollIntoView({
                    behavior: 'smooth',
                    block: "start",
                    inline: "nearest"
                });

            }, 800)

        } else {
            setShowUpgradePopup({
                show: true,
                text: "add more icons"
            });
        }
    };

    return (

        <a href="" className="
                transform-none flex items-start w-full group rounded-xl bg-white p-4 text-left shadow-md
                 transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-[#424fcf]/30
        " onClick={handleClick}>
            <div className="flex-col items-start gap-3">
                <div className="text-base font-semibold flex items-center gap-2 text-gray-900">
                    <div className="h-9 w-9 rounded-lg grid place-items-center bg-[#424fcf]/10">
                        {/* link icon */}
                        <MdOutlineAddLink className="h-6 w-6 text-[#424fcf]" aria-hidden="true" />
                    </div>
                    <h3 className="uppercase">Add Link</h3>
                </div>
            </div>
        </a>

    )
}
export default AddLink;
