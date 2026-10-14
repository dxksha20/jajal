<?php

namespace Database\Factories;

use App\Models\MedicalCase;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MedicalCase>
 */
class MedicalCaseFactory extends Factory
{
    protected $model = MedicalCase::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'case_number' => 'CAS-2026-' . fake()->unique()->numerify('####'),
            'patient_ref_code' => 'PAT-' . fake()->numerify('####'),
            'surgeon_name' => 'Dr. ' . fake()->lastName(),
            'implant_type' => fake()->randomElement([
                'Titanium Hip Stem (Acetabular Cup)',
                'Cruciate-Retaining Total Knee System',
                'Anterior Cervical Interbody Fusion Cage',
                'Reverse Shoulder Arthrosurface Prosthesis',
                'Thoracolumbar Posterior Fixation Rods',
            ]),
            'status' => fake()->randomElement(MedicalCase::STATUSES),
            'priority' => fake()->randomElement(MedicalCase::PRIORITIES),
            'surgery_date' => fake()->optional(0.7)->dateTimeBetween('+1 week', '+3 months')?->format('Y-m-d'),
            'created_by' => User::factory(),
        ];
    }
}
