import React, { useState } from 'react';
import { X, Github, Key, Check, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { githubService } from '../services/github';
import { DEFAULT_GITHUB_USERNAME } from '../data/fallbackData';

interface GithubSyncModalProps {
  currentUsername: string;
  isOpen: boolean;
  onClose: () => void;
  onSwitchUser: (username: string) => Promise<void>;
}

export const GithubSyncModal: React.FC<GithubSyncModalProps> = ({
  currentUsername,
  isOpen,
  onClose,
  onSwitchUser,
}) => {
  const [usernameInput, setUsernameInput] = useState(currentUsername);
  const [tokenInput, setTokenInput] = useState(githubService.getToken() || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const targetUser = usernameInput.trim();
    if (!targetUser) {
      setErrorMsg('Please enter a valid GitHub username.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Save or clear token
      githubService.setToken(tokenInput.trim() || null);
      await onSwitchUser(targetUser);
      setSuccessMsg(`Successfully synced with @${targetUser}`);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch GitHub profile';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetDefault = async () => {
    setUsernameInput(DEFAULT_GITHUB_USERNAME);
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await onSwitchUser(DEFAULT_GITHUB_USERNAME);
      setSuccessMsg(`Restored default profile @${DEFAULT_GITHUB_USERNAME}`);
      setTimeout(() => onClose(), 800);
    } catch {
      setErrorMsg('Failed to reset default.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#0e1017] border border-white/[0.12] shadow-2xl p-6 sm:p-7 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-white font-display font-bold text-lg">
            <Github className="w-5 h-5 text-indigo-400" />
            <span>GitHub Sync & Source Control</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md bg-white/[0.04]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          This portfolio fetches live public data directly from the official GitHub API.
          You can synchronize your account, inspect another developer profile, or provide an optional token.
        </p>

        {/* Current status quota */}
        <div className="p-3 rounded-lg bg-[#08090e] border border-white/[0.06] flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">API Rate Limit Quota:</span>
          <span className="text-emerald-400">
            {githubService.rateLimit.remaining} / {githubService.rateLimit.limit} remaining
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
              GitHub Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">
                @
              </span>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="christianamos"
                className="w-full pl-8 pr-4 py-2 text-xs bg-[#07080c] border border-white/[0.1] rounded-lg text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300 font-mono flex items-center gap-1.5">
                <Key className="w-3 h-3 text-slate-400" />
                <span>Personal Access Token (Optional)</span>
              </label>
              <span className="text-[11px] text-slate-500">Unlocks 5,000 req/hr</span>
            </div>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (Never sent to third parties)"
              className="w-full px-3 py-2 text-xs bg-[#07080c] border border-white/[0.1] rounded-lg text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Token is kept only in your local browser session storage for GitHub API requests.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetDefault}
              disabled={isSubmitting}
              className="px-3 py-2 text-xs text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-lg transition-colors"
            >
              Reset to @{DEFAULT_GITHUB_USERNAME}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{isSubmitting ? 'Syncing...' : 'Apply & Sync Profile'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
