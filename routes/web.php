<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
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

    // All Transactions Page
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');

    // Financial Actions
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::post('/transactions/update', [TransactionController::class, 'update'])->name('transactions.update');
    Route::post('/transactions/delete', [TransactionController::class, 'destroy'])->name('transactions.destroy');

    Route::post('/savings', [SavingsController::class, 'store'])->name('savings.store');   

    Route::post('/budgets', [BudgetController::class, 'store'])->name('budgets.store');
    Route::post('/budgets/update', [BudgetController::class, 'update'])->name('budgets.update');
    Route::post('/budgets/delete', [BudgetController::class, 'destroy'])->name('budgets.destroy'); 

    

    // Logout Route
    Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/'); 
    })->name('logout');
    
});

require __DIR__.'/settings.php';