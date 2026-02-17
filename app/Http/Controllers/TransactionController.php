<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'category' => 'required|string',
            'date' => 'required|date',
            'note' => 'nullable|string',
            'type' => 'required|string', // This will be 'income'
        ]);

        Auth::user()->transactions()->create($validated);

        return back()->with('success', 'Income added successfully!');
    }
}
