import React from 'react';
import { FileText, CheckCircle2, Shield, Terminal, ArrowUpRight } from 'lucide-react';
import { EnvironmentReleaseInfo } from '../../types/health';

interface ReleaseSummaryProps {
  releases: EnvironmentReleaseInfo[];
}

export const ReleaseSummary: React.FC<ReleaseSummaryProps> = ({ releases }) => {
  const prodRelease = releases.find((r) => r.environment === 'Prod') || releases[0];

  const releaseHighlights = [
    'Integrated Azure OpenAI GPT-4o weather hazard risk model for aviation and cloud datacenter cooling.',
    'Enhanced multi-region Cosmos DB partition key scheme (/cityCode) reducing P99 latency by 24ms.',
    'Implemented automated smoke testing gate across Dev, QA, and Production environments with failure-trend analytics.',
    'Upgraded Bicep infrastructure definitions for zero-downtime Blue/Green slot swapping.',
    'Added real-time air quality index (AQI) telemetry stream ingestion via satellite ground stations.',
  ];

  return (
    <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">
              Executive Release Summary & Artifact Digest
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Current Production Target: {prodRelease?.version} · Build Artifacts Verified
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
          <Shield className="w-3.5 h-3.5" />
          <span>Security & SBOM Scanned</span>
        </div>
      </div>

      {/* Highlights list */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block font-mono">
          Deployment Invariants & Key Enhancements
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {releaseHighlights.map((hl, i) => (
            <div
              key={i}
              className="flex items-start space-x-2 text-xs text-slate-300 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{hl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Smoke test command simulation */}
      <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
        <div className="flex items-center justify-between text-slate-500 text-[11px]">
          <span>Automated Verification Command</span>
          <span>bash</span>
        </div>
        <div className="text-cyan-300 select-all">
          ./tests/smoke/api-contract-tests.sh --env=prod --quality-threshold=95
        </div>
      </div>
    </div>
  );
};
