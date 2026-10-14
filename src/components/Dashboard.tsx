import React from 'react';
import { MedicalCase, User } from '../types';
import {
  FolderKanban,
  Clock,
  FileCheck2,
  CheckCircle,
  CheckCheck,
  PlusCircle,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { getStatusBadgeClass, getPriorityBadgeClass, formatDate } from '../utils/helpers';

interface DashboardProps {
  cases: MedicalCase[];
  currentUser: User | null;
  onNavigateToCases: (filterStatus?: string) => void;
  onNavigateToCreate: () => void;
  onSelectCase: (caseItem: MedicalCase) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  cases,
  currentUser,
  onNavigateToCases,
  onNavigateToCreate,
  onSelectCase,
}) => {
  // Required dashboard counts (Step 6)
  const totalCount = cases.length;
  const planningCount = cases.filter((c) => c.status === 'Planning').length;
  const inReviewCount = cases.filter((c) => c.status === 'In Review').length;
  const approvedCount = cases.filter((c) => c.status === 'Approved').length;
  const completedCount = cases.filter((c) => c.status === 'Completed').length;

  const recentCases = [...cases].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome & Action Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Medical Case Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome, <span className="font-semibold text-slate-800">{currentUser?.name || 'Guest'}</span>.
            {currentUser?.role === 'admin'
              ? ' You are logged in as Admin with permissions to create, edit, change status, and delete cases.'
              : ' You are logged in as Viewer with read-only access to cases and details.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToCases()}
            className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            View All Cases
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={onNavigateToCreate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Case</span>
            </button>
          )}
        </div>
      </div>

      {/* MANDATORY METRICS: Total Cases, Planning, In Review, Approved, Completed */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Case Status Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Cases */}
          <div
            onClick={() => onNavigateToCases()}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Cases
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">
              {totalCount}
            </div>
            <div className="mt-2 text-xs text-blue-600 font-medium group-hover:underline flex items-center gap-1">
              <span>View all cases</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Planning */}
          <div
            onClick={() => onNavigateToCases('Planning')}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Planning
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-blue-900">
              {planningCount}
            </div>
            <div className="mt-2 text-xs text-blue-600 font-medium group-hover:underline flex items-center gap-1">
              <span>Filter Planning</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* In Review */}
          <div
            onClick={() => onNavigateToCases('In Review')}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-amber-300 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                In Review
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
                <FileCheck2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-amber-900">
              {inReviewCount}
            </div>
            <div className="mt-2 text-xs text-amber-600 font-medium group-hover:underline flex items-center gap-1">
              <span>Filter In Review</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Approved */}
          <div
            onClick={() => onNavigateToCases('Approved')}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Approved
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-emerald-900">
              {approvedCount}
            </div>
            <div className="mt-2 text-xs text-emerald-600 font-medium group-hover:underline flex items-center gap-1">
              <span>Filter Approved</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Completed */}
          <div
            onClick={() => onNavigateToCases('Completed')}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-teal-300 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Completed
              </span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition">
                <CheckCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-teal-900">
              {completedCount}
            </div>
            <div className="mt-2 text-xs text-teal-700 font-medium group-hover:underline flex items-center gap-1">
              <span>Filter Completed</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Cases Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Medical Cases</h3>
            <p className="text-xs text-slate-500">Latest medical case records</p>
          </div>
          <button
            onClick={() => onNavigateToCases()}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({cases.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Case #</th>
                <th className="py-3 px-4">Surgeon</th>
                <th className="py-3 px-4">Implant Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Surgery Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{c.case_number}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">{c.surgeon_name}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{c.implant_type}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-md border font-medium ${getStatusBadgeClass(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-md border ${getPriorityBadgeClass(c.priority)}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{formatDate(c.surgery_date)}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectCase(c)}
                      className="text-xs bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-3 py-1 rounded-lg font-medium transition cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
