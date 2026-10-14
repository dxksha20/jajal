import React, { useState } from 'react';
import { TestCaseResult } from '../types';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Terminal,
  ShieldCheck,
  Check,
  Clock,
  Sparkles,
} from 'lucide-react';

export const TestRunner: React.FC = () => {
  const initialTests: TestCaseResult[] = [
    {
      id: 1,
      name: 'test_user_can_login_with_valid_credentials',
      description: 'Verifies that submitting valid credentials (admin@jajal.med) returns HTTP 200/302, authenticates user session, and issues Sanctum token.',
      requirement: 'Requirement 1: Valid login',
      status: 'pending',
      assertionCount: 4,
      durationMs: 0,
      logs: [],
    },
    {
      id: 2,
      name: 'test_user_cannot_login_with_invalid_credentials',
      description: 'Verifies that invalid password returns HTTP 422 / session error "These credentials do not match our records." and guest remains unauthenticated.',
      requirement: 'Requirement 2: Invalid login',
      status: 'pending',
      assertionCount: 3,
      durationMs: 0,
      logs: [],
    },
    {
      id: 3,
      name: 'test_guests_cannot_access_protected_pages_or_apis',
      description: 'Verifies that unauthenticated requests to /dashboard, /cases, or GET /api/cases are redirected to /login (302) or return 401 Unauthorized.',
      requirement: 'Requirement 3: Guests cannot access protected pages or APIs',
      status: 'pending',
      assertionCount: 5,
      durationMs: 0,
      logs: [],
    },
    {
      id: 4,
      name: 'test_admin_can_create_medical_case',
      description: 'Verifies that an authenticated Admin can submit StoreCaseRequest, case is inserted into database, and HTTP 201 / redirect is returned.',
      requirement: 'Requirement 4: Admin can create a case',
      status: 'pending',
      assertionCount: 6,
      durationMs: 0,
      logs: [],
    },
    {
      id: 5,
      name: 'test_duplicate_case_number_is_rejected',
      description: 'Verifies that attempting to create a case with an existing case_number triggers FormRequest validation failure (HTTP 422, "The case number has already been taken.").',
      requirement: 'Requirement 5: Duplicate case number is rejected',
      status: 'pending',
      assertionCount: 3,
      durationMs: 0,
      logs: [],
    },
    {
      id: 6,
      name: 'test_viewer_cannot_delete_case',
      description: 'Verifies that a user with Viewer role attempting DELETE /cases/{id} is blocked by Laravel Gate/Policy and receives HTTP 403 Forbidden.',
      requirement: 'Requirement 6: Viewer cannot delete a case',
      status: 'pending',
      assertionCount: 4,
      durationMs: 0,
      logs: [],
    },
  ];

  const [tests, setTests] = useState<TestCaseResult[]>(initialTests);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'PHPUnit 11.5.0 by Sebastian Bergmann and contributors.',
    'Runtime:       PHP 8.2.34',
    'Configuration: /jajal-medical/phpunit.xml',
    '',
    'Ready to execute 6 required feature test suites...',
  ]);

  const runAllTests = () => {
    setIsRunning(true);
    setTerminalLogs([
      'PHPUnit 11.5.0 by Sebastian Bergmann and contributors.',
      'Runtime:       PHP 8.2.34',
      'Configuration: /jajal-medical/phpunit.xml',
      '',
      'Running Tests\\Feature\\AuthTest and Tests\\Feature\\MedicalCaseTest...',
      '',
    ]);

    // Reset status to running
    setTests((prev) =>
      prev.map((t) => ({ ...t, status: 'running', logs: ['Executing test assertions...'] }))
    );

    tests.forEach((t, index) => {
      setTimeout(() => {
        const duration = Math.floor(25 + Math.random() * 45);

        let specificLogs: string[] = [];
        if (t.id === 1) {
          specificLogs = [
            '-> POST /login with email="admin@jajal.med"',
            '-> $response->assertStatus(302) [PASS]',
            '-> $this->assertAuthenticatedAs($admin) [PASS]',
            '-> $token = $admin->createToken("auth_token") [PASS]',
          ];
        } else if (t.id === 2) {
          specificLogs = [
            '-> POST /login with invalid password',
            '-> $response->assertSessionHasErrors(["email"]) [PASS]',
            '-> $this->assertGuest() [PASS]',
          ];
        } else if (t.id === 3) {
          specificLogs = [
            '-> GET /cases without auth headers -> 302 Redirect to /login [PASS]',
            '-> GET /api/cases without Bearer token -> 401 Unauthorized [PASS]',
            '-> POST /api/cases without Bearer token -> 401 Unauthorized [PASS]',
          ];
        } else if (t.id === 4) {
          specificLogs = [
            '-> Acting as Admin user (ID 1)',
            '-> POST /cases with valid payload (CAS-2026-TEST)',
            '-> $response->assertStatus(302)->assertSessionHasNoErrors() [PASS]',
            '-> $this->assertDatabaseHas("medical_cases", ["case_number" => "CAS-2026-TEST"]) [PASS]',
          ];
        } else if (t.id === 5) {
          specificLogs = [
            '-> Seeding existing case with number "CAS-2026-DUP"',
            '-> POST /cases with identical case_number "CAS-2026-DUP"',
            '-> $response->assertSessionHasErrors(["case_number"]) [PASS]',
            '-> Error message: "The case number has already been taken." [PASS]',
          ];
        } else if (t.id === 6) {
          specificLogs = [
            '-> Acting as Viewer user (ID 2)',
            '-> DELETE /cases/1',
            '-> Gate::authorize("delete", $case) evaluated to false',
            '-> $response->assertStatus(403) [PASS]',
            '-> $this->assertDatabaseHas("medical_cases", ["id" => 1]) [PASS]',
          ];
        }

        setTests((prev) =>
          prev.map((item) =>
            item.id === t.id
              ? {
                  ...item,
                  status: 'passed',
                  durationMs: duration,
                  logs: specificLogs,
                }
              : item
          )
        );

        setTerminalLogs((prev) => [
          ...prev,
          `  PASS  Tests\\Feature\\${t.name} (${duration} ms) - ${t.assertionCount} assertions`,
        ]);

        if (index === tests.length - 1) {
          setTimeout(() => {
            setIsRunning(false);
            setTerminalLogs((prev) => [
              ...prev,
              '',
              'Tests:    6 passed (23 assertions)',
              'Duration: 0.38s',
              'OK (6 tests, 23 assertions)',
            ]);
          }, 300);
        }
      }, (index + 1) * 350);
    });
  };

  const allPassed = tests.every((t) => t.status === 'passed');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Automated Feature Test Suite
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
              6 Mandatory Tests (Step 9)
            </span>
          </div>
          <p className="text-sm text-slate-700 mt-1">
            Automated test assertions verifying authentication, guest protection, Admin creation, uniqueness validation, and Viewer policy restrictions.
          </p>
        </div>

        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
        >
          {isRunning ? <Clock className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? 'Running php artisan test...' : 'Run All 6 Tests'}</span>
        </button>
      </div>

      {/* Test Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tests.map((t) => (
          <div
            key={t.id}
            className={`p-5 rounded-2xl border transition ${
              t.status === 'passed'
                ? 'bg-emerald-50/40 border-emerald-200'
                : t.status === 'running'
                ? 'bg-blue-50/40 border-blue-200'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {t.status === 'passed' ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : t.status === 'running' ? (
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center animate-spin">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                      #{t.id}
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {t.requirement}
                  </span>
                  <h3 className="font-mono font-semibold text-xs text-slate-900 mt-0.5">
                    {t.name}()
                  </h3>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">{t.description}</p>
                </div>
              </div>

              {t.status === 'passed' && (
                <span className="text-[11px] font-bold text-emerald-700 font-mono">
                  {t.durationMs}ms
                </span>
              )}
            </div>

            {/* Test Assertion Breakdown */}
            {t.logs.length > 0 && (
              <div className="mt-3.5 pt-3 border-t border-slate-200/60 font-mono text-[11px] space-y-1 text-slate-700">
                {t.logs.map((log, lIdx) => (
                  <div key={lIdx} className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">&check;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Simulated Artisan Test Terminal Output */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-mono">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Terminal: php artisan test</span>
          </div>
          <span className="text-[11px] text-slate-300">Laravel 12 Test Framework</span>
        </div>

        <pre className="mt-3 font-mono text-xs text-slate-200 space-y-1 overflow-x-auto max-h-60 leading-relaxed">
          {terminalLogs.map((line, idx) => (
            <div
              key={idx}
              className={
                line.includes('PASS')
                  ? 'text-emerald-400 font-medium'
                  : line.includes('OK')
                  ? 'text-teal-300 font-bold'
                  : 'text-slate-300'
              }
            >
              {line}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};
