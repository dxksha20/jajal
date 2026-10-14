@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="space-y-6">
    <!-- Top Greeting Card -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Clinical Operations Dashboard</h1>
            <p class="text-sm text-slate-500 mt-1">
                Welcome back, <span class="font-semibold text-slate-800">{{ Auth::user()->name }}</span>.
                @if(Auth::user()->isAdmin())
                    You have <span class="text-blue-600 font-bold">Admin</span> authorization (Full CRUD & Status permissions).
                @else
                    You have <span class="text-emerald-600 font-bold">Viewer</span> authorization (Read-only access).
                @endif
            </p>
        </div>

        <div class="flex items-center gap-3">
            <a href="{{ route('cases.index') }}" class="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                View All Cases
            </a>
            @if(Auth::user()->isAdmin())
                <a href="{{ route('cases.create') }}" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition">
                    + Create Medical Case
                </a>
            @endif
        </div>
    </div>

    <!-- REQUIRED DASHBOARD METRICS: Total Cases, Planning, In Review, Approved, Completed -->
    <div>
        <div class="flex items-center justify-between mb-3">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-500">
                Medical Case Metrics (Step 6 Mandatory Deliverable)
            </h2>
            <span class="text-xs text-slate-400">Live Database Aggregations</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- Total Cases -->
            <a href="{{ route('cases.index') }}" class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 transition group">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Total Cases</span>
                <div class="mt-2 text-3xl font-extrabold text-slate-900">{{ $totalCases }}</div>
                <div class="mt-2 text-xs text-blue-600 font-medium group-hover:underline">Browse all cases &rarr;</div>
            </a>

            <!-- Planning -->
            <a href="{{ route('cases.index', ['status' => 'Planning']) }}" class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 transition group">
                <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Planning</span>
                <div class="mt-2 text-3xl font-extrabold text-blue-900">{{ $planningCount }}</div>
                <div class="mt-2 text-xs text-blue-600 font-medium group-hover:underline">Pre-op cases &rarr;</div>
            </a>

            <!-- In Review -->
            <a href="{{ route('cases.index', ['status' => 'In Review']) }}" class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-amber-400 transition group">
                <span class="text-xs font-bold uppercase tracking-wider text-amber-600">In Review</span>
                <div class="mt-2 text-3xl font-extrabold text-amber-900">{{ $inReviewCount }}</div>
                <div class="mt-2 text-xs text-amber-600 font-medium group-hover:underline">Pending approval &rarr;</div>
            </a>

            <!-- Approved -->
            <a href="{{ route('cases.index', ['status' => 'Approved']) }}" class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 transition group">
                <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">Approved</span>
                <div class="mt-2 text-3xl font-extrabold text-emerald-900">{{ $approvedCount }}</div>
                <div class="mt-2 text-xs text-emerald-600 font-medium group-hover:underline">Ready for OR &rarr;</div>
            </a>

            <!-- Completed -->
            <a href="{{ route('cases.index', ['status' => 'Completed']) }}" class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-teal-400 transition group">
                <span class="text-xs font-bold uppercase tracking-wider text-teal-700">Completed</span>
                <div class="mt-2 text-3xl font-extrabold text-teal-900">{{ $completedCount }}</div>
                <div class="mt-2 text-xs text-teal-700 font-medium group-hover:underline">Closed surgeries &rarr;</div>
            </a>
        </div>
    </div>

    <!-- Recent Cases Table -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-slate-900">Recent Medical Case Dossiers</h3>
            <a href="{{ route('cases.index') }}" class="text-xs text-blue-600 font-semibold hover:underline">
                View All Cases &rarr;
            </a>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead class="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
                    <tr>
                        <th class="py-3 px-4">Case #</th>
                        <th class="py-3 px-4">Surgeon</th>
                        <th class="py-3 px-4">Implant Type</th>
                        <th class="py-3 px-4">Status</th>
                        <th class="py-3 px-4">Priority</th>
                        <th class="py-3 px-4">Surgery Date</th>
                        <th class="py-3 px-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse ($recentCases as $c)
                        <tr class="hover:bg-slate-50/60 transition">
                            <td class="py-3 px-4 font-mono font-bold text-blue-600">{{ $c->case_number }}</td>
                            <td class="py-3 px-4 font-medium text-slate-900">{{ $c->surgeon_name }}</td>
                            <td class="py-3 px-4 text-slate-600 truncate max-w-xs">{{ $c->implant_type }}</td>
                            <td class="py-3 px-4">
                                <span class="px-2 py-0.5 rounded text-xs font-semibold
                                    {{ $c->status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                       ($c->status === 'In Review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                       ($c->status === 'Planning' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                       ($c->status === 'Completed' ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-slate-100 text-slate-700'))) }}">
                                    {{ $c->status }}
                                </span>
                            </td>
                            <td class="py-3 px-4">
                                <span class="px-2 py-0.5 rounded text-xs font-semibold
                                    {{ $c->priority === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                       ($c->priority === 'Medium' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200') }}">
                                    {{ $c->priority }}
                                </span>
                            </td>
                            <td class="py-3 px-4 text-slate-500 text-xs">{{ $c->surgery_date ? $c->surgery_date->format('M d, Y') : 'Not scheduled' }}</td>
                            <td class="py-3 px-4 text-right">
                                <a href="{{ route('cases.show', $c) }}" class="text-xs bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2.5 py-1 rounded-md font-medium transition">
                                    View
                                </a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="py-6 text-center text-slate-500">No medical cases recorded yet.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
