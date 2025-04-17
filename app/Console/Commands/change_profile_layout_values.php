<?php

namespace App\Console\Commands;

use App\Models\Page;
use Illuminate\Console\Command;

class change_profile_layout_values extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:change_profile_layout_values';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Change profile layout values from "layout" to "profile"';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $pages = Page::get();

        foreach($pages as $page) {
            if ($page->profile_layout == "layout_one") {
                $page->update(['profile_layout' => "profile_one"]);
            } elseif ($page->profile_layout == "layout_two") {
                $page->update(['profile_layout' => "profile_two"]);
            } elseif ($page->profile_layout == "layout_three") {
                $page->update(['profile_layout' => "profile_two"]);
            }
        }

        return 0;
    }
}
