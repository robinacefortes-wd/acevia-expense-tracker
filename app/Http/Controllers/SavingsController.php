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

        // Check if this is an update from dashboard stats
        if ($request->has('update_total') && $request->update_total) {
            // Clear existing savings and set new total
            $request->user()->savings()->delete();
            $request->user()->savings()->create($validated);
        } else {
            // Regular savings entry
            $request->user()->savings()->create($validated);
        }

        return back()->with('success', 'Savings entry recorded!');
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'date'   => 'required|date',
            'note'   => 'nullable|string|max:255',
        ]);

        // Replace all savings with this single entry (for dashboard edit)
        $user = $request->user();
        $user->savings()->delete();
        $user->savings()->create($validated);

        return back()->with('success', 'Savings updated successfully!');
    }
}
