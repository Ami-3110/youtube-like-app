<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\GoogleAuthController;

Route::get('/api/auth/google', [GoogleAuthController::class, 'redirect']);
Route::get('/api/auth/google/callback', [GoogleAuthController::class, 'callback']);