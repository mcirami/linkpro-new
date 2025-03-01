<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        '/stripe-webhook',
        '/stripe-products-webhook',
        '/paypal-webhook',
        '*.stripe.com',
        '/payment-onboarding',
        '/onboarding-success',
        '/vapor/signed-storage-url',
        '/shopify/webhook/update-product',
        '/shopify/webhook/add-product',
        '/shopify/webhook/delete-product',
        '/api/auth/shopify/disconnect'
    ];
}
