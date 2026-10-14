@extends('layouts.app')

@section('title', 'Create Medical Case')

@section('content')
<div class="max-w-3xl mx-auto space-y-6">
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Create Medical Case</h1>
            <p class="text-xs text-slate-500 mt-0.5">Form Request Validation &bull; Admin Authorized Action</p>
        </div>
        <a href="{{ route('cases.index') }}" class="text-xs text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg">
            &larr; Back to List
        </a>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        @if ($errors->any())
            <div class="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                <p class="font-bold text-rose-900 mb-1">Please correct the following errors:</p>
                <ul class="list-disc pl-4 space-y-1">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('cases.store') }}" class="space-y-6">
            @csrf

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Case Number <span class="text-rose-500">*</span>
                    </label>
                    <input type="text" name="case_number" value="{{ old('case_number') }}" required placeholder="e.g. CAS-2026-022"
                        class="block w-full px-3.5 py-2.5 font-mono text-sm border rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500">
                    <p class="mt-1 text-[11px] text-slate-500">Must be unique across all cases.</p>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Patient Reference Code <span class="text-rose-500">*</span>
                    </label>
                    <input type="text" name="patient_ref_code" value="{{ old('patient_ref_code', 'PAT-' . rand(1000, 9999)) }}" required placeholder="e.g. PAT-4481"
                        class="block w-full px-3.5 py-2.5 font-mono text-sm border rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500">
                    <p class="mt-1 text-[11px] text-amber-600 font-medium">Dummy/anonymized data only for patient privacy.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Surgeon Name <span class="text-rose-500">*</span>
                    </label>
                    <input type="text" name="surgeon_name" value="{{ old('surgeon_name') }}" required placeholder="e.g. Dr. Michael Chang"
                        class="block w-full px-3.5 py-2.5 text-sm border rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Implant Type <span class="text-rose-500">*</span>
                    </label>
                    <input type="text" name="implant_type" value="{{ old('implant_type') }}" required placeholder="e.g. Titanium Hip Stem / Ceramic Knee"
                        class="block w-full px-3.5 py-2.5 text-sm border rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500">
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Status <span class="text-rose-500">*</span>
                    </label>
                    <select name="status" required class="block w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                        @foreach(['Draft', 'Planning', 'In Review', 'Approved', 'Completed', 'Cancelled'] as $st)
                            <option value="{{ $st }}" {{ old('status') === $st ? 'selected' : '' }}>{{ $st }}</option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Priority <span class="text-rose-500">*</span>
                    </label>
                    <select name="priority" required class="block w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                        @foreach(['Low', 'Medium', 'High'] as $pr)
                            <option value="{{ $pr }}" {{ old('priority', 'Medium') === $pr ? 'selected' : '' }}>{{ $pr }}</option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Surgery Date <span class="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input type="date" name="surgery_date" value="{{ old('surgery_date') }}"
                        class="block w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                </div>
            </div>

            <div class="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
                <a href="{{ route('cases.index') }}" class="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                    Cancel
                </a>
                <button type="submit" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition">
                    Create Medical Case
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
