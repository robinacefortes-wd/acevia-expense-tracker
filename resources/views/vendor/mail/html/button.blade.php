@props([
    'url',
    'color' => 'primary',
    'align' => 'center',
])
<table class="action" align="{{ $align }}" width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td align="{{ $align }}">
<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td align="{{ $align }}">
<table border="0" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td style="border-radius: 8px; background-color: #8151d9;">
<a href="{{ $url }}"
   class="button button-{{ $color }}"
   target="_blank"
   rel="noopener"
   style="
       display: inline-block;
       padding: 13px 36px;
       border-radius: 8px;
       font-family: 'Inter', -apple-system, sans-serif;
       font-size: 15px;
       font-weight: 600;
       color: #ffffff !important;
       text-decoration: none;
       background-color: #8151d9;
       -webkit-text-size-adjust: none;
   "
>{!! $slot !!}</a>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>