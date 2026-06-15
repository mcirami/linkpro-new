<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\OfferClick;
use App\Models\Purchase;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Purchase>
 */
class PurchaseFactory extends Factory
{
    protected $model = Purchase::class;

    public function definition(): array
    {
        return [
            'offer_click_id'  => OfferClick::factory(),
            'user_id'         => User::factory(),
            'course_id'       => Course::factory(),
            'customer_id'     => 'cus_' . fake()->bothify('##########'),
            'transaction_id'  => fake()->unique()->uuid(),
            'purchase_amount' => 100.00,
            'pm_last_four'    => null,
            'pm_type'         => 'card',
            'status'          => 'active',
        ];
    }
}
