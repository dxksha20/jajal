<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalCase extends Model
{
    use HasFactory;

    protected $table = 'medical_cases';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'case_number',
        'patient_ref_code',
        'surgeon_name',
        'implant_type',
        'status',
        'priority',
        'surgery_date',
        'created_by',
    ];

    /**
     * Attribute casting.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'surgery_date' => 'date:Y-m-d',
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];

    /**
     * Allowed statuses.
     */
    public const STATUSES = [
        'Draft',
        'Planning',
        'In Review',
        'Approved',
        'Completed',
        'Cancelled',
    ];

    /**
     * Allowed priorities.
     */
    public const PRIORITIES = [
        'Low',
        'Medium',
        'High',
    ];

    /**
     * User who created the case.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Alias for creator.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
