@extends('layouts.app')

@section('title', 'Case ' . $case->case_number)

@section('content')
<div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
            <a href="{{ route('cases.index') }}" class="p-2 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition">
                &larr;
            </a>
            <div>
                <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-xl text-blue-600">{{ $case->case_number }}</span>
                    <span class="px-2.5 py-0.5 text-xs font-semibold rounded-md border
                        {{ $case->status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                           ($case->status === 'In Review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                           ($case->status === 'Planning' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                           ($case->status === 'Completed' ? 'bg-teal-50 text-teal-800 border-teal-200' : 'bg-slate-100 text-slate-700 border-slate-200'))) }}">
                        {{ $case->status }}
                    </span>
                    <span class="px-2.5 py-0.5 text-xs font-semibold rounded-md border
                        {{ $case->priority === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                           ($case->priority === 'Medium' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200') }}">
                        {{ $case->priority }} Priority
                    </span>
                </div>
                <p class="text-xs text-slate-500 mt-1">Database ID #{{ $case->id }} &bull; Medical Implant Dossier</p>
            </div>
        </div>

        <div class="flex items-center gap-2">
            @if(Auth::user()->isAdmin())
                <a href="{{ route('cases.edit', $case) }}" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition">
                    Edit Case
                </a>

                <form method="POST" action="{{ route('cases.destroy', $case) }}" class="inline" onsubmit="return confirm('Permanently delete this case?');">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition cursor-pointer">
                        Delete
                    </button>
                </form>
            @else
                <span class="text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-200">
                    Viewer (Read-only)
                </span>
            @endif
        </div>
    </div>

    <!-- Main Dossier Card -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-6">
            <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <h2 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Clinical Parameters</h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <span class="text-xs text-slate-400">Implant Type</span>
                        <p class="font-semibold text-slate-900 mt-1">{{ $case->implant_type }}</p>
                    </div>

                    <div class="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <span class="text-xs text-slate-400">Attending Surgeon</span>
                        <p class="font-semibold text-slate-900 mt-1">{{ $case->surgeon_name }}</p>
                    </div>

                    <div class="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <span class="text-xs text-slate-400">Surgery Date</span>
                        <p class="font-semibold text-slate-900 mt-1">{{ $case->surgery_date ? $case->surgery_date->format('F d, Y') : 'Not scheduled' }}</p>
                    </div>

                    <div class="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <span class="text-xs text-slate-400">Patient Reference Code</span>
                        <p class="font-mono font-bold text-slate-900 mt-1">{{ $case->patient_ref_code }}</p>
                        <span class="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Dummy/Anonymized</span>
                    </div>
                </div>

                @if(Auth::user()->isAdmin())
                    <div class="mt-6 pt-5 border-t border-slate-200">
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            Quick Status Progression (Admin Only):
                        </label>
                        <div class="flex flex-wrap gap-2">
                            @foreach(['Draft', 'Planning', 'In Review', 'Approved', 'Completed', 'Cancelled'] as $st)
                                <form method="POST" action="{{ route('cases.updateStatus', $case) }}" class="inline">
                                    @csrf
                                    @method('PATCH')
                                    <input type="hidden" name="status" value="{{ $st }}">
                                    <button type="submit" class="px-3 py-1 text-xs font-medium rounded-lg border transition {{ $case->status === $st ? 'bg-blue-600 text-white font-bold' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' }}">
                                        {{ $st }}
                                    </button>
                                </form>
                            @endforeach
                        </div>
                    </div>
                @endif
            </div>
        </div>

        <div class="space-y-6">
            <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Audit & Records</h3>

                <div class="space-y-3 text-xs">
                    <div>
                        <span class="text-slate-400">Created By User</span>
                        <p class="font-semibold text-slate-800 mt-0.5">
                            {{ $case->creator ? $case->creator->name : 'User #' . $case->created_by }}
                        </p>
                    </div>

                    <div class="pt-2 border-t border-slate-100">
                        <span class="text-slate-400">Created Timestamp</span>
                        <p class="font-mono text-slate-700 mt-0.5">{{ $case->created_at->format('Y-m-d H:i:s') }}</p>
                    </div>

                    <div class="pt-2 border-t border-slate-100">
                        <span class="text-slate-400">Last Updated</span>
                        <p class="font-mono text-slate-700 mt-0.5">{{ $case->updated_at->format('Y-m-d H:i:s') }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
