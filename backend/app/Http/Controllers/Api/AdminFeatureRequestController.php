<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeatureRequest;
use Illuminate\Http\Request;

class AdminFeatureRequestController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user()->is_admin) {
            abort(403);
        }

        return FeatureRequest::with('user')
            ->latest()
            ->paginate(10);
    }

    public function update(Request $request, FeatureRequest $featureRequest)
    {
        if (!$request->user()->is_admin) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => [
                'required',
                'in:pending,reviewing,done,rejected,withdrawn',
            ],
            'admin_comment' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        $featureRequest->update($validated);

        return response()->json($featureRequest);
    }
}
