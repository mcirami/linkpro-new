/* import React, { useState } from "react";
import {
    AppProvider,
    Card,
    Layout,
    Page,
    InlineGrid,
    AccountConnection,
} from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Head } from "@inertiajs/react";

const shopOrigin = new URLSearchParams(window.location.search).get("shop");

const config = {
    apiKey: "0bea31034ce514bbb251f3ca77386677",
    shopOrigin,
    forceRedirect: true,
};

export default function ShopifyApp() {
    const [connected, setConnected] = useState(false);
    const accountName = connected ? "Jane Appleseed" : "";
    const buttonText = connected
        ? "Disconnect"
        : "Connect Your LinkPro Account";
    const details = connected ? "Account connected" : "No account connected";

    const handleClick = () => {};

    return (
        <AppProvider>
            <Head title="Link Pro Sales Channel App" />
            <Page title="LinkPro">
                <Layout>
                    <Layout.Section>
                        <Card>
                            <InlineGrid columns={["twoThirds", "oneThird"]}>
                                <div style={{ padding: "40px" }}>
                                    <h2
                                        style={{
                                            fontSize: "24px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Boost discovery of your products and
                                        streamline shopping with LinkPro
                                    </h2>
                                    <p>
                                        Enable people to shop your most popular
                                        products right on your LinkPro page.
                                    </p>
                                    <p>
                                        Build your brand by sharing your latest
                                        content and events, grow your subscriber
                                        list, and more
                                    </p>

                                    <AccountConnection
                                        accountName={accountName}
                                        connected={connected}
                                        title="LinkPro"
                                        action={{
                                            content: buttonText,
                                            onAction: handleClick,
                                        }}
                                        details={details}
                                        style={{
                                            width: "100%",
                                            height: "150px",
                                        }}
                                    />
                                    <p>Don't have an account yet?</p>
                                    <a
                                        href="https://link.pro/register"
                                        target="_blank"
                                    >
                                        Click Here To Create a LinkPro Account
                                    </a>
                                </div>
                                <div style={{ padding: "40px" }}>
                                    <img src="https://d2qqgh4ebru6pi.cloudfront.net/ce41833e-bc7e-4017-bc67-2abe5b6a2987/images/img-phone.png" />
                                </div>
                            </InlineGrid>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        </AppProvider>
    );
}
 */
