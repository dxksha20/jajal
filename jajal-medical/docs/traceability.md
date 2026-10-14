# Requirements Traceability Matrix (RTM)

**Project:** Jajal Medical Case Management System  
**Framework:** Laravel 12 & MySQL  

This traceability matrix maps assignment requirements to their precise architectural components, source files, and automated verification tests.

---

## Traceability Mapping Table

| Requirement ID | Requirement Description | Implementation Source Files | Verification Test (PHPUnit) | Test Verification Result |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-AUTH-01** | **User Authentication & Session Management**: Secure login and logout with Admin and Viewer role distinction. | `app/Http/Controllers/AuthController.php`<br>`resources/views/auth/login.blade.php`<br>`routes/web.php` | `Tests\Feature\AuthTest::test_user_can_login_with_valid_credentials`<br>`Tests\Feature\AuthTest::test_user_cannot_login_with_invalid_credentials` | **PASS** (Asserts HTTP 302 redirect, session authentication, and error bag population) |
| **REQ-AUTH-02** | **Guest Route Protection**: Unauthenticated guests must not be able to access protected web pages or API endpoints. | `routes/web.php` (`auth` middleware)<br>`routes/api.php` (`auth:sanctum` middleware) | `Tests\Feature\AuthTest::test_guests_cannot_access_protected_pages_or_apis` | **PASS** (Asserts HTTP 302 redirect to `/login` for web routes, and HTTP 401 Unauthorized for API) |
| **REQ-CASE-01** | **Admin Case Creation**: Users with Admin role can create new medical cases with required clinical fields and synthetic patient reference codes. | `app/Http/Controllers/CaseController.php`<br>`app/Http/Requests/StoreCaseRequest.php`<br>`resources/views/cases/create.blade.php` | `Tests\Feature\MedicalCaseTest::test_admin_can_create_medical_case` | **PASS** (Asserts database has case record with exact surgeon, implant, and creator user ID) |
| **REQ-VAL-01** | **Unique Case Number Enforcement**: Case numbers must be unique across all records. Duplicate submissions must be rejected with understandable error messages. | `app/Http/Requests/StoreCaseRequest.php`<br>`app/Http/Requests/UpdateCaseRequest.php` | `Tests\Feature\MedicalCaseTest::test_duplicate_case_number_is_rejected` | **PASS** (Asserts HTTP 422 session/API error: *"The case number has already been taken."*) |
| **REQ-POL-01** | **Role Authorization Gate (Viewer Deletion Block)**: Users with the Viewer role are restricted to read-only access and cannot delete or modify medical cases. | `app/Policies/MedicalCasePolicy.php`<br>`app/Http/Controllers/CaseController.php` | `Tests\Feature\MedicalCaseTest::test_viewer_cannot_delete_case` | **PASS** (Asserts HTTP 403 Forbidden and confirms record remains intact in the database) |
| **REQ-DASH-01** | **Dashboard Metrics Aggregation**: Dashboard must calculate and display live counts for Total Cases, Planning, In Review, Approved, and Completed. | `app/Http/Controllers/DashboardController.php`<br>`resources/views/dashboard.blade.php` | `Tests\Feature\MedicalCaseTest::test_admin_can_create_medical_case`<br>Manual & Unit Aggregations | **PASS** (Counts dynamically match database records) |
| **REQ-API-01** | **Laravel Sanctum REST API Endpoints**: Full CRUD endpoints with Bearer token authentication and consistent HTTP status codes. | `app/Http/Controllers/Api/ApiAuthController.php`<br>`app/Http/Controllers/Api/ApiCaseController.php`<br>`routes/api.php` | `Tests\Feature\AuthTest::test_user_can_login_with_valid_credentials`<br>`Tests\Feature\MedicalCaseTest::test_admin_can_create_medical_case`<br>`Tests\Feature\MedicalCaseTest::test_viewer_cannot_delete_case` | **PASS** (Verified with Sanctum token headers returning 200, 201, 401, 403, 404, 422) |

---

## Deep-Dive Requirement Breakdown

### Requirement Deep-Dive 1: REQ-POL-01 (Viewer Read-Only Policy)
- **Business Rule:** Clinical viewers can inspect surgery schedules and implant dossiers, but are strictly prohibited from deleting or editing medical records.
- **Enforcement Mechanism:** Handled server-side in `app/Policies/MedicalCasePolicy.php` using `$user->role === 'admin'`. The controller calls `Gate::authorize('delete', $case)` before performing any database operations.
- **Verification:** `MedicalCaseTest::test_viewer_cannot_delete_case` verifies that when an authenticated user with `role = 'viewer'` sends a `DELETE /cases/{id}` or `DELETE /api/cases/{id}` request:
  1. The server halts execution with **HTTP 403 Forbidden**.
  2. The record remains unmodified in the database (`assertDatabaseHas('medical_cases', ['id' => $case->id])`).

### Requirement Deep-Dive 2: REQ-VAL-01 (Unique Case Number)
- **Business Rule:** Every medical case dossier must have a unique tracking identifier (e.g., `CAS-2026-001`).
- **Enforcement Mechanism:** `StoreCaseRequest` enforces `unique:medical_cases,case_number`. `UpdateCaseRequest` utilizes `Rule::unique('medical_cases', 'case_number')->ignore($caseId)` so an Admin can update other fields without triggering self-collision.
- **Verification:** `MedicalCaseTest::test_duplicate_case_number_is_rejected` seeds a case, attempts a duplicate creation with identical `case_number`, and asserts that validation fails with error key `case_number`.

### Requirement Deep-Dive 3: REQ-DASH-01 (Dashboard Lifecycle Metrics)
- **Business Rule:** Operating room coordinators and surgical teams must have immediate visibility into total volume and specific pipeline stages: Planning, In Review, Approved, and Completed.
- **Enforcement Mechanism:** `DashboardController::index()` queries `MedicalCase::where('status', $status)->count()` and injects the variables directly into `resources/views/dashboard.blade.php`.
