<?php

namespace Database\Factories;

use App\Models\Link;
use App\Models\Page;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Link>
 */
class LinkFactory extends Factory
{
    protected $model = Link::class;

    public function definition(): array
    {
        return [
            'user_id'           => User::factory(),
            'page_id'           => Page::factory(),
            'folder_id'         => '',
            'position'          => 0,
            'mailchimp_list_id' => '',
        ];
    }
}
