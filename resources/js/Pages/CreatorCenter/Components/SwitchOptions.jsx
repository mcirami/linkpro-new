import React, {useState} from 'react';
import IOSSwitch from '../../../Utils/IOSSwitch';
import {updateOfferData} from '@/Services/OfferRequests.jsx';
import {Link} from '@inertiajs/react';

const SwitchOptions = ({offer}) => {

    const [currentOffer, setCurrentOffer] = useState(offer);
    const {id, active, public_offer, published} = currentOffer

    const handleChange = (type) => {
        const value = !currentOffer[type];
        let key = type;

        if(type.includes("_")) {
            key = type.split("_")[0];
        }

        const packets = {
            [`${key}`]: value,
        };

        updateOfferData(packets, id).then((response) => {
            if(response.success) {
                setCurrentOffer((prev) => ({
                    ...prev,
                    [`${type}`]: value,
                }))
            }
        });
    }

    return (

        <div className="flex justify-between items-center pt-2 ">
            <div className="flex justify-between text-sm text-gray-600 gap-2">
                <IOSSwitch
                    onChange={() => handleChange('active')}
                    checked={Boolean(active)}
                    disabled={!Boolean(published)}
                />
                <div>Active</div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 gap-2">
                <div>Public</div>
                <IOSSwitch
                    onChange={() => handleChange('public_offer')}
                    checked={Boolean(public_offer)}
                    disabled={!Boolean(published)}
                />
            </div>
        </div>
    )
};

export default SwitchOptions;
