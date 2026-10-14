import React from 'react';
import { MedicalCase, User } from '../types';
import {
  FolderKanban,
  Clock,
  CheckCircle,
  FileCheck2,
  CheckCheck,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Calendar,
  User as UserIcon,
  Shield,
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
  // Required metric counts
  const totalCount = cases.length;
  const planningCount = cases.filter((c) => c.status === 'Planning').length;
  const inReviewCount = cases.filter((c) => c.status === 'In Review').length;
  const approvedCount = cases.filter((c) => c.status === 'Approved').length;
  const completedCount = cases.filter((c) => c.status === 'Completed').length;
  const draftCount = cases.filter((c) => c.status === 'Draft').length;

  const highPriorityCount = cases.filter((c) => c.priority === 'High').length;
  const recentCases = [...cases].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Greeting and Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Clinical Operations Dashboard
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800 border border-blue-200">
              Live Medical Data
            </span>
          </div>
          <p className="text-sm text-slate-700 mt-1">
            Welcome back, <span className="font-semibold text-slate-800">{currentUser?.name || 'Guest User'}</span>.
            {currentUser?.role === 'admin'
              ? ' You have full Admin permissions to create, edit, change status, and delete medical cases.'
              : ' You are logged in as Viewer (read-only access to cases and details).'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToCases()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition cursor-pointer"
          >
            <FolderKanban className="w-4 h-4 text-slate-700" />
            <span>View All Cases</span>
          </button>

          {currentUser?.role === 'admin' ? (
            <button
              onClick={onNavigateToCreate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Medical Case</span>
            </button>
          ) : (
            <div className="text-xs bg-slate-100 text-slate-700 px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-700" />
              <span>Viewer Role (Read-only)</span>
            </div>
          )}
        </div>
      </div>

      {/* REQUIRED DASHBOARD METRICS: Total, Planning, In Review, Approved, Completed */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Case Lifecycle Metrics (Step 6 Requirement)
          </h2>
          <span className="text-xs text-slate-600">Updated in real-time</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Cases */}
          <div
            onClick={() => onNavigateToCases()}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Total Cases
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                <FolderKanban className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{totalCount}</span>
              <span className="text-xs text-slate-600">active dossiers</span>
            </div>
            <div className="mt-3 flex items-center text-xs text-blue-600 font-medium group-hover:underline">
              <span>Inspect all records</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Planning Cases */}
          <div
            onClick={() => onNavigateToCases('Planning')}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Planning
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-blue-900">{planningCount}</span>
              <span className="text-xs text-blue-700 font-medium">pre-op staging</span>
            </div>
            <div className="mt-3 flex items-center text-xs text-blue-700 font-medium group-hover:underline">
              <span>Filter Planning</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* In Review Cases */}
          <div
            onClick={() => onNavigateToCases('In Review')}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-amber-300 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                In Review
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
                <FileCheck2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-900">{inReviewCount}</span>
              <span className="text-xs text-amber-700 font-medium">pending signoff</span>
            </div>
            <div className="mt-3 flex items-center text-xs text-amber-600 font-medium group-hover:underline">
              <span>Filter In Review</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Approved Cases */}
          <div
            onClick={() => onNavigateToCases('Approved')}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Approved
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-900">{approvedCount}</span>
              <span className="text-xs text-emerald-700 font-medium">ready for OR</span>
            </div>
            <div className="mt-3 flex items-center text-xs text-emerald-600 font-medium group-hover:underline">
              <span>Filter Approved</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Completed Cases */}
          <div
            onClick={() => onNavigateToCases('Completed')}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-teal-300 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Completed
              </span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition">
                <CheckCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-teal-900">{completedCount}</span>
              <span className="text-xs text-teal-700 font-medium">surgeries closed</span>
            </div>
            <div className="mt-3 flex items-center text-xs text-teal-700 font-medium group-hover:underline">
              <span>Filter Completed</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Highlights: High Priority Warning & Status Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>High Priority Case Alert</span>
            </h3>
            <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
              {highPriorityCount} Cases
            </span>
          </div>
          <p className="text-xs text-slate-700 mt-2">
            These cases have been flagged with High Clinical Priority due to surgery urgency or custom implant requirements.
          </p>

          <div className="mt-4 space-y-2">
            {cases
              .filter((c) => c.priority === 'High')
              .slice(0, 3)
              .map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelectCase(c)}
                  className="p-3 bg-red-50/50 hover:bg-red-50 border border-red-100 rounded-xl transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono font-bold text-xs text-slate-900">{c.case_number}</span>
                    <p className="text-xs text-slate-700 truncate max-w-[180px]">{c.implant_type}</p>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-md border ${getStatusBadgeClass(c.status)}`}>
                    {c.status}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Case Status Distribution</span>
            </h3>
            <span className="text-xs text-slate-700">100% of pipeline</span>
          </div>

          {/* Multi-segment Progress Bar */}
          <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${(planningCount / totalCount) * 100}%` }}
              title={`Planning: ${planningCount}`}
              className="bg-blue-500 h-full"
            ></div>
            <div
              style={{ width: `${(inReviewCount / totalCount) * 100}%` }}
              title={`In Review: ${inReviewCount}`}
              className="bg-amber-400 h-full"
            ></div>
            <div
              style={{ width: `${(approvedCount / totalCount) * 100}%` }}
              title={`Approved: ${approvedCount}`}
              className="bg-emerald-500 h-full"
            ></div>
            <div
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
              title={`Completed: ${completedCount}`}
              className="bg-teal-600 h-full"
            ></div>
            <div
              style={{ width: `${(draftCount / totalCount) * 100}%` }}
              title={`Draft: ${draftCount}`}
              className="bg-slate-300 h-full"
            ></div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-slate-700">Planning: {planningCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-slate-700">In Review: {inReviewCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-700">Approved: {approvedCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
              <span className="text-slate-700">Completed: {completedCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              <span className="text-slate-700">Draft: {draftCount}</span>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Role-Based Access Policy Enforced: </span>
              Laravel Gate & Policy <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">MedicalCasePolicy</code> governs write/update/delete operations.
              Admin has full authority; Viewer is restricted to <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">viewAny</code> and <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">view</code>.
            </div>
          </div>
        </div>
      </div>

      {/* Recent Cases Table Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-900">Recent Medical Case Dossiers</h3>
            <p className="text-xs text-slate-700">Latest cases recorded in Jajal Medical database</p>
          </div>
          <button
            onClick={() => onNavigateToCases()}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({cases.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
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
                  <td className="py-3 px-4 font-medium text-slate-800">{c.surgeon_name}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{c.implant_type}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-md border ${getStatusBadgeClass(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-md border ${getPriorityBadgeClass(c.priority)}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 text-xs">{formatDate(c.surgery_date)}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectCase(c)}
                      className="text-xs bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2.5 py-1 rounded-md font-medium transition cursor-pointer"
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
