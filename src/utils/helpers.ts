import { CaseStatus, CasePriority, ValidationErrors, CaseFormData, MedicalCase } from '../types';

export function getStatusBadgeClass(status: CaseStatus): string {
  switch (status) {
    case 'Draft':
      return 'bg-slate-100 text-slate-700 border-slate-300';
    case 'Planning':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'In Review':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Approved':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Completed':
      return 'bg-teal-50 text-teal-800 border-teal-200';
    case 'Cancelled':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}

export function getPriorityBadgeClass(priority: CasePriority): string {
  switch (priority) {
    case 'High':
      return 'bg-red-50 text-red-700 border-red-200 font-semibold';
    case 'Medium':
      return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    case 'Low':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Not scheduled';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Validates form data against Laravel FormRequest rules:
 * - case_number: required, unique (ignoring current id if editing)
 * - patient_ref_code: required
 * - surgeon_name: required, min 3 chars
 * - implant_type: required
 * - status: required, valid enum
 * - priority: required, valid enum
 * - surgery_date: nullable, valid date
 */
export function validateCaseForm(
  data: CaseFormData,
  existingCases: MedicalCase[],
  currentCaseId?: number
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Case Number validation
  if (!data.case_number || !data.case_number.trim()) {
    errors.case_number = ['The case number field is required.'];
  } else {
    const trimmed = data.case_number.trim().toUpperCase();
    const isDuplicate = existingCases.some(
      (c) =>
        c.case_number.toUpperCase() === trimmed &&
        (!currentCaseId || c.id !== currentCaseId)
    );
    if (isDuplicate) {
      errors.case_number = ['The case number has already been taken.'];
    }
  }

  // Patient Ref Code validation
  if (!data.patient_ref_code || !data.patient_ref_code.trim()) {
    errors.patient_ref_code = ['The patient reference code is required.'];
  }

  // Surgeon Name validation
  if (!data.surgeon_name || !data.surgeon_name.trim()) {
    errors.surgeon_name = ['The surgeon name field is required.'];
  } else if (data.surgeon_name.trim().length < 3) {
    errors.surgeon_name = ['The surgeon name must be at least 3 characters.'];
  }

  // Implant Type validation
  if (!data.implant_type || !data.implant_type.trim()) {
    errors.implant_type = ['The implant type field is required.'];
  }

  // Status validation
  const validStatuses: CaseStatus[] = [
    'Draft',
    'Planning',
    'In Review',
    'Approved',
    'Completed',
    'Cancelled',
  ];
  if (!data.status || !validStatuses.includes(data.status)) {
    errors.status = ['The selected status is invalid.'];
  }

  // Priority validation
  const validPriorities: CasePriority[] = ['Low', 'Medium', 'High'];
  if (!data.priority || !validPriorities.includes(data.priority)) {
    errors.priority = ['The selected priority is invalid.'];
  }

  // Surgery Date validation
  if (data.surgery_date) {
    const parsed = new Date(data.surgery_date);
    if (isNaN(parsed.getTime())) {
      errors.surgery_date = ['The surgery date must be a valid date.'];
    }
  }

  return errors;
}
