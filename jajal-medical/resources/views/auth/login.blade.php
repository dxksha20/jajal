@extends('layouts.app')

@section('title', 'Sign In')

@section('content')
<div class="min-h-[75vh] flex flex-col justify-center py-8 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md">
            +
        </div>
        <h2 class="mt-3 text-2xl font-bold tracking-tight text-slate-900">Sign In to Jajal Medical</h2>
        <p class="mt-1 text-xs text-slate-500">Clinical Case Management &bull; Laravel Authentication</p>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
            @if ($errors->any())
                <div class="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                    <p class="font-bold text-rose-900 mb-1">Authentication Failed:</p>
                    <ul class="list-disc pl-4 space-y-0.5">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form method="POST" action="{{ route('login') }}" class="space-y-4">
                @csrf

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Email Address
                    </label>
                    <input type="email" name="email" value="{{ old('email', 'admin@jajal.med') }}" required autofocus
                        class="block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Password
                    </label>
                    <input type="password" name="password" value="password" required
                        class="block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500">
                    <p class="mt-1 text-xs text-slate-500">Demo password is <code class="font-mono bg-slate-100 px-1 py-0.5 rounded">password</code></p>
                </div>

                <div class="flex items-center justify-between text-xs">
                    <label class="flex items-center gap-2 text-slate-600">
                        <input type="checkbox" name="remember" class="rounded border-slate-300 text-blue-600">
                        <span>Remember me</span>
                    </label>
                </div>

                <button type="submit" class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition">
                    Sign In to System
                </button>
            </form>

            <div class="mt-6 pt-5 border-t border-slate-200 text-center">
                <p class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Pre-seeded Demo Accounts:</p>
                <div class="grid grid-cols-2 gap-2 text-left">
                    <div class="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl">
                        <span class="text-xs font-bold text-blue-700">Admin</span>
                        <p class="text-[11px] text-slate-600 font-mono">admin@jajal.med</p>
                    </div>
                    <div class="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                        <span class="text-xs font-bold text-emerald-700">Viewer</span>
                        <p class="text-[11px] text-slate-600 font-mono">viewer@jajal.med</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
