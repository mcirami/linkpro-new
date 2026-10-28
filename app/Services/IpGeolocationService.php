<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Mchev\Banhammer\Services\IpApiService;

/**
 * Banhammer's own IpApiService returns null whenever the ip-api.com lookup
 * fails, and BlockByCountry then dereferences it. Laravel turns that warning
 * into an ErrorException, which the middleware's catch block converts into a
 * BanhammerException -- so a geolocation outage became a 403 for every visitor.
 *
 * ip-api.com is HTTP-only and rate limited to 45 requests a minute on the free
 * tier, so that outage is realistic rather than theoretical.
 *
 * This replacement fails open: a lookup that times out or comes back malformed
 * is reported with a 'fail' status, which is the shape BlockByCountry already
 * handles by letting the request through. It also caps the request, because the
 * inherited call used the default 30 second timeout and every uncached request
 * waited behind it.
 */
class IpGeolocationService extends IpApiService
{
    protected const TIMEOUT_SECONDS = 2;

    public function getGeolocationData(string $ip): ?array
    {
        $cacheKey = 'ip_geolocation_'.$ip;

        $cached = Cache::get($cacheKey);

        if (is_array($cached) && isset($cached['status'])) {
            return $cached;
        }

        try {
            $response = Http::connectTimeout(self::TIMEOUT_SECONDS)
                ->timeout(self::TIMEOUT_SECONDS)
                ->get("http://ip-api.com/json/{$ip}?fields=status,message,countryCode,query");

            $data = $response->json();
        } catch (\Throwable $e) {
            Log::warning('IP geolocation unavailable, allowing request.', [
                'ip' => $ip,
                'exception' => $e->getMessage(),
            ]);

            return $this->unavailable($e->getMessage());
        }

        if (! is_array($data) || ! isset($data['status'])) {
            Log::warning('IP geolocation returned an unexpected payload, allowing request.', [
                'ip' => $ip,
            ]);

            return $this->unavailable('unexpected response from ip-api.com');
        }

        // Only a real answer is worth keeping for a day. Caching a failure here
        // would disable country checks for this address for 24 hours, so a
        // failure is simply retried on the next request.
        Cache::put($cacheKey, $data, now()->addDay());

        return $data;
    }

    /**
     * The payload BlockByCountry reads as "could not determine, let it pass".
     */
    protected function unavailable(string $message): array
    {
        return ['status' => 'fail', 'message' => $message];
    }
}
