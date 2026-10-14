<?php

namespace App\Http\Controllers;

use App\Models\MedicalCase;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Display the clinical operations dashboard with required metrics.
     */
    public function index()
    {
        // Calculate counts according to Step 6 requirements
        $totalCases = MedicalCase::count();
        $planningCount = MedicalCase::where('status', 'Planning')->count();
        $inReviewCount = MedicalCase::where('status', 'In Review')->count();
        $approvedCount = MedicalCase::where('status', 'Approved')->count();
        $completedCount = MedicalCase::where('status', 'Completed')->count();

        // Optional auxiliary counts
        $draftCount = MedicalCase::where('status', 'Draft')->count();
        $cancelledCount = MedicalCase::where('status', 'Cancelled')->count();

        // High priority alerts
        $highPriorityCount = MedicalCase::where('priority', 'High')->count();

        // Recent cases for dashboard table preview
        $recentCases = MedicalCase::with('creator')
            ->latest()
            ->take(5)
            ->get();

        return view('dashboard', compact(
            'totalCases',
            'planningCount',
            'inReviewCount',
            'approvedCount',
            'completedCount',
            'draftCount',
            'cancelledCount',
            'highPriorityCount',
            'recentCases'
        ));
    }
}
