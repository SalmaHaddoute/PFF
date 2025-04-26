<?php

$domains = env(
    'SANCTUM_STATEFUL_DOMAINS',
    'localhost,127.0.0.1,::1,'.parse_url(env('APP_URL'), PHP_URL_HOST)
);

return [
    'stateful' => explode(',', $domains),
    'guard' => ['web'],
    'expiration' => null,
    'middleware' => [
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
    ],
];