<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;

class ProfileController extends Controller
{
    private function getCloudinary(): Cloudinary
    {
        return new Cloudinary(
            Configuration::instance([
                'cloud' => [
                    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                    'api_key'    => env('CLOUDINARY_API_KEY'),
                    'api_secret' => env('CLOUDINARY_API_SECRET'),
                ],
                'url' => ['secure' => true],
            ])
        );
    }

    public function index()
    {
        $user = Auth::user();
        $transactions = $user->transactions()->get();

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
        $cloudinary = $this->getCloudinary();

        // Delete old avatar if exists
        if ($user->avatar && str_contains($user->avatar, 'cloudinary.com')) {
            $publicId = pathinfo(parse_url($user->avatar, PHP_URL_PATH), PATHINFO_FILENAME);
            $cloudinary->uploadApi()->destroy('acevia/avatars/' . $publicId);
        }

        // Upload new avatar
        $result = $cloudinary->uploadApi()->upload(
            $request->file('avatar')->getRealPath(),
            [
                'folder' => 'acevia/avatars',
                'transformation' => [
                    'width'   => 300,
                    'height'  => 300,
                    'crop'    => 'fill',
                    'gravity' => 'face',
                ],
            ]
        );

        $avatarUrl = $result['secure_url'];
        $user->update(['avatar' => $avatarUrl]);

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

        if ($user->avatar && str_contains($user->avatar, 'cloudinary.com')) {
            $publicId = pathinfo(parse_url($user->avatar, PHP_URL_PATH), PATHINFO_FILENAME);
            $cloudinary = $this->getCloudinary();
            $cloudinary->uploadApi()->destroy('acevia/avatars/' . $publicId);
        }

        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}