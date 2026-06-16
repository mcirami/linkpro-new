<?php

namespace App\Policies;

use App\Models\LandingPage;
use App\Models\User;
use App\Policies\Concerns\AuthorizesOwnership;
use Illuminate\Auth\Access\Response;

class LandingPagePolicy
{
    use AuthorizesOwnership;

    public function manage(User $user, LandingPage $landingPage): Response
    {
        return $this->ownerOrNotFound($user, $landingPage);
    }
}
