import { GithubUser, GithubRepo, GithubEvent } from '../types/github';
import { FALLBACK_USER, FALLBACK_REPOS } from '../data/fallbackData';

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

class GithubService {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private token: string | null = null;
  public rateLimit: RateLimitInfo = {
    limit: 60,
    remaining: 60,
    reset: Date.now() + 3600000,
  };

  constructor() {
    // Check localStorage for saved token
    try {
      const savedToken = localStorage.getItem('gh_pat_token');
      if (savedToken) {
        this.token = savedToken;
      }
    } catch {
      // LocalStorage unavailable
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('gh_pat_token', token);
    } else {
      localStorage.removeItem('gh_pat_token');
    }
    // Clear cache when credentials change
    this.cache.clear();
  }

  public getToken(): string | null {
    return this.token;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token.trim()}`;
    }
    return headers;
  }

  private updateRateLimits(response: Response) {
    const limit = response.headers.get('x-ratelimit-limit');
    const remaining = response.headers.get('x-ratelimit-remaining');
    const reset = response.headers.get('x-ratelimit-reset');

    if (limit && remaining) {
      this.rateLimit = {
        limit: parseInt(limit, 10),
        remaining: parseInt(remaining, 10),
        reset: reset ? parseInt(reset, 10) * 1000 : Date.now() + 3600000,
      };
    }
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  private setCache<T>(key: string, data: T) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  public async fetchUser(username: string): Promise<GithubUser> {
    const cacheKey = `user_${username.toLowerCase()}`;
    const cached = this.getFromCache<GithubUser>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers: this.getHeaders(),
      });
      this.updateRateLimits(response);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`GitHub user "${username}" was not found.`);
        }
        if (response.status === 403) {
          throw new Error('GitHub API rate limit reached. Using authentic snapshot.');
        }
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const data: GithubUser = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (err) {
      // If it's christianamos and API failed or rate-limited, return rich fallback
      if (username.toLowerCase() === 'christianamos' || username.toLowerCase() === 'christianamos67') {
        return FALLBACK_USER;
      }
      throw err;
    }
  }

  public async fetchRepos(username: string): Promise<GithubRepo[]> {
    const cacheKey = `repos_${username.toLowerCase()}`;
    const cached = this.getFromCache<GithubRepo[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`,
        { headers: this.getHeaders() }
      );
      this.updateRateLimits(response);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Rate limit exceeded');
        }
        throw new Error(`Failed to fetch repos: ${response.statusText}`);
      }

      let repos: GithubRepo[] = await response.json();

      // If user is christianamos, supplement with our curated companion repos if only 1 public repo exists
      if (username.toLowerCase() === 'christianamos' && repos.length <= 1) {
        const existingNames = new Set(repos.map(r => r.name.toLowerCase()));
        for (const fb of FALLBACK_REPOS) {
          if (!existingNames.has(fb.name.toLowerCase())) {
            repos.push(fb);
          }
        }
      }

      this.setCache(cacheKey, repos);
      return repos;
    } catch {
      if (username.toLowerCase() === 'christianamos' || username.toLowerCase() === 'christianamos67') {
        return FALLBACK_REPOS;
      }
      return [];
    }
  }

  public async fetchEvents(username: string): Promise<GithubEvent[]> {
    const cacheKey = `events_${username.toLowerCase()}`;
    const cached = this.getFromCache<GithubEvent[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=30`,
        { headers: this.getHeaders() }
      );
      this.updateRateLimits(response);
      if (!response.ok) return [];
      const events: GithubEvent[] = await response.json();
      this.setCache(cacheKey, events);
      return events;
    } catch {
      return [];
    }
  }

  public async fetchRepoReadme(owner: string, repo: string): Promise<string | null> {
    const cacheKey = `readme_${owner}_${repo}`;
    const cached = this.getFromCache<string>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: {
          ...this.getHeaders(),
          Accept: 'application/vnd.github.v3.raw',
        },
      });
      if (!response.ok) return null;
      const text = await response.text();
      this.setCache(cacheKey, text);
      return text;
    } catch {
      return null;
    }
  }

  public async fetchLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    const cacheKey = `lang_${owner}_${repo}`;
    const cached = this.getFromCache<Record<string, number>>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers: this.getHeaders(),
      });
      if (!response.ok) return {};
      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch {
      return {};
    }
  }
}

export const githubService = new GithubService();
