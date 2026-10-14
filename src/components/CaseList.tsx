import React, { useState, useMemo } from 'react';
import { MedicalCase, User, CaseStatus } from '../types';
import {
  Search,
  Filter,
  PlusCircle,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  AlertCircle,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { getStatusBadgeClass, getPriorityBadgeClass, formatDate } from '../utils/helpers';

interface CaseListProps {
  cases: MedicalCase[];
  currentUser: User | null;
  initialStatusFilter?: string;
  onSelectCase: (caseItem: MedicalCase) => void;
  onEditCase: (caseItem: MedicalCase) => void;
  onCreateCase: () => void;
  onDeleteCase: (caseId: number) => void;
}

export const CaseList: React.FC<CaseListProps> = ({
  cases,
  currentUser,
  initialStatusFilter = '',
  onSelectCase,
  onEditCase,
  onCreateCase,
  onDeleteCase,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [caseToDelete, setCaseToDelete] = useState<MedicalCase | null>(null);
  const [viewerBlockedMessage, setViewerBlockedMessage] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 10;

  // Filter & Search Logic
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Search by case number OR surgeon name
      const matchesSearch =
        searchTerm === '' ||
        c.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.surgeon_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.implant_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.patient_ref_code.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by status
      const matchesStatus = statusFilter === '' || c.status === statusFilter;

      // Filter by priority
      const matchesPriority = priorityFilter === '' || c.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [cases, searchTerm, statusFilter, priorityFilter]);

  // Pagination (10 per page)
  const totalPages = Math.ceil(filteredCases.length / ITEMS_PER_PAGE) || 1;
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCases.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCases, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAttemptRestrictedAction = (actionName: string) => {
    if (currentUser?.role !== 'admin') {
      setViewerBlockedMessage(
        `403 Forbidden: You are currently signed in as a "Viewer". Laravel authorization policy (MedicalCasePolicy) forbids Viewers from executing ${actionName}. Please switch to Admin to test write actions.`
      );
      setTimeout(() => setViewerBlockedMessage(null), 6000);
    }
  };

  const confirmDelete = () => {
    if (caseToDelete && currentUser?.role === 'admin') {
      onDeleteCase(caseToDelete.id);
      setCaseToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Policy Warning Toast if Viewer attempts forbidden actions */}
      {viewerBlockedMessage && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 shadow-sm flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Authorization Denied (Laravel Gate 403)</p>
              <p className="text-xs text-amber-800 mt-0.5">{viewerBlockedMessage}</p>
            </div>
          </div>
          <button
            onClick={() => setViewerBlockedMessage(null)}
            className="text-amber-700 hover:text-amber-900 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Medical Case Registry
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {filteredCases.length} records found
              </span>
            </div>
            <p className="text-sm text-slate-700 mt-1">
              Browse, filter, and manage surgical dossiers. (10 cases per page)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentUser?.role === 'admin' ? (
              <button
                onClick={onCreateCase}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Medical Case</span>
              </button>
            ) : (
              <div
                onClick={() => handleAttemptRestrictedAction('creating cases')}
                className="flex items-center gap-2 bg-slate-100 text-slate-700 text-xs px-3 py-2 rounded-xl border border-slate-300 cursor-not-allowed opacity-80"
                title="Only Admins can create cases"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Case (Admin Only)</span>
              </div>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Case # or Surgeon..."
              className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full py-2 px-3 border border-slate-300 bg-white rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Planning">Planning</option>
              <option value="In Review">In Review</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full py-2 px-3 border border-slate-300 bg-white rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-center">
            {(searchTerm || statusFilter || priorityFilter) ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setPriorityFilter('');
                  setCurrentPage(1);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer py-2 px-3 hover:bg-blue-50 rounded-lg transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear All Filters</span>
              </button>
            ) : (
              <span className="text-xs text-slate-600">Showing page {currentPage} of {totalPages}</span>
            )}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Case Number</th>
                <th className="py-3.5 px-4">Dummy Patient Ref</th>
                <th className="py-3.5 px-4">Surgeon Name</th>
                <th className="py-3.5 px-4">Implant Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Surgery Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-700">
                    <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No medical cases match your criteria</p>
                    <p className="text-xs text-slate-600 mt-1">Try resetting filters or adjusting search keywords.</p>
                  </td>
                </tr>
              ) : (
                paginatedCases.map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/40 transition group">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                      {c.case_number}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {c.patient_ref_code}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                      {c.surgeon_name}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate" title={c.implant_type}>
                      {c.implant_type}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 text-xs rounded-md border font-medium ${getStatusBadgeClass(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 text-xs rounded-md border ${getPriorityBadgeClass(c.priority)}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-xs whitespace-nowrap">
                      {formatDate(c.surgery_date)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Action (Available for both Admin and Viewer) */}
                        <button
                          onClick={() => onSelectCase(c)}
                          title="View Case Dossier"
                          className="p-1.5 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Action (Conditional on Admin role) */}
                        {currentUser?.role === 'admin' ? (
                          <button
                            onClick={() => onEditCase(c)}
                            title="Edit Case (Admin Only)"
                            className="p-1.5 text-slate-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAttemptRestrictedAction('editing')}
                            title="Edit disabled: Viewer is read-only"
                            className="p-1.5 text-slate-500 hover:text-slate-700 rounded-lg transition cursor-not-allowed"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Action (Conditional on Admin role) */}
                        {currentUser?.role === 'admin' ? (
                          <button
                            onClick={() => setCaseToDelete(c)}
                            title="Delete Case (Admin Only)"
                            className="p-1.5 text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAttemptRestrictedAction('deleting')}
                            title="Delete disabled: Viewer is read-only"
                            className="p-1.5 text-slate-500 hover:text-slate-700 rounded-lg transition cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 10 Cases Per Page Pagination Bar */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="text-xs text-slate-700">
            Showing{' '}
            <span className="font-semibold text-slate-900">
              {filteredCases.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-900">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredCases.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-900">{filteredCases.length}</span> cases
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => handlePageChange(pg)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  currentPage === pg
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 hover:bg-white border border-transparent hover:border-slate-300'
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal (Admin Only) */}
      {caseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Confirm Case Deletion</h3>
                <p className="text-xs text-slate-700 mt-1">
                  Are you sure you want to permanently delete medical case{' '}
                  <span className="font-mono font-bold text-rose-600">{caseToDelete.case_number}</span>?
                  This action is logged under Laravel authorization audit.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setCaseToDelete(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition shadow-xs cursor-pointer"
              >
                Delete Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
