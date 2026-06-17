<?php

namespace App\Policies;

use App\Models\Folder;
use App\Models\User;
use App\Policies\Concerns\AuthorizesOwnership;
use Illuminate\Auth\Access\Response;

class FolderPolicy
{
    use AuthorizesOwnership;

    public function manage(User $user, Folder $folder): Response
    {
        return $this->ownerOrForbidden($user, $folder);
    }
}
