<?php

namespace App\Console\Commands;

use App\Models\Link;
use Illuminate\Console\Command;

class ChangeStdLinkTypeValue extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'change:linkTypeValue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Change Standard link type value to URL';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $links = Link::get();
        foreach($links as $link) {
            if ($link->type == "standard") {
                $link->update( [ 'type' => 'url' ] );
            }
        }
    }
}
