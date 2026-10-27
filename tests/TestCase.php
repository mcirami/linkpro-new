<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Http\Client\Factory;
use Illuminate\Support\Facades\Http;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();

        // Banhammer's BlockByCountry middleware runs on every web request and
        // Stevebauman\Location is called on login and registration. Both
        // geolocate the client through ip-api.com. Banhammer only geolocates
        // when it has countries to block, so emptying the list short-circuits
        // it before the network; Location is stubbed below.
        config()->set('ban.blocked_countries', []);

        $this->fakeGeolocation(Http::response([
            'status' => 'success',
            'country' => 'United States',
            'countryCode' => 'US',
            'query' => '127.0.0.1',
        ]));
    }

    /**
     * Stub the ip-api.com geolocation lookup.
     *
     * Http::fake() appends stubs and the first match wins, so a test cannot
     * override the default above by calling Http::fake() again -- the client
     * has to be rebuilt first.
     */
    protected function fakeGeolocation(mixed $response): void
    {
        $this->app->forgetInstance(Factory::class);
        Http::clearResolvedInstances();

        Http::fake(['ip-api.com/*' => $response]);
    }
}
