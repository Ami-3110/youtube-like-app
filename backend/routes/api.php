<?php

use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\MovieReactionController;
use App\Http\Controllers\api\CommentReactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function(Request $request) {
  return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [LoginController::class, 'store']);

Route::post('/logout', [LoginController::class, 'destroy'])
  ->middleware('auth:sanctum');

// Dashboard
Route::get('/movies', [MovieController::class, 'index']);
// Movie detail
Route::get('/movies/{movie}', [MovieController::class, 'show']);

// MovieReaction Get
Route::get('/movies/{movie}/reactions', [MovieReactionController::class, 'show']);
// Comment Get 
Route::get('/movies/{movie}/comments', [CommentController::class, 'index']);
// CommentReaction Get
Route::get('/comments/{comment}/reaction',
[CommentReactionController::class, 'show']);
  // CommentReaction Post
  Route::post('/comments/{comment}/reaction',[CommentReactionController::class, 'toggle']);

// Authentication required
Route::middleware('auth:sanctum')->group(function () {
  // Comment Post
  Route::post('/movies/{movie}/comments', [CommentController::class, 'store']);
  // Comment Update
  Route::patch('/comments/{comment}', [CommentController::class, 'update']);
  // Comment delete
  Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

  // MovieReaction Post
  Route::post('/movies/{movie}/reactions', [MovieReactionController::class, 'toggle']);



});

