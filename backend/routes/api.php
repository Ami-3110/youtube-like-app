<?php

use App\Http\Controllers\Api\MovieController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Dashboard
Route::get('/movies', [MovieController::class, 'index']);

// Movie detail
Route::get('/movies/{movie}', [MovieController::class, 'show']);