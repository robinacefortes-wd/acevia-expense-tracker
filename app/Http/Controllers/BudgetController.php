<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Budget;
use Illuminate\Support\Facades\Auth; 

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

    public function update(Request $request)
    {
        $validated = $request->validate([
            'id'     => 'required|exists:budgets,id', // We pass the ID in the body
            'limit'  => 'required|numeric|min:0',
            'period' => 'required|in:today,week,month,year',
        ]);

        $budget = $request->user()->budgets()->findOrFail($validated['id']);
        $budget->update([
            'limit'  => $validated['limit'],
            'period' => $validated['period'],
        ]);

        return back()->with('success', 'Budget updated successfully!');
    }


    public function destroy(Request $request) 
    {
        $validated = $request->validate([
            'id' => 'required|exists:budgets,id'
        ]);

        $request->user()->budgets()
            ->where('id', $validated['id'])
            ->delete();

        return back()->with('success', 'Budget deleted!');
    }
}