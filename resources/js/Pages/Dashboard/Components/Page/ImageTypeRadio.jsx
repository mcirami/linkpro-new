import React, {useEffect} from 'react';
import {submitPageSetting} from '@/Services/PageRequests.jsx';

const ImageTypeRadio = ({
                            setImageType,
                            imageType,
                            setPageSettings,
                            pageId
                        }) => {

    useEffect(() => {
        setImageType(imageType);
    },[imageType]);
    const handleOnChange = (e) => {
        const packets = {
            'main_img_type': e.target.value,
        };

        submitPageSetting(packets, pageId).then(res => {
            setImageType(e.target.value)
            setPageSettings((prev) => ({
                ...prev,
                main_img_type: e.target.value
            }));
        });
    }
    return (
        <div className="my_row radios_wrap img_type mb-1">
            <div className="radio_wrap">
                <label htmlFor="header">
                    <input id="header"
                           type="radio"
                           value="header"
                           name="img_type"
                           checked={imageType === 'header'}
                           onChange={(e) => {handleOnChange(e) }}/>
                    Header
                </label>
            </div>
            <div className="radio_wrap">
                <label htmlFor="page">
                    <input id="page"
                           type="radio"
                           value="page"
                           name="img_type"
                           onChange={(e) => { handleOnChange(e) }}
                           checked={imageType === 'page'}
                    />
                    Full Page
                </label>
            </div>
        </div>
    );
};

export default ImageTypeRadio;
