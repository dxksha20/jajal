import React, { useState } from 'react';
import { BookOpen, Database, GitMerge, Copy, Check, FileText } from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'readme' | 'database' | 'traceability'>('readme');
  const [copied, setCopied] = useState(false);

  const readmeContent = `# Jajal Medical Case Management System

A beginner-friendly, secure medical case management application developed for the Software Developer Intern assignment.

## Tech Stack
- **Framework:** Laravel 12 (PHP 8.2+)
- **Database:** MySQL (with Eloquent ORM & migrations)
- **Frontend:** Laravel Blade with HTML, CSS (Tailwind) & JavaScript
- **Authentication:** Laravel Session Auth (Web) & Laravel Sanctum (REST API)

## Demo Credentials
| Role   | Email              | Password   | Permissions |
|--------|--------------------|------------|-------------|
| Admin  | \`admin@jajal.med\`  | \`password\` | Full CRUD (Create, View, Edit, Status, Delete) |
| Viewer | \`viewer@jajal.med\` | \`password\` | Read-only (View dashboard & case details) |

## Quick Setup Guide
\`\`\`bash
# 1. Clone repository
git clone https://github.com/<your-username>/jajal-medical.git
cd jajal-medical

# 2. Install Composer & Node dependencies
composer install
npm install && npm run build

# 3. Environment configuration
cp .env.example .env
php artisan key:generate

# 4. Database setup (MySQL)
# Configure DB_DATABASE=jajal_medical, DB_USERNAME, DB_PASSWORD in .env
php artisan migrate --seed

# 5. Run local development server
php artisan serve
\`\`\`
Visit http://127.0.0.1:8000 in your browser!`;

  const databaseContent = `# Jajal Medical Database Architecture (docs/database.md)

## Tables Schema

### 1. \`users\`
- \`id\` (BIGINT UNSIGNED, Primary Key, Auto Increment)
- \`name\` (VARCHAR 255)
- \`email\` (VARCHAR 255, Unique)
- \`password\` (VARCHAR 255, Hashed with bcrypt)
- \`role\` (ENUM: 'admin', 'viewer', default: 'viewer')
- \`remember_token\` (VARCHAR 100, Nullable)
- \`created_at\`, \`updated_at\` (TIMESTAMP)

### 2. \`medical_cases\`
- \`id\` (BIGINT UNSIGNED, Primary Key, Auto Increment)
- \`case_number\` (VARCHAR 50, Unique, Required, indexed)
- \`patient_ref_code\` (VARCHAR 50, Required - dummy anonymized code)
- \`surgeon_name\` (VARCHAR 255, Required)
- \`implant_type\` (VARCHAR 255, Required)
- \`status\` (ENUM: 'Draft', 'Planning', 'In Review', 'Approved', 'Completed', 'Cancelled')
- \`priority\` (ENUM: 'Low', 'Medium', 'High')
- \`surgery_date\` (DATE, Nullable)
- \`created_by\` (BIGINT UNSIGNED, Foreign Key -> \`users.id\`, cascade on delete)
- \`created_at\`, \`updated_at\` (TIMESTAMP)

### 3. \`personal_access_tokens\` (Laravel Sanctum)
- Standard Sanctum API token storage for mobile/SPA endpoints.

## Entity-Relationship
\`\`\`
users (1) ────< hasMany >──── (N) medical_cases
(Admin/Viewer)                      (Belongs to User via created_by)
\`\`\``;

  const traceabilityContent = `# Requirements Traceability Matrix (docs/traceability.md)

| Req ID | Requirement Description | Implementation (Code Files) | Automated Verification Test |
|--------|-------------------------|------------------------------|-----------------------------|
| **REQ-AUTH-01** | User authentication with Admin and Viewer role protection | \`app/Http/Controllers/AuthController.php\`<br/>\`app/Policies/MedicalCasePolicy.php\`<br/>\`routes/web.php\` | \`test_user_can_login_with_valid_credentials\`<br/>\`test_user_cannot_login_with_invalid_credentials\` |
| **REQ-AUTH-02** | Guests cannot access protected pages or APIs | \`routes/web.php\` (\`auth\` middleware)<br/>\`routes/api.php\` (\`auth:sanctum\` middleware) | \`test_guests_cannot_access_protected_pages_or_apis\` |
| **REQ-CRUD-01** | Admin can create cases with unique case number and dummy patient ref | \`app/Http/Controllers/CaseController.php\`<br/>\`app/Http/Requests/StoreCaseRequest.php\` | \`test_admin_can_create_medical_case\`<br/>\`test_duplicate_case_number_is_rejected\` |
| **REQ-POL-01** | Viewer role is strictly read-only and cannot delete cases (HTTP 403) | \`app/Policies/MedicalCasePolicy.php\` (\`delete\` method returning \`$user->role === 'admin'\`) | \`test_viewer_cannot_delete_case\` |
| **REQ-DASH-01** | Dashboard displays counts for Total Cases, Planning, In Review, Approved, Completed | \`app/Http/Controllers/DashboardController.php\`<br/>\`resources/views/dashboard.blade.php\` | Verified via Blade rendering & controller unit checks |
| **REQ-API-01** | Sanctum REST API endpoints for login, cases CRUD, and token logout | \`app/Http/Controllers/Api/ApiAuthController.php\`<br/>\`app/Http/Controllers/Api/ApiCaseController.php\`<br/>\`routes/api.php\` | Tested via Sanctum API explorer & integration tests |`;

  const currentContent =
    activeDoc === 'readme'
      ? readmeContent
      : activeDoc === 'database'
      ? databaseContent
      : traceabilityContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Tab Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Project Documentation (Step 10)
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800 border border-blue-200">
                Documentation Deliverables
              </span>
            </div>
            <p className="text-sm text-slate-700 mt-1">
              Complete documentation matching intern assignment requirements: README.md, docs/database.md, and docs/traceability.md.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Markdown' : 'Copy Content'}</span>
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveDoc('readme')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeDoc === 'readme'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>README.md (Setup & Credentials)</span>
          </button>

          <button
            onClick={() => setActiveDoc('database')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeDoc === 'database'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>docs/database.md (Schema & ER)</span>
          </button>

          <button
            onClick={() => setActiveDoc('traceability')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeDoc === 'traceability'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GitMerge className="w-4 h-4" />
            <span>docs/traceability.md (Reqs to Tests)</span>
          </button>
        </div>
      </div>

      {/* Markdown Document Content Viewer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <pre className="font-mono text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed overflow-x-auto bg-slate-50 p-6 rounded-xl border border-slate-200">
          {currentContent}
        </pre>
      </div>
    </div>
  );
};
