<?php

namespace Database\Factories;

use App\Models\Offer;
use App\Models\OfferClick;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OfferClick>
 */
class OfferClickFactory extends Factory
{
    protected $model = OfferClick::class;

    public function definition(): array
    {
        return [
            // id is a UUID assigned by the model's UUID trait on create.
            'ip_address'  => fake()->ipv4(),
            'referral_id' => null,
            'offer_id'    => Offer::factory(),
            'is_unique'   => true,
        ];
    }
}
