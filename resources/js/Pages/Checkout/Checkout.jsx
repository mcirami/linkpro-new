import React from 'react';
import {isEmpty} from 'lodash';
import {Head} from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CheckoutLayout from '@/Pages/Checkout/Components/CheckoutLayout.jsx';

function Checkout({
                      auth,
                      token,
                      offer,
                      course,
                      creator,
                      affRef,
                      clickId
}) {

    return (
        <>
            {isEmpty(auth.user.userInfo) ?

                <GuestLayout>
                    <Head title="Checkout" />
                    <CheckoutLayout
                        auth={auth}
                        token={token}
                        offer={offer}
                        course={course}
                        creator={creator}
                        affRef={affRef}
                        clickId={clickId}
                    />
                </GuestLayout>
                :
                <AuthenticatedLayout>
                    <Head title="Checkout" />
                    <CheckoutLayout
                        auth={auth}
                        token={token}
                        offer={offer}
                        course={course}
                        creator={creator}
                        affRef={affRef}
                        clickId={clickId}
                    />
                </AuthenticatedLayout>
            }

        </>
    );
}

export default Checkout;
