<?php

use App\Http\Controllers\Api\ApiAuthController;
use App\Http\Controllers\Api\ApiCaseController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Laravel Sanctum Authentication (Step 8)
|--------------------------------------------------------------------------
*/

// Public authentication endpoint
Route::post('/login', [ApiAuthController::class, 'login']);

// Protected API routes with Sanctum Token
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [ApiAuthController::class, 'logout']);

    // Medical Cases CRUD Endpoints
    Route::get('/cases', [ApiCaseController::class, 'index']);
    Route::post('/cases', [ApiCaseController::class, 'store']);
    Route::get('/cases/{id}', [ApiCaseController::class, 'show']);
    Route::put('/cases/{id}', [ApiCaseController::class, 'update']);
    Route::delete('/cases/{id}', [ApiCaseController::class, 'destroy']);
});
