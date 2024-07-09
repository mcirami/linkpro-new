<?php

namespace App\Listeners;

use App\Models\UserIpAddress;
use Illuminate\Auth\Events\Login;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
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

    public function handle( Login $event): void
    {
        $user = $event->user;
        $roles = $user->getRoleNames();;
        if (!$roles->contains('admin')) {
            if ($position = Location::get(request()->ip())) {
                $userIpAddress = new UserIpAddress(
                    ( new UserIpAddress )->parseData((array) $position)
                );
                $userIpAddress->ip = $position->ip;
                $userIpAddress->user_id = $user->id;
                $userIpAddress->save();
            }
        }
    }
}
