import React from 'react';
import { User } from '../types';
import {
  Activity,
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Terminal,
  CheckCircle2,
  BookOpen,
  GitBranch,
  Shield,
  UserCheck,
  LogOut,
  LogIn,
  Sliders,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onToggleRole: () => void;
  onOpenSystemCheck: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenLogin,
  onLogout,
  onToggleRole,
  onOpenSystemCheck,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner: Medical System Indicator & Switcher */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-100">Jajal Medical CMS</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300 hidden sm:inline">
            Intern Assignment: Laravel 12 &bull; Blade &bull; MySQL &bull; Sanctum Auth
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSystemCheck}
            className="flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors cursor-pointer text-xs font-medium"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Step 1: System Check</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Role:</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                  currentUser.role === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {currentUser.role}
              </span>
              <button
                onClick={onToggleRole}
                title="Quick switch role to test Admin vs Viewer permissions"
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded border border-slate-700 transition cursor-pointer"
              >
                Switch to {currentUser.role === 'admin' ? 'Viewer' : 'Admin'}
              </button>
            </div>
          ) : (
            <span className="text-amber-400 font-medium text-xs">
              Browsing as Guest (Protected routes require login)
            </span>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Brand */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  Jajal Medical
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                  CMS
                </span>
              </div>
              <p className="text-xs text-slate-700">Case Management System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('cases')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                activeTab === 'cases' || activeTab === 'case-details' || activeTab === 'case-edit'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Medical Cases</span>
            </button>

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('create-case')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                  activeTab === 'create-case'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Case</span>
              </button>
            )}

            <span className="h-5 w-px bg-slate-200 mx-1"></span>

            <button
              onClick={() => setActiveTab('api-explorer')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                activeTab === 'api-explorer'
                  ? 'bg-purple-50 text-purple-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>API (Sanctum)</span>
            </button>

            <button
              onClick={() => setActiveTab('test-runner')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                activeTab === 'test-runner'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Automated Tests</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                activeTab === 'docs'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Docs & Traceability</span>
            </button>

            <button
              onClick={() => setActiveTab('github')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                activeTab === 'github'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>GitHub Setup</span>
            </button>
          </nav>

          {/* User Auth Section */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-semibold text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-xs text-slate-700 font-mono flex items-center justify-end gap-1">
                    <Shield className="w-3 h-3 text-blue-500 inline" />
                    {currentUser.email}
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Log out of session"
                  className="p-2 text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition border border-slate-200 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-xs cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
