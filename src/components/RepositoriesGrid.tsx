import React, { useState, useMemo } from 'react';
import { Github, Star, GitFork, ExternalLink, Search, Copy, Check, Eye, Code, Terminal, Clock } from 'lucide-react';
import { GithubRepo } from '../types/github';

interface RepositoriesGridProps {
  repos: GithubRepo[];
  username: string;
  onOpenRepoDetails: (repo: GithubRepo) => void;
}

const LANGUAGE_COLORS: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Ruby: '#701516',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Go: '#00ADD8',
  Rust: '#dea584',
};

export const RepositoriesGrid: React.FC<RepositoriesGridProps> = ({
  repos,
  username,
  onOpenRepoDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'updated' | 'stars' | 'name'>('updated');
  const [copiedRepoId, setCopiedRepoId] = useState<number | null>(null);

  // Extract unique languages
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((r) => {
      if (r.language) langs.add(r.language);
    });
    return ['All', ...Array.from(langs)];
  }, [repos]);

  // Filter & sort
  const filteredRepos = useMemo(() => {
    return repos
      .filter((repo) => {
        const matchesSearch =
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesLang =
          selectedLanguage === 'All' || repo.language === selectedLanguage;
        return matchesSearch && matchesLang;
      })
      .sort((a, b) => {
        if (sortBy === 'stars') {
          return b.stargazers_count - a.stargazers_count;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return new Date(b.pushed_at || b.updated_at).getTime() - new Date(a.pushed_at || a.updated_at).getTime();
      });
  }, [repos, searchQuery, selectedLanguage, sortBy]);

  const copyClone = (repo: GithubRepo, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`git clone ${repo.clone_url || repo.html_url + '.git'}`);
    setCopiedRepoId(repo.id);
    setTimeout(() => setCopiedRepoId(null), 2000);
  };

  return (
    <section id="repositories" className="py-20 border-t border-slate-200/90 bg-[#f8fafd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-[#0059e8] uppercase font-mono mb-2">
              04. Source Code Repositories
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display">
              GitHub Repositories
            </h2>
          </div>
          <div className="text-xs text-slate-700 font-mono font-medium">
            Synced from @{username} · {repos.length} Repositories Available
          </div>
        </div>

        {/* Filter & Search Bar: Interactive segmented controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter repositories by name or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#0059e8] focus:bg-white transition-colors"
            />
          </div>

          {/* Controls Right */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Language Filter Tabs (Functional segmented control buttons) */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg overflow-x-auto">
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    selectedLanguage === lang
                      ? 'bg-[#0059e8] text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'updated' | 'stars' | 'name')}
              className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#0059e8] cursor-pointer"
            >
              <option value="updated">Recently Updated</option>
              <option value="stars">Most Starred</option>
              <option value="name">Alphabetical</option>
            </select>

          </div>
        </div>

        {/* Repositories Grid */}
        {filteredRepos.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-slate-50 border border-slate-200">
            <Code className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No repositories match your criteria</h3>
            <p className="text-xs text-slate-700 font-medium mt-1">Try adjusting your search query or language filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map((repo) => {
              const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || '#94a3b8' : '#94a3b8';
              const updatedDate = new Date(repo.pushed_at || repo.updated_at);
              const formattedDate = updatedDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={repo.id}
                  onClick={() => onOpenRepoDetails(repo)}
                  className="rounded-xl bg-white border border-slate-200/90 hover:border-[#0059e8]/50 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-3">
                    
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 font-mono group-hover:text-[#0059e8] transition-colors truncate">
                        <Terminal className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <span className="truncate">{repo.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => copyClone(repo, e)}
                          title="Copy clone command"
                          className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors"
                        >
                          {copiedRepoId === repo.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Open on GitHub"
                          className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-700 leading-relaxed line-clamp-3 font-normal">
                      {repo.description || 'No description provided for this repository.'}
                    </p>

                  </div>

                  {/* Bottom unboxed metadata (NO PILLS) */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-700">
                    
                    {/* Language and stars */}
                    <div className="flex items-center gap-3">
                      {repo.language && (
                        <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: langColor }}
                          />
                          <span>{repo.language}</span>
                        </span>
                      )}

                      <span className="flex items-center gap-1 font-mono text-slate-700 font-medium">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="tabular-nums">{repo.stargazers_count}</span>
                      </span>

                      {repo.forks_count > 0 && (
                        <span className="flex items-center gap-1 font-mono text-slate-700 font-medium">
                          <GitFork className="w-3 h-3 text-slate-700" />
                          <span className="tabular-nums">{repo.forks_count}</span>
                        </span>
                      )}
                    </div>

                    {/* Date */}
                    <span className="font-mono text-slate-600 font-medium">
                      {formattedDate}
                    </span>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
