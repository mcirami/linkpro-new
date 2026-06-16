<?php

namespace App\Policies;

use App\Models\Link;
use App\Models\User;
use App\Policies\Concerns\AuthorizesOwnership;
use Illuminate\Auth\Access\Response;

class LinkPolicy
{
    use AuthorizesOwnership;

    public function manage(User $user, Link $link): Response
    {
        return $this->ownerOrForbidden($user, $link);
    }
}
