<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CaseController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - Jajal Medical Case Management System
|--------------------------------------------------------------------------
*/

// Root redirect
Route::get('/', function () {
    return redirect()->route('dashboard');
});

// Authentication Routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected Routes (Requires Authentication)
Route::middleware(['auth'])->group(function () {
    // Dashboard (Step 6)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Medical Cases Resource Routes (Step 6)
    Route::get('/cases', [CaseController::class, 'index'])->name('cases.index');
    Route::get('/cases/create', [CaseController::class, 'create'])->name('cases.create');
    Route::post('/cases', [CaseController::class, 'store'])->name('cases.store');
    Route::get('/cases/{case}', [CaseController::class, 'show'])->name('cases.show');
    Route::get('/cases/{case}/edit', [CaseController::class, 'edit'])->name('cases.edit');
    Route::put('/cases/{case}', [CaseController::class, 'update'])->name('cases.update');
    Route::patch('/cases/{case}/status', [CaseController::class, 'updateStatus'])->name('cases.updateStatus');
    Route::delete('/cases/{case}', [CaseController::class, 'destroy'])->name('cases.destroy');
});
