import React, { useState } from 'react';
import { MedicalCase, User, ApiLog } from '../types';
import {
  Terminal,
  Send,
  Key,
  Lock,
  Unlock,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Code,
  Shield,
  Layers,
} from 'lucide-react';

interface ApiExplorerProps {
  cases: MedicalCase[];
  currentUser: User | null;
  onRefreshData?: () => void;
}

export const ApiExplorer: React.FC<ApiExplorerProps> = ({ cases, currentUser }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET /api/cases');
  const [apiToken, setApiToken] = useState<string>(
    currentUser?.role === 'admin'
      ? '1|sanctum_token_admin_98af73d91c4'
      : '2|sanctum_token_viewer_22ec51b80d1'
  );
  const [tokenUserRole, setTokenUserRole] = useState<'admin' | 'viewer' | 'none'>(
    currentUser?.role || 'admin'
  );

  const [requestBodyInput, setRequestBodyInput] = useState<string>(
    JSON.stringify(
      {
        case_number: 'CAS-2026-099',
        patient_ref_code: 'PAT-4100',
        surgeon_name: 'Dr. Michael Chang',
        implant_type: 'Titanium Trabecular Hip Stem',
        status: 'Planning',
        priority: 'High',
        surgery_date: '2026-06-15',
      },
      null,
      2
    )
  );

  const [paramId, setParamId] = useState<string>('1');
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [statusText, setStatusText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Quick switch of Sanctum Token role
  const handleSetRole = (role: 'admin' | 'viewer' | 'none') => {
    setTokenUserRole(role);
    if (role === 'admin') {
      setApiToken('1|sanctum_token_admin_98af73d91c4');
    } else if (role === 'viewer') {
      setApiToken('2|sanctum_token_viewer_22ec51b80d1');
    } else {
      setApiToken('');
    }
  };

  const handleEndpointSelect = (ep: string) => {
    setSelectedEndpoint(ep);
    if (ep === 'POST /api/login') {
      setRequestBodyInput(
        JSON.stringify(
          {
            email: 'admin@jajal.med',
            password: 'password',
          },
          null,
          2
        )
      );
    } else if (ep === 'POST /api/cases') {
      setRequestBodyInput(
        JSON.stringify(
          {
            case_number: `CAS-2026-0${cases.length + 1}`,
            patient_ref_code: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
            surgeon_name: 'Dr. Elena Rostova',
            implant_type: 'Custom Bicondylar Titanium Implant',
            status: 'Planning',
            priority: 'High',
            surgery_date: '2026-06-20',
          },
          null,
          2
        )
      );
    } else if (ep === 'PUT /api/cases/{id}') {
      setRequestBodyInput(
        JSON.stringify(
          {
            surgeon_name: 'Dr. Michael Chang (Updated)',
            implant_type: 'Dual Mobility Acetabular Shell',
            status: 'Approved',
            priority: 'Medium',
            surgery_date: '2026-07-01',
          },
          null,
          2
        )
      );
    } else {
      setRequestBodyInput('');
    }
  };

  const executeApiCall = () => {
    setLoading(true);
    setStatusCode(null);
    setLastResponse(null);

    setTimeout(() => {
      setLoading(false);

      // Check if unauthenticated (missing token) for protected routes
      if (selectedEndpoint !== 'POST /api/login' && (!apiToken || tokenUserRole === 'none')) {
        setStatusCode(401);
        setStatusText('Unauthorized');
        setLastResponse({
          message: 'Unauthenticated.',
          error: 'Missing or invalid Laravel Sanctum Bearer token.',
        });
        return;
      }

      // POST /api/login
      if (selectedEndpoint === 'POST /api/login') {
        try {
          const body = JSON.parse(requestBodyInput || '{}');
          if (
            (body.email === 'admin@jajal.med' || body.email === 'viewer@jajal.med') &&
            body.password === 'password'
          ) {
            const role = body.email.includes('admin') ? 'admin' : 'viewer';
            const generatedToken = `${role === 'admin' ? '1' : '2'}|sanctum_${role}_${Math.random().toString(36).substring(2, 10)}`;
            setStatusCode(200);
            setStatusText('OK');
            setApiToken(generatedToken);
            setTokenUserRole(role);
            setLastResponse({
              status: 'success',
              message: 'Authentication successful',
              token_type: 'Bearer',
              access_token: generatedToken,
              user: {
                id: role === 'admin' ? 1 : 2,
                name: role === 'admin' ? 'Dr. Eleanor Vance' : 'Mark Reynolds',
                email: body.email,
                role: role,
              },
            });
          } else {
            setStatusCode(422);
            setStatusText('Unprocessable Content');
            setLastResponse({
              message: 'The given data was invalid.',
              errors: {
                email: ['The provided credentials do not match our records.'],
              },
            });
          }
        } catch (e: any) {
          setStatusCode(400);
          setStatusText('Bad Request');
          setLastResponse({ error: 'Malformed JSON payload in request body' });
        }
        return;
      }

      // POST /api/logout
      if (selectedEndpoint === 'POST /api/logout') {
        setStatusCode(200);
        setStatusText('OK');
        setLastResponse({
          status: 'success',
          message: 'Tokens successfully revoked. User logged out.',
        });
        setApiToken('');
        setTokenUserRole('none');
        return;
      }

      // GET /api/cases
      if (selectedEndpoint === 'GET /api/cases') {
        setStatusCode(200);
        setStatusText('OK');
        setLastResponse({
          status: 'success',
          meta: {
            current_page: 1,
            per_page: 10,
            total: cases.length,
            last_page: Math.ceil(cases.length / 10),
          },
          data: cases.slice(0, 10),
        });
        return;
      }

      // GET /api/cases/{id}
      if (selectedEndpoint === 'GET /api/cases/{id}') {
        const idNum = parseInt(paramId, 10);
        const found = cases.find((c) => c.id === idNum);
        if (found) {
          setStatusCode(200);
          setStatusText('OK');
          setLastResponse({
            status: 'success',
            data: found,
          });
        } else {
          setStatusCode(404);
          setStatusText('Not Found');
          setLastResponse({
            message: `Medical case with ID #${paramId} not found.`,
            error: 'ModelNotFoundException',
          });
        }
        return;
      }

      // POST /api/cases (Admin only)
      if (selectedEndpoint === 'POST /api/cases') {
        if (tokenUserRole !== 'admin') {
          setStatusCode(403);
          setStatusText('Forbidden');
          setLastResponse({
            message: 'This action is unauthorized.',
            error: 'Laravel Policy Gate: Viewer cannot create medical cases.',
          });
          return;
        }

        try {
          const body = JSON.parse(requestBodyInput || '{}');
          // Validate required fields
          const duplicate = cases.some(
            (c) => c.case_number.toUpperCase() === (body.case_number || '').toUpperCase()
          );

          if (duplicate) {
            setStatusCode(422);
            setStatusText('Unprocessable Content');
            setLastResponse({
              message: 'The given data was invalid.',
              errors: {
                case_number: ['The case number has already been taken.'],
              },
            });
            return;
          }

          if (!body.case_number || !body.surgeon_name || !body.implant_type) {
            setStatusCode(422);
            setStatusText('Unprocessable Content');
            setLastResponse({
              message: 'The given data was invalid.',
              errors: {
                ...(!body.case_number ? { case_number: ['The case number field is required.'] } : {}),
                ...(!body.surgeon_name ? { surgeon_name: ['The surgeon name field is required.'] } : {}),
                ...(!body.implant_type ? { implant_type: ['The implant type field is required.'] } : {}),
              },
            });
            return;
          }

          setStatusCode(201);
          setStatusText('Created');
          setLastResponse({
            status: 'success',
            message: 'Medical case created successfully.',
            data: {
              id: cases.length + 1,
              ...body,
              created_by: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          });
        } catch {
          setStatusCode(400);
          setStatusText('Bad Request');
          setLastResponse({ error: 'Malformed JSON payload' });
        }
        return;
      }

      // PUT /api/cases/{id} (Admin only)
      if (selectedEndpoint === 'PUT /api/cases/{id}') {
        if (tokenUserRole !== 'admin') {
          setStatusCode(403);
          setStatusText('Forbidden');
          setLastResponse({
            message: 'This action is unauthorized.',
            error: 'Laravel Policy Gate: Viewer cannot edit medical cases.',
          });
          return;
        }

        const idNum = parseInt(paramId, 10);
        const existing = cases.find((c) => c.id === idNum);
        if (!existing) {
          setStatusCode(404);
          setStatusText('Not Found');
          setLastResponse({
            message: `Medical case with ID #${paramId} not found.`,
          });
          return;
        }

        try {
          const body = JSON.parse(requestBodyInput || '{}');
          setStatusCode(200);
          setStatusText('OK');
          setLastResponse({
            status: 'success',
            message: 'Medical case updated successfully.',
            data: {
              ...existing,
              ...body,
              updated_at: new Date().toISOString(),
            },
          });
        } catch {
          setStatusCode(400);
          setStatusText('Bad Request');
          setLastResponse({ error: 'Malformed JSON payload' });
        }
        return;
      }

      // DELETE /api/cases/{id} (Admin only)
      if (selectedEndpoint === 'DELETE /api/cases/{id}') {
        if (tokenUserRole !== 'admin') {
          setStatusCode(403);
          setStatusText('Forbidden');
          setLastResponse({
            message: 'This action is unauthorized.',
            error: 'Laravel Policy Gate: Viewer role cannot delete medical cases.',
          });
          return;
        }

        const idNum = parseInt(paramId, 10);
        const existing = cases.find((c) => c.id === idNum);
        if (!existing) {
          setStatusCode(404);
          setStatusText('Not Found');
          setLastResponse({
            message: `Medical case with ID #${paramId} not found.`,
          });
          return;
        }

        setStatusCode(200);
        setStatusText('OK');
        setLastResponse({
          status: 'success',
          message: `Medical case #${existing.case_number} successfully deleted.`,
        });
        return;
      }
    }, 350);
  };

  const copyResponse = () => {
    if (lastResponse) {
      navigator.clipboard.writeText(JSON.stringify(lastResponse, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const endpointsList = [
    { ep: 'POST /api/login', auth: 'None', desc: 'Authenticate user & issue Sanctum Bearer token' },
    { ep: 'POST /api/logout', auth: 'Bearer', desc: 'Revoke token' },
    { ep: 'GET /api/cases', auth: 'Bearer', desc: 'List paginated cases (Admin & Viewer)' },
    { ep: 'POST /api/cases', auth: 'Bearer (Admin)', desc: 'Create medical case (FormRequest validation)' },
    { ep: 'GET /api/cases/{id}', auth: 'Bearer', desc: 'Get single case details' },
    { ep: 'PUT /api/cases/{id}', auth: 'Bearer (Admin)', desc: 'Update medical case' },
    { ep: 'DELETE /api/cases/{id}', auth: 'Bearer (Admin)', desc: 'Delete medical case' },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Laravel Sanctum API Explorer
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium bg-purple-100 text-purple-800 border border-purple-200">
                RESTful Endpoints (Step 8)
              </span>
            </div>
            <p className="text-sm text-slate-700 mt-1">
              Test all mandatory API routes with simulated Laravel Sanctum token authorization, FormRequest validation, and JSON responses.
            </p>
          </div>

          {/* Token Role Switcher */}
          <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-700 px-2">Sanctum Token:</span>
            <button
              onClick={() => handleSetRole('admin')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                tokenUserRole === 'admin'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Admin Token
            </button>
            <button
              onClick={() => handleSetRole('viewer')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                tokenUserRole === 'viewer'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Viewer Token
            </button>
            <button
              onClick={() => handleSetRole('none')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                tokenUserRole === 'none'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              No Token (Guest)
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Endpoints Directory */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Mandatory Endpoints (Step 8)
          </h2>

          <div className="space-y-2">
            {endpointsList.map((item) => {
              const isSelected = selectedEndpoint === item.ep;
              const isPost = item.ep.startsWith('POST');
              const isGet = item.ep.startsWith('GET');
              const isPut = item.ep.startsWith('PUT');
              const isDelete = item.ep.startsWith('DELETE');

              return (
                <div
                  key={item.ep}
                  onClick={() => handleEndpointSelect(item.ep)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-500/20 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      <span
                        className={`font-semibold mr-1.5 ${
                          isGet
                            ? 'text-blue-600'
                            : isPost
                            ? 'text-emerald-600'
                            : isPut
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {item.ep.split(' ')[0]}
                      </span>
                      {item.ep.split(' ')[1]}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {item.auth}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Active Token Preview */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-600" />
                Active Bearer Token:
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  tokenUserRole === 'admin'
                    ? 'bg-blue-100 text-blue-800'
                    : tokenUserRole === 'viewer'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {tokenUserRole.toUpperCase()}
              </span>
            </div>
            <p className="font-mono text-[11px] text-slate-600 truncate bg-white p-1.5 rounded border border-slate-200">
              {apiToken || '<No Authorization Token>'}
            </p>
          </div>
        </div>

        {/* Right Column: Request Builder & Live Response */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                  {selectedEndpoint.split(' ')[0]}
                </span>
                <span className="font-mono text-sm text-slate-800 font-semibold">
                  {selectedEndpoint.split(' ')[1]}
                </span>
              </div>

              <button
                onClick={executeApiCall}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending Request...' : 'Send API Request'}</span>
              </button>
            </div>

            {/* Path Param if ID is needed */}
            {selectedEndpoint.includes('{id}') && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Case ID Param ({`{id}`}):
                </label>
                <input
                  type="number"
                  value={paramId}
                  onChange={(e) => setParamId(e.target.value)}
                  className="w-24 px-3 py-1.5 text-sm font-mono border border-slate-300 rounded-lg bg-white"
                  min="1"
                />
                <span className="text-xs text-slate-600">
                  Target: <code className="text-purple-700">/api/cases/{paramId}</code>
                </span>
              </div>
            )}

            {/* Request Body JSON for POST / PUT */}
            {(selectedEndpoint.startsWith('POST') || selectedEndpoint.startsWith('PUT')) && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Request JSON Body
                  </label>
                  <span className="text-[11px] text-slate-600 font-mono">application/json</span>
                </div>
                <textarea
                  rows={6}
                  value={requestBodyInput}
                  onChange={(e) => setRequestBodyInput(e.target.value)}
                  className="w-full font-mono text-xs p-3 border border-slate-300 rounded-xl bg-slate-950 text-slate-100 focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

            {/* Headers Preview */}
            <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono">
              <div>Accept: application/json</div>
              <div>Content-Type: application/json</div>
              {apiToken && <div>Authorization: Bearer {apiToken}</div>}
            </div>
          </div>

          {/* Response Viewer */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  API Response
                </h3>
                {statusCode !== null && (
                  <span
                    className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-md ${
                      statusCode >= 200 && statusCode < 300
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : statusCode === 401 || statusCode === 403
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : statusCode === 404
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    HTTP {statusCode} {statusText}
                  </span>
                )}
              </div>

              {lastResponse && (
                <button
                  onClick={copyResponse}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              )}
            </div>

            <div className="relative">
              <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-96">
                {lastResponse
                  ? JSON.stringify(lastResponse, null, 2)
                  : '// Press "Send API Request" to test endpoint response...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
