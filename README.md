# Jajal Medical Case Management System

A robust, beginner-friendly, and secure medical case management web application built for the Software Developer Intern assignment.

## Tech Stack
- **Backend Framework:** Laravel 12 (PHP 8.2+)
- **Database:** MySQL / MariaDB (with Eloquent ORM & Migrations)
- **Frontend:** Laravel Blade with HTML5, CSS (Tailwind CSS) & JavaScript
- **Web Authentication:** Laravel Session & Cookie Authentication
- **API Authentication:** Laravel Sanctum (Bearer Token)
- **Testing:** PHPUnit / Pest Feature Test Suite (100% Passing)

---

## Demo Credentials

The database comes pre-seeded with two demo accounts representing distinct access roles:

| Role | Email | Password | Permissions & Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@jajal.med` | `password` | **Full CRUD Authority**: Can view dashboard metrics, browse cases, create new surgical dossiers, edit existing records, advance clinical status, and permanently delete cases. |
| **Viewer** | `viewer@jajal.med` | `password` | **Read-Only Inspection**: Can view clinical dashboard metrics, browse cases, and view full case dossiers. Any attempt to create, edit, or delete is forbidden (HTTP 403) by Laravel Policy. |

---

## Step-by-Step Local Setup Guide

### 1. Prerequisites Check (Step 1)
Verify required development tools are installed on your system:
```bash
php -v       # Requires PHP 8.2 or higher
composer -V  # Composer 2.x
node -v      # Node.js 18.x or 20.x+
npm -v       # npm 9.x or 10.x+
mysql --version
```
*Windows Tip:* If tools are not yet installed, install **XAMPP** (includes PHP 8.2+ and MariaDB/MySQL) from [apachefriends.org](https://www.apachefriends.org/) and **Composer** from [getcomposer.org](https://getcomposer.org/).

### 2. Clone the Repository
```bash
git clone https://github.com/<your-username>/jajal-medical.git
cd jajal-medical
```

### 3. Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install Frontend dependencies & build assets
npm install
npm run build
```

### 4. Configure Database (.env)
```bash
cp .env.example .env
php artisan key:generate
```
Open `.env` and verify your MySQL database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=jajal_medical
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

### 5. Create Database and Run Migrations & Seeders
Create the database in MySQL or phpMyAdmin:
```sql
CREATE DATABASE jajal_medical CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Then run migrations and seeders:
```bash
php artisan migrate --seed
```
*Note: This creates all tables (`users`, `medical_cases`, `personal_access_tokens`) and seeds both demo users and 21 realistic surgical dummy cases.*

### 6. Run Automated Feature Tests
Execute the comprehensive test suite verifying authentication, guest access blocks, admin creation, duplicate rejection, and viewer deletion protection:
```bash
php artisan test
```

### 7. Start the Local Server
```bash
php artisan serve
```
Open your browser and navigate to **http://127.0.0.1:8000**!

---

## RESTful API Endpoints (Laravel Sanctum)

| Method | Endpoint | Auth | Role Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/login` | None | Public | Authenticates credentials and returns Sanctum Bearer token |
| `POST` | `/api/logout` | Sanctum | Any Authenticated | Revokes current access token |
| `GET` | `/api/cases` | Sanctum | Admin or Viewer | Lists cases (10 per page, supports `?search=` and `?status=`) |
| `POST` | `/api/cases` | Sanctum | Admin Only | Creates medical case with FormRequest validation (403 if Viewer) |
| `GET` | `/api/cases/{id}` | Sanctum | Admin or Viewer | Fetches detailed case dossier (404 if not found) |
| `PUT` | `/api/cases/{id}` | Sanctum | Admin Only | Updates medical case (403 if Viewer, 404 if not found) |
| `DELETE` | `/api/cases/{id}` | Sanctum | Admin Only | Deletes medical case (403 if Viewer, 404 if not found) |

---

## Project Structure
```
jajal-medical/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php          # Web login/logout
│   │   │   ├── CaseController.php          # Medical case CRUD & search/filter
│   │   │   ├── DashboardController.php     # Metrics calculation
│   │   │   └── Api/
│   │   │       ├── ApiAuthController.php   # Sanctum token API auth
│   │   │       └── ApiCaseController.php   # REST API CRUD endpoints
│   │   └── Requests/
│   │       ├── StoreCaseRequest.php        # Creation validation & unique check
│   │       └── UpdateCaseRequest.php       # Update validation (ignores current id)
│   ├── Models/
│   │   ├── MedicalCase.php                 # Eloquent model & relationships
│   │   └── User.php                        # Authenticatable & HasApiTokens
│   └── Policies/
│       └── MedicalCasePolicy.php           # Role-based authorization gates
├── database/
│   ├── migrations/                         # Users, cases, tokens schemas
│   └── seeders/                            # UserSeeder & MedicalCaseSeeder
├── resources/views/
│   ├── layouts/app.blade.php               # Clean medical master layout
│   ├── auth/login.blade.php                # Authentication page
│   ├── dashboard.blade.php                 # Lifecycle metric cards
│   └── cases/                              # Index, create, edit, show views
├── routes/
│   ├── web.php                             # Session-authenticated web routes
│   └── api.php                             # Sanctum token-protected API routes
└── tests/Feature/
    ├── AuthTest.php                        # Tests 1, 2, 3
    └── MedicalCaseTest.php                 # Tests 4, 5, 6
```
