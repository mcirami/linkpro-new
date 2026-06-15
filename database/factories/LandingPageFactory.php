<?php

namespace Database\Factories;

use App\Models\LandingPage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LandingPage>
 */
class LandingPageFactory extends Factory
{
    protected $model = LandingPage::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title'   => fake()->unique()->sentence(3),
            'slug'    => fake()->unique()->slug(),
        ];
    }
}
