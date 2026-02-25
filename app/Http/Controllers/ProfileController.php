<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $transactions = $user->transactions()->get();

        // Longest no-spend streak
        $expenseDates = $user->transactions()
            ->where('type', 'expense')
            ->orderBy('date', 'asc')
            ->pluck('date')
            ->map(fn($d) => \Carbon\Carbon::parse($d)->toDateString())
            ->unique()
            ->values()
            ->toArray();

        $longestStreak = 0;
        if (!empty($expenseDates)) {
            $allDates = collect();
            $start = \Carbon\Carbon::parse($user->created_at)->startOfDay();
            $end = \Carbon\Carbon::now()->startOfDay();
            for ($d = $start->copy(); $d->lte($end); $d->addDay()) {
                $allDates->push($d->toDateString());
            }
            $streak = 0;
            $best = 0;
            foreach ($allDates as $date) {
                if (!in_array($date, $expenseDates)) {
                    $streak++;
                    $best = max($best, $streak);
                } else {
                    $streak = 0;
                }
            }
            $longestStreak = $best;
        }

        return Inertia::render('Profile', [
            'user' => $user,
            'stats' => [
                'totalTransactions' => $transactions->count(),
                'longestNoSpendStreak' => $longestStreak,
                'memberSince' => \Carbon\Carbon::parse($user->created_at)->format('F j, Y'),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'phone'      => 'required|string|max:20',
            'email'      => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return back()->with('success', 'Profile updated successfully!');
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $user = Auth::user();

        // Delete old avatar if exists
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return back()->with('success', 'Avatar updated!');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password'      => 'required',
            'password'              => 'required|min:8|confirmed',
            'password_confirmation' => 'required',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Current password is incorrect.']);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return back()->with('success', 'Password updated successfully!');
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'password' => 'required',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->password, $user->password)) {
            return back()->withErrors(['password' => 'Incorrect password.']);
        }

        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}