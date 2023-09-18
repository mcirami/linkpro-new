<?php
namespace App\Http\Traits;

use Carbon\Carbon;

trait UserTrait {

    public function getUserSubscriptions($user) {

        return $user->subscriptions()->first();
    }

    public function getUserPages($user) {

        return $user->pages()->get();
    }

    public function getDefaultUserPage($user) {

        return $user->pages()->where('default', true)->pluck('name');
    }

    public function enableUsersPages($user) {
        $pages = $user->pages()->get();

        foreach ($pages as $page) {
            if (!$page->default) {
                $page->disabled = false;
                $page->save();
            }
        }
    }

    public function checkUserSubscription($user) {

        $userSub = $this->getUserSubscriptions($user);

        if(empty($userSub) || ($userSub->ends_at && $userSub->ends_at < Carbon::now())) {
            return false;
        }

        return true;

    }
}
