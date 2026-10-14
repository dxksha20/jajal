<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Jajal Medical') - Case Management System</title>
    <!-- Tailwind CSS CDN for instant, zero-build Blade rendering -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        code, pre { font-family: 'JetBrains Mono', monospace; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased">
    <!-- Top System Banner -->
    <div class="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div class="flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span class="font-semibold text-white">Jajal Medical CMS</span>
            <span class="text-slate-500">|</span>
            <span class="text-slate-400">Laravel 12 &bull; Blade &bull; MySQL &bull; Sanctum Auth</span>
        </div>
        <div class="flex items-center gap-3">
            @auth
                <span class="text-slate-400">Logged in as:</span>
                <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider {{ Auth::user()->role === 'admin' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white' }}">
                    {{ Auth::user()->role }}
                </span>
            @else
                <span class="text-amber-400 font-medium">Guest Mode</span>
            @endauth
        </div>
    </div>

    <!-- Navigation Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Brand -->
                <a href="{{ route('dashboard') }}" class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md font-bold text-lg">
                        +
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-lg text-slate-900 tracking-tight">Jajal Medical</span>
                            <span class="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">CMS</span>
                        </div>
                        <p class="text-xs text-slate-500">Case Management System</p>
                    </div>
                </a>

                @auth
                    <!-- Nav Links -->
                    <nav class="hidden md:flex items-center gap-1">
                        <a href="{{ route('dashboard') }}" class="px-3.5 py-2 rounded-lg text-sm font-medium transition {{ request()->routeIs('dashboard') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' }}">
                            Dashboard
                        </a>
                        <a href="{{ route('cases.index') }}" class="px-3.5 py-2 rounded-lg text-sm font-medium transition {{ request()->routeIs('cases.*') && !request()->routeIs('cases.create') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' }}">
                            Medical Cases
                        </a>
                        @if(Auth::user()->role === 'admin')
                            <a href="{{ route('cases.create') }}" class="px-3.5 py-2 rounded-lg text-sm font-medium transition {{ request()->routeIs('cases.create') ? 'bg-blue-600 text-white font-semibold' : 'text-blue-600 hover:bg-blue-50' }}">
                                + New Case
                            </a>
                        @endif
                    </nav>

                    <!-- User Actions -->
                    <div class="flex items-center gap-3">
                        <div class="text-right hidden sm:block">
                            <div class="text-sm font-semibold text-slate-800 leading-tight">{{ Auth::user()->name }}</div>
                            <div class="text-xs text-slate-500 font-mono">{{ Auth::user()->email }}</div>
                        </div>

                        <form method="POST" action="{{ route('logout') }}" class="inline">
                            @csrf
                            <button type="submit" class="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg transition cursor-pointer">
                                Log Out
                            </button>
                        </form>
                    </div>
                @else
                    <a href="{{ route('login') }}" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xs">
                        Sign In
                    </a>
                @endauth
            </div>
        </div>
    </header>

    <!-- Main Container -->
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <!-- Flash Messages -->
        @if (session('success'))
            <div class="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="text-emerald-600 font-bold">&check;</span>
                    <span>{{ session('success') }}</span>
                </div>
            </div>
        @endif

        @if (session('error'))
            <div class="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="text-rose-600 font-bold">&cross;</span>
                    <span>{{ session('error') }}</span>
                </div>
            </div>
        @endif

        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-12">
        <p>&copy; {{ date('Y') }} Jajal Medical Case Management System &bull; Laravel 12 &bull; MySQL &bull; Sanctum</p>
    </footer>
</body>
</html>
