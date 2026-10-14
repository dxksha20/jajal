import React from 'react';
import { MedicalCase, User, CaseStatus } from '../types';
import {
  ArrowLeft,
  Pencil,
  Calendar,
  User as UserIcon,
  ShieldCheck,
  Clock,
  Layers,
  Activity,
  CheckCircle2,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { getStatusBadgeClass, getPriorityBadgeClass, formatDate } from '../utils/helpers';

interface CaseDetailsProps {
  caseItem: MedicalCase;
  currentUser: User | null;
  onBack: () => void;
  onEdit: () => void;
  onUpdateStatus: (caseId: number, newStatus: CaseStatus) => void;
}

export const CaseDetails: React.FC<CaseDetailsProps> = ({
  caseItem,
  currentUser,
  onBack,
  onEdit,
  onUpdateStatus,
}) => {
  const statuses: CaseStatus[] = [
    'Draft',
    'Planning',
    'In Review',
    'Approved',
    'Completed',
    'Cancelled',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-700 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xl text-blue-600">
                {caseItem.case_number}
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border ${getStatusBadgeClass(caseItem.status)}`}>
                {caseItem.status}
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border ${getPriorityBadgeClass(caseItem.priority)}`}>
                {caseItem.priority} Priority
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-1">
              Case Database ID: <code className="font-mono text-slate-800">#{caseItem.id}</code> &bull; Surgical Implant Dossier
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser?.role === 'admin' ? (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition shadow-xs cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit Case</span>
            </button>
          ) : (
            <div className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
              Read-Only View (Viewer)
            </div>
          )}
        </div>
      </div>

      {/* Main Dossier Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Clinical Parameters */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Surgical & Implant Specifications</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-xs text-slate-600 font-medium">Implant System Type</span>
                <p className="font-semibold text-slate-900 mt-1">{caseItem.implant_type}</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-xs text-slate-600 font-medium">Attending Surgeon</span>
                <p className="font-semibold text-slate-900 mt-1">{caseItem.surgeon_name}</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-xs text-slate-600 font-medium">Scheduled Surgery Date</span>
                <p className="font-semibold text-slate-900 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {formatDate(caseItem.surgery_date)}
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-xs text-slate-600 font-medium">Patient Reference (Dummy)</span>
                <p className="font-mono font-bold text-slate-900 mt-1">{caseItem.patient_ref_code}</p>
                <span className="inline-block mt-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  De-identified / Synthetic
                </span>
              </div>
            </div>

            {/* Quick Status Transition (Admin only) */}
            {currentUser?.role === 'admin' && (
              <div className="mt-6 pt-5 border-t border-slate-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Admin Status Progression:
                </label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((st) => (
                    <button
                      key={st}
                      onClick={() => onUpdateStatus(caseItem.id, st)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                        caseItem.status === st
                          ? `${getStatusBadgeClass(st)} ring-2 ring-blue-500`
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Privacy & Compliance Notice */}
          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              <span className="font-bold">Medical Data Compliance Note:</span> This record adheres to
              patient confidentiality standards. The patient reference code <code className="font-mono font-bold">{caseItem.patient_ref_code}</code> is
              a dummy generated key containing no personally identifiable health information (PHI).
            </div>
          </div>
        </div>

        {/* Right Column: Audit Trail & Metadata */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Audit Log & Timestamps</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-600">Created By User ID</span>
                <p className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  User #{caseItem.created_by} ({caseItem.created_by_name || 'System Admin'})
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-600">Created Timestamp</span>
                <p className="font-mono text-slate-800 mt-0.5">{caseItem.created_at}</p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-600">Last Updated Timestamp</span>
                <p className="font-mono text-slate-800 mt-0.5">{caseItem.updated_at}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-xs space-y-2">
            <h4 className="font-bold text-slate-900">Laravel Eloquent Model Info</h4>
            <p className="text-slate-700">
              Model: <code className="font-mono bg-slate-100 text-slate-800 px-1 py-0.5 rounded">App\Models\MedicalCase</code>
            </p>
            <p className="text-slate-700">
              Relationship: <code className="font-mono bg-slate-100 text-slate-800 px-1 py-0.5 rounded">$this-&gt;belongsTo(User::class, 'created_by')</code>
            </p>
            <p className="text-slate-700">
              Table: <code className="font-mono bg-slate-100 text-slate-800 px-1 py-0.5 rounded">medical_cases</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
