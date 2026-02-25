<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    public function create(array $input): User
    {
        Validator::make($input, [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name'  => ['required', 'string', 'max:255'],
            'phone'      => ['required', 'string', 'max:20'],
            'email'      => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'   => $this->passwordRules(),
        ])->validate();

        return User::create([
            'first_name' => $input['first_name'],
            'last_name'  => $input['last_name'],
            'phone'      => $input['phone'],
            'email'      => $input['email'],
            'password'   => $input['password'],
        ]);
    }
}