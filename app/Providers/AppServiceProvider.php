<?php

namespace App\Providers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Laravel\Breeze\BreezeServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if ($this->app->environment('local')) {
            $this->app->register( BreezeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(Request $request): void
    {
        Schema::defaultStringLength(191);

        if ($request->server->has('HTTP_X_ORIGINAL_HOST')) {
            $request->server->set('HTTP_X_FORWARDED_HOST', $request->server->get('HTTP_X_ORIGINAL_HOST'));
            $request->headers->set('X_FORWARDED_HOST', $request->server->get('HTTP_X_ORIGINAL_HOST'));
        }

        //Voyager::addAction(\App\Actions\BanUser::class);
    }
}
