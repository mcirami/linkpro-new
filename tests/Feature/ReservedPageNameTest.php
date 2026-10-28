<?php

use App\Models\Page;
use App\Models\User;
use App\Rules\NotReservedPageName;
use Illuminate\Support\Facades\Validator;

/**
 * Pages are served by the catch-all GET /{page}, so a page named after an
 * existing top-level route is unreachable the moment it is created.
 */

function validatePageName(string $name): bool
{
    return Validator::make(
        ['name' => $name],
        ['name' => [new NotReservedPageName]]
    )->passes();
}

test('the reserved list is derived from the application routes', function () {
    $reserved = NotReservedPageName::reservedNames();

    expect($reserved)
        ->toContain('login', 'register', 'dashboard', 'admin', 'forgot-password')
        ->not->toContain('/');

    // Only a single static segment can shadow a page. '/offers/{offer}/{user}'
    // never matches a bare '/offers', so that name stays available.
    expect($reserved)->not->toContain('offers');
});

test('a page may not be named after a top-level route', function (string $name) {
    expect(validatePageName($name))->toBeFalse();
})->with(['login', 'register', 'dashboard', 'verify-email', 'plans']);

test('the check cannot be bypassed by casing or underscores', function (string $name) {
    expect(validatePageName($name))->toBeFalse();
})->with(['Login', 'LOGIN', 'forgot_password', 'Verify_Email']);

test('ordinary page names are still allowed', function (string $name) {
    expect(validatePageName($name))->toBeTrue();
})->with(['matteo', 'my-links', 'offers', 'api', 'login-page', 'mylogin']);

test('creating a page with a reserved name is rejected', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson(route('page.new'), ['name' => 'login'])
        ->assertStatus(422)
        ->assertJsonValidationErrors('name');

    expect(Page::where('name', 'login')->exists())->toBeFalse();
});

test('creating a page with an available name is accepted', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson(route('page.new'), ['name' => 'my-new-page'])
        ->assertSuccessful();

    expect(Page::where('name', 'my-new-page')->exists())->toBeTrue();
});
