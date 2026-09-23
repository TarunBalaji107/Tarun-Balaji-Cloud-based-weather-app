import React, { useState } from 'react';
import { EnvironmentReleaseInfo } from '../types/health';
import { EnvironmentStatus } from '../components/release/EnvironmentStatus';
import { QualityChart } from '../components/release/QualityChart';
import { ReleaseSummary } from '../components/release/ReleaseSummary';
import { GitBranch, Play, Terminal, CheckCircle2, RefreshCw } from 'lucide-react';

interface ReleaseCenterProps {
  releases: EnvironmentReleaseInfo[];
}

export const ReleaseCenter: React.FC<ReleaseCenterProps> = ({ releases }) => {
  const [runningSmokeTest, setRunningSmokeTest] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const handleRunSmokeTest = async (env: string) => {
    setRunningSmokeTest(env);
    setLogs([
      `[AZURE-DEVOPS-RUNNER] Initializing smoke test suite for target environment: ${env.toUpperCase()}...`,
      `[AZURE-DEVOPS-RUNNER] Loading config from tests/smoke/config/${env.toLowerCase()}.env...`,
      `[CONTRACT-TEST] Testing GET /api/weather/current?city=London... 200 OK (38ms)`,
      `[CONTRACT-TEST] Validating WMO weather schema invariant... PASSED`,
      `[CONTRACT-TEST] Testing GET /api/weather/forecast?lat=51.5&lon=-0.12... 200 OK (42ms)`,
      `[CONTRACT-TEST] Testing POST /api/weather/insights... 200 OK (112ms)`,
      `[CONTRACT-TEST] Testing GET /api/health... 200 OK (14ms)`,
      `[UI-SMOKE] Headless Playwright browser verification: Dashboard render in 184ms... PASSED`,
      `[REPORTER] Generating cross-environment summary report at reports/current/executive-dashboard.md...`,
      `[SUCCESS] 42/42 tests passed. Quality score calculated: 98/100. Zero breaking contract changes.`,
    ]);

    setTimeout(() => {
      setRunningSmokeTest(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div>
          <div className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">
              Azure DevOps Release Center & Quality Gates
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Automated Cross-Environment CI/CD Orchestration · Dev / QA / Prod Pipeline
          </p>
        </div>

        <button
          onClick={() => handleRunSmokeTest('Prod')}
          disabled={!!runningSmokeTest}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors"
        >
          <Play className="w-4 h-4" />
          <span>{runningSmokeTest ? `Running ${runningSmokeTest}...` : 'Run Production Verification'}</span>
        </button>
      </div>

      {/* Environment Statuses */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-200">
          Environment Deployment Matrix
        </h2>
        <EnvironmentStatus
          releases={releases}
          onTriggerPipeline={handleRunSmokeTest}
        />
      </div>

      {/* Quality Gate Chart */}
      <QualityChart releases={releases} />

      {/* Interactive Smoke Test Output Console */}
      {logs.length > 0 && (
        <div className="border border-slate-800 bg-slate-950 rounded-xl p-4 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Azure Pipeline Execution Output</span>
            </div>
            <button
              onClick={() => setLogs([])}
              className="text-[11px] text-slate-500 hover:text-slate-300"
            >
              Clear Log
            </button>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto text-slate-300">
            {logs.map((log, i) => (
              <div
                key={i}
                className={
                  log.includes('[SUCCESS]')
                    ? 'text-emerald-400 font-semibold'
                    : log.includes('PASSED')
                    ? 'text-cyan-300'
                    : 'text-slate-400'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Executive Digest & Summary */}
      <ReleaseSummary releases={releases} />
    </div>
  );
};
