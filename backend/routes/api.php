<?php

use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\CommentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Dashboard
Route::get('/movies', [MovieController::class, 'index']);
// Movie detail
Route::get('/movies/{movie}', [MovieController::class, 'show']);

// Comment Get 
Route::get('/movies/{movie}/comments', [CommentController::class, 'index']);
// Comment Post
Route::post('/movies/{movie}/comments', [CommentController::class, 'store']);