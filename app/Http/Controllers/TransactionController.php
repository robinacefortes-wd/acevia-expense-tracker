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

    public function update(Request $request)
    {
        $validated = $request->validate([
            'id'       => 'required|exists:transactions,id',
            'amount'   => 'required|numeric|min:0',
            'category' => 'required|string',
            'date'     => 'required|date',
            'note'     => 'nullable|string|max:255',
            'type'     => 'required|in:income,expense',
        ]);

        $transaction = $request->user()->transactions()->findOrFail($validated['id']);
        $transaction->update($validated);

        return back()->with('success', 'Transaction updated!');
    }

    public function destroy(Request $request) 
    {
        $validated = $request->validate(['id' => 'required|exists:transactions,id']);
        
        $request->user()->transactions()
            ->where('id', $validated['id'])
            ->delete();

        return back()->with('success', 'Transaction deleted!');
    }
}
