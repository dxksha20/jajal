<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCaseRequest;
use App\Http\Requests\UpdateCaseRequest;
use App\Models\MedicalCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ApiCaseController extends Controller
{
    /**
     * List medical cases with optional search and filter (Admin & Viewer).
     *
     * GET /api/cases
     */
    public function index(Request $request): JsonResponse
    {
        $query = MedicalCase::with('creator')->latest();

        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('case_number', 'like', "%{$search}%")
                  ->orWhere('surgeon_name', 'like', "%{$search}%")
                  ->orWhere('implant_type', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $cases = $query->paginate(10);

        return response()->json([
            'status' => 'success',
            'meta' => [
                'current_page' => $cases->currentPage(),
                'per_page' => $cases->perPage(),
                'total' => $cases->total(),
                'last_page' => $cases->lastPage(),
            ],
            'data' => $cases->items(),
        ], 200);
    }

    /**
     * Create a new medical case (Admin only).
     *
     * POST /api/cases
     */
    public function store(StoreCaseRequest $request): JsonResponse
    {
        // Check authorization policy
        $response = Gate::inspect('create', MedicalCase::class);
        if ($response->denied()) {
            return response()->json([
                'status' => 'error',
                'message' => 'This action is unauthorized.',
                'error' => $response->message(),
            ], 403);
        }

        $validated = $request->validated();
        $validated['created_by'] = $request->user()->id;

        $case = MedicalCase::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Medical case created successfully.',
            'data' => $case,
        ], 201);
    }

    /**
     * Get a specific medical case details (Admin & Viewer).
     *
     * GET /api/cases/{id}
     */
    public function show($id): JsonResponse
    {
        $case = MedicalCase::with('creator')->find($id);

        if (! $case) {
            return response()->json([
                'status' => 'error',
                'message' => "Medical case with ID #{$id} not found.",
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $case,
        ], 200);
    }

    /**
     * Update a medical case (Admin only).
     *
     * PUT /api/cases/{id}
     */
    public function update(UpdateCaseRequest $request, $id): JsonResponse
    {
        $case = MedicalCase::find($id);

        if (! $case) {
            return response()->json([
                'status' => 'error',
                'message' => "Medical case with ID #{$id} not found.",
            ], 404);
        }

        $response = Gate::inspect('update', $case);
        if ($response->denied()) {
            return response()->json([
                'status' => 'error',
                'message' => 'This action is unauthorized.',
                'error' => $response->message(),
            ], 403);
        }

        $case->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Medical case updated successfully.',
            'data' => $case,
        ], 200);
    }

    /**
     * Delete a medical case (Admin only).
     *
     * DELETE /api/cases/{id}
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $case = MedicalCase::find($id);

        if (! $case) {
            return response()->json([
                'status' => 'error',
                'message' => "Medical case with ID #{$id} not found.",
            ], 404);
        }

        $response = Gate::inspect('delete', $case);
        if ($response->denied()) {
            return response()->json([
                'status' => 'error',
                'message' => 'This action is unauthorized.',
                'error' => $response->message(),
            ], 403);
        }

        $caseNumber = $case->case_number;
        $case->delete();

        return response()->json([
            'status' => 'success',
            'message' => "Medical case #{$caseNumber} deleted successfully.",
        ], 200);
    }
}
