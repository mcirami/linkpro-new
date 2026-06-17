<?php

namespace App\Policies;

use App\Models\Page;
use App\Models\User;
use App\Policies\Concerns\AuthorizesOwnership;
use Illuminate\Auth\Access\Response;

class PagePolicy
{
    use AuthorizesOwnership;

    public function manage(User $user, Page $page): Response
    {
        return $this->ownerOrNotFound($user, $page);
    }
}
