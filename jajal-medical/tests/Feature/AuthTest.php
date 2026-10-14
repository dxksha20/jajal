<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test 1: Valid login authenticates user and redirects to dashboard.
     */
    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@jajal.med',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $response = $this->post('/login', [
            'email' => 'admin@jajal.med',
            'password' => 'password',
        ]);

        $response->assertStatus(302);
        $response->assertRedirect('/dashboard');
        $this->assertAuthenticatedAs($user);

        // Also test API login returns 200 with Sanctum token
        $apiResponse = $this->postJson('/api/login', [
            'email' => 'admin@jajal.med',
            'password' => 'password',
        ]);

        $apiResponse->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'access_token',
                'token_type',
                'user' => ['id', 'name', 'email', 'role'],
            ]);
    }

    /**
     * Test 2: Invalid login returns validation error and user remains guest.
     */
    public function test_user_cannot_login_with_invalid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@jajal.med',
            'password' => Hash::make('password'),
        ]);

        $response = $this->post('/login', [
            'email' => 'admin@jajal.med',
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();

        // Also verify API returns 422
        $apiResponse = $this->postJson('/api/login', [
            'email' => 'admin@jajal.med',
            'password' => 'wrong-password',
        ]);

        $apiResponse->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    /**
     * Test 3: Guests cannot access protected web pages or APIs.
     */
    public function test_guests_cannot_access_protected_pages_or_apis(): void
    {
        // Protected Web routes redirect to login
        $dashboardResponse = $this->get('/dashboard');
        $dashboardResponse->assertStatus(302);
        $dashboardResponse->assertRedirect('/login');

        $casesResponse = $this->get('/cases');
        $casesResponse->assertStatus(302);
        $casesResponse->assertRedirect('/login');

        // Protected API endpoints return 401 Unauthorized
        $apiResponse = $this->getJson('/api/cases');
        $apiResponse->assertStatus(401);

        $apiCreateResponse = $this->postJson('/api/cases', [
            'case_number' => 'CAS-TEST',
        ]);
        $apiCreateResponse->assertStatus(401);
    }
}
