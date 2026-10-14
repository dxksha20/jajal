<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCaseRequest;
use App\Http\Requests\UpdateCaseRequest;
use App\Models\MedicalCase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class CaseController extends Controller
{
    /**
     * Display a listing of medical cases with search, status filtering, and 10 per page pagination.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', MedicalCase::class);

        $query = MedicalCase::with('creator')->latest();

        // Search by case number OR surgeon name
        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('case_number', 'like', "%{$search}%")
                  ->orWhere('surgeon_name', 'like', "%{$search}%")
                  ->orWhere('implant_type', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status') && in_array($request->input('status'), MedicalCase::STATUSES)) {
            $query->where('status', $request->input('status'));
        }

        // Filter by priority
        if ($request->filled('priority') && in_array($request->input('priority'), MedicalCase::PRIORITIES)) {
            $query->where('priority', $request->input('priority'));
        }

        // Paginate exactly 10 cases per page as required by Step 6
        $cases = $query->paginate(10)->withQueryString();

        return view('cases.index', compact('cases'));
    }

    /**
     * Show form to create a new case (Admin only).
     */
    public function create()
    {
        Gate::authorize('create', MedicalCase::class);

        return view('cases.create');
    }

    /**
     * Store newly created case in database.
     */
    public function store(StoreCaseRequest $request)
    {
        Gate::authorize('create', MedicalCase::class);

        $validated = $request->validated();
        $validated['created_by'] = Auth::id();

        $medicalCase = MedicalCase::create($validated);

        return redirect()->route('cases.show', $medicalCase)
            ->with('success', "Medical case {$medicalCase->case_number} created successfully.");
    }

    /**
     * Display the specified medical case dossier (Admin and Viewer).
     */
    public function show(MedicalCase $case)
    {
        Gate::authorize('view', $case);

        $case->load('creator');

        return view('cases.show', compact('case'));
    }

    /**
     * Show the form for editing the case (Admin only).
     */
    public function edit(MedicalCase $case)
    {
        Gate::authorize('update', $case);

        return view('cases.edit', compact('case'));
    }

    /**
     * Update the medical case in database (Admin only).
     */
    public function update(UpdateCaseRequest $request, MedicalCase $case)
    {
        Gate::authorize('update', $case);

        $case->update($request->validated());

        return redirect()->route('cases.show', $case)
            ->with('success', "Medical case {$case->case_number} updated successfully.");
    }

    /**
     * Update only the status of a case (Admin only).
     */
    public function updateStatus(Request $request, MedicalCase $case)
    {
        Gate::authorize('update', $case);

        $request->validate([
            'status' => ['required', 'in:' . implode(',', MedicalCase::STATUSES)],
        ]);

        $case->update(['status' => $request->input('status')]);

        return back()->with('success', "Case status updated to {$case->status}.");
    }

    /**
     * Remove the case from database (Admin only).
     */
    public function destroy(MedicalCase $case)
    {
        Gate::authorize('delete', $case);

        $caseNumber = $case->case_number;
        $case->delete();

        return redirect()->route('cases.index')
            ->with('success', "Medical case {$caseNumber} deleted successfully.");
    }
}
