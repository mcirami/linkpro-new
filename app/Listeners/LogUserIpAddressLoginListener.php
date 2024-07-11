<?php

namespace App\Listeners;

use App\Events\UserLoggedIn;
use App\Models\UserIpAddress;
use Illuminate\Auth\Events\Login;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Stevebauman\Location\Facades\Location;
use Illuminate\Auth\Events\Authenticated;
class LogUserIpAddressLoginListener implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    public function handle( UserLoggedIn $event ): void
    {
        $user = $event->user;
        $position = $event->userLocation;
        /*$roles = $user->getRoleNames();;
        if (!$roles->contains('admin')) {*/
            if ($position) {

                UserIpAddress::create([
                    'ip'          => $position->ip,
                    'countryName' => $position->countryName ?? NULL,
                    'countryCode' => $position->countryCode ?? NULL,
                    'regionName'  => $position->regionName ?? NULL,
                    'regionCode'  => $position->regionCode ?? NULL,
                    'cityName'    => $position->cityName ?? NULL,
                    'zipCode'     => $position->zipCode ?? NULL,
                    'postalCode'  => $position->postalCode ?? NULL,
                    'latitude'    => $position->latitude ?? NULL,
                    'longitude'   => $position->longitude ?? NULL,
                    'isoCode'     => $position->isoCode ?? NULL,
                    'timezone'    => $position->timezone ?? NULL,
                    'metroCode'   => $position->metroCode ?? NULL,
                    'areaCode'    => $position->areaCode ?? NULL,
                    'user_id'     => $user->id
                ]);
            } else {
                UserIpAddress::create([
                    'ip'          => "0.0.0.0",
                    'countryName' => NULL,
                    'countryCode' => NULL,
                    'regionName'  => NULL,
                    'regionCode'  => NULL,
                    'cityName'    => NULL,
                    'zipCode'     => NULL,
                    'postalCode'  => NULL,
                    'latitude'    => NULL,
                    'longitude'   => NULL,
                    'isoCode'     => NULL,
                    'timezone'    => NULL,
                    'metroCode'   => NULL,
                    'areaCode'    => NULL,
                    'user_id'     => $user->id
                ]);
            }


       /* }*/
    }
}
