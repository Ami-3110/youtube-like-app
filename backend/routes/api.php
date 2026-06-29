<?php

use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\MovieReactionController;
use App\Http\Controllers\Api\CommentReactionController;
use App\Http\Controllers\Api\FollowController;
use App\Http\Controllers\Api\MovieUploadController;
use App\Http\Controllers\Api\TopicController;
use App\Http\Controllers\Api\UserChannelController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function(Request $request) {
  return $request->user();
})->middleware('auth:sanctum');

// Login
Route::post('/login', [LoginController::class, 'store']);
//Logout
Route::post('/logout', [LoginController::class, 'destroy'])
  ->middleware('auth:sanctum');

// Dashboard
Route::get('/movies', [MovieController::class, 'index']);
// Movie detail
Route::get('/movies/{movie}', [MovieController::class, 'show']);
// Topics
Route::get('/topics', [TopicController::class, 'index']);

// MovieReaction get
Route::get('/movies/{movie}/reactions', [MovieReactionController::class, 'show']);
// Comment get 
Route::get('/movies/{movie}/comments', [CommentController::class, 'index']);
// CommentReaction get
Route::get('/comments/{comment}/reactions',
[CommentReactionController::class, 'show']);
// RecommendMovies get
Route::get('/movies/{movie}/related', [MovieController::class, 'related']);
// Follow get
Route::get('/users/{user}/follow', [FollowController::class, 'show']);

// Channel get
Route::get('users/{user}/channel', [UserChannelController::class, 'show']);

// Authentication required
Route::middleware('auth:sanctum')->group(function () {
  // Comment post
  Route::post('/movies/{movie}/comments', [CommentController::class, 'store']);
  // Comment update
  Route::patch('/comments/{comment}', [CommentController::class, 'update']);
  // Comment delete
  Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

  // MovieReaction post
  Route::post('/movies/{movie}/reactions', [MovieReactionController::class, 'toggle']);

  // CommentReaction post
  Route::post('/comments/{comment}/reactions',[CommentReactionController::class, 'toggle']);

  //MovieUpload
  Route::post('/movies', [MovieUploadController::class, 'store']);

  // Follow post
  Route::post('/users/{user}/follow',[FollowController::class, 'toggle']);
  // Following index
  Route::get('/me/following', [FollowController::class, 'index']);


});

