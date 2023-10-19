<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        <script src="https://js.braintreegateway.com/web/3.97.2/js/client.min.js"></script>
        <script src="https://js.braintreegateway.com/web/3.97.2/js/hosted-fields.min.js" defer></script>
        <script src="https://www.paypalobjects.com/api/checkout.js" data-version-4 log-level="warn" defer></script>
        <script src="https://js.braintreegateway.com/web/dropin/1.40.2/js/dropin.min.js"></script>
        <!-- Load the PayPal Checkout component. -->
        <script src="https://js.braintreegateway.com/web/3.97.2/js/paypal-checkout.min.js" defer></script>
        <!-- Load the Venmo Checkout component. -->
        <script src="https://js.braintreegateway.com/web/3.97.2/js/venmo.min.js" defer></script>
        <!-- Load the Apple Checkout component. -->
        <script src="https://js.braintreegateway.com/web/3.97.2/js/apple-pay.min.js" defer></script>

        <script src="https://js.braintreegateway.com/web/3.97.2/js/data-collector.min.js" defer></script>
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx',"resources/js/custom.jsx", "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
