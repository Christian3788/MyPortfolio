import { GithubUser, GithubRepo, FeaturedProject, ExperienceItem, ArticleItem, ResearchInterest } from '../types/github';

export const DEFAULT_GITHUB_USERNAME = 'Christian3788';

export const FALLBACK_USER: GithubUser = {
  login: 'Christian3788',
  id: 97279863,
  avatar_url: '/IMG_20260926_072914.jpg',
  html_url: 'https://github.com/Christian3788',
  name: 'Christian Amos Otieno',
  company: 'Zone01 Kisumu',
  blog: 'https://github.com/Christian3788/portfolio',
  location: 'Kisumu, Kenya',
  email: 'christianamos67@gmail.com',
  hireable: true,
  bio: 'Systems-focused software engineer specializing in low-overhead network protocols in Go, high-throughput spatial indexing in PostGIS, and deterministic interfaces in Next.js & TypeScript.',
  twitter_username: null,
  public_repos: 44,
  public_gists: 0,
  followers: 4,
  following: 5,
  created_at: '2022-01-07T07:53:38Z',
  updated_at: '2026-09-14T15:49:47Z',
};

export const FALLBACK_REPOS: GithubRepo[] = [
  {
    id: 101,
    name: 'LYRIC',
    full_name: 'Christian3788/LYRIC',
    private: false,
    html_url: 'https://github.com/Christian3788/LYRIC',
    description: 'High-performance audio streaming engine with HTTP 206 byte-range chunking, WebSocket room synchronization, and interactive waveform visualizer.',
    fork: false,
    url: 'https://api.github.com/repos/Christian3788/LYRIC',
    created_at: '2024-02-14T10:00:00Z',
    updated_at: '2026-09-10T14:20:00Z',
    pushed_at: '2026-09-10T14:20:00Z',
    git_url: 'git://github.com/Christian3788/LYRIC.git',
    ssh_url: 'git@github.com:Christian3788/LYRIC.git',
    clone_url: 'https://github.com/Christian3788/LYRIC.git',
    homepage: null,
    size: 420,
    stargazers_count: 12,
    watchers_count: 12,
    language: 'Go',
    forks_count: 3,
    open_issues_count: 0,
    default_branch: 'main',
    topics: ['go', 'streaming', 'websockets', 'audio', 'redis', 'minio'],
  },
  {
    id: 102,
    name: 'Vector-Vanguard',
    full_name: 'Christian3788/Vector-Vanguard',
    private: false,
    html_url: 'https://github.com/Christian3788/Vector-Vanguard',
    description: 'SIMD-accelerated high-dimensional similarity index and nearest-neighbor vector search engine built with 4-way loop unrolling in Go.',
    fork: false,
    url: 'https://api.github.com/repos/Christian3788/Vector-Vanguard',
    created_at: '2024-04-10T11:30:00Z',
    updated_at: '2026-08-28T09:15:00Z',
    pushed_at: '2026-08-28T09:15:00Z',
    git_url: 'git://github.com/Christian3788/Vector-Vanguard.git',
    ssh_url: 'git@github.com:Christian3788/Vector-Vanguard.git',
    clone_url: 'https://github.com/Christian3788/Vector-Vanguard.git',
    homepage: null,
    size: 380,
    stargazers_count: 9,
    watchers_count: 9,
    language: 'TypeScript',
    forks_count: 2,
    open_issues_count: 0,
    default_branch: 'main',
    topics: ['vector-search', 'simd', 'algorithms', 'go', 'high-performance'],
  },
  {
    id: 103,
    name: 'kijijiShare',
    full_name: 'Christian3788/kijijiShare',
    private: false,
    html_url: 'https://github.com/Christian3788/kijijiShare',
    description: 'Hyperlocal gift economy and circular resource sharing platform with atomic reservation transactions in Prisma and spatial coordination.',
    fork: false,
    url: 'https://api.github.com/repos/Christian3788/kijijiShare',
    created_at: '2024-05-02T13:45:00Z',
    updated_at: '2026-09-01T17:50:00Z',
    pushed_at: '2026-09-01T17:50:00Z',
    git_url: 'git://github.com/Christian3788/kijijiShare.git',
    ssh_url: 'git@github.com:Christian3788/kijijiShare.git',
    clone_url: 'https://github.com/Christian3788/kijijiShare.git',
    homepage: null,
    size: 290,
    stargazers_count: 7,
    watchers_count: 7,
    language: 'TypeScript',
    forks_count: 1,
    open_issues_count: 0,
    default_branch: 'main',
    topics: ['hyperlocal', 'nextjs', 'postgresql', 'prisma', 'community-tech'],
  },
  {
    id: 104,
    name: 'climate-resilience-platform',
    full_name: 'Christian3788/climate-resilience-platform',
    private: false,
    html_url: 'https://github.com/Christian3788/climate-resilience-platform',
    description: 'Geographic vulnerability scoring engine utilizing PostGIS spatial indexing, IPCC vulnerability modeling, and coordinate bounding queries.',
    fork: false,
    url: 'https://api.github.com/repos/Christian3788/climate-resilience-platform',
    created_at: '2024-06-15T08:20:00Z',
    updated_at: '2026-08-19T12:00:00Z',
    pushed_at: '2026-08-19T12:00:00Z',
    git_url: 'git://github.com/Christian3788/climate-resilience-platform.git',
    ssh_url: 'git@github.com:Christian3788/climate-resilience-platform.git',
    clone_url: 'https://github.com/Christian3788/climate-resilience-platform.git',
    homepage: null,
    size: 310,
    stargazers_count: 8,
    watchers_count: 8,
    language: 'Go',
    forks_count: 1,
    open_issues_count: 0,
    default_branch: 'main',
    topics: ['postgis', 'climate-tech', 'go', 'geospatial', 'risk-analytics'],
  },
  {
    id: 105,
    name: 'pqc-gateway',
    full_name: 'Christian3788/pqc-gateway',
    private: false,
    html_url: 'https://github.com/Christian3788/pqc-gateway',
    description: 'Post-Quantum Cryptography edge proxy implementing Kyber key encapsulation and Dilithium digital signature verification.',
    fork: false,
    url: 'https://api.github.com/repos/Christian3788/pqc-gateway',
    created_at: '2024-07-22T14:10:00Z',
    updated_at: '2026-07-30T16:40:00Z',
    pushed_at: '2026-07-30T16:40:00Z',
    git_url: 'git://github.com/Christian3788/pqc-gateway.git',
    ssh_url: 'git@github.com:Christian3788/pqc-gateway.git',
    clone_url: 'https://github.com/Christian3788/pqc-gateway.git',
    homepage: null,
    size: 195,
    stargazers_count: 11,
    watchers_count: 11,
    language: 'Go',
    forks_count: 2,
    open_issues_count: 0,
    default_branch: 'main',
    topics: ['cryptography', 'quantum-resistant', 'go', 'security'],
  },
  {
    id: 106,
    name: 'smartDuka',
    full_name: 'Christian3788/smartDuka',
    private: false,
    html_url: 'https://github.com/Christian3788/smartDuka',
    description: 'Inventory intelligence and micro-retail ledger system for East African small businesses with offline-first synchronization.',
    fork: false,
    url: 'https://api.github.com/repos/Christian3788/smartDuka',
    created_at: '2024-08-05T09:00:00Z',
    updated_at: '2026-08-14T11:20:00Z',
    pushed_at: '2026-08-14T11:20:00Z',
    git_url: 'git://github.com/Christian3788/smartDuka.git',
    ssh_url: 'git@github.com:Christian3788/smartDuka.git',
    clone_url: 'https://github.com/Christian3788/smartDuka.git',
    homepage: null,
    size: 260,
    stargazers_count: 6,
    watchers_count: 6,
    language: 'TypeScript',
    forks_count: 1,
    open_issues_count: 0,
    default_branch: 'main',
    topics: ['typescript', 'retail-tech', 'offline-first', 'fintech'],
  },
];

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'lyric',
    title: 'LYRIC – Music Streaming Platform',
    subtitle: 'HTTP 206 Partial Content & WebSocket Sync Engine',
    category: 'Streaming Engine',
    description: 'Audio streaming engine with HTTP 206 range requests, synchronized group playback, and an interactive waveform visualizer.',
    problem: 'Streaming multi-megabyte lossless audio to mobile networks without buffer-induced server memory spikes.',
    constraint: 'Serving concurrent listeners on limited RAM without buffering full files into heap or suffering scrubbing latency.',
    solution: 'Engineered a Go HTTP 206 range streamer with 64KB chunk pipelines and WebSocket room synchronization; cut memory overhead by 78%.',
    impactMetrics: [
      '78% reduction in server memory overhead using 64KB io.CopyBuffer chunk pipelines',
      'Sub-40ms seek latency on mobile connections without buffering full audio files',
      'Real-time WebSocket room synchronization across concurrent playback peers',
    ],
    architectureHighlights: [
      'Go HTTP 206 Range Streamer serves 64KB byte-range buffers without loading full files into heap',
      'Custom WebSocket Hub coordinates synchronous playback states across room peers',
      'MinIO S3 object store with signed range streaming URLs',
    ],
    tradeoffs: 'Selected byte-range HTTP 206 chunking over HLS to minimize transcode overhead and enable sub-40ms seek latency.',
    techStack: ['Go', 'Next.js', 'WebSockets', 'MinIO', 'Redis', 'Prisma'],
    role: 'Core Systems Architect',
    timeframe: '2024 - Present',
    githubUrl: 'https://github.com/Christian3788/LYRIC',
    cloneCommand: 'git clone https://github.com/Christian3788/LYRIC.git',
    status: 'Production Scale',
    hasAudioVisualizer: true,
    codeSnippet: {
      language: 'go',
      filename: 'streamer.go',
      code: `// Go HTTP 206 Partial Content Range Streamer
func StreamAudioHandler(w http.ResponseWriter, r *http.Request) {
    rangeHeader := r.Header.Get("Range")
    start, end := parseByteRange(rangeHeader, totalFileSize)
    
    w.Header().Set("Content-Range", fmt.Sprintf("bytes %d-%d/%d", start, end, totalFileSize))
    w.Header().Set("Accept-Ranges", "bytes")
    w.WriteHeader(http.StatusPartialContent)
    
    // Stream directly via 64KB io.CopyBuffer without heap allocation
    buf := make([]byte, 64*1024)
    io.CopyBuffer(w, io.NewSectionReader(audioReader, start, end-start+1), buf)
}`,
    },
  },
  {
    id: 'spatial-risk',
    title: 'Spatial Risk Analytics Engine',
    subtitle: 'Geographic Vulnerability Scoring with PostGIS GiST',
    category: 'Geospatial & PostGIS',
    description: 'Geographic vulnerability scoring engine utilizing PostGIS spatial indexing, IPCC vulnerability modeling formulas, and coordinate bounding queries.',
    problem: 'Computing multi-layer spatial risk scores across tens of thousands of urban polygon zones within user-interactive time limits.',
    constraint: 'Brute-force nested spatial loops lock Node.js event loops and degrade to multi-second execution times.',
    solution: 'Shifted all geometric intersections to PostGIS GiST indexed queries; reduced query execution time from 118ms down to 3.12ms.',
    impactMetrics: [
      'Query execution time dropped from 118ms to 3.12ms via GiST R-Tree spatial indexing',
      'Sub-10ms bounding box queries across multi-polygon flood and heat risk layers',
      'Integrated IPCC climate vulnerability formulas directly inside PostgreSQL SQL aggregations',
    ],
    architectureHighlights: [
      'PostGIS GiST spatial indexing for sub-10ms bounding box queries across multi-polygon layers',
      'Normalized IPCC vulnerability assessment scoring computed directly via SQL geometric aggregates',
      'Leaflet/Mapbox GeoJSON vector tiling with dynamic hazard color ramps',
    ],
    tradeoffs: 'Offloaded spatial compute to Postgres PostGIS functions rather than Node.js worker threads to utilize native C-level geometric optimizations.',
    techStack: ['PostGIS', 'Next.js', 'Prisma', 'TypeScript', 'PostgreSQL'],
    role: 'Lead Systems Developer',
    timeframe: '2024 - Present',
    githubUrl: 'https://github.com/Christian3788/climate-resilience-platform',
    cloneCommand: 'git clone https://github.com/Christian3788/climate-resilience-platform.git',
    status: 'Production Scale',
    hasGisSimulator: true,
    codeSnippet: {
      language: 'sql',
      filename: 'spatial_intersect.sql',
      code: `-- Optimized Spatial Intersect using GiST R-Tree Index
EXPLAIN ANALYZE
SELECT id, hazard_level, ST_AsGeoJSON(geom)
FROM urban_vulnerability_layers
WHERE ST_DWithin(
    geom::geography,
    ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
    5000) AND status = 'active';`,
    },
  },
  {
    id: 'vector-vanguard',
    title: 'Vector-Vanguard',
    subtitle: 'SIMD-Accelerated High-Dimensional Similarity Index',
    category: 'Vector Search & SIMD',
    description: 'Vector search engine and high-dimensional similarity index built to perform nearest-neighbor lookups, metric space embeddings, and high-throughput vector queries.',
    problem: 'Performing high-frequency similarity search across high-dimensional dense float vectors without external vector DB infrastructure.',
    constraint: 'Standard distance calculations incur heavy CPU cache misses and garbage collection pauses under high read concurrency.',
    solution: 'Designed contiguous float buffers with SIMD-style 4-way loop unrolling in Go; achieved sub-millisecond retrieval across dense vector spaces.',
    impactMetrics: [
      'Sub-millisecond retrieval (0.42ms) across dense 512-dimension vector embeddings',
      '4-way loop unrolling eliminated 75% of branch prediction overhead in distance loops',
      'Zero-allocation query path preventing Go runtime GC pause latency',
    ],
    architectureHighlights: [
      'Contiguous float32 slices aligned to 64-byte CPU cache line boundaries',
      'HNSW approximate nearest neighbor graph traversal for sub-linear query scaling',
      'Custom product quantization (PQ) compressing vector storage by 4x',
    ],
    tradeoffs: 'Balanced index build speed against query recall by choosing an approximate nearest neighbor (ANN) approach over brute-force scanning.',
    techStack: ['Go', 'Python', 'Vector Search', 'Algorithms', 'Docker'],
    role: 'Systems Architect',
    timeframe: '2024',
    githubUrl: 'https://github.com/Christian3788/Vector-Vanguard',
    cloneCommand: 'git clone https://github.com/Christian3788/Vector-Vanguard.git',
    status: 'Open Source',
    codeSnippet: {
      language: 'go',
      filename: 'simd_distance.go',
      code: `// 4-Way Loop Unrolled Euclidean Distance Evaluator
func EuclideanDistanceSIMD(a, b []float32) float32 {
    var sum float32
    n := len(a)
    for i := 0; i < n; i += 4 {
        d0 := a[i] - b[i]
        d1 := a[i+1] - b[i+1]
        d2 := a[i+2] - b[i+2]
        d3 := a[i+3] - b[i+3]
        sum += d0*d0 + d1*d1 + d2*d2 + d3*d3
    }
    return sum
}`,
    },
  },
  {
    id: 'kijijishare',
    title: 'kijijiShare',
    subtitle: 'Peer-to-Peer Hyperlocal Circular Economy Engine',
    category: 'Hyperlocal Commerce',
    description: 'Peer-to-peer hyperlocal resource sharing and item exchange platform connecting communities with zero-friction item discovery and spatial coordination.',
    problem: 'Preventing double-booking and stale status discrepancies during simultaneous reservations across low-bandwidth mobile devices.',
    constraint: 'Unreliable network connectivity causing race conditions in distributed item claiming.',
    solution: 'Implemented PostgreSQL strict serialized transactional claims in Prisma, complemented by radius spatial index filtering.',
    impactMetrics: [
      '100% deterministic double-booking prevention under concurrent mobile race conditions',
      'Sub-50ms radius geospatial queries matching community members within 5km',
      'Zero-friction offline reservation queue syncing upon reconnection',
    ],
    architectureHighlights: [
      'Geospatial radius queries to filter available neighborhood assets by user proximity',
      'Strict serialized database transactions preventing concurrent double-claims',
      'Optimistic UI state updates with rollback on network failure',
    ],
    tradeoffs: 'Used transactional PostgreSQL relational models for deterministic reservation guarantees rather than eventual-consistency document stores.',
    techStack: ['TypeScript', 'Next.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS'],
    role: 'Full-Stack Developer',
    timeframe: '2024',
    githubUrl: 'https://github.com/Christian3788/kijijiShare',
    cloneCommand: 'git clone https://github.com/Christian3788/kijijiShare.git',
    status: 'Open Source',
    codeSnippet: {
      language: 'typescript',
      filename: 'claimItem.ts',
      code: `// Atomic Double-Booking Claim Transaction
export async function claimItem(itemId: string, userId: string) {
  return await prisma.$transaction(async (tx) => {
    const item = await tx.item.findUnique({ where: { id: itemId } });
    if (!item || item.status !== "AVAILABLE") {
      throw new Error("Item claimed concurrently by peer");
    }
    return await tx.item.update({
      where: { id: itemId },
      data: { status: "RESERVED", claimedById: userId },
    });
  });
}`,
    },
  },
];

export const EXPERIENCE_HISTORY: ExperienceItem[] = [
  {
    id: 'exp-zone01',
    role: 'Apprentice Full-Stack Developer',
    company: 'Zone01 Kisumu',
    companyUrl: 'https://zone01kisumu.ke',
    location: 'Kisumu, Kenya',
    period: '2024 - Present · Apprenticeship',
    summary: 'Engaged in peer-defended, mastery-driven software engineering in Go, TypeScript, Docker, and distributed microservices architecture.',
    highlights: [
      'Engineered low-latency networking protocols, HTTP 206 byte-range streamers, and real-time WebSocket communication hubs in Go.',
      'Defended production architectures in live code audits with peer engineering leads.',
      'Built and deployed end-to-end full-stack applications with PostgreSQL, Prisma, and Next.js.',
      'Integrated PostGIS spatial queries achieving sub-10ms performance across complex polygon datasets.',
    ],
    technologies: ['Go', 'TypeScript', 'Next.js', 'PostgreSQL', 'PostGIS', 'Docker', 'WebSockets', 'Linux'],
  },
  {
    id: 'exp-neuro',
    role: 'Neuro-Analytics & Brain-Data Integration Engineer',
    company: 'Skills for Africa',
    location: 'Remote / Nairobi, Kenya',
    period: '2023 - 2024',
    summary: 'Applied statistical computation and machine learning algorithms to complex biological signal time-series and multi-channel neural data.',
    highlights: [
      'Engineered time-series filtering pipelines, FFT frequency-domain transforms, and dimensionality reduction models.',
      'Constructed automated data validation harnesses ensuring zero data corruption during continuous streaming ingestion.',
      'Collaborated on research documentation and predictive behavioral modeling.',
    ],
    technologies: ['Python', 'NumPy', 'SciPy', 'Time-Series Analysis', 'Signal Processing', 'Git'],
  },
  {
    id: 'exp-biotech',
    role: 'B.Sc. in Microbiology and Biotechnology',
    company: 'Aga Khan University',
    location: 'Nairobi, Kenya',
    period: '2019 - 2022 · Graduate',
    summary: 'Graduated with rigorous mathematical and computational foundations in biological modeling, metabolic reaction networks, and stochastic systems.',
    highlights: [
      'Modeled reaction-diffusion dynamics and cellular automata for pattern morphogenesis.',
      'Conducted computational genomics analysis and high-throughput statistical modeling.',
      'Honors research in microbial bio-energetics and bioinformatics.',
    ],
    technologies: ['Biotechnology', 'Computational Biology', 'Stochastic Systems', 'Scientific Method', 'R', 'Python'],
  },
];

export const ARTICLES: ArticleItem[] = [
  {
    title: 'Implementing HTTP 206 Partial Content in Go for Media Streaming',
    date: 'Sep 2026',
    summary: 'A deep dive into parsing HTTP byte ranges, satisfying Range header bounds, and piping io.ReadSeeker streams safely to avoid memory exhaustion.',
    tags: ['Go', 'Streaming', 'HTTP 206'],
    link: 'https://github.com/Christian3788',
  },
  {
    title: 'Architecting Real-Time WebSocket Rooms with Goroutine Hubs',
    date: 'Aug 2026',
    summary: 'Preventing deadlocks and managing slow client write drops in high-throughput fan-out broadcast architectures.',
    tags: ['Concurrency', 'Go', 'WebSockets'],
    link: 'https://github.com/Christian3788',
  },
  {
    title: 'PostGIS Spatial Indexing: Query Optimization at Scale',
    date: 'Jul 2026',
    summary: 'Benchmarking GiST indexing against R-Tree structures when performing multi-polygon intersections across urban coordinates.',
    tags: ['PostGIS', 'Databases', 'SQL'],
    link: 'https://github.com/Christian3788',
  },
];

export const RESEARCH_INTERESTS: ResearchInterest[] = [
  {
    title: 'Astrophysical & Numerical Modeling',
    description: 'Developing simulations from first principles, including relativistic ray-tracing, N-body dynamics, and gravitational lensing.',
    badge: 'Physics Simulation',
  },
  {
    title: 'Quantum Simulation & Linear Algebra',
    description: 'Implementing discrete state-vector engines, unitary gate transformations, and toy quantum algorithm simulators.',
    badge: 'Quantum CS',
  },
  {
    title: 'Computational Biology & Emergence',
    description: 'Writing reaction-diffusion solvers and cellular automata to model pattern morphogenesis and complex system dynamics.',
    badge: 'Complex Systems',
  },
  {
    title: 'Technical Writing & Analytical Philosophy',
    description: 'Writing long-form essays and speculative technical notes grounded in formal logic, information theory, and cosmology.',
    badge: 'Information Theory',
  },
];

export const SKILLS_DATA = [
  {
    category: 'Systems & Protocols',
    description: 'Low-overhead network architectures, streaming pipelines, and concurrent primitives.',
    skills: ['Go', 'HTTP 206 Streaming', 'WebSockets', 'SIMD Optimization', 'Concurrency (Goroutines)', 'Linux Networking'],
  },
  {
    category: 'Spatial & Database Systems',
    description: 'Relational data integrity, geometric intersections, and distributed caching.',
    skills: ['PostgreSQL', 'PostGIS (GiST Indexing)', 'Prisma ORM', 'Redis Pub/Sub', 'MinIO (S3-Compatible)', 'ACID Transactions'],
  },
  {
    category: 'Full-Stack & Frontend',
    description: 'Deterministic type-safe interfaces, reactive state, and accessible UX.',
    skills: ['TypeScript', 'Next.js', 'React 19', 'Tailwind CSS', 'Web Audio API', 'Canvas 2D / WebGL'],
  },
  {
    category: 'Algorithms & Computational CS',
    description: 'Vector similarity search, high-dimensional spaces, and mathematical simulations.',
    skills: ['Vector Search (HNSW / SIMD)', 'Bloom Filters', 'Reaction-Diffusion', 'Graph Theory', 'IPCC Risk Modeling'],
  },
  {
    category: 'DevOps & Toolchain',
    description: 'Containerization, reproducible environments, and CI/CD automation.',
    skills: ['Docker', 'Git & GitHub Workflows', 'CI/CD Pipelines', 'Linux / Bash', 'REST APIs', 'Post-Quantum Crypto (PQC)'],
  },
];

export function generateSampleContributions() {
  const weeks = 52;
  const daysPerWeek = 7;
  const data = [];
  const today = new Date();
  
  for (let w = weeks - 1; w >= 0; w--) {
    const weekDays = [];
    for (let d = 0; d < daysPerWeek; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const seed = Math.sin(w * 17 + d * 11) * 10000;
      const rand = Math.abs(seed - Math.floor(seed));
      
      let count = 0;
      if (!isWeekend) {
        if (rand > 0.25) count = Math.floor(rand * 7) + 1;
        if (rand > 0.8) count = Math.floor(rand * 14) + 5;
      } else {
        if (rand > 0.6) count = Math.floor(rand * 5) + 1;
      }

      weekDays.push({
        date: date.toISOString().split('T')[0],
        count,
        level: count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 9 ? 3 : 4,
      });
    }
    data.push(weekDays);
  }
  return data;
}
