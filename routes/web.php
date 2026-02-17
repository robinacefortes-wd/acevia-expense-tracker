<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\SavingsController;
use App\Http\Controllers\BudgetController;

// 1. Public Routes
Route::get('/', function () {
    return Inertia::render('landingpage', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// 2. Protected Routes (Must be logged in)
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard - Using your new Controller
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Financial Actions
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::post('/savings', [SavingsController::class, 'store'])->name('savings.store');
    Route::post('/budgets', [BudgetController::class, 'store'])->name('budgets.store');
    
});

require __DIR__.'/settings.php';