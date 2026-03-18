<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('dashboard', [
            'transactions' => $user->transactions()
                ->orderBy('date', 'desc')
                ->orderBy('created_at', 'desc')
                ->get(),
            'budgets' => $user->budgets()->get(),
            'savings' => $user->savings()->get(),
            'totalBalance' => $user->transactions()->where('type', 'income')->sum('amount') 
                            - $user->transactions()->where('type', 'expense')->sum('amount'),
        ]);
    }
}