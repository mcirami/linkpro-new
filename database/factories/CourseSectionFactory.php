<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\CourseSection;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CourseSection>
 */
class CourseSectionFactory extends Factory
{
    protected $model = CourseSection::class;

    public function definition(): array
    {
        return [
            'user_id'         => User::factory(),
            'course_id'       => Course::factory(),
            'type'            => 'video',
            'button_position' => '',
            'position'        => 0,
        ];
    }
}
