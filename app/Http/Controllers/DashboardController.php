<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('Dashboard', [
            'transactions' => $user->transactions()->latest()->take(10)->get(),
            'budgets' => $user->budgets()->get(),
            'savings' => $user->savings()->get(),
            'totalBalance' => $user->transactions()->where('type', 'income')->sum('amount') 
                            - $user->transactions()->where('type', 'expense')->sum('amount'),
        ]);
    }
}