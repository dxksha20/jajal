import React, { useState, useEffect } from 'react';
import { MedicalCase, CaseFormData, ValidationErrors, User } from '../types';
import { validateCaseForm } from '../utils/helpers';
import {
  Save,
  ArrowLeft,
  AlertCircle,
  FileText,
  UserCheck,
  Calendar,
  Layers,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface CaseFormProps {
  initialCase?: MedicalCase | null;
  existingCases: MedicalCase[];
  currentUser: User | null;
  onSave: (caseData: CaseFormData) => void;
  onCancel: () => void;
}

export const CaseForm: React.FC<CaseFormProps> = ({
  initialCase,
  existingCases,
  currentUser,
  onSave,
  onCancel,
}) => {
  const isEditing = Boolean(initialCase);

  const [formData, setFormData] = useState<CaseFormData>({
    case_number: initialCase?.case_number || '',
    patient_ref_code: initialCase?.patient_ref_code || '',
    surgeon_name: initialCase?.surgeon_name || '',
    implant_type: initialCase?.implant_type || '',
    status: initialCase?.status || 'Draft',
    priority: initialCase?.priority || 'Medium',
    surgery_date: initialCase?.surgery_date || '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Auto-generate next case number and dummy patient ref if creating new
  useEffect(() => {
    if (!isEditing && !formData.case_number) {
      const nextNum = existingCases.length + 1;
      const paddedNum = String(nextNum).padStart(3, '0');
      const randomPatient = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;

      setFormData((prev) => ({
        ...prev,
        case_number: `CAS-2026-${paddedNum}`,
        patient_ref_code: randomPatient,
      }));
    }
  }, [isEditing, existingCases.length]);

  const handleChange = (
    field: keyof CaseFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Real-time validation clear if field is valid
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check role authorization (Laravel Policy check)
    if (currentUser?.role !== 'admin') {
      setErrors({
        authorization: ['403 Forbidden: You must have an Admin role to create or modify medical cases.'],
      });
      return;
    }

    const validationErrors = validateCaseForm(
      formData,
      existingCases,
      initialCase?.id
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave(formData);
  };

  // If viewer tries to access form directly
  if (currentUser?.role !== 'admin') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-2xl mx-auto text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">403 Forbidden - Access Denied</h2>
        <p className="text-sm text-slate-700 mt-2">
          You are currently signed in as a <span className="font-semibold text-slate-800">Viewer</span>.
          According to Laravel Gate / Policy rules, only users with the <span className="font-semibold text-blue-600">Admin</span> role
          can create or edit medical cases.
        </p>
        <p className="text-xs text-slate-600 mt-2">
          Please use the role toggle in the top bar to switch to Admin to test this feature.
        </p>
        <div className="mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-medium transition cursor-pointer"
          >
            Return to Medical Cases
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb & Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-700 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isEditing ? `Edit Case: ${initialCase?.case_number}` : 'Create New Medical Case'}
            </h1>
            <p className="text-xs text-slate-700 mt-0.5">
              Form Request Validation &bull; Laravel FormRequest validation rules enforced
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
          Admin Authorized
        </span>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {errors.authorization && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Authorization Error</p>
              <p className="text-xs mt-0.5">{errors.authorization[0]}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Case Number & Dummy Patient Ref */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Case Number <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-600">Must be unique</span>
              </div>
              <input
                type="text"
                required
                value={formData.case_number}
                onChange={(e) => handleChange('case_number', e.target.value)}
                placeholder="e.g. CAS-2026-022"
                className={`block w-full px-3.5 py-2.5 font-mono text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                  errors.case_number
                    ? 'border-rose-300 bg-rose-50/30 text-rose-900'
                    : 'border-slate-300 text-slate-900'
                }`}
              />
              {errors.case_number && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.case_number[0]}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Patient Reference Code <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-amber-600 font-medium">Dummy Data Only</span>
              </div>
              <input
                type="text"
                required
                value={formData.patient_ref_code}
                onChange={(e) => handleChange('patient_ref_code', e.target.value)}
                placeholder="e.g. PAT-9481"
                className={`block w-full px-3.5 py-2.5 font-mono text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                  errors.patient_ref_code
                    ? 'border-rose-300 bg-rose-50/30 text-rose-900'
                    : 'border-slate-300 text-slate-900'
                }`}
              />
              {errors.patient_ref_code && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.patient_ref_code[0]}
                </p>
              )}
              <p className="mt-1 text-[11px] text-slate-600">
                Patient privacy compliance: never enter real names or identifiers.
              </p>
            </div>
          </div>

          {/* Row 2: Surgeon Name & Implant Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Surgeon Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.surgeon_name}
                onChange={(e) => handleChange('surgeon_name', e.target.value)}
                placeholder="e.g. Dr. Michael Chang"
                className={`block w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                  errors.surgeon_name
                    ? 'border-rose-300 bg-rose-50/30 text-rose-900'
                    : 'border-slate-300 text-slate-900'
                }`}
              />
              {errors.surgeon_name && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.surgeon_name[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Implant Type <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.implant_type}
                onChange={(e) => handleChange('implant_type', e.target.value)}
                placeholder="e.g. Titanium Hip Stem / Ceramic Knee System"
                className={`block w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                  errors.implant_type
                    ? 'border-rose-300 bg-rose-50/30 text-rose-900'
                    : 'border-slate-300 text-slate-900'
                }`}
              />
              {errors.implant_type && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.implant_type[0]}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Status, Priority & Optional Surgery Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as any)}
                className="block w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Draft">Draft</option>
                <option value="Planning">Planning</option>
                <option value="In Review">In Review</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              {errors.status && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.status[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Priority <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value as any)}
                className="block w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.priority && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.priority[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Surgery Date <span className="text-slate-600 font-normal">(Optional)</span>
              </label>
              <input
                type="date"
                value={formData.surgery_date || ''}
                onChange={(e) => handleChange('surgery_date', e.target.value)}
                className="block w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
              {errors.surgery_date && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.surgery_date[0]}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Medical Case'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
