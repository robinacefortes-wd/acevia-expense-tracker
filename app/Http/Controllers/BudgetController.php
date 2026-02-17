<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Budget;

class BudgetController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'limit'    => 'required|numeric|min:0',
            'period'   => 'required|in:today,week,month,year',
        ]);

        $request->user()->budgets()->create($validated);

        return back()->with('success', 'Budget created successfully!');
    }
}