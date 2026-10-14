<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('medical_cases', function (Blueprint $table) {
            $table->id();
            $table->string('case_number', 50)->unique();
            $table->string('patient_ref_code', 50); // Dummy/anonymized reference code only
            $table->string('surgeon_name', 255);
            $table->string('implant_type', 255);
            $table->enum('status', [
                'Draft',
                'Planning',
                'In Review',
                'Approved',
                'Completed',
                'Cancelled',
            ])->default('Draft');
            $table->enum('priority', ['Low', 'Medium', 'High'])->default('Medium');
            $table->date('surgery_date')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            // Indexes for performant search & filtering
            $table->index('surgeon_name');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_cases');
    }
};
