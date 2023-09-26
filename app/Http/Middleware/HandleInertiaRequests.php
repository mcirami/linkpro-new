<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $subscription = null;

        if($user) {
            $subscription = $user->subscriptions()->first();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => [
                    'username'      => $user ? $user->username : null,
                    'roles'         => $user ? $user->roles : null,
                    'avatar'        => $user ? $user->avatar : null,
                    'subscription'  => [
                        'name'      => $subscription ? $subscription->name : null,
                        'ends_at'   => $subscription ? $subscription->ends_at : null
                    ]
                ],
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
