<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Movie::query()
            ->with([
              'user:id,name',
              'topics:id,name'
              ])
            // ->select([
            //   'id',
            //   'user_id',
            //   'title',
            //   ])
            ->get()
            ->map(function ($movie) {
              return [
                'id' => $movie->id,
                'title' => $movie->title,
                'user' => $movie->user->name,
                'thumbnail_path' => $movie->thumbnail_path,
                'topics' => $movie->topics->pluck('name'),
                'views' => $movie->views,
                'created_at' => $movie->created_at,
              ];
            });
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Movie $movie)
    {
        $movie->increment('views');

        $movie->load([
          'user:id,name',
          'topics:id,name',
        ]);

        return[
          'id' => $movie->id,
          'title' => $movie->title,
          'description' => $movie->description,
          'user' => $movie->user->name,
          'movie_path' => $movie->movie_path,
          'thumbnail_path' => $movie->thumbnail_path,
          'topics' => $movie->topics->pluck('name'),
          'views' => $movie->views,
          'created_at' => $movie->created_at,
        ];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
