import React, {useEffect, useState, useRef} from 'react';

const PaymentComponent = ({
                              authToken,
                              setShowSection
}) => {

    const dropInRef = useRef(null);
    const loadRef = useRef(true);

    useEffect(() => {
        const firstRender = loadRef.current;

        if( firstRender || dropInRef.current.innerHTML === "" ) {
            loadRef.current = false;

            braintree.dropin.create({
                authorization: authToken,
                selector: '#bt-dropin',
            }, function(createErr, instance) {
                if (createErr) {
                    console.log('Create Error', createErr);
                }
            });
        }
    },[])

    return (
        <>
            <h2 className="text-uppercase">Billing Info</h2>
            <div className="drop_in_wrap">
                <div className="bt-drop-in-wrapper">
                    <div ref={dropInRef} id="bt-dropin"></div>
                </div>
            </div>
            <a href="#"
               className="button blue text-uppercase mt-auto"
               onClick={(e) => setShowSection((prev) => [
                   ...prev,
                   "methods"
               ])}
            >
                Change Payment Method
            </a>
        </>
    );
};

export default PaymentComponent;
