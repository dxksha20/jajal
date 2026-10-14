import React from 'react';
import { User } from '../types';
import {
  Activity,
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Shield,
  LogOut,
  LogIn,
  UserCheck,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onToggleRole: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenLogin,
  onLogout,
  onToggleRole,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Brand */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition">
              <Activity className="w-5 h-5 stroke-[2.5]" />
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
              <p className="text-xs text-slate-500">Case Management System</p>
            </div>
          </div>

          {/* Navigation Links - Strictly Jajal Medical Tasks */}
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
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
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                activeTab === 'cases' || activeTab === 'case-details' || activeTab === 'case-edit'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Medical Cases</span>
            </button>

            {/* Create Case Button - Admin only */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('create-case')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  activeTab === 'create-case'
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Create Case</span>
              </button>
            )}
          </nav>

          {/* User Auth & Role Control */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* Role Switcher Pill (Quick testing between Admin & Viewer) */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 py-1 px-2.5 rounded-lg">
                  <span className="text-xs text-slate-500 hidden sm:inline">Role:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                      currentUser.role === 'admin'
                        ? 'bg-blue-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {currentUser.role}
                  </span>
                  <button
                    onClick={onToggleRole}
                    title="Switch role to test Admin vs Viewer permissions"
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium ml-1 cursor-pointer hover:underline"
                  >
                    (Switch to {currentUser.role === 'admin' ? 'Viewer' : 'Admin'})
                  </button>
                </div>

                <div className="hidden lg:block text-right">
                  <div className="text-sm font-semibold text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {currentUser.email}
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Sign out"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition border border-slate-200 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow-xs cursor-pointer"
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
