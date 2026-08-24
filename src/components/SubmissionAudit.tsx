import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import { SubmissionAudit } from '../types';
import {
  FileCheck2,
  Sparkles,
  Search,
  Filter,
  Play,
  Github,
  Video,
  Globe,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Send,
  Flag,
  Loader2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export const SubmissionAuditView: React.FC = () => {
  const {
    submissionAudits,
    auditSingleTeam,
    runFleetAIAudit,
    isAuditingFleet,
    flagSubmissionTeam,
    triggerReminderNow,
    showToast,
  } = useHackathon();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('All');
  const [selectedEligibility, setSelectedEligibility] = useState<string>('All');
  const [auditingTeamId, setAuditingTeamId] = useState<string | null>(null);

  const tracks = [
    'All',
    'AI & Autonomous Agents',
    'FinTech & Web3',
    'HealthTech & BioAI',
    'ClimateTech',
    'Open Innovation',
  ];

  const filteredAudits = submissionAudits.filter((audit) => {
    const matchesSearch =
      audit.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (audit.flags || []).some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTrack = selectedTrack === 'All' || audit.track === selectedTrack;
    const matchesElig = selectedEligibility === 'All' || audit.eligibility === selectedEligibility;
    return matchesSearch && matchesTrack && matchesElig;
  });

  const handleRunSingleAudit = async (audit: SubmissionAudit) => {
    setAuditingTeamId(audit.id);
    await auditSingleTeam(audit.id);
    setAuditingTeamId(null);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Team,Track,Status,Score,Eligibility,GitHub,Demo,Video,Flags']
        .concat(
          submissionAudits.map(
            (s) =>
              `"${s.teamName}","${s.track}","${s.status}",${s.complianceScore},"${s.eligibility}","${s.githubUrl || ''}","${s.demoUrl || ''}","${s.videoUrl || ''}","${(s.flags || []).join('; ')}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HackVerse_AI_Submission_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      title: 'Audit Report Exported',
      description: 'Downloaded compliance matrix CSV for judges.',
      type: 'success',
    });
  };

  const eligibleCount = submissionAudits.filter((s) => s.eligibility === 'Eligible').length;
  const actionRequiredCount = submissionAudits.filter(
    (s) => s.eligibility === 'Action Required' || s.eligibility === 'Ineligible'
  ).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Submission Audit</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
              COMPLIANCE AUDITOR
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated repository commit analysis, demo link health checks, and video pitch verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            id="run-fleet-audit-btn"
            onClick={() => runFleetAIAudit()}
            disabled={isAuditingFleet}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isAuditingFleet ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isAuditingFleet ? 'Auditing All 68 Teams...' : 'Run Fleet AI Audit'}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Eligible Submissions</div>
            <div className="text-2xl font-bold font-mono text-emerald-400">{eligibleCount}/68</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Action Required / Flagged</div>
            <div className="text-2xl font-bold font-mono text-amber-400">{actionRequiredCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Avg Compliance Index</div>
            <div className="text-2xl font-bold font-mono text-blue-400">84.2/100</div>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teams or issues..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            {tracks.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={selectedEligibility}
            onChange={(e) => setSelectedEligibility(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Eligibility</option>
            <option value="Eligible">Eligible Only</option>
            <option value="Action Required">Action Required</option>
            <option value="Ineligible">Ineligible</option>
          </select>
        </div>
      </div>

      {/* Table of Submissions */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Team & Track</th>
                <th className="px-4 py-3.5">Artifacts Status</th>
                <th className="px-4 py-3.5">Score</th>
                <th className="px-4 py-3.5">AI Compliance Audit</th>
                <th className="px-4 py-3.5">Flags & Notes</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAudits.map((item) => {
                const eligibilityStyles = {
                  Eligible: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                  'Action Required': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                  Ineligible: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
                  Pending: 'bg-slate-800 text-slate-400 border-slate-700',
                };

                const isAuditing = auditingTeamId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-slate-850/50 transition-colors">
                    {/* Team & Track */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-white text-sm">{item.teamName}</div>
                      <div className="text-[11px] text-slate-400">{item.track}</div>
                    </td>

                    {/* Artifacts */}
                    <td className="px-4 py-4 space-y-1">
                      <div className="flex items-center gap-2">
                        {item.githubUrl ? (
                          <a
                            href={item.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:underline"
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span>Repo</span>
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-rose-400">
                            <Github className="w-3.5 h-3.5" />
                            <span>Missing</span>
                          </span>
                        )}

                        <span>•</span>

                        {item.demoUrl ? (
                          <a
                            href={item.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Demo</span>
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                            <Globe className="w-3.5 h-3.5" />
                            <span>No URL</span>
                          </span>
                        )}

                        <span>•</span>

                        {item.videoUrl ? (
                          <a
                            href={item.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-purple-400 hover:underline"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Video</span>
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                            <Video className="w-3.5 h-3.5" />
                            <span>No Video</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Score */}
                    <td className="px-4 py-4">
                      <div
                        className={`text-sm font-bold font-mono ${
                          item.complianceScore >= 80
                            ? 'text-emerald-400'
                            : item.complianceScore >= 60
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {item.complianceScore}/100
                      </div>
                    </td>

                    {/* Eligibility Badge */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          eligibilityStyles[item.eligibility]
                        }`}
                      >
                        {item.eligibility === 'Eligible' && <CheckCircle2 className="w-3 h-3" />}
                        {item.eligibility === 'Action Required' && (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {item.eligibility === 'Ineligible' && <XCircle className="w-3 h-3" />}
                        <span>{item.eligibility}</span>
                      </span>
                    </td>

                    {/* Flags & AI Remarks */}
                    <td className="px-4 py-4 max-w-xs">
                      {(item.flags || []).length > 0 ? (
                        <div className="space-y-0.5">
                          {(item.flags || []).map((flag, idx) => (
                            <div
                              key={idx}
                              className="text-[11px] text-amber-300/90 leading-tight flex items-start gap-1"
                            >
                              <span className="text-amber-400">•</span>
                              <span>{flag}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">All criteria passed</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleRunSingleAudit(item)}
                        disabled={isAuditing}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-colors disabled:opacity-50"
                        title="Run single team audit"
                      >
                        {isAuditing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          'Audit Team'
                        )}
                      </button>

                      <button
                        onClick={() => flagSubmissionTeam(item.id)}
                        className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/25 transition-colors"
                        title="Flag for manual inspection"
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          triggerReminderNow('rem-2');
                          showToast({
                            title: 'Targeted Reminder Sent',
                            description: `Sent repository fix request to ${item.teamName}.`,
                            type: 'info',
                          });
                        }}
                        className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/25 transition-colors"
                        title="Send targeted fix reminder"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
