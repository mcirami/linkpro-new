<?php

namespace App\Rules;

use App\Models\Page;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Route as Router;

/**
 * Pages are served by the catch-all GET /{page} at the bottom of routes/web.php,
 * so a route that already answers a GET on a single static path segment shadows
 * any page of that name -- the page is simply unreachable, with no indication to
 * the owner that their link is dead.
 *
 * The reserved list is read from the router rather than hard-coded, so adding a
 * top-level route reserves its name automatically and the two cannot drift.
 */
class NotReservedPageName implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            return;
        }

        // Compare the stored form: 'Login' and 'log_in' both become 'login'
        // and 'log-in' once saved, so checking the raw input would be bypassable.
        if (in_array(Page::normalizeName($value), static::reservedNames(), true)) {
            $fail('The name ":input" is reserved by the application. Please choose a different one.');
        }
    }

    /**
     * Every name that an existing route would shadow.
     *
     * @return array<int, string>
     */
    public static function reservedNames(): array
    {
        return collect(Router::getRoutes())
            ->filter(fn (Route $route) => in_array('GET', $route->methods(), true))
            ->map(fn (Route $route) => $route->uri())
            ->reject(fn (string $uri) => $uri === '/'
                || str_contains($uri, '/')
                || str_contains($uri, '{'))
            ->unique()
            ->sort()
            ->values()
            ->all();
    }
}
