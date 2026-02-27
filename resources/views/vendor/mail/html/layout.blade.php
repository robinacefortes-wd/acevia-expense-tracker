<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
<title>{{ config('app.name') }}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }

body {
    margin: 0;
    padding: 0;
    background-color: #f3f4f6;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
    color: #374151;
}

.wrapper { background-color: #f3f4f6; width: 100%; }
.content { width: 100%; max-width: 600px; margin: 0 auto; }

.header td {
    padding: 32px 0 20px;
    text-align: center;
    background-color: #f3f4f6;
}

.body { background-color: #f3f4f6; padding: 0 24px; }

.inner-body {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    overflow: hidden;
    width: 570px;
}

.content-cell {
    padding: 40px 48px;
    color: #374151;
    font-size: 15px;
    line-height: 1.7;
}

.content-cell p { color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
.content-cell h1, .content-cell h2 { color: #111827; font-weight: 700; margin: 0 0 20px; font-size: 22px; }
.content-cell a { color: #8151d9; text-decoration: none; }

.footer td { padding: 24px 0 32px; text-align: center; background-color: #f3f4f6; }
.footer p { color: #9ca3af; font-size: 12px; margin: 0 0 4px; }

.action { margin: 28px 0; }

.button {
    display: inline-block;
    padding: 13px 32px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none !important;
    text-align: center;
    color: #ffffff !important;
}

.button-primary { background: linear-gradient(135deg, #8151d9 0%, #a178e8 100%); }
.button-success { background: linear-gradient(135deg, #10b981 0%, #34d399 100%); }
.button-error   { background: linear-gradient(135deg, #ef4444 0%, #f87171 100%); }

.subcopy { border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 24px; }
.subcopy p { color: #9ca3af !important; font-size: 12px !important; line-height: 1.6; }
.subcopy a { color: #8151d9 !important; word-break: break-all; }

hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }

@media only screen and (max-width: 600px) {
    .inner-body { width: 100% !important; }
    .footer { width: 100% !important; }
    .content-cell { padding: 32px 24px !important; }
}
@media only screen and (max-width: 500px) {
    .button { width: 100% !important; }
}
</style>
{!! $head ?? '' !!}
</head>
<body>
<table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td align="center">
<table class="content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
{!! $header ?? '' !!}
<tr>
<td class="body" width="100%" cellpadding="0" cellspacing="0" style="border: hidden !important;">
<table class="inner-body" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td class="content-cell">
{!! Illuminate\Mail\Markdown::parse($slot) !!}
{!! $subcopy ?? '' !!}
</td>
</tr>
</table>
</td>
</tr>
{!! $footer ?? '' !!}
</table>
</td>
</tr>
</table>
</body>
</html>