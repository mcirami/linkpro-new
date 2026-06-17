<?php

namespace App\Policies\Concerns;

use App\Models\User;
use Illuminate\Auth\Access\Response;

trait AuthorizesOwnership
{
    /**
     * Whether the user owns the given model (matches its user_id).
     */
    protected function owns(User $user, $model): bool
    {
        return (int) $user->id === (int) $model->user_id;
    }

    /**
     * Allow when the user owns the model, otherwise deny with a 403.
     */
    protected function ownerOrForbidden(User $user, $model): Response
    {
        return $this->owns($user, $model)
            ? Response::allow()
            : Response::deny();
    }

    /**
     * Allow when the user owns the model, otherwise deny with a 404 so the
     * resource's existence is not revealed to non-owners.
     */
    protected function ownerOrNotFound(User $user, $model): Response
    {
        return $this->owns($user, $model)
            ? Response::allow()
            : Response::denyAsNotFound();
    }
}
