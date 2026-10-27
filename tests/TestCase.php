<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Http;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();

        // Banhammer's BlockByCountry middleware runs on every web request and
        // Stevebauman\Location is called on login and registration. Both geolocate
        // the client through ip-api.com, so left live the suite stalls on the 30
        // second cURL timeout and is non-deterministic. Banhammer only geolocates
        // when it has countries to block, so emptying the list short-circuits it
        // before the network -- which also stops an unreachable ip-api.com from
        // turning into a blanket 403.
        config()->set('ban.blocked_countries', []);

        Http::fake([
            'ip-api.com/*' => Http::response([
                'status' => 'success',
                'country' => 'United States',
                'countryCode' => 'US',
                'query' => '127.0.0.1',
            ]),
        ]);
    }
}
