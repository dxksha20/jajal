<?php

namespace Tests\Feature;

use App\Models\MedicalCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MedicalCaseTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test 4: Admin can create a case.
     */
    public function test_admin_can_create_medical_case(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $payload = [
            'case_number' => 'CAS-2026-999',
            'patient_ref_code' => 'PAT-8812',
            'surgeon_name' => 'Dr. Eleanor Vance',
            'implant_type' => 'Custom Titanium Glenoid Vault',
            'status' => 'Planning',
            'priority' => 'High',
            'surgery_date' => '2026-07-20',
        ];

        // 1. Web creation
        $response = $this->actingAs($admin)->post('/cases', $payload);
        $response->assertStatus(302);
        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas('medical_cases', [
            'case_number' => 'CAS-2026-999',
            'surgeon_name' => 'Dr. Eleanor Vance',
            'created_by' => $admin->id,
        ]);

        // 2. API creation with Sanctum
        $apiPayload = [
            'case_number' => 'CAS-2026-998',
            'patient_ref_code' => 'PAT-8813',
            'surgeon_name' => 'Dr. Michael Chang',
            'implant_type' => 'Acetabular Revision Ring',
            'status' => 'Approved',
            'priority' => 'Medium',
            'surgery_date' => '2026-08-01',
        ];

        $apiResponse = $this->actingAs($admin, 'sanctum')->postJson('/api/cases', $apiPayload);
        $apiResponse->assertStatus(201)
            ->assertJsonPath('data.case_number', 'CAS-2026-998');
    }

    /**
     * Test 5: Duplicate case number is rejected by FormRequest validation.
     */
    public function test_duplicate_case_number_is_rejected(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        // Pre-create existing case
        MedicalCase::factory()->create([
            'case_number' => 'CAS-2026-DUP',
            'created_by' => $admin->id,
        ]);

        // Attempt to create second case with same case_number
        $duplicatePayload = [
            'case_number' => 'CAS-2026-DUP',
            'patient_ref_code' => 'PAT-0000',
            'surgeon_name' => 'Dr. Different Surgeon',
            'implant_type' => 'Any Implant',
            'status' => 'Draft',
            'priority' => 'Low',
        ];

        // Web request assertion
        $response = $this->actingAs($admin)->post('/cases', $duplicatePayload);
        $response->assertSessionHasErrors(['case_number']);

        // API request assertion
        $apiResponse = $this->actingAs($admin, 'sanctum')->postJson('/api/cases', $duplicatePayload);
        $apiResponse->assertStatus(422)
            ->assertJsonValidationErrors(['case_number']);
    }

    /**
     * Test 6: Viewer cannot delete a case (Laravel Policy / Gate returns HTTP 403 Forbidden).
     */
    public function test_viewer_cannot_delete_case(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $viewer = User::factory()->create(['role' => 'viewer']);

        $case = MedicalCase::factory()->create([
            'case_number' => 'CAS-2026-DEL',
            'created_by' => $admin->id,
        ]);

        // 1. Viewer attempts Web DELETE
        $response = $this->actingAs($viewer)->delete("/cases/{$case->id}");
        $response->assertStatus(403);

        // Assert record is still in database!
        $this->assertDatabaseHas('medical_cases', [
            'id' => $case->id,
            'case_number' => 'CAS-2026-DEL',
        ]);

        // 2. Viewer attempts API DELETE with Sanctum
        $apiResponse = $this->actingAs($viewer, 'sanctum')->deleteJson("/api/cases/{$case->id}");
        $apiResponse->assertStatus(403);

        // Record remains untouched
        $this->assertDatabaseHas('medical_cases', [
            'id' => $case->id,
        ]);
    }
}
