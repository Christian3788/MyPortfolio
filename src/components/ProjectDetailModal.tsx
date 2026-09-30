import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink, Code2, Server, Terminal, ArrowUpRight, Database, AlertCircle, CheckCircle2, Layers } from 'lucide-react';
import { FeaturedProject, GithubRepo } from '../types/github';
import { githubService } from '../services/github';
import { AudioVisualizerWidget } from './AudioVisualizerWidget';
import { GisSimulatorWidget } from './GisSimulatorWidget';
import { ArchitectureTopologyModal } from './ArchitectureTopologyModal';

interface ProjectDetailModalProps {
  project?: FeaturedProject | null;
  repo?: GithubRepo | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  repo,
  onClose,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [loadingReadme, setLoadingReadme] = useState(false);
  const [isTopologyOpen, setIsTopologyOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (repo) {
      setLoadingReadme(true);
      const owner = repo.full_name.split('/')[0];
      githubService.fetchRepoReadme(owner, repo.name).then((data) => {
        setReadmeContent(data);
        setLoadingReadme(false);
      });
    } else {
      setReadmeContent(null);
    }
  }, [repo]);

  if (!project && !repo) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-[#0059e8] font-bold">
                {project ? project.category : 'GitHub Repository'}
              </span>
              <span aria-hidden="true" className="text-slate-400 font-bold">·</span>
              <span className="text-emerald-800 font-bold">
                {project ? project.status : repo?.fork ? 'Forked Repo' : 'Public Repository'}
              </span>
              {project && (
                <>
                  <span aria-hidden="true" className="text-slate-400 font-bold">·</span>
                  <span className="text-slate-700 font-medium">{project.timeframe}</span>
                </>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              {project ? project.title : repo?.name}
            </h2>

            {project?.subtitle && (
              <p className="text-sm text-[#0059e8] font-mono">
                {project.subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Close dialog (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {project ? (
          <div className="space-y-6">
            
            <p className="text-base text-slate-700 leading-relaxed">
              {project.description}
            </p>

            {/* Problem & Solution Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 font-mono">
                  <AlertCircle className="w-4 h-4" />
                  <span>Problem &amp; Invariant Constraint</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {project.problem}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60">
                  <strong className="text-amber-700 font-medium">Constraint: </strong>
                  {project.constraint}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Engineered Solution</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {project.solution}
                </p>
                {project.tradeoffs && (
                  <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60">
                    <strong className="text-[#0059e8] font-medium">Trade-off: </strong>
                    {project.tradeoffs}
                  </p>
                )}
              </div>
            </div>

            {/* Interactive Widget Embed */}
            {project.hasAudioVisualizer && (
              <div className="space-y-2">
                <div className="text-xs font-mono text-[#0059e8] font-semibold">Live Interactive Audio Streamer Preview:</div>
                <AudioVisualizerWidget />
              </div>
            )}

            {project.hasGisSimulator && (
              <div className="space-y-2">
                <div className="text-xs font-mono text-[#0059e8] font-semibold">Live PostGIS GiST Spatial Indexing Simulator:</div>
                <GisSimulatorWidget />
              </div>
            )}

            {/* Quantified Outcomes */}
            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-900 font-mono">
                <Database className="w-4 h-4 text-[#0059e8]" />
                <span>Verified Engineering Metrics &amp; Outcomes</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {project.impactMetrics.map((metric, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                    <span>{metric}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code Snippet Box */}
            {project.codeSnippet && (
              <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xs">
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <Code2 className="w-4 h-4 text-[#0059e8]" />
                    <span>{project.codeSnippet.filename}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400 uppercase">{project.codeSnippet.language}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(project.codeSnippet!.code)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                  <code>{project.codeSnippet.code}</code>
                </pre>
              </div>
            )}

            {/* Clone Box */}
            {project.cloneCommand && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-800 truncate">
                  <Terminal className="w-4 h-4 text-[#0059e8] shrink-0" />
                  <span className="truncate">{project.cloneCommand}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(project.cloneCommand!)}
                  className="ml-3 px-2.5 py-1 text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  Copy
                </button>
              </div>
            )}

            {/* Tech Stack Footer */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-800">
                <span className="text-slate-800 font-bold font-mono">Tech Stack:</span>
                {project.techStack.map((tech, i) => (
                  <React.Fragment key={tech}>
                    <span className="text-slate-900 font-semibold">{tech}</span>
                    {i < project.techStack.length - 1 && (
                      <span aria-hidden="true" className="text-slate-400 font-bold">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTopologyOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors font-mono cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-[#0059e8]" />
                  <span>Inspect Architecture Blueprint</span>
                </button>

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0059e8] hover:bg-[#0048c4] rounded-lg transition-colors shadow-xs"
                  >
                    <span>View Repository</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Architecture Topology Blueprint Modal */}
            <ArchitectureTopologyModal
              project={project}
              isOpen={isTopologyOpen}
              onClose={() => setIsTopologyOpen(false)}
            />

          </div>
        ) : repo ? (
          <div className="space-y-6">
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {repo.description || 'No description provided for this repository.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-700 font-medium">Primary Language</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{repo.language || 'Multi-language'}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-700 font-medium">Stars</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5 font-mono">{repo.stargazers_count}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-700 font-medium">Forks</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5 font-mono">{repo.forks_count}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-700 font-medium">Default Branch</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5 font-mono">{repo.default_branch}</div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-800 truncate">
                <Terminal className="w-4 h-4 text-[#0059e8] shrink-0" />
                <span className="truncate font-semibold">git clone {repo.clone_url || repo.html_url + '.git'}</span>
              </div>
              <button
                onClick={() => copyToClipboard(`git clone ${repo.clone_url || repo.html_url + '.git'}`)}
                className="ml-3 px-2.5 py-1 text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                Copy
              </button>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                README.md Documentation
              </div>
              {loadingReadme ? (
                <div className="text-xs text-slate-700 font-mono py-6 text-center font-medium">Loading README from GitHub...</div>
              ) : readmeContent ? (
                <pre className="text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                  {readmeContent}
                </pre>
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Repository contents and commit logs are available on GitHub.
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0059e8] hover:bg-[#0048c4] rounded-lg transition-colors shadow-xs"
              >
                <span>Open on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
};
