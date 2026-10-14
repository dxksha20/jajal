export type UserRole = 'admin' | 'viewer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export type CaseStatus =
  | 'Draft'
  | 'Planning'
  | 'In Review'
  | 'Approved'
  | 'Completed'
  | 'Cancelled';

export type CasePriority = 'Low' | 'Medium' | 'High';

export interface MedicalCase {
  id: number;
  case_number: string;
  patient_ref_code: string;
  surgeon_name: string;
  implant_type: string;
  status: CaseStatus;
  priority: CasePriority;
  surgery_date: string | null;
  created_by: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CaseFormData {
  case_number: string;
  patient_ref_code: string;
  surgeon_name: string;
  implant_type: string;
  status: CaseStatus;
  priority: CasePriority;
  surgery_date: string;
}

export interface ValidationErrors {
  [key: string]: string[];
}

export interface ApiLog {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  status: number;
  statusText: string;
  timestamp: string;
  requestHeaders: Record<string, string>;
  requestBody?: any;
  responseBody: any;
}

export interface TestCaseResult {
  id: number;
  name: string;
  description: string;
  requirement: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  assertionCount: number;
  durationMs: number;
  logs: string[];
}
