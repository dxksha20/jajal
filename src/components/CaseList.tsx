import React, { useState, useMemo } from 'react';
import { MedicalCase, User } from '../types';
import {
  Search,
  PlusCircle,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [caseToDelete, setCaseToDelete] = useState<MedicalCase | null>(null);

  const ITEMS_PER_PAGE = 10;

  // Search by case number OR surgeon name, filter by status
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesSearch =
        searchTerm === '' ||
        c.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.surgeon_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.implant_type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === '' || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [cases, searchTerm, statusFilter]);

  // Exactly 10 cases per page pagination
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

  const confirmDelete = () => {
    if (caseToDelete && currentUser?.role === 'admin') {
      onDeleteCase(caseToDelete.id);
      setCaseToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Medical Cases
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Case listing (10 cases per page)
            </p>
          </div>

          <div>
            {/* Create Case Button - displayed only where appropriate for Admin users */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={onCreateCase}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Case</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter and Search Bar: Search by case number or surgeon name & Filter by status */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2">
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
              placeholder="Search by case number or surgeon name..."
              className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full py-2.5 px-3 border border-slate-300 bg-white rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Planning">Planning</option>
              <option value="In Review">In Review</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {(searchTerm || statusFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setCurrentPage(1);
                }}
                className="text-xs text-slate-600 hover:text-slate-900 px-2.5 py-2 hover:bg-slate-100 rounded-lg whitespace-nowrap cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Case Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Case Number</th>
                <th className="py-3.5 px-4">Patient Ref</th>
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
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No medical cases found</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing filters or search keywords.</p>
                  </td>
                </tr>
              ) : (
                paginatedCases.map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/30 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                      {c.case_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {c.patient_ref_code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                      {c.surgeon_name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={c.implant_type}>
                      {c.implant_type}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 text-xs rounded-md border font-medium ${getStatusBadgeClass(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 text-xs rounded-md border ${getPriorityBadgeClass(c.priority)}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                      {formatDate(c.surgery_date)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {/* View Action - Available to everyone */}
                        <button
                          onClick={() => onSelectCase(c)}
                          title="View Details"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit & Delete Actions - Displayed ONLY for Admin users */}
                        {currentUser?.role === 'admin' && (
                          <>
                            <button
                              onClick={() => onEditCase(c)}
                              title="Edit Case"
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setCaseToDelete(c)}
                              title="Delete Case"
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
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
          <div className="text-xs text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-800">
              {filteredCases.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-800">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredCases.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-800">{filteredCases.length}</span> cases
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

      {/* Delete Confirmation Modal (Admin only) */}
      {caseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Confirm Case Deletion</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Are you sure you want to permanently delete case{' '}
                  <span className="font-mono font-bold text-rose-600">{caseToDelete.case_number}</span>?
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
