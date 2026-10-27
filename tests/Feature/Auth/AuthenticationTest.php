<?php

use App\Models\User;
use App\Providers\RouteServiceProvider;

// LoginRequest takes a single 'identity' field and works out for itself whether
// it holds an email or a username, so these post 'identity' rather than Breeze's
// 'email' -- posting 'email' fails validation before credentials are checked.
// Note the password-reset controllers call the equivalent field 'login'.

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'identity' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(RouteServiceProvider::HOME);
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'identity' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});
