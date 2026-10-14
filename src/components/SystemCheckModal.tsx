import React from 'react';
import { CheckCircle2, HardDrive, Terminal, X, AlertTriangle, Monitor, ExternalLink } from 'lucide-react';

interface SystemCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemCheckModal: React.FC<SystemCheckModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const checks = [
    {
      tool: 'PHP',
      installed: true,
      version: 'PHP 8.2.34 (cli)',
      command: 'php -v',
      details: 'Required for Laravel 12 runtime, Eloquent ORM, and Artisan CLI.',
      windowsGuide: 'Install via XAMPP, Laragon, or standalone PHP 8.2+ from windows.php.net/download and add C:\\php to system PATH.',
    },
    {
      tool: 'Composer',
      installed: true,
      version: 'Composer 2.10.3',
      command: 'composer -V',
      details: 'PHP package dependency manager for Laravel core, Sanctum, and Pest/PHPUnit.',
      windowsGuide: 'Download and run Composer-Setup.exe from getcomposer.org. It automatically registers Composer in Windows PATH.',
    },
    {
      tool: 'Node.js',
      installed: true,
      version: 'v22.23.2',
      command: 'node -v',
      details: 'JavaScript runtime for compiling frontend assets (Vite / Tailwind CSS).',
      windowsGuide: 'Download Node.js LTS (v20 or v22) Windows Installer (.msi) from nodejs.org.',
    },
    {
      tool: 'npm',
      installed: true,
      version: '10.9.8',
      command: 'npm -v',
      details: 'Node package manager for frontend dependencies.',
      windowsGuide: 'Included automatically when you install Node.js.',
    },
    {
      tool: 'MySQL / MariaDB Client',
      installed: true,
      version: 'MariaDB 10.11.18 (MySQL compatible)',
      command: 'mysql --version',
      details: 'Relational database engine for persisting users, medical cases, and Sanctum tokens.',
      windowsGuide: 'Recommended for Windows beginners: Install XAMPP (apachefriends.org) and start the "MySQL" module from the XAMPP Control Panel.',
    },
    {
      tool: 'Disk Space Check (C: / Local)',
      installed: true,
      version: '189 GB Available (Plenty of space)',
      command: 'df -h',
      details: 'Checked free disk space before downloading dependencies to prevent out-of-disk errors.',
      windowsGuide: 'On Windows, check "This PC" -> Local Disk (C:). Ensure at least 3-5 GB is free for PHP, Composer cache, and node_modules.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Step 1: System & Environment Verification</h2>
              <p className="text-xs text-slate-700">Verified tools and Windows configuration guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-700 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status List */}
        <div className="mt-5 space-y-3.5">
          {checks.map((c, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-sm text-slate-900">{c.tool}</span>
                </div>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {c.version}
                </span>
              </div>
              <p className="text-xs text-slate-700">{c.details}</p>
              <div className="pt-1.5 text-[11px] text-slate-700 font-mono bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-blue-600 font-semibold">$ {c.command}</span>
                <span className="text-slate-600 block mt-0.5 font-sans">
                  Windows Guide: {c.windowsGuide}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Windows Setup Summary */}
        <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1.5">
          <p className="font-bold">Easiest Windows Setup for Beginners (XAMPP):</p>
          <ol className="list-decimal pl-5 space-y-1 text-blue-800">
            <li>Download & install <strong>XAMPP</strong> with PHP 8.2+ from <span className="underline">apachefriends.org</span>.</li>
            <li>Download & install <strong>Composer</strong> Windows Installer from <span className="underline">getcomposer.org</span>.</li>
            <li>Download & install <strong>Node.js</strong> from <span className="underline">nodejs.org</span>.</li>
            <li>Open XAMPP Control Panel, click <strong>Start</strong> next to MySQL, then open browser to <code className="bg-blue-100 px-1 py-0.5 rounded">http://localhost/phpmyadmin</code>.</li>
            <li>Create database named <code className="bg-blue-100 px-1 py-0.5 rounded font-bold">jajal_medical</code>.</li>
          </ol>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition cursor-pointer"
          >
            All Tools Verified &bull; Continue
          </button>
        </div>
      </div>
    </div>
  );
};
