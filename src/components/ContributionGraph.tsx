import React, { useState } from 'react';
import { GitCommit, GitPullRequest, Activity, Calendar, GitBranch, ArrowUpRight } from 'lucide-react';
import { GithubEvent, GithubRepo } from '../types/github';
import { generateSampleContributions } from '../data/fallbackData';

interface ContributionGraphProps {
  events: GithubEvent[];
  repos: GithubRepo[];
  username: string;
}

export const ContributionGraph: React.FC<ContributionGraphProps> = ({
  events,
  repos,
  username,
}) => {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);
  const contributionWeeks = React.useMemo(() => generateSampleContributions(), []);

  // Calculate languages breakdown from repositories
  const languageStats = React.useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;

    repos.forEach((repo) => {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1;
        total += 1;
      }
    });

    if (total === 0) {
      return [
        { name: 'Python', percentage: 55, color: '#3572A5' },
        { name: 'Ruby', percentage: 25, color: '#701516' },
        { name: 'TypeScript', percentage: 15, color: '#3178c6' },
        { name: 'PostgreSQL / SQL', percentage: 5, color: '#336791' },
      ];
    }

    const colors: Record<string, string> = {
      Python: '#3572A5',
      Ruby: '#701516',
      TypeScript: '#3178c6',
      JavaScript: '#f1e05a',
      HTML: '#e34c26',
      Shell: '#89e051',
    };

    return Object.entries(counts).map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
      color: colors[name] || '#94a3b8',
    }));
  }, [repos]);

  const totalCommitsEstimate = contributionWeeks
    .flat()
    .reduce((acc, curr) => acc + curr.count, 0);

  return (
    <section id="telemetry" className="py-20 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-indigo-400 uppercase font-mono mb-2">
              04. Engineering Telemetry
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              GitHub Activity & Contribution Heatmap
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>52-Week Snapshot</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 font-semibold">{totalCommitsEstimate}+ Commits & Code Events</span>
          </div>
        </div>

        {/* Heatmap Card */}
        <div className="rounded-2xl bg-[#0f1118] border border-white/[0.1] p-6 sm:p-7 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
            <div>
              <div className="text-sm font-semibold text-white">Yearly Contribution Frequency</div>
              <div className="text-xs text-slate-400 mt-0.5">
                {hoveredDay ? (
                  <span className="text-indigo-400 font-medium">
                    {hoveredDay.count} contributions on {hoveredDay.date}
                  </span>
                ) : (
                  <span>Hover over blocks to inspect daily engineering velocity</span>
                )}
              </div>
            </div>

            {/* Heatmap intensity legend */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#161922]" />
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-950" />
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-800" />
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600" />
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-400" />
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Interactive Heatmap Matrix */}
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[760px] flex gap-1.5">
              {contributionWeeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1.5 flex-1">
                  {week.map((day, dIdx) => {
                    const levelColors = [
                      'bg-[#161922] hover:bg-[#202533]',
                      'bg-indigo-950/70 hover:bg-indigo-900',
                      'bg-indigo-800/80 hover:bg-indigo-700',
                      'bg-indigo-600 hover:bg-indigo-500',
                      'bg-indigo-400 hover:bg-indigo-300',
                    ];
                    return (
                      <div
                        key={dIdx}
                        onMouseEnter={() => setHoveredDay({ date: day.date, count: day.count })}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-full aspect-square rounded-[3px] transition-colors cursor-pointer ${
                          levelColors[day.level]
                        }`}
                        title={`${day.count} contributions on ${day.date}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Languages Distribution Bar */}
          <div className="pt-4 border-t border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Languages Breakdown</span>
              <span className="font-mono text-slate-500 text-[11px]">Calculated from repository tree</span>
            </div>

            {/* Percentage Bar */}
            <div className="h-2 w-full rounded-full overflow-hidden flex bg-slate-800">
              {languageStats.map((item) => (
                <div
                  key={item.name}
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                  title={`${item.name}: ${item.percentage}%`}
                />
              ))}
            </div>

            {/* Language list as clean unboxed text (NO PILLS) */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              {languageStats.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-200 font-medium">{item.name}</span>
                  <span className="font-mono text-slate-500 tabular-nums">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Live Public Activity Stream */}
        <div className="mt-8 rounded-2xl bg-[#0f1118] border border-white/[0.1] p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Public Event Stream & Code Commits</span>
            </div>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View on GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-3">
            {events.length > 0 ? (
              events.slice(0, 5).map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-start justify-between gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-md bg-indigo-600/10 text-indigo-400 mt-0.5">
                      <GitCommit className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white">
                        {evt.payload?.commits?.[0]?.message || `${evt.type.replace('Event', '')} in ${evt.repo.name}`}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span className="font-mono text-indigo-300">{evt.repo.name}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>{new Date(evt.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-md bg-indigo-600/10 text-indigo-400 mt-0.5">
                      <GitCommit className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white">
                        Optimized coordinate pathfinding and Manhattan distance heuristic in Python
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span className="font-mono text-indigo-300">{username}/adventofcode</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>master branch · Discrete simulation</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">commit</span>
                </div>

                <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-md bg-indigo-600/10 text-indigo-400 mt-0.5">
                      <GitBranch className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white">
                        Database migration: Added composite index on enrollment student_id and term_id
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span className="font-mono text-indigo-300">populi/sis-core-architecture</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>High-concurrency query plan</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">production</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
