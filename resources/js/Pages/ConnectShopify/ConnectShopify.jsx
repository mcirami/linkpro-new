import React, { useState, useEffect } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Head } from "@inertiajs/react";
import { FaArrowRightLong } from "react-icons/fa6";
import { func } from "prop-types";

function ConnectShopify({ domain, errors = null }) {
    const handleConnect = () => {
        let myPromise = new Promise((resolve, reject) => {
            resolve("/auth/shopify?domain=" + domain);
            reject("Error");
        });

        myPromise.then(
            function (result) {
                window.location.href = result;
            },
            function (error) {
                console.error("ERROR::", error);
            },
        );
    };

    useEffect(() => {
        const href = window.location.href.split("?")[0];
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const errors = urlParams?.get("errors");
        //console.log(urlParams);
    }, []);

    const handleCancel = () => {
        window.close();
    };

    return (
        <div className="content_wrap p-5 mt-5 border-gray-100 border rounded-lg max-w-lg mx-auto">
            <Head title="Connect Shopify Store" />
            <div className="logo_wrap max-w-48 mx-auto mb-5">
                <h1>
                    <ApplicationLogo />
                </h1>
            </div>
            <div className="content">
                <div className="flex flex-row justify-center content-center gap-2">
                    <img
                        className="max-w-10"
                        src={Vapor.asset("images/Shopify-Logo.png")}
                        alt="Shopify Logo"
                    />
                    <div className="mt-auto mb-auto">
                        <FaArrowRightLong />
                    </div>
                    <img
                        className="max-w-10"
                        src={Vapor.asset("images/preview-device-bg.png")}
                        alt="LinkPro Icon"
                    />
                </div>
                <div className="text-center block">
                    <div className="my-5">
                        <p>Connect Shopify to your LinkPro.</p>
                        <p>
                            In connecting your LinkPro account, you agree to
                            share basic account information related to your use
                            to Shopify.
                        </p>
                    </div>
                    <a
                        onClick={handleConnect}
                        className="button blue !w-full mb-4"
                        href="#"
                    >
                        Connect my Shopify account
                    </a>
                    <a onClick={handleCancel} href="#">
                        Cancel
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ConnectShopify;
