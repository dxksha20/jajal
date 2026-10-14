import React, { useState } from 'react';
import { Shield, KeyRound, Mail, AlertCircle, ArrowRight, UserCheck, Activity } from 'lucide-react';
import { DEMO_USERS } from '../data/seedData';
import { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onCancel?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('admin@jajal.med');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Validate credentials against demo accounts
      const user = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (user && password === 'password') {
        onLoginSuccess(user);
      } else {
        setError('These credentials do not match our records. (Password for demo is "password")');
      }
    }, 400);
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Activity className="w-8 h-8 stroke-[2.2]" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
          Sign In to Jajal Medical
        </h2>
        <p className="mt-1 text-center text-sm text-slate-700">
          Medical Case Management System &bull; Laravel Authentication
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-900">Authentication Failed</p>
                <p className="mt-0.5 text-xs text-rose-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jajal.med"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="mt-1 text-xs text-slate-600">Demo password is <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono">password</code></p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to System</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-700 text-center mb-3">
              Quick Role Login (Pre-seeded Accounts)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@jajal.med')}
                className="flex flex-col items-center p-3 text-left border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 rounded-xl transition cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-blue-700 font-semibold text-xs">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin User</span>
                </div>
                <span className="text-[11px] text-slate-600 mt-0.5">Full CRUD Access</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('viewer@jajal.med')}
                className="flex flex-col items-center p-3 text-left border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 rounded-xl transition cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Viewer User</span>
                </div>
                <span className="text-[11px] text-slate-600 mt-0.5">Read-Only Access</span>
              </button>
            </div>
          </div>

          {onCancel && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-slate-700 hover:text-slate-800 font-medium cursor-pointer"
              >
                Cancel and return
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
