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
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\FeatureRequestController;
use App\Http\Controllers\Api\AdminFeatureRequestController;
use App\Http\Controllers\Api\AdminTopicController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\GoogleAuthController;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function(Request $request) {
  return $request->user();
})->middleware('auth:sanctum');

// Register
Route::post('/register', RegisterController::class);
// Login
Route::post('/login', [LoginController::class, 'store']);
//Logout
Route::post('/logout', [LoginController::class, 'destroy'])
  ->middleware('auth:sanctum');

// Google OAuth
Route::get('/auth/google', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

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
Route::get('/users/{user}/channel', [UserChannelController::class, 'show']);

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

  //Movie Upload
  Route::post('/movies', [MovieUploadController::class, 'store']);
  //Movie Update
  Route::patch('/movies/{movie}', [MovieUploadController::class, 'update']);
  //Movie Delete
  Route::delete('/movies/{movie}', [MovieUploadController::class, 'destroy']);

  // Follow post
  Route::post('/users/{user}/follow',[FollowController::class, 'toggle']);
  // Following index
  Route::get('/me/following', [FollowController::class, 'index']);

  // Channel edit
  Route::patch('/me/profile',[ProfileController::class, 'update']);

  // FeatureRequest get
  Route::get('/me/feature-requests', [FeatureRequestController::class, 'index']);
  // FeatureRequest post
  Route::post('/feature-requests', [FeatureRequestController::class, 'store']);
  // FeatureRequest withdraw
  Route::patch(
      '/feature-requests/{featureRequest}/withdraw',
      [FeatureRequestController::class, 'withdraw']
  );

  // Email edit
  Route::patch('/me/email',[AccountController::class, 'updateEmail']);
  // Password edit
  Route::patch('/me/password',[AccountController::class, 'updatePassword']);
  // Account delete
  Route::delete('/me/account',[AccountController::class, 'destroy']);
  
  // Admin request get
  Route::get('/admin/feature-requests', [AdminFeatureRequestController::class, 'index']);
  // Admin request patch
  Route::patch(
    '/admin/feature-requests/{featureRequest}', [AdminFeatureRequestController::class, 'update']
    );
  // Admin topic get
  Route::get('/admin/topics', [AdminTopicController::class, 'index']);
  // Admin topic post
  Route::post('/admin/topics', [AdminTopicController::class, 'store']);
  // Admin topic delete
  Route::delete('/admin/topics/{topic}', [AdminTopicController::class, 'destroy']);
  // Admin user get
  Route::get('/admin/users', [AdminUserController::class, 'index']);
  // Admin user delete
  Route::delete('/admin/users/{user}', [AdminUserController::class, 'destroy']);
});

