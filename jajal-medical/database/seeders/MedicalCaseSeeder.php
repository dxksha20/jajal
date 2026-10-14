<?php

namespace Database\Seeders;

use App\Models\MedicalCase;
use App\Models\User;
use Illuminate\Database\Seeder;

class MedicalCaseSeeder extends Seeder
{
    /**
     * Seed at least 20 realistic dummy cases with synthetic patient info only.
     */
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first() ?? User::factory()->create(['role' => 'admin']);

        $casesData = [
            [
                'case_number' => 'CAS-2026-001',
                'patient_ref_code' => 'PAT-8392',
                'surgeon_name' => 'Dr. Michael Chang',
                'implant_type' => 'Titanium Hip Stem (Acetabular Cup)',
                'status' => 'Completed',
                'priority' => 'High',
                'surgery_date' => '2026-02-14',
            ],
            [
                'case_number' => 'CAS-2026-002',
                'patient_ref_code' => 'PAT-1044',
                'surgeon_name' => 'Dr. Sarah Jenkins',
                'implant_type' => 'Cruciate-Retaining Total Knee System',
                'status' => 'Approved',
                'priority' => 'Medium',
                'surgery_date' => '2026-03-02',
            ],
            [
                'case_number' => 'CAS-2026-003',
                'patient_ref_code' => 'PAT-6721',
                'surgeon_name' => 'Dr. David Kim',
                'implant_type' => 'Anterior Cervical Interbody Fusion Cage',
                'status' => 'In Review',
                'priority' => 'High',
                'surgery_date' => '2026-03-10',
            ],
            [
                'case_number' => 'CAS-2026-004',
                'patient_ref_code' => 'PAT-4409',
                'surgeon_name' => 'Dr. Michael Chang',
                'implant_type' => 'Reverse Shoulder Arthrosurface Prosthesis',
                'status' => 'Planning',
                'priority' => 'Medium',
                'surgery_date' => '2026-03-18',
            ],
            [
                'case_number' => 'CAS-2026-005',
                'patient_ref_code' => 'PAT-9912',
                'surgeon_name' => 'Dr. Priya Sharma',
                'implant_type' => 'Cannulated Pediatric Femoral Screw',
                'status' => 'Draft',
                'priority' => 'Low',
                'surgery_date' => null,
            ],
            [
                'case_number' => 'CAS-2026-006',
                'patient_ref_code' => 'PAT-3120',
                'surgeon_name' => 'Dr. Robert Torres',
                'implant_type' => 'Bicondylar Hemi-Knee Unicompartmental',
                'status' => 'Planning',
                'priority' => 'High',
                'surgery_date' => '2026-03-24',
            ],
            [
                'case_number' => 'CAS-2026-007',
                'patient_ref_code' => 'PAT-7815',
                'surgeon_name' => 'Dr. Sarah Jenkins',
                'implant_type' => 'Cranial Reconstruction PEEK Plate',
                'status' => 'In Review',
                'priority' => 'High',
                'surgery_date' => '2026-03-28',
            ],
            [
                'case_number' => 'CAS-2026-008',
                'patient_ref_code' => 'PAT-5534',
                'surgeon_name' => 'Dr. David Kim',
                'implant_type' => 'Thoracolumbar Posterior Fixation Rods',
                'status' => 'Approved',
                'priority' => 'Medium',
                'surgery_date' => '2026-04-05',
            ],
            [
                'case_number' => 'CAS-2026-009',
                'patient_ref_code' => 'PAT-2098',
                'surgeon_name' => 'Dr. Priya Sharma',
                'implant_type' => 'Distal Radius Volar Locking Plate',
                'status' => 'Completed',
                'priority' => 'Low',
                'surgery_date' => '2026-02-20',
            ],
            [
                'case_number' => 'CAS-2026-010',
                'patient_ref_code' => 'PAT-6641',
                'surgeon_name' => 'Dr. Michael Chang',
                'implant_type' => 'Revision Hip Dual Mobility Liner',
                'status' => 'Planning',
                'priority' => 'High',
                'surgery_date' => '2026-04-12',
            ],
            [
                'case_number' => 'CAS-2026-011',
                'patient_ref_code' => 'PAT-1823',
                'surgeon_name' => 'Dr. Robert Torres',
                'implant_type' => 'Ankle Arthrodesis TTC Nail',
                'status' => 'Approved',
                'priority' => 'Medium',
                'surgery_date' => '2026-04-18',
            ],
            [
                'case_number' => 'CAS-2026-012',
                'patient_ref_code' => 'PAT-4902',
                'surgeon_name' => 'Dr. Sarah Jenkins',
                'implant_type' => 'Posterior Stabilized Total Knee Prosthesis',
                'status' => 'Draft',
                'priority' => 'Low',
                'surgery_date' => null,
            ],
            [
                'case_number' => 'CAS-2026-013',
                'patient_ref_code' => 'PAT-7389',
                'surgeon_name' => 'Dr. David Kim',
                'implant_type' => 'Expandable Vertebral Body Replacement',
                'status' => 'In Review',
                'priority' => 'High',
                'surgery_date' => '2026-04-22',
            ],
            [
                'case_number' => 'CAS-2026-014',
                'patient_ref_code' => 'PAT-8810',
                'surgeon_name' => 'Dr. Priya Sharma',
                'implant_type' => 'Proximal Humerus Fracture Plate',
                'status' => 'Approved',
                'priority' => 'Medium',
                'surgery_date' => '2026-04-29',
            ],
            [
                'case_number' => 'CAS-2026-015',
                'patient_ref_code' => 'PAT-3371',
                'surgeon_name' => 'Dr. Robert Torres',
                'implant_type' => 'Intramedullary Femoral Reconstruction Nail',
                'status' => 'Completed',
                'priority' => 'High',
                'surgery_date' => '2026-03-01',
            ],
            [
                'case_number' => 'CAS-2026-016',
                'patient_ref_code' => 'PAT-9043',
                'surgeon_name' => 'Dr. Michael Chang',
                'implant_type' => 'Ceramic-on-Ceramic Total Hip System',
                'status' => 'Planning',
                'priority' => 'Low',
                'surgery_date' => '2026-05-06',
            ],
            [
                'case_number' => 'CAS-2026-017',
                'patient_ref_code' => 'PAT-5167',
                'surgeon_name' => 'Dr. Sarah Jenkins',
                'implant_type' => 'ACL Reconstruction Interference Screw',
                'status' => 'Cancelled',
                'priority' => 'Low',
                'surgery_date' => null,
            ],
            [
                'case_number' => 'CAS-2026-018',
                'patient_ref_code' => 'PAT-6294',
                'surgeon_name' => 'Dr. David Kim',
                'implant_type' => 'Lumbar Microdiscectomy Annular Closure Device',
                'status' => 'Planning',
                'priority' => 'Medium',
                'surgery_date' => '2026-05-12',
            ],
            [
                'case_number' => 'CAS-2026-019',
                'patient_ref_code' => 'PAT-7019',
                'surgeon_name' => 'Dr. Priya Sharma',
                'implant_type' => 'Clavicle Hook Plate System',
                'status' => 'Approved',
                'priority' => 'Medium',
                'surgery_date' => '2026-05-18',
            ],
            [
                'case_number' => 'CAS-2026-020',
                'patient_ref_code' => 'PAT-8430',
                'surgeon_name' => 'Dr. Robert Torres',
                'implant_type' => 'Tibial Plateau Variable Angle Locking Plate',
                'status' => 'In Review',
                'priority' => 'High',
                'surgery_date' => '2026-05-22',
            ],
            [
                'case_number' => 'CAS-2026-021',
                'patient_ref_code' => 'PAT-9511',
                'surgeon_name' => 'Dr. Michael Chang',
                'implant_type' => 'Custom 3D-Printed Titanium Pelvic Augment',
                'status' => 'Planning',
                'priority' => 'High',
                'surgery_date' => '2026-05-28',
            ],
        ];

        foreach ($casesData as $item) {
            MedicalCase::updateOrCreate(
                ['case_number' => $item['case_number']],
                array_merge($item, ['created_by' => $admin->id])
            );
        }
    }
}
