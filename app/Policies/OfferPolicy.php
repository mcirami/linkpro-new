<?php

namespace App\Policies;

use App\Models\Offer;
use App\Models\User;
use App\Policies\Concerns\AuthorizesOwnership;
use Illuminate\Auth\Access\Response;

class OfferPolicy
{
    use AuthorizesOwnership;

    public function manage(User $user, Offer $offer): Response
    {
        return $this->ownerOrNotFound($user, $offer);
    }
}
