<?php

namespace App\Policies;

use App\Models\LandingPageSection;
use App\Models\User;
use App\Policies\Concerns\AuthorizesOwnership;
use Illuminate\Auth\Access\Response;

class LandingPageSectionPolicy
{
    use AuthorizesOwnership;

    public function manage(User $user, LandingPageSection $landingPageSection): Response
    {
        return $this->ownerOrNotFound($user, $landingPageSection);
    }
}
