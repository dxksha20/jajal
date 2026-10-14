# Database Architecture & Entity Relationships

**Project:** Jajal Medical Case Management System  
**Engine:** MySQL 8.0+ / MariaDB 10.4+  
**ORM:** Laravel 12 Eloquent ORM  

---

## 1. Schema Specifications

### Table: `users`
Stores user identities, credentials, and access control roles.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Unique user identifier |
| `name` | VARCHAR(255) | NOT NULL | User's full clinical/system display name |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | User login email address |
| `password` | VARCHAR(255) | NOT NULL | Bcrypt/Argon2id hashed password |
| `role` | ENUM('admin', 'viewer') | NOT NULL, DEFAULT 'viewer' | Role for authorization policies |
| `remember_token` | VARCHAR(100) | NULLABLE | Session remember token |
| `created_at` | TIMESTAMP | NULLABLE | Account creation timestamp |
| `updated_at` | TIMESTAMP | NULLABLE | Last profile update timestamp |

---

### Table: `medical_cases`
Stores surgical implant case dossiers. Contains only de-identified dummy patient reference codes in compliance with healthcare data confidentiality standards.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Auto-generated case primary key |
| `case_number` | VARCHAR(50) | NOT NULL, UNIQUE, INDEX | Unique surgical tracking identifier (e.g. `CAS-2026-001`) |
| `patient_ref_code` | VARCHAR(50) | NOT NULL | Synthetic dummy reference code (e.g. `PAT-8392`) |
| `surgeon_name` | VARCHAR(255) | NOT NULL, INDEX | Attending surgeon name |
| `implant_type` | VARCHAR(255) | NOT NULL | Implant system / prosthetic specification |
| `status` | ENUM | NOT NULL, DEFAULT 'Draft', INDEX | Case lifecycle stage: `Draft`, `Planning`, `In Review`, `Approved`, `Completed`, `Cancelled` |
| `priority` | ENUM | NOT NULL, DEFAULT 'Medium' | Clinical triage priority: `Low`, `Medium`, `High` |
| `surgery_date` | DATE | NULLABLE | Planned operation date |
| `created_by` | BIGINT UNSIGNED | NOT NULL, FK -> `users(id)` | User who registered the case |
| `created_at` | TIMESTAMP | NULLABLE | Dossier creation timestamp |
| `updated_at` | TIMESTAMP | NULLABLE | Last status or detail modification timestamp |

---

### Table: `personal_access_tokens` (Laravel Sanctum)
Stores API tokens issued during `POST /api/login`.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Token primary key |
| `tokenable_type` | VARCHAR(255) | NOT NULL, INDEX | Polymorphic model class (`App\Models\User`) |
| `tokenable_id` | BIGINT UNSIGNED | NOT NULL, INDEX | Foreign key to `users.id` |
| `name` | VARCHAR(255) | NOT NULL | Token identifier (e.g. `api_token`) |
| `token` | VARCHAR(64) | NOT NULL, UNIQUE | SHA-256 hashed bearer token string |
| `abilities` | TEXT | NULLABLE | Token permissions (e.g. `["*"]`) |
| `last_used_at` | TIMESTAMP | NULLABLE | Timestamp of last API invocation |
| `expires_at` | TIMESTAMP | NULLABLE | Token expiration date |
| `created_at` | TIMESTAMP | NULLABLE | Token issuance timestamp |
| `updated_at` | TIMESTAMP | NULLABLE | Token update timestamp |

---

## 2. Entity-Relationship Diagram (ERD)

```
+------------------------------------------------+
|                     users                      |
+------------------------------------------------+
| id                  : BIGINT UNSIGNED (PK)     |
| name                : VARCHAR(255)             |
| email               : VARCHAR(255) (UNIQUE)    |
| password            : VARCHAR(255)             |
| role                : ENUM('admin', 'viewer')  |
| remember_token      : VARCHAR(100)             |
| created_at          : TIMESTAMP                |
| updated_at          : TIMESTAMP                |
+------------------------------------------------+
         | 1
         |
         | hasMany
         |
         v N
+------------------------------------------------+
|                 medical_cases                  |
+------------------------------------------------+
| id                  : BIGINT UNSIGNED (PK)     |
| case_number         : VARCHAR(50) (UNIQUE)     |
| patient_ref_code    : VARCHAR(50)              |
| surgeon_name        : VARCHAR(255)             |
| implant_type        : VARCHAR(255)             |
| status              : ENUM (Draft..Cancelled)  |
| priority            : ENUM (Low, Medium, High) |
| surgery_date        : DATE (NULLABLE)          |
| created_by          : BIGINT UNSIGNED (FK)     |
| created_at          : TIMESTAMP                |
| updated_at          : TIMESTAMP                |
+------------------------------------------------+
         ^ 
         | belongsTo(User::class, 'created_by')
         | ON DELETE CASCADE
```

---

## 3. Eloquent Model Relationships

### In `App\Models\User`:
```php
public function medicalCases(): HasMany
{
    return $this->hasMany(MedicalCase::class, 'created_by');
}
```

### In `App\Models\MedicalCase`:
```php
public function creator(): BelongsTo
{
    return $this->belongsTo(User::class, 'created_by');
}
```
