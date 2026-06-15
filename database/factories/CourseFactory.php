<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\LandingPage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    protected $model = Course::class;

    public function definition(): array
    {
        return [
            'user_id'         => User::factory(),
            'landing_page_id' => LandingPage::factory(),
            'title'           => fake()->unique()->sentence(3),
            'slug'            => fake()->unique()->slug(),
            'logo'            => null,
            'intro_text'      => fake()->paragraph(),
        ];
    }
}
