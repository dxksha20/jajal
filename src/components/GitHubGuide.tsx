import React, { useState } from 'react';
import { GitBranch, Github, Terminal, Copy, Check, ExternalLink, HelpCircle, AlertTriangle } from 'lucide-react';

export const GitHubGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: 'Step 1: Create a New Repository on GitHub',
      explanation: 'Go to github.com, click the "+" icon in the top right, and choose "New repository".',
      details: [
        'Repository name: jajal-medical (or jajal-medical-cms)',
        'Public or Private: Select either (Public is best for internship submissions)',
        'Do NOT initialize with a README, .gitignore, or license (we already have pristine ones created)',
      ],
      code: null,
    },
    {
      title: 'Step 2: Initialize Git and Stage Project Files',
      explanation: 'Run these commands inside the jajal-medical folder in your terminal (PowerShell, Git Bash, or Linux terminal):',
      code: `cd jajal-medical
git init
git add .
git commit -m "feat: complete Jajal Medical Case Management System implementation (Laravel 12, Blade, MySQL, Sanctum)"`,
    },
    {
      title: 'Step 3: Link Remote and Push to GitHub',
      explanation: 'Replace <YOUR_GITHUB_USERNAME> with your actual GitHub username and push:',
      code: `git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/jajal-medical.git
git push -u origin main`,
    },
    {
      title: 'Step 4: Running on Your Local Computer (Windows / XAMPP / Native)',
      explanation: 'When someone clones your repository, this is how they run it:',
      code: `# 1. Install PHP dependencies
composer install

# 2. Setup environment
cp .env.example .env
php artisan key:generate

# 3. Create MySQL Database in phpMyAdmin or MySQL CLI:
# CREATE DATABASE jajal_medical;

# 4. Run migrations and seeders (generates 2 users & 20+ cases)
php artisan migrate --seed

# 5. Run automated tests
php artisan test

# 6. Start the local server
php artisan serve`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              GitHub Push & Deployment Guide
            </h1>
            <p className="text-sm text-slate-700 mt-0.5">
              Step-by-step beginner guide to pushing your assignment codebase to GitHub and running it locally.
            </p>
          </div>
        </div>
      </div>

      {/* Security Tip Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-bold">Credential Security Rule (Step 3 Requirement):</p>
          <p>
            Never commit your real <code className="font-mono bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-bold">.env</code> file or database passwords to GitHub.
            The project includes a clean <code className="font-mono bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-bold">.gitignore</code> that automatically excludes <code className="font-mono">.env</code>, while maintaining <code className="font-mono">.env.example</code> for evaluators.
          </p>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                {step.title}
              </h2>

              {step.code && (
                <button
                  onClick={() => copyToClipboard(step.code!, idx)}
                  className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedIndex === idx ? 'Copied Commands' : 'Copy'}</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">{step.explanation}</p>

            {step.details && (
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-5">
                {step.details.map((item, dIdx) => (
                  <li key={dIdx}>{item}</li>
                ))}
              </ul>
            )}

            {step.code && (
              <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed">
                {step.code}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
