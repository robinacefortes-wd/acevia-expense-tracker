<x-mail::layout>
{{-- Header --}}
<x-slot:header>
<x-mail::header :url="config('app.url')">
{{ config('app.name') }}
</x-mail::header>
</x-slot:header>

{{-- Body --}}
{!! $slot !!}

{{-- Subcopy --}}
@isset($subcopy)
<x-slot:subcopy>
<x-mail::subcopy>
{!! $subcopy !!}
</x-mail::subcopy>
</x-slot:subcopy>
@endisset

{{-- Footer --}}
<x-slot:footer>
<x-mail::footer>
<p style="margin: 0 0 6px; color: #4b5563; font-size: 12px;">
    © {{ date('Y') }} <strong style="color: #6b7280;">Acevia Expense Tracker</strong>. {{ __('All rights reserved.') }}
</p>
<p style="margin: 0; color: #374151; font-size: 11px;">
    This email was sent because a request was made for your account.<br>
    If you didn't request this, you can safely ignore this email.
</p>
</x-mail::footer>
</x-slot:footer>
</x-mail::layout>