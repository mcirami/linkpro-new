<?php

namespace Database\Factories;

use App\Models\LandingPage;
use App\Models\LandingPageSection;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LandingPageSection>
 */
class LandingPageSectionFactory extends Factory
{
    protected $model = LandingPageSection::class;

    public function definition(): array
    {
        return [
            'user_id'         => User::factory(),
            'landing_page_id' => LandingPage::factory(),
            'type'            => 'text',
            'text'            => fake()->sentence(),
            'position'        => 0,
        ];
    }
}
