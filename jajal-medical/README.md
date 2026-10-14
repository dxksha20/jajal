# Jajal Medical Case Management System

A clean, beginner-friendly, and secure medical case management web application built for the **Software Developer Intern Practical Assignment** at **@Jajal Medical**.

---

## 1. Project Overview & Tech Stack

A medical device company tracks implant cases from draft to completion. Authorized users log in, create cases, update their status, and view them on an accessible clinical dashboard.

- **Backend Framework:** Laravel 12 (PHP 8.2+)
- **Database:** MySQL / MariaDB (via Eloquent ORM & Migrations)
- **Frontend:** Laravel Blade with HTML5, CSS (Tailwind CSS) & JavaScript
- **Web Authentication:** Laravel Session & Cookie Authentication
- **API Authentication:** Laravel Sanctum (Bearer Tokens)
- **Development Environment:** Native PHP CLI / Laravel Herd

---

## 2. Running Locally with Laravel Herd (Recommended)

Since you have **Laravel Herd** installed, running this project is completely automated and takes under 60 seconds:

### Step 1: Open the Project in Herd
- **Option A (Parked Folder):** Move or clone this `jajal` repository into your Herd folder (by default `C:\Users\<YourUser>\Herd\jajal` on Windows or `~/Herd/jajal` on macOS).
- **Option B (Link via Terminal):** Open your terminal in this project folder and run:
  ```bash
  herd link jajal
  ```

### Step 2: Install Dependencies & Setup Environment
Open your terminal (PowerShell, Command Prompt, or Git Bash) inside the project folder:
```bash
# 1. Install Composer dependencies
composer install

# 2. Setup your .env file
cp .env.example .env
php artisan key:generate

# 3. Configure Database in .env
# By default, SQLite or MySQL can be used:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=jajal_medical
# DB_USERNAME=root
# DB_PASSWORD=

# 4. Run database migrations & seed dummy records
php artisan migrate --seed
```

### Step 3: Open in Browser
Open your browser and navigate directly to:
👉 **[http://jajal.test](http://jajal.test)**

*(Laravel Herd automatically proxies the `.test` domain, manages PHP 8.2+, handles HTTPS, and routes incoming traffic without needing `php artisan serve`)*

---

## 3. Alternative Setup (Standard PHP CLI / Artisan Serve)

If running without Laravel Herd:
```bash
# 1. Clone the repository
git clone https://github.com/dxksha20/jajal.git
cd jajal

# 2. Install dependencies
composer install
npm install && npm run build

# 3. Environment configuration
cp .env.example .env
php artisan key:generate

# 4. Run migrations and seeders
php artisan migrate --seed

# 5. Start development server
php artisan serve
```
Then navigate to **http://127.0.0.1:8000** in your browser.

---

## 4. Test Login Credentials (Dummy Accounts)

The database seeders (`UserSeeder`) populate two demo accounts matching the assignment specifications:

| Role | Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@jajal.med` | `password` | **Full Authority:** View cases, Create cases, Edit cases, Change status, and Delete cases. |
| **Viewer** | `viewer@jajal.med` | `password` | **Read-Only:** View cases and case details only. Blocked (HTTP 403) from creating, editing, updating status, or deleting cases. |

---

## 5. Automated Tests

All 6 mandatory feature tests specified in the assignment are written using PHPUnit / Laravel Test suite:

```bash
php artisan test
```

### Test Suite Results:
```
PHPUnit 11.5.57 by Sebastian Bergmann and contributors.
Runtime:       PHP 8.2.34
Configuration: phpunit.xml

........                                                            8 / 8 (100%)

Time: 00:00.759, Memory: 42.50 MB
OK (8 tests, 47 assertions)
```

1. **`test_user_can_login_with_valid_credentials`**: Valid login succeeds, authenticates session, and issues Sanctum token.
2. **`test_user_cannot_login_with_invalid_credentials`**: Invalid login is rejected with validation message; user remains guest.
3. **`test_guests_cannot_access_protected_pages_or_apis`**: Guest cannot open case pages (redirects to `/login`) or APIs (returns HTTP 401).
4. **`test_admin_can_create_medical_case`**: Admin can create a case; verifies database insertion.
5. **`test_duplicate_case_number_is_rejected`**: Duplicate case number triggers HTTP 422 with *"The case number has already been taken."*
6. **`test_viewer_cannot_delete_case`**: Server authorization policy blocks Viewer deletion with HTTP 403 Forbidden.

---

## 6. REST API Endpoints (Laravel Sanctum)

All endpoints return a consistent JSON shape: `{ "success": true, "data": {...}, "message": "..." }`

| Method | Endpoint | Description | Who Can Call | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/login` | Authenticate and obtain Sanctum Bearer token | Anyone | `200`, `422` |
| `POST` | `/api/logout` | Revoke current Bearer token | Logged-in users | `200`, `401` |
| `GET` | `/api/cases` | List cases (paginated, 10/page, search & filter) | Admin, Viewer | `200`, `401` |
| `POST` | `/api/cases` | Create medical case (FormRequest validation) | Admin Only | `201`, `401`, `403`, `422` |
| `GET` | `/api/cases/{id}` | Get single case details | Admin, Viewer | `200`, `401`, `404` |
| `PUT` | `/api/cases/{id}` | Update medical case | Admin Only | `200`, `401`, `403`, `404`, `422` |
| `DELETE`| `/api/cases/{id}` | Delete medical case | Admin Only | `200`, `401`, `403`, `404` |

*A ready-to-import Postman Collection is included at: `jajal-medical.postman_collection.json`.*

---

## 7. Requirements Traceability Matrix (`docs/traceability.md`)

| ID | Requirement (Input) | Implementation (Output) | Verification |
| :--- | :--- | :--- | :--- |
| **REQ-001** | Admin shall be able to create a case | `CaseController@store` + `cases/create.blade.php` + `StoreCaseRequest` | Feature test: `test_admin_can_create_medical_case` |
| **REQ-002** | Case Number shall be unique | Unique DB index + `StoreCaseRequest` & `UpdateCaseRequest` rule | Feature test: `test_duplicate_case_number_is_rejected` |
| **REQ-003** | Only Admin shall delete cases | `MedicalCasePolicy@delete` returning `403` for non-admins | Feature test: `test_viewer_cannot_delete_case` |

---

## 8. Assumptions & Known Limitations

1. **Patient Data Privacy:** In compliance with healthcare data regulations, only synthetic/dummy patient reference codes (e.g. `PAT-8392`) are recorded. No personal identifying information (PHI) is collected.
2. **Session Lifetime:** Web sessions expire after 120 minutes of inactivity as configured in `config/session.php`.
3. **Database Portability:** Configured with clean MySQL migrations and indexes (`case_number` unique index, `status` index), while also maintaining 100% compatibility with SQLite for fast in-memory test execution.
