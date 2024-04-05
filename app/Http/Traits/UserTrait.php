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

    /**
     * @param $user
     *
     * @return void
     */
    public function enableUsersPages($user): void {
        $pages = $user->pages()->get();

        foreach ($pages as $page) {
            if (!$page->default) {
                $page->disabled = false;
                $page->save();
            }
        }
    }

    /**
     * @param $user
     *
     * @return bool
     */
    public function checkUserSubscription($user): bool {

        $userSub = $this->getUserSubscriptions($user);

        if(empty($userSub) || ($userSub->ends_at && $userSub->ends_at < Carbon::now())) {
            return false;
        }

        return true;

    }
}
