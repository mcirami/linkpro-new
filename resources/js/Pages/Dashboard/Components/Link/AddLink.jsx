import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';
import { MdOutlineAddLink } from "react-icons/md";
import React from 'react';
import ContentSelectButtons
    from "@/Components/ContentSelectButtons.jsx";
const AddLink = ({
                     subStatus,
                     setShowUpgradePopup,
                     setShowLinkTypeRadio
}) => {

    const { userLinks } = useUserLinksContext();

    const handleClick = () => {
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

        <div className="grid grid-cols-1 gap-4">
            <ContentSelectButtons
                handleClick={handleClick}
                options={[
                    {
                        key: 'link',
                        icon: <MdOutlineAddLink className="h-6 w-6 text-[#424fcf]" aria-hidden="true" />,
                        title: 'Add Link',
                    },
                ]}
            />
        </div>
    )
}
export default AddLink;
