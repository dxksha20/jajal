@extends('layouts.app')

@section('title', 'Medical Cases')

@section('content')
<div class="space-y-6">
    <!-- Header and Controls -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
                <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Medical Case Registry</h1>
                <p class="text-sm text-slate-500 mt-1">Browse, search, and filter surgical dossiers. (10 cases per page)</p>
            </div>

            <div>
                @if(Auth::user()->isAdmin())
                    <a href="{{ route('cases.create') }}" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition">
                        + Create Medical Case
                    </a>
                @else
                    <span class="text-xs bg-slate-100 text-slate-500 px-3 py-2 rounded-xl border border-slate-200">
                        Viewer Access (Read-Only)
                    </span>
                @endif
            </div>
        </div>

        <!-- Filter & Search Form -->
        <form method="GET" action="{{ route('cases.index') }}" class="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
                <input type="text" name="search" value="{{ request('search') }}" placeholder="Search by Case # or Surgeon..."
                    class="block w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500">
            </div>

            <div>
                <select name="status" class="block w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-700 bg-white focus:ring-2 focus:ring-blue-500">
                    <option value="">All Statuses</option>
                    @foreach(['Draft', 'Planning', 'In Review', 'Approved', 'Completed', 'Cancelled'] as $st)
                        <option value="{{ $st }}" {{ request('status') === $st ? 'selected' : '' }}>{{ $st }}</option>
                    @endforeach
                </select>
            </div>

            <div>
                <select name="priority" class="block w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm text-slate-700 bg-white focus:ring-2 focus:ring-blue-500">
                    <option value="">All Priorities</option>
                    @foreach(['Low', 'Medium', 'High'] as $pr)
                        <option value="{{ $pr }}" {{ request('priority') === $pr ? 'selected' : '' }}>{{ $pr }} Priority</option>
                    @endforeach
                </select>
            </div>

            <div class="flex items-center gap-2">
                <button type="submit" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition">
                    Filter
                </button>
                @if(request('search') || request('status') || request('priority'))
                    <a href="{{ route('cases.index') }}" class="px-3 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl">
                        Reset
                    </a>
                @endif
            </div>
        </form>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead class="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
                    <tr>
                        <th class="py-3.5 px-4">Case Number</th>
                        <th class="py-3.5 px-4">Dummy Patient Ref</th>
                        <th class="py-3.5 px-4">Surgeon Name</th>
                        <th class="py-3.5 px-4">Implant Type</th>
                        <th class="py-3.5 px-4">Status</th>
                        <th class="py-3.5 px-4">Priority</th>
                        <th class="py-3.5 px-4">Surgery Date</th>
                        <th class="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse ($cases as $c)
                        <tr class="hover:bg-blue-50/30 transition">
                            <td class="py-3.5 px-4 font-mono font-bold text-blue-600">{{ $c->case_number }}</td>
                            <td class="py-3.5 px-4">
                                <span class="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                                    {{ $c->patient_ref_code }}
                                </span>
                            </td>
                            <td class="py-3.5 px-4 font-medium text-slate-900">{{ $c->surgeon_name }}</td>
                            <td class="py-3.5 px-4 text-slate-600 max-w-xs truncate">{{ $c->implant_type }}</td>
                            <td class="py-3.5 px-4">
                                <span class="px-2.5 py-0.5 rounded text-xs font-semibold
                                    {{ $c->status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                       ($c->status === 'In Review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                       ($c->status === 'Planning' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                       ($c->status === 'Completed' ? 'bg-teal-50 text-teal-800 border border-teal-200' :
                                       ($c->status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700 border border-slate-200')))) }}">
                                    {{ $c->status }}
                                </span>
                            </td>
                            <td class="py-3.5 px-4">
                                <span class="px-2.5 py-0.5 rounded text-xs font-semibold
                                    {{ $c->priority === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                       ($c->priority === 'Medium' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200') }}">
                                    {{ $c->priority }}
                                </span>
                            </td>
                            <td class="py-3.5 px-4 text-slate-500 text-xs">{{ $c->surgery_date ? $c->surgery_date->format('M d, Y') : 'Not scheduled' }}</td>
                            <td class="py-3.5 px-4 text-right">
                                <div class="flex items-center justify-end gap-1.5">
                                    <a href="{{ route('cases.show', $c) }}" class="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50" title="View Case">
                                        View
                                    </a>

                                    @if(Auth::user()->isAdmin())
                                        <a href="{{ route('cases.edit', $c) }}" class="p-1.5 text-slate-500 hover:text-amber-600 rounded-lg hover:bg-amber-50" title="Edit Case">
                                            Edit
                                        </a>

                                        <form method="POST" action="{{ route('cases.destroy', $c) }}" class="inline" onsubmit="return confirm('Delete case {{ $c->case_number }}?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer" title="Delete Case">
                                                Delete
                                            </button>
                                        </form>
                                    @endif
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="8" class="py-12 text-center text-slate-500">
                                No medical cases match your filter criteria.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- 10 per page pagination links -->
        <div class="px-4 py-3 bg-slate-50 border-t border-slate-200">
            {{ $cases->links() }}
        </div>
    </div>
</div>
@endsection
