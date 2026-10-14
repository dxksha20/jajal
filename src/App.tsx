import React, { useState } from 'react';
import { User, MedicalCase, CaseFormData, CaseStatus } from './types';
import { DEMO_USERS, INITIAL_CASES } from './data/seedData';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CaseList } from './components/CaseList';
import { CaseForm } from './components/CaseForm';
import { CaseDetails } from './components/CaseDetails';
import { LoginPage } from './components/LoginPage';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(DEMO_USERS[0]); // default to Admin
  const [cases, setCases] = useState<MedicalCase[]>(INITIAL_CASES);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedCase, setSelectedCase] = useState<MedicalCase | null>(null);
  const [editingCase, setEditingCase] = useState<MedicalCase | null>(null);
  const [initialStatusFilter, setInitialStatusFilter] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFlash = (type: 'success' | 'error', message: string) => {
    setFlashMessage({ type, message });
    setTimeout(() => setFlashMessage(null), 3500);
  };

  // Toggle between Admin and Viewer roles to test permissions
  const handleToggleRole = () => {
    if (!currentUser) {
      setCurrentUser(DEMO_USERS[0]);
      showFlash('success', 'Logged in as Admin (Dr. Eleanor Vance)');
      return;
    }

    if (currentUser.role === 'admin') {
      setCurrentUser(DEMO_USERS[1]); // Viewer
      showFlash('success', 'Switched to Viewer (Mark Reynolds - Read-only access)');
    } else {
      setCurrentUser(DEMO_USERS[0]); // Admin
      showFlash('success', 'Switched to Admin (Dr. Eleanor Vance - Full CRUD access)');
    }
  };

  const handleSelectCase = (caseItem: MedicalCase) => {
    setSelectedCase(caseItem);
    setActiveTab('case-details');
  };

  const handleEditCase = (caseItem: MedicalCase) => {
    if (currentUser?.role !== 'admin') {
      showFlash('error', '403 Forbidden: Viewers are not authorized to edit cases.');
      return;
    }
    setEditingCase(caseItem);
    setActiveTab('case-edit');
  };

  const handleNavigateToCasesWithFilter = (filterStatus?: string) => {
    setInitialStatusFilter(filterStatus || '');
    setActiveTab('cases');
  };

  const handleSaveCase = (formData: CaseFormData) => {
    if (currentUser?.role !== 'admin') {
      showFlash('error', '403 Forbidden: Only Admin users can create or modify cases.');
      return;
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (editingCase) {
      // Update existing case
      setCases((prev) =>
        prev.map((c) =>
          c.id === editingCase.id
            ? {
                ...c,
                case_number: formData.case_number.trim(),
                patient_ref_code: formData.patient_ref_code.trim(),
                surgeon_name: formData.surgeon_name.trim(),
                implant_type: formData.implant_type.trim(),
                status: formData.status,
                priority: formData.priority,
                surgery_date: formData.surgery_date || null,
                updated_at: now,
              }
            : c
        )
      );
      showFlash('success', `Case ${formData.case_number} updated successfully.`);
      setEditingCase(null);
      setActiveTab('cases');
    } else {
      // Create new case
      const newId = Math.max(...cases.map((c) => c.id), 0) + 1;
      const newCase: MedicalCase = {
        id: newId,
        case_number: formData.case_number.trim(),
        patient_ref_code: formData.patient_ref_code.trim(),
        surgeon_name: formData.surgeon_name.trim(),
        implant_type: formData.implant_type.trim(),
        status: formData.status,
        priority: formData.priority,
        surgery_date: formData.surgery_date || null,
        created_by: currentUser.id,
        created_by_name: currentUser.name,
        created_at: now,
        updated_at: now,
      };

      setCases((prev) => [newCase, ...prev]);
      showFlash('success', `Case ${newCase.case_number} created successfully.`);
      setActiveTab('cases');
    }
  };

  const handleDeleteCase = (caseId: number) => {
    if (currentUser?.role !== 'admin') {
      showFlash('error', '403 Forbidden: Viewers cannot delete medical cases.');
      return;
    }

    const target = cases.find((c) => c.id === caseId);
    setCases((prev) => prev.filter((c) => c.id !== caseId));
    showFlash('success', `Case ${target?.case_number || caseId} deleted successfully.`);
  };

  const handleUpdateStatus = (caseId: number, newStatus: CaseStatus) => {
    if (currentUser?.role !== 'admin') {
      showFlash('error', '403 Forbidden: Only Admin users can change case status.');
      return;
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? { ...c, status: newStatus, updated_at: now }
          : c
      )
    );

    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase((prev) => (prev ? { ...prev, status: newStatus, updated_at: now } : null));
    }

    showFlash('success', `Case status updated to "${newStatus}".`);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setShowLoginModal(false);
    showFlash('success', `Welcome back, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showFlash('success', 'Logged out successfully.');
  };

  // If user is logged out, show the Login page directly
  if (!currentUser && !showLoginModal) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'create-case' && currentUser?.role !== 'admin') {
            showFlash('error', '403 Forbidden: Only Admins can create cases.');
            setActiveTab('cases');
            return;
          }
          setActiveTab(tab);
        }}
        onOpenLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onToggleRole={handleToggleRole}
      />

      {/* Flash Alerts */}
      {flashMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
          <div
            className={`p-3.5 rounded-xl border flex items-center gap-3 text-sm font-medium shadow-xs ${
              flashMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {flashMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{flashMessage.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area - Strictly Jajal Medical Tasks */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* 1. Dashboard (Counts: Total, Planning, In Review, Approved, Completed) */}
        {activeTab === 'dashboard' && (
          <Dashboard
            cases={cases}
            currentUser={currentUser}
            onNavigateToCases={handleNavigateToCasesWithFilter}
            onNavigateToCreate={() => setActiveTab('create-case')}
            onSelectCase={handleSelectCase}
          />
        )}

        {/* 2. Medical Case List (10 per page, search, filter, conditional actions) */}
        {activeTab === 'cases' && (
          <CaseList
            cases={cases}
            currentUser={currentUser}
            initialStatusFilter={initialStatusFilter}
            onSelectCase={handleSelectCase}
            onEditCase={handleEditCase}
            onCreateCase={() => setActiveTab('create-case')}
            onDeleteCase={handleDeleteCase}
          />
        )}

        {/* 3. Create Case Form (Admin only) */}
        {activeTab === 'create-case' && (
          <CaseForm
            existingCases={cases}
            currentUser={currentUser}
            onSave={handleSaveCase}
            onCancel={() => setActiveTab('cases')}
          />
        )}

        {/* 4. Edit Case Form (Admin only) */}
        {activeTab === 'case-edit' && (
          <CaseForm
            initialCase={editingCase}
            existingCases={cases}
            currentUser={currentUser}
            onSave={handleSaveCase}
            onCancel={() => {
              setEditingCase(null);
              setActiveTab('cases');
            }}
          />
        )}

        {/* 5. Case Details Page */}
        {activeTab === 'case-details' && selectedCase && (
          <CaseDetails
            caseItem={selectedCase}
            currentUser={currentUser}
            onBack={() => setActiveTab('cases')}
            onEdit={() => handleEditCase(selectedCase)}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="max-w-md w-full animate-in zoom-in-95">
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onCancel={() => setShowLoginModal(false)}
            />
          </div>
        </div>
      )}

      {/* Clean Medical Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            &copy; {new Date().getFullYear()} Jajal Medical Case Management System
          </p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Admin &amp; Viewer Access Control</span>
            <span>&bull;</span>
            <span>Laravel 12</span>
            <span>&bull;</span>
            <span>MySQL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
