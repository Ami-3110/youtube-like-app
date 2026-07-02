<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use Illuminate\Http\Request;

class AdminTopicController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user()->is_admin) {
            abort(403);
        }

        return Topic::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        if (!$request->user()->is_admin) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50', 'unique:topics,name'],
        ]);

        $topic = Topic::create($validated);

        return response()->json($topic, 201);
    }

    public function destroy(Request $request, Topic $topic)
    {
        if (!$request->user()->is_admin) {
            abort(403);
        }

        $topic->delete();

        return response()->json([
            'message' => 'Topic deleted',
        ]);
    }
}