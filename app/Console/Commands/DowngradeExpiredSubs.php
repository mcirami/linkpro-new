<?php

namespace App\Console\Commands;

use App\Jobs\JobDowngradeExpiredSubs;
use App\Models\Folder;
use App\Models\Subscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class DowngradeExpiredSubs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:downgradeExpiredSubs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for expired subscriptions where functionality has not been updated to reflect status';

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
        $subscriptions = Subscription::where('ends_at', '<', Carbon::now())->where('downgraded', false)->get();

        if ($subscriptions->isNotEmpty()) {

            retry(20, function() use ($subscriptions) {
                JobDowngradeExpiredSubs::dispatch($subscriptions);
            }, 200);

        }

        return 0;
    }
}
