<?php

namespace App\Policies;

use App\Models\CourseSection;
use App\Models\User;
use App\Policies\Concerns\AuthorizesOwnership;
use Illuminate\Auth\Access\Response;

class CourseSectionPolicy
{
    use AuthorizesOwnership;

    public function manage(User $user, CourseSection $courseSection): Response
    {
        return $this->ownerOrNotFound($user, $courseSection);
    }
}
