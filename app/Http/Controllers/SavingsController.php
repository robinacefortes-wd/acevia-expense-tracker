<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Saving;
use Illuminate\Support\Facades\Auth;

class SavingsController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'date'   => 'required|date',
            'note'   => 'nullable|string|max:255',
        ]);

        // Assumes you have a 'user_id' foreign key on your savings table
        $request->user()->savings()->create($validated);

        return back()->with('success', 'Savings entry recorded!');
    }
}