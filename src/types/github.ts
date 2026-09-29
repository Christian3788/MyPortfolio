export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  topics?: string[];
  default_branch: string;
  languages?: Record<string, number>;
}

export interface GithubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
    url: string;
  };
  payload?: {
    action?: string;
    commits?: Array<{
      sha: string;
      message: string;
      author: {
        name: string;
        email: string;
      };
    }>;
    ref?: string;
    ref_type?: string;
  };
  created_at: string;
}

export interface FeaturedProject {
  id: string;
  title: string;
  subtitle: string;
  category: 'Streaming Engine' | 'Geospatial & PostGIS' | 'Vector Search & SIMD' | 'Hyperlocal Commerce' | 'Enterprise';
  description: string;
  problem: string;
  constraint: string;
  solution: string;
  impactMetrics: string[];
  architectureHighlights: string[];
  tradeoffs?: string;
  techStack: string[];
  role: string;
  timeframe: string;
  githubUrl?: string;
  demoUrl?: string;
  cloneCommand?: string;
  status: 'Production Scale' | 'Open Source' | 'Enterprise';
  hasAudioVisualizer?: boolean;
  hasGisSimulator?: boolean;
  codeSnippet?: {
    language: string;
    filename: string;
    code: string;
  };
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  period: string;
  summary: string;
  highlights: string[];
  technologies: string[];
}

export interface ArticleItem {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  link: string;
}

export interface ResearchInterest {
  title: string;
  description: string;
  badge: string;
}
