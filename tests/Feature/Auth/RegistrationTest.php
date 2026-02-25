<?php

test('registration screen can be rendered', function () {
    $this->withoutVite();

    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'first_name'            => 'Test',
        'last_name'             => 'User',
        'phone'                 => '1234567890',
        'email'                 => 'test@example.com',
        'password'              => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});