<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;
use App\Policies\Concerns\AuthorizesOwnership;
use Illuminate\Auth\Access\Response;

class CoursePolicy
{
    use AuthorizesOwnership;

    public function manage(User $user, Course $course): Response
    {
        return $this->ownerOrNotFound($user, $course);
    }
}
