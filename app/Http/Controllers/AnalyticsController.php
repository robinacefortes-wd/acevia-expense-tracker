<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AnalyticsController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $transactions = $user->transactions()
            ->orderBy('date', 'asc')
            ->get();

        $totalSavings = $user->savings()->sum('amount');

        return Inertia::render('Analytics', [
            'transactions' => $transactions,
            'totalSavings' => $totalSavings,
        ]);
    }
}