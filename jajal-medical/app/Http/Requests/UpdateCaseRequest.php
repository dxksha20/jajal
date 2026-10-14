<?php

namespace App\Http\Requests;

use App\Models\MedicalCase;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Only Admin users may submit updates.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Obtain route parameter 'case' or 'id'
        $caseId = $this->route('case') instanceof MedicalCase
            ? $this->route('case')->id
            : $this->route('case') ?? $this->route('id');

        return [
            'case_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('medical_cases', 'case_number')->ignore($caseId),
            ],
            'patient_ref_code' => ['required', 'string', 'max:50'],
            'surgeon_name' => ['required', 'string', 'min:3', 'max:255'],
            'implant_type' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(MedicalCase::STATUSES)],
            'priority' => ['required', Rule::in(MedicalCase::PRIORITIES)],
            'surgery_date' => ['nullable', 'date'],
        ];
    }

    /**
     * Custom error messages for friendly beginner understanding.
     */
    public function messages(): array
    {
        return [
            'case_number.required' => 'The case number field is required.',
            'case_number.unique' => 'The case number has already been taken.',
            'patient_ref_code.required' => 'The patient reference code is required.',
            'surgeon_name.required' => 'The surgeon name field is required.',
            'surgeon_name.min' => 'The surgeon name must be at least 3 characters.',
            'implant_type.required' => 'The implant type field is required.',
            'status.required' => 'The case status is required.',
            'status.in' => 'The selected status is invalid. Permitted: Draft, Planning, In Review, Approved, Completed, Cancelled.',
            'priority.required' => 'The case priority is required.',
            'priority.in' => 'The selected priority is invalid. Permitted: Low, Medium, High.',
            'surgery_date.date' => 'The surgery date must be a valid date format.',
        ];
    }
}
