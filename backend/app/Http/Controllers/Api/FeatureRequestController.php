<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeatureRequest;
use Illuminate\Http\Request;

class FeatureRequestController extends Controller
{
    public function index(Request $request)
    {
        $featureRequests = $request->user()
            ->featureRequests()
            ->latest()
            ->get();

        return response()->json($featureRequests);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $featureRequest = $request->user()
            ->featureRequests()
            ->create([
                'title' => $validated['title'],
                'body' => $validated['body'],
                'status' => 'pending',
            ]);

        return response()->json($featureRequest, 201);
    }

    public function withdraw(Request $request, FeatureRequest $featureRequest)
    {
        if ($featureRequest->user_id !== $request->user()->id) {
            abort(403);
        }

        if (in_array($featureRequest->status, ['done', 'rejected', 'withdrawn'], true)) {
            return response()->json([
                'message' => 'このリクエストは取り下げできません',
            ], 422);
        }

        $featureRequest->status = 'withdrawn';
        $featureRequest->save();

        return response()->json($featureRequest);
    }
}