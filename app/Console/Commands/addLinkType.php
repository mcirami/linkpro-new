<?php

namespace App\Console\Commands;

use App\Models\Link;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class addLinkType extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'add:linkType';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add a link type to all links';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $links = Link::get();

        foreach ($links as $link) {
            if ($link->mailchimp_list_id != null) {
                $link->update(["type" => "mailchimp"]);
            } else {
                $link->update(["type" => "standard"]);
            }
        }

        return 0;
    }
}
