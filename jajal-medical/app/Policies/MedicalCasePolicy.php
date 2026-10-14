<?php

namespace App\Policies;

use App\Models\MedicalCase;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MedicalCasePolicy
{
    /**
     * Determine whether the user can view any medical cases.
     * Both Admin and Viewer can view case listings.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'viewer'], true);
    }

    /**
     * Determine whether the user can view the specific medical case dossier.
     * Both Admin and Viewer can view details.
     */
    public function view(User $user, MedicalCase $medicalCase): bool
    {
        return in_array($user->role, ['admin', 'viewer'], true);
    }

    /**
     * Determine whether the user can create medical cases.
     * Only Admin can create cases.
     */
    public function create(User $user): Response
    {
        return $user->role === 'admin'
            ? Response::allow()
            : Response::deny('403 Forbidden: Only Admin users are authorized to create medical cases.');
    }

    /**
     * Determine whether the user can update the medical case or its status.
     * Only Admin can update cases.
     */
    public function update(User $user, MedicalCase $medicalCase): Response
    {
        return $user->role === 'admin'
            ? Response::allow()
            : Response::deny('403 Forbidden: Only Admin users are authorized to modify medical cases.');
    }

    /**
     * Determine whether the user can delete the medical case.
     * Only Admin can delete cases.
     */
    public function delete(User $user, MedicalCase $medicalCase): Response
    {
        return $user->role === 'admin'
            ? Response::allow()
            : Response::deny('403 Forbidden: Only Admin users are authorized to delete medical cases.');
    }
}
