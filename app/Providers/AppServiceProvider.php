<?php

namespace App\Providers;

use App\Services\IpGeolocationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Mchev\Banhammer\Services\IpApiService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Banhammer resolves this out of the container, so replacing the binding
        // makes its country check fail open instead of 403ing every visitor when
        // the geolocation lookup is unavailable.
        $this->app->bind(IpApiService::class, IpGeolocationService::class);
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
