import React from 'react';
import { GitCommit, Play, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { EnvironmentReleaseInfo } from '../../types/health';
import { StatusChip } from '../operations/StatusChip';

interface EnvironmentStatusProps {
  releases: EnvironmentReleaseInfo[];
  onTriggerPipeline?: (env: string) => void;
}

export const EnvironmentStatus: React.FC<EnvironmentStatusProps> = ({
  releases,
  onTriggerPipeline,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {releases.map((rel) => {
        const isProd = rel.environment === 'Prod';
        const isQA = rel.environment === 'QA';

        return (
          <div
            key={rel.environment}
            className={`border rounded-xl p-5 flex flex-col justify-between ${
              isProd
                ? 'border-emerald-500/40 bg-emerald-950/10'
                : isQA
                ? 'border-cyan-500/40 bg-cyan-950/10'
                : 'border-slate-800 bg-slate-900/50'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
                    Environment
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {rel.environment} Stage
                  </h3>
                </div>
                <StatusChip status={rel.status} />
              </div>

              {/* Version & Commit */}
              <div className="mt-4 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Release Version</span>
                  <span className="font-semibold text-white">{rel.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Git Commit</span>
                  <span className="flex items-center space-x-1 text-cyan-400">
                    <GitCommit className="w-3.5 h-3.5" />
                    <span>{rel.commitHash}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Deployed At</span>
                  <span className="text-slate-300">{rel.deployedAt}</span>
                </div>
              </div>

              {/* Quality & Smoke Test Gate */}
              <div className="mt-4 p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Smoke Test Suite</span>
                  <span className="text-emerald-400 font-bold tabular-nums">
                    {rel.passedTests}/{rel.totalTests} Passed ({rel.smokeTestPassRate}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      rel.smokeTestPassRate === 100
                        ? 'bg-emerald-400'
                        : rel.smokeTestPassRate > 95
                        ? 'bg-cyan-400'
                        : 'bg-amber-400'
                    }`}
                    style={{ width: `${rel.smokeTestPassRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <span>Quality Index: <strong className="text-white">{rel.qualityScore}/100</strong></span>
                  <span>Avg Latency: <strong className="text-white">{rel.latencyAvgMs} ms</strong></span>
                </div>
              </div>
            </div>

            {/* Run Actions */}
            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">{rel.pipelineRunId}</span>
              {onTriggerPipeline && (
                <button
                  onClick={() => onTriggerPipeline(rel.environment)}
                  className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  <Play className="w-3 h-3" />
                  <span>Run Smoke Tests</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
