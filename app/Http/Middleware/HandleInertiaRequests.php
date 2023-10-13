<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
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
        $user = null;
        if($request->user()) {
            $user = $request->user()->makeHidden(['mailchimp_token', 'mailchimp_lists', 'mailchimp_server', 'braintree_id', 'permissions', 'roles', 'settings' ]);
        }
        $subscription = null;
        $course = $request->route('course');

        if($user) {
            $subscription = $user->subscriptions()->first();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => [
                    'userInfo'      => $user,
                    'permissions'   => $user ? $user->getAllPermissions()->pluck('name') : null,
                    'roles'         => $user ? $user->getRoleNames() : null,
                    'subscription'  => [
                        'name'              => $subscription ? $subscription->name : null,
                        'ends_at'           => $subscription ? $subscription->ends_at : null,
                        'braintree_status'  => $subscription ? $subscription->braintree_status : null,
                        'braintree_id'      => $subscription ? $subscription->braintree_id : null,
                    ],
                    'courseData'   => $course
                ],
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
