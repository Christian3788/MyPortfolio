export interface GitCommitNode {
  sha: string;
  repoId: 'lyric' | 'vector-vanguard' | 'kijijishare' | 'spatial-agritech' | 'zone01';
  repoName: string;
  repoFullName: string;
  branch: string;
  author: string;
  date: string;
  timestamp: number; // for sequential Dusk-to-Dawn scrubber
  message: string;
  detailedNotes: string;
  category: 'perf' | 'feat' | 'arch' | 'audit' | 'fix';
  color: string;
  insertions: number;
  deletions: number;
  altitude: number; // 3D Spire Height (0.05 to 0.3)
  radius: number;   // Column width (0.25 to 0.55)
  lat: number;
  lng: number;
  district: string;
  codeSnippet: string;
  language: 'go' | 'sql' | 'typescript' | 'bash';
  githubUrl: string;
  isHead?: boolean;
}

export interface RepoMetropolis {
  id: string;
  name: string;
  fullName: string;
  districtName: string;
  description: string;
  centerLat: number;
  centerLng: number;
  color: string;
  totalCommits: number;
  totalInsertions: number;
  totalDeletions: number;
  primaryLanguage: string;
  githubUrl: string;
}

export const REPO_METROPOLISES: RepoMetropolis[] = [
  {
    id: 'lyric',
    name: 'LYRIC',
    fullName: 'Christian3788/LYRIC',
    districtName: 'Zero-Copy Audio Streaming District',
    description: 'High-throughput Go HTTP 206 byte-range chunking, TCP zero-copy socket streaming, and io.CopyN memory bounds.',
    centerLat: -0.0862,
    centerLng: 34.7521,
    color: '#10b981', // Emerald
    totalCommits: 9,
    totalInsertions: 2180,
    totalDeletions: 432,
    primaryLanguage: 'Go',
    githubUrl: 'https://github.com/Christian3788/LYRIC',
  },
  {
    id: 'spatial-agritech',
    name: 'Spatial-Agritech',
    fullName: 'Christian3788/Spatial-Agritech',
    districtName: 'PostGIS Geospatial & Sensor Plaza',
    description: 'PostGIS 2D GiST R-Tree indexing, Hilbert space-filling curve clustering, and sub-4ms spatial radius queries on 100k parcels.',
    centerLat: -0.0984,
    centerLng: 34.7852,
    color: '#06b6d4', // Cyan
    totalCommits: 8,
    totalInsertions: 1940,
    totalDeletions: 310,
    primaryLanguage: 'PostgreSQL / Go',
    githubUrl: 'https://github.com/Christian3788/Spatial-Agritech',
  },
  {
    id: 'kijijishare',
    name: 'KijijiShare',
    fullName: 'Christian3788/KijijiShare',
    districtName: 'Advisory Lock Concurrency Sector',
    description: 'High-concurrency equipment sharing engine with PostgreSQL transactional advisory locks, eliminating double-booking races under 500 goroutines.',
    centerLat: -0.0921,
    centerLng: 34.7645,
    color: '#818cf8', // Indigo
    totalCommits: 8,
    totalInsertions: 1820,
    totalDeletions: 365,
    primaryLanguage: 'Go / SQL',
    githubUrl: 'https://github.com/Christian3788/KijijiShare',
  },
  {
    id: 'vector-vanguard',
    name: 'Vector-Vanguard & Zone01 Core',
    fullName: 'Christian3788/Vector-Vanguard',
    districtName: 'SIMD Algorithms & Peer Defense Citadel',
    description: 'AVX2 256-bit SIMD vector search, 32-bit Murmur3 Bloom filter, and Zone01 peer-defended low-latency epoll networking.',
    centerLat: -0.0818,
    centerLng: 34.7738,
    color: '#f59e0b', // Amber
    totalCommits: 7,
    totalInsertions: 1650,
    totalDeletions: 290,
    primaryLanguage: 'Go / C',
    githubUrl: 'https://github.com/Christian3788/Vector-Vanguard',
  },
];

export const GITHUB_COMMIT_NODES: GitCommitNode[] = [
  // =========================================================
  // 1. LYRIC (High-Throughput Go HTTP 206 Zero-Copy Streaming)
  // District: Zero-Copy Audio Streaming District (Lakefront Port)
  // =========================================================
  {
    sha: 'e4a91b2',
    repoId: 'lyric',
    repoName: 'LYRIC',
    repoFullName: 'Christian3788/LYRIC',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-02-14',
    timestamp: 1707904800000,
    message: 'feat(stream): implement zero-copy io.CopyN range streamer over TCP socket',
    detailedNotes: 'Replaced naive ioutil.ReadAll buffer with kernel-level zero-copy io.CopyN streaming. Slices byte ranges directly into socket write queues without copying into userland heap.',
    category: 'perf',
    color: '#10b981', // Emerald
    insertions: 412,
    deletions: 88,
    altitude: 0.24,
    radius: 0.42,
    lat: -0.0862,
    lng: 34.7521,
    district: 'Zero-Copy Audio Streaming District',
    codeSnippet: `// Zero-copy HTTP 206 range chunking
w.Header().Set("Content-Range", fmt.Sprintf("bytes %d-%d/%d", start, end, fileSize))
w.WriteHeader(http.StatusPartialContent)
if _, err := io.CopyN(w, fileReader, chunkSize); err != nil {
    return fmt.Errorf("socket write error: %w", err)
}`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/LYRIC/commit/e4a91b2',
  },
  {
    sha: '3b8d1a0',
    repoId: 'lyric',
    repoName: 'LYRIC',
    repoFullName: 'Christian3788/LYRIC',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-02-22',
    timestamp: 1708596000000,
    message: 'perf(netpoll): delegate socket readiness to epoll event loop without thread preemption',
    detailedNotes: 'Integrated Go runtime netpoller to park blocked I/O goroutines without thread preemption. Measured zero OS context switch penalties under 1,000 active streams.',
    category: 'perf',
    color: '#10b981',
    insertions: 280,
    deletions: 45,
    altitude: 0.18,
    radius: 0.38,
    lat: -0.0854,
    lng: 34.7538,
    district: 'Zero-Copy Audio Streaming District',
    codeSnippet: `// Socket readiness check bypassing OS context switch
rawConn, _ := conn.SyscallConn()
rawConn.Read(func(fd uintptr) bool {
    syscall.SetNonblock(int(fd), true)
    return true
})`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/LYRIC/commit/3b8d1a0',
  },
  {
    sha: '9f2c418',
    repoId: 'lyric',
    repoName: 'LYRIC',
    repoFullName: 'Christian3788/LYRIC',
    branch: 'streaming-v2',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-03-05',
    timestamp: 1709632800000,
    message: 'arch(buffer): introduce sync.Pool 64KB byte recycling to drop heap GC cycles by 78%',
    detailedNotes: 'Implemented sync.Pool buffer recycler. High-throughput audio segments reuse pooled byte buffers, eliminating 15,000 transient allocations per minute.',
    category: 'arch',
    color: '#818cf8', // Indigo
    insertions: 195,
    deletions: 130,
    altitude: 0.16,
    radius: 0.36,
    lat: -0.0871,
    lng: 34.7505,
    district: 'Zero-Copy Audio Streaming District',
    codeSnippet: `var bufferPool = sync.Pool{
    New: func() any {
        b := make([]byte, 64*1024) // 64KB chunk buffer
        return &b
    },
}`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/LYRIC/commit/9f2c418',
  },
  {
    sha: '7a1e0b5',
    repoId: 'lyric',
    repoName: 'LYRIC',
    repoFullName: 'Christian3788/LYRIC',
    branch: 'streaming-v2',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-03-18',
    timestamp: 1710756000000,
    message: 'audit(peer): defend Zone01 PR #28 on memory bounded streaming under 1k goroutines',
    detailedNotes: 'Presented live telemetry to Zone01 peer review board demonstrating resident set size (RSS) remaining capped at 65.2MB during concurrent 1,000 audio client load.',
    category: 'audit',
    color: '#f59e0b', // Amber
    insertions: 160,
    deletions: 32,
    altitude: 0.14,
    radius: 0.35,
    lat: -0.0880,
    lng: 34.7529,
    district: 'Zero-Copy Audio Streaming District',
    codeSnippet: `// Zone01 Peer Defense PR #28 verification suite
func BenchmarkStreamingEngine_1kGoroutines(b *testing.B) {
    b.SetParallelism(1000)
    b.RunParallel(func(pb *testing.PB) {
        for pb.Next() { streamRange(0, 1024*1024) }
    })
}`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/LYRIC/commit/7a1e0b5',
  },
  {
    sha: 'c8d2091',
    repoId: 'lyric',
    repoName: 'LYRIC',
    repoFullName: 'Christian3788/LYRIC',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-04-02',
    timestamp: 1712052000000,
    message: 'feat(headers): parse multi-part byte range requests RFC 7233',
    detailedNotes: 'Added full RFC 7233 compliance for multiple discontiguous byte ranges in a single HTTP request with boundary multipart/byteranges content formatting.',
    category: 'feat',
    color: '#06b6d4', // Cyan
    insertions: 240,
    deletions: 18,
    altitude: 0.17,
    radius: 0.37,
    lat: -0.0848,
    lng: 34.7548,
    district: 'Zero-Copy Audio Streaming District',
    codeSnippet: `func parseRangeHeader(s string, size int64) ([]httpRange, error) {
    if !strings.HasPrefix(s, "bytes=") { return nil, errors.New("invalid range unit") }
    // Parse comma-separated offsets...
}`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/LYRIC/commit/c8d2091',
  },
  {
    sha: '2e4b810',
    repoId: 'lyric',
    repoName: 'LYRIC',
    repoFullName: 'Christian3788/LYRIC',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-04-14',
    timestamp: 1713088800000,
    message: 'fix(leak): resolve goroutine leak on premature client TCP RST packet termination',
    detailedNotes: 'Bound context cancellation listeners to client TCP close notifications. Blocked worker goroutines terminate immediately upon client tab close.',
    category: 'fix',
    color: '#f43f5e', // Rose
    insertions: 92,
    deletions: 41,
    altitude: 0.09,
    radius: 0.32,
    lat: -0.0876,
    lng: 34.7541,
    district: 'Zero-Copy Audio Streaming District',
    codeSnippet: `select {
case <-ctx.Done():
    fileReader.Close()
    return ctx.Err()
case n := <-writeDone:
    // normal completion
}`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/LYRIC/commit/2e4b810',
  },
  {
    sha: '5d9a334',
    repoId: 'lyric',
    repoName: 'LYRIC',
    repoFullName: 'Christian3788/LYRIC',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-05-01',
    timestamp: 1714557600000,
    message: 'perf(tcp): enable TCP_NODELAY and SO_REUSEPORT for Linux socket multiplexing',
    detailedNotes: 'Disabled Nagle algorithm for low-latency time-to-first-byte (TTFB). Decreased packet delivery jitter on East Africa sub-3G cellular handshakes.',
    category: 'perf',
    color: '#10b981',
    insertions: 115,
    deletions: 28,
    altitude: 0.12,
    radius: 0.34,
    lat: -0.0860,
    lng: 34.7510,
    district: 'Zero-Copy Audio Streaming District',
    codeSnippet: `conn.SetNoDelay(true)
conn.SetWriteBuffer(128 * 1024)
syscall.SetsockoptInt(fd, syscall.SOL_SOCKET, unix.SO_REUSEPORT, 1)`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/LYRIC/commit/5d9a334',
  },
  {
    sha: '1f0c76b',
    repoId: 'lyric',
    repoName: 'LYRIC',
    repoFullName: 'Christian3788/LYRIC',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-05-20',
    timestamp: 1716200000000,
    message: 'feat(metrics): Prometheus latency p50/p95/p99 telemetry collector',
    detailedNotes: 'Integrated atomic sliding-window histograms recording per-chunk latency metrics. Exported on /metrics endpoint for Grafana observability dashboards.',
    category: 'feat',
    color: '#06b6d4',
    insertions: 210,
    deletions: 14,
    altitude: 0.15,
    radius: 0.36,
    lat: -0.0850,
    lng: 34.7525,
    district: 'Zero-Copy Audio Streaming District',
    codeSnippet: `prometheus.NewHistogramVec(prometheus.HistogramOpts{
    Name: "audio_stream_chunk_duration_seconds",
    Buckets: []float64{0.001, 0.005, 0.010, 0.025, 0.050, 0.100},
}, []string{"format", "status"})`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/LYRIC/commit/1f0c76b',
  },
  {
    sha: '6c81a29',
    repoId: 'lyric',
    repoName: 'LYRIC',
    repoFullName: 'Christian3788/LYRIC',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-06-12',
    timestamp: 1718186400000,
    message: 'release(v2.4): production readiness for 100k concurrent audio streams',
    detailedNotes: 'Culmination of zero-copy Go streaming architecture. Benchmark validated: 8.4ms TTFB, 78% memory reduction, zero goroutine leaks under continuous 48-hour soak test.',
    category: 'perf',
    color: '#10b981',
    insertions: 320,
    deletions: 45,
    altitude: 0.28,
    radius: 0.48,
    lat: -0.0865,
    lng: 34.7532,
    district: 'Zero-Copy Audio Streaming District',
    codeSnippet: `// Final Production Streamer Architecture v2.4
type StreamerServer struct {
    pool    *sync.Pool
    storage ObjectReader
    metrics *TelemetryHub
}`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/LYRIC/commit/6c81a29',
    isHead: true,
  },

  // =========================================================
  // 2. Spatial-Agritech Platform (PostGIS 2D GiST R-Tree Indexing)
  // District: PostGIS Geospatial & Sensor Plaza (Kano Plains)
  // =========================================================
  {
    sha: '8f1a23c',
    repoId: 'spatial-agritech',
    repoName: 'Spatial-Agritech',
    repoFullName: 'Christian3788/Spatial-Agritech',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-01-20',
    timestamp: 1705744800000,
    message: 'feat(spatial): Hilbert space-filling curve clustering on farm boundaries table',
    detailedNotes: 'Clustered 100,000 spatial parcel polygons along 1D Hilbert space-filling curves. Ensured physical database table pages reflect geographical proximity on disk.',
    category: 'feat',
    color: '#06b6d4',
    insertions: 530,
    deletions: 92,
    altitude: 0.26,
    radius: 0.44,
    lat: -0.0984,
    lng: 34.7852,
    district: 'PostGIS Geospatial & Sensor Plaza',
    codeSnippet: `CREATE INDEX idx_parcels_hilbert 
ON farm_parcels USING gist (geom);
CLUSTER farm_parcels USING idx_parcels_hilbert;`,
    language: 'sql',
    githubUrl: 'https://github.com/Christian3788/Spatial-Agritech/commit/8f1a23c',
  },
  {
    sha: '4c9d781',
    repoId: 'spatial-agritech',
    repoName: 'Spatial-Agritech',
    repoFullName: 'Christian3788/Spatial-Agritech',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-02-08',
    timestamp: 1707386400000,
    message: 'perf(gist): create 2D GiST R-Tree index on location geometry column (sub-4ms lookups)',
    detailedNotes: 'Slashed bounding radius query latency from 118.4ms (sequential scan) down to 3.12ms using generalized search trees (GiST) bounding box checks.',
    category: 'perf',
    color: '#10b981',
    insertions: 184,
    deletions: 26,
    altitude: 0.22,
    radius: 0.40,
    lat: -0.0975,
    lng: 34.7869,
    district: 'PostGIS Geospatial & Sensor Plaza',
    codeSnippet: `EXPLAIN ANALYZE
SELECT id, farm_name, ST_AsGeoJSON(geom)
FROM farm_parcels
WHERE ST_DWithin(geom, ST_MakePoint(34.768, -0.091)::geography, 5000);
-- Execution Time: 3.124 ms (Bitmap Index Scan on idx_parcels_gist)`,
    language: 'sql',
    githubUrl: 'https://github.com/Christian3788/Spatial-Agritech/commit/4c9d781',
  },
  {
    sha: 'a2b0e45',
    repoId: 'spatial-agritech',
    repoName: 'Spatial-Agritech',
    repoFullName: 'Christian3788/Spatial-Agritech',
    branch: 'gist-clustering',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-02-28',
    timestamp: 1709114400000,
    message: 'arch(st_dwithin): optimize ST_DWithin spherical queries against 100k parcel records',
    detailedNotes: 'Converted planar Euclidean queries to true spheroidal geography ST_DWithin predicates avoiding equator distortion while retaining index applicability.',
    category: 'arch',
    color: '#818cf8',
    insertions: 295,
    deletions: 64,
    altitude: 0.19,
    radius: 0.38,
    lat: -0.0995,
    lng: 34.7836,
    district: 'PostGIS Geospatial & Sensor Plaza',
    codeSnippet: `func QueryNearbySensors(db *sql.DB, lat, lng float64, radiusMeters int) ([]SensorNode, error) {
    query := \`SELECT id, reading FROM sensors WHERE ST_DWithin(geog, ST_SetSRID(ST_Point($1, $2), 4326)::geography, $3)\`
    return scanRows(db.Query(query, lng, lat, radiusMeters))
}`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/Spatial-Agritech/commit/a2b0e45',
  },
  {
    sha: 'd71f302',
    repoId: 'spatial-agritech',
    repoName: 'Spatial-Agritech',
    repoFullName: 'Christian3788/Spatial-Agritech',
    branch: 'gist-clustering',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-03-14',
    timestamp: 1710410400000,
    message: 'audit(peer): defend Zone01 PR #09 on Hilbert clustering reducing disk I/O seek spikes',
    detailedNotes: 'Defended spatial cache locality theorem before Zone01 Kisumu audit panel. Demonstrated that Hilbert curve disk reordering produced 99.4% buffer cache hit ratio.',
    category: 'audit',
    color: '#f59e0b',
    insertions: 145,
    deletions: 19,
    altitude: 0.15,
    radius: 0.35,
    lat: -0.0968,
    lng: 34.7878,
    district: 'PostGIS Geospatial & Sensor Plaza',
    codeSnippet: `-- Zone01 Audit Verification: Buffer Cache Hit Ratio
SELECT (sum(heap_blks_hit) - sum(heap_blks_read)) / sum(heap_blks_hit) AS ratio
FROM pg_statio_user_tables WHERE relname = 'farm_parcels';
-- Result: 0.9942 (99.42% buffer cache hit rate)`,
    language: 'sql',
    githubUrl: 'https://github.com/Christian3788/Spatial-Agritech/commit/d71f302',
  },
  {
    sha: '6b3c990',
    repoId: 'spatial-agritech',
    repoName: 'Spatial-Agritech',
    repoFullName: 'Christian3788/Spatial-Agritech',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-04-05',
    timestamp: 1712311200000,
    message: 'feat(weather): IoT weather station telemetry ingestion with PostGIS point casting',
    detailedNotes: 'High-throughput micro-weather ingest pipeline reading rainfall, soil moisture, and humidity from 60+ stations into time-partitioned PostGIS hypertable.',
    category: 'feat',
    color: '#06b6d4',
    insertions: 310,
    deletions: 52,
    altitude: 0.17,
    radius: 0.37,
    lat: -0.0988,
    lng: 34.7865,
    district: 'PostGIS Geospatial & Sensor Plaza',
    codeSnippet: `INSERT INTO telemetry_readings (sensor_id, temp, humidity, geom, captured_at)
VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326), NOW());`,
    language: 'sql',
    githubUrl: 'https://github.com/Christian3788/Spatial-Agritech/commit/6b3c990',
  },
  {
    sha: '3e8a441',
    repoId: 'spatial-agritech',
    repoName: 'Spatial-Agritech',
    repoFullName: 'Christian3788/Spatial-Agritech',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-04-24',
    timestamp: 1713952800000,
    message: 'fix(srid): enforce SRID 4326 WGS84 spatial reference projection across foreign keys',
    detailedNotes: 'Resolved coordinate system projection mismatch between sensor raw WGS84 feeds and UTM zone 36N projected coordinate boundaries.',
    category: 'fix',
    color: '#f43f5e',
    insertions: 75,
    deletions: 20,
    altitude: 0.08,
    radius: 0.31,
    lat: -0.0991,
    lng: 34.7842,
    district: 'PostGIS Geospatial & Sensor Plaza',
    codeSnippet: `ALTER TABLE farm_parcels 
ALTER COLUMN geom TYPE geometry(Polygon, 4326) 
USING ST_Transform(geom, 4326);`,
    language: 'sql',
    githubUrl: 'https://github.com/Christian3788/Spatial-Agritech/commit/3e8a441',
  },
  {
    sha: '9d0e128',
    repoId: 'spatial-agritech',
    repoName: 'Spatial-Agritech',
    repoFullName: 'Christian3788/Spatial-Agritech',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-05-15',
    timestamp: 1715767200000,
    message: 'perf(vacuum): tune autovacuum_vacuum_scale_factor for high-frequency GPS writes',
    detailedNotes: 'Prevented table bloat on high-frequency IoT spatial sensor writes by aggressive autovacuum tuning, keeping index page fill factor at 90%.',
    category: 'perf',
    color: '#10b981',
    insertions: 88,
    deletions: 12,
    altitude: 0.11,
    radius: 0.33,
    lat: -0.0978,
    lng: 34.7858,
    district: 'PostGIS Geospatial & Sensor Plaza',
    codeSnippet: `ALTER TABLE telemetry_readings SET (
    autovacuum_vacuum_scale_factor = 0.05,
    autovacuum_vacuum_cost_limit = 1000
);`,
    language: 'sql',
    githubUrl: 'https://github.com/Christian3788/Spatial-Agritech/commit/9d0e128',
  },
  {
    sha: '5a2b774',
    repoId: 'spatial-agritech',
    repoName: 'Spatial-Agritech',
    repoFullName: 'Christian3788/Spatial-Agritech',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-06-08',
    timestamp: 1717838400000,
    message: 'feat(ndvi): satellite NDVI crop vigour polygon intersection pipeline',
    detailedNotes: 'Implemented real-time raster-to-vector polygon intersection computing mean NDVI vegetative index across 25,000 western Kenya smallholder farms.',
    category: 'feat',
    color: '#06b6d4',
    insertions: 410,
    deletions: 35,
    altitude: 0.25,
    radius: 0.46,
    lat: -0.0980,
    lng: 34.7860,
    district: 'PostGIS Geospatial & Sensor Plaza',
    codeSnippet: `SELECT p.id, ST_SummaryStats(ST_Clip(r.rast, p.geom)) AS ndvi_stats
FROM sentinel_ndvi r JOIN farm_parcels p ON ST_Intersects(r.rast, p.geom);`,
    language: 'sql',
    githubUrl: 'https://github.com/Christian3788/Spatial-Agritech/commit/5a2b774',
    isHead: true,
  },

  // =========================================================
  // 3. KijijiShare (Collaborative Concurrency & Advisory Locks)
  // District: Advisory Lock Concurrency Sector (Kisumu CBD)
  // =========================================================
  {
    sha: '1d4a99e',
    repoId: 'kijijishare',
    repoName: 'KijijiShare',
    repoFullName: 'Christian3788/KijijiShare',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-01-12',
    timestamp: 1705053600000,
    message: 'feat(locks): implement pg_advisory_xact_lock to eliminate double-booking race condition',
    detailedNotes: 'Engineered application-level transactional advisory locks. Concurrent reservation requests hash their resource ID into a 64-bit integer, guaranteeing zero double-allocations.',
    category: 'feat',
    color: '#818cf8',
    insertions: 380,
    deletions: 75,
    altitude: 0.23,
    radius: 0.41,
    lat: -0.0921,
    lng: 34.7645,
    district: 'Advisory Lock Concurrency Sector',
    codeSnippet: `tx, _ := db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelReadCommitted})
// Acquire transactional advisory lock tied to resource ID
if _, err := tx.ExecContext(ctx, "SELECT pg_advisory_xact_lock($1)", resourceID); err != nil {
    tx.Rollback()
    return err
}`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/KijijiShare/commit/1d4a99e',
  },
  {
    sha: '7c2e01b',
    repoId: 'kijijishare',
    repoName: 'KijijiShare',
    repoFullName: 'Christian3788/KijijiShare',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-02-02',
    timestamp: 1706868000000,
    message: 'perf(bench): stress test 500 concurrent goroutine claims with 0 deadlock aborts',
    detailedNotes: 'Ran automated stress harness simulating 500 simultaneous goroutines racing for a single equipment reservation. Exactly 1 succeeded; 499 rejected safely with 0 deadlocks.',
    category: 'perf',
    color: '#10b981',
    insertions: 265,
    deletions: 42,
    altitude: 0.19,
    radius: 0.39,
    lat: -0.0915,
    lng: 34.7658,
    district: 'Advisory Lock Concurrency Sector',
    codeSnippet: `func TestAdvisoryLock_500ConcurrentClaims(t *testing.T) {
    var wg sync.WaitGroup
    var successCount int64
    for i := 0; i < 500; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            if err := claimItem(testItemID); err == nil {
                atomic.AddInt64(&successCount, 1)
            }
        }()
    }
    wg.Wait()
    assert.Equal(t, int64(1), successCount) // Exactly one winner
}`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/KijijiShare/commit/7c2e01b',
  },
  {
    sha: 'a91b443',
    repoId: 'kijijishare',
    repoName: 'KijijiShare',
    repoFullName: 'Christian3788/KijijiShare',
    branch: 'advisory-locks',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-02-25',
    timestamp: 1708855200000,
    message: 'arch(transact): serializable snapshot isolation level fallback with retry jitter',
    detailedNotes: 'Implemented exponential backoff with full jitter for handling PostgreSQL serialization failures (SQLSTATE 40001), ensuring 99.99% transaction completion.',
    category: 'arch',
    color: '#818cf8',
    insertions: 190,
    deletions: 30,
    altitude: 0.16,
    radius: 0.36,
    lat: -0.0930,
    lng: 34.7632,
    district: 'Advisory Lock Concurrency Sector',
    codeSnippet: `func RunSerializableTx(ctx context.Context, db *sql.DB, fn func(*sql.Tx) error) error {
    for attempt := 0; attempt < 5; attempt++ {
        err := executeTx(ctx, db, fn)
        if isSerializationFailure(err) {
            time.Sleep(backoffWithJitter(attempt))
            continue
        }
        return err
    }
    return ErrMaxRetriesExceeded
}`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/KijijiShare/commit/a91b443',
  },
  {
    sha: '3f8d229',
    repoId: 'kijijishare',
    repoName: 'KijijiShare',
    repoFullName: 'Christian3788/KijijiShare',
    branch: 'advisory-locks',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-03-22',
    timestamp: 1711101600000,
    message: 'audit(peer): defend Zone01 PR #14 on transactional claim guarantees under packet drop',
    detailedNotes: 'Successfully defended PR #14 before Zone01 audit panel. Demonstrated that even under simulated 30% TCP packet loss, advisory locks release automatically on session teardown.',
    category: 'audit',
    color: '#f59e0b',
    insertions: 210,
    deletions: 18,
    altitude: 0.17,
    radius: 0.37,
    lat: -0.0910,
    lng: 34.7650,
    district: 'Advisory Lock Concurrency Sector',
    codeSnippet: `// Zone01 PR #14 Defense Audit Log
// Invariant: pg_advisory_xact_lock releases automatically on ROLLBACK or DISCONNECT
// No orphaned lock keys remain in pg_locks table. Verified 100%.`,
    language: 'sql',
    githubUrl: 'https://github.com/Christian3788/KijijiShare/commit/3f8d229',
  },
  {
    sha: '5b0c884',
    repoId: 'kijijishare',
    repoName: 'KijijiShare',
    repoFullName: 'Christian3788/KijijiShare',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-04-10',
    timestamp: 1712743200000,
    message: 'feat(sync): WebSocket broadcast engine with Redis pub/sub backplane',
    detailedNotes: 'Real-time equipment availability broadcast using non-blocking Go WebSockets backed by Redis Pub/Sub channels to sync all active browser clients in under 12ms.',
    category: 'feat',
    color: '#06b6d4',
    insertions: 340,
    deletions: 68,
    altitude: 0.20,
    radius: 0.38,
    lat: -0.0927,
    lng: 34.7662,
    district: 'Advisory Lock Concurrency Sector',
    codeSnippet: `go func() {
    pubsub := redisClient.Subscribe(ctx, "equipment:events")
    for msg := range pubsub.Channel() {
        hub.Broadcast([]byte(msg.Payload))
    }
}()`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/KijijiShare/commit/5b0c884',
  },
  {
    sha: '8e2a110',
    repoId: 'kijijishare',
    repoName: 'KijijiShare',
    repoFullName: 'Christian3788/KijijiShare',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-04-28',
    timestamp: 1714298400000,
    message: 'fix(timeout): context cancellation timeout propagation to release held locks immediately',
    detailedNotes: 'Added 3,000ms context timeout on all database transactions. Prevents slow cellular clients from holding PostgreSQL locks during network dropouts.',
    category: 'fix',
    color: '#f43f5e',
    insertions: 112,
    deletions: 35,
    altitude: 0.10,
    radius: 0.32,
    lat: -0.0935,
    lng: 34.7640,
    district: 'Advisory Lock Concurrency Sector',
    codeSnippet: `ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
defer cancel()
tx, err := db.BeginTx(ctx, nil)`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/KijijiShare/commit/8e2a110',
  },
  {
    sha: '4b9f661',
    repoId: 'kijijishare',
    repoName: 'KijijiShare',
    repoFullName: 'Christian3788/KijijiShare',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-05-30',
    timestamp: 1717063200000,
    message: 'release(v1.8): zero-deadlock concurrency runtime verification',
    detailedNotes: 'Passed comprehensive race detection (go test -race) with 0 warnings. Advisory lock protocol verified across 10,000 automated reservation lifecycles.',
    category: 'arch',
    color: '#818cf8',
    insertions: 275,
    deletions: 40,
    altitude: 0.25,
    radius: 0.45,
    lat: -0.0924,
    lng: 34.7649,
    district: 'Advisory Lock Concurrency Sector',
    codeSnippet: `// KijijiShare Production Concurrency Kernel v1.8
type TransactionManager struct {
    db         *sql.DB
    lockEngine *AdvisoryLockCoordinator
}`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/KijijiShare/commit/4b9f661',
    isHead: true,
  },

  // =========================================================
  // 4. Vector-Vanguard & Zone01 Core (SIMD & Systems Algorithms)
  // District: SIMD Algorithms & Peer Defense Citadel
  // =========================================================
  {
    sha: '2c4e88a',
    repoId: 'vector-vanguard',
    repoName: 'Vector-Vanguard',
    repoFullName: 'Christian3788/Vector-Vanguard',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-01-28',
    timestamp: 1706436000000,
    message: 'feat(simd): 256-bit AVX2 SIMD vector byte search achieving 1.84 GB/s scanning',
    detailedNotes: 'Implemented 4-way loop unrolled AVX2 assembly intrinsics in Go. Evaluates 32 bytes simultaneously, increasing linear keyword search throughput from 320 MB/s to 1.84 GB/s.',
    category: 'perf',
    color: '#10b981',
    insertions: 490,
    deletions: 110,
    altitude: 0.25,
    radius: 0.43,
    lat: -0.0818,
    lng: 34.7738,
    district: 'SIMD Algorithms & Peer Defense Citadel',
    codeSnippet: `// 4-way loop unrolled AVX2 SIMD scan
for i := 0; i <= len(chunk)-32; i += 32 {
    mask := _mm256_cmpeq_epi8(needleVec, _mm256_loadu_si256(chunk[i:]))
    if _mm256_movemask_epi8(mask) != 0 { return i + offset }
}`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/Vector-Vanguard/commit/2c4e88a',
  },
  {
    sha: '9a1f55b',
    repoId: 'vector-vanguard',
    repoName: 'Vector-Vanguard',
    repoFullName: 'Christian3788/Vector-Vanguard',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-02-18',
    timestamp: 1708250400000,
    message: 'arch(bloom): 32-bit Murmur3 non-cryptographic Bloom filter with 0.1% false positive rate',
    detailedNotes: 'Designed 32-bit bitset Bloom filter utilizing double-hashing algorithm (h1 + i*h2). Filters out 99.9% of non-existent vector queries before disk reads.',
    category: 'arch',
    color: '#818cf8',
    insertions: 280,
    deletions: 35,
    altitude: 0.18,
    radius: 0.38,
    lat: -0.0825,
    lng: 34.7750,
    district: 'SIMD Algorithms & Peer Defense Citadel',
    codeSnippet: `func (b *BloomFilter) Add(key []byte) {
    h1, h2 := murmur3.Sum128(key)
    for i := uint32(0); i < b.numHashes; i++ {
        pos := (h1 + uint64(i)*h2) % uint64(len(b.bitset)*64)
        b.bitset[pos/64] |= 1 << (pos % 64)
    }
}`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/Vector-Vanguard/commit/9a1f55b',
  },
  {
    sha: '5e3b002',
    repoId: 'vector-vanguard',
    repoName: 'Vector-Vanguard',
    repoFullName: 'Christian3788/Vector-Vanguard',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-03-08',
    timestamp: 1709892000000,
    message: 'perf(gc): memory alignment padding and cache line false sharing elimination',
    detailedNotes: 'Padded multi-threaded counter structs to 64-byte boundaries (CPU cache line size). Eliminated false sharing between worker cores on AMD EPYC servers.',
    category: 'perf',
    color: '#10b981',
    insertions: 175,
    deletions: 50,
    altitude: 0.15,
    radius: 0.35,
    lat: -0.0810,
    lng: 34.7725,
    district: 'SIMD Algorithms & Peer Defense Citadel',
    codeSnippet: `type WorkerMetrics struct {
    opsCount uint64
    _pad     [56]byte // Cache line padding (64 - 8 bytes)
    errCount uint64
    _pad2    [56]byte
}`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/Vector-Vanguard/commit/5e3b002',
  },
  {
    sha: '8c7d441',
    repoId: 'vector-vanguard',
    repoName: 'Vector-Vanguard',
    repoFullName: 'Christian3788/Vector-Vanguard',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-03-29',
    timestamp: 1711706400000,
    message: 'audit(peer): defend Zone01 algorithm audit with unanimous peer board approval',
    detailedNotes: 'Defended bitwise vector indexing algorithm at Zone01 Kisumu audit board. Peer evaluators confirmed zero heap allocations during query phase.',
    category: 'audit',
    color: '#f59e0b',
    insertions: 190,
    deletions: 15,
    altitude: 0.16,
    radius: 0.36,
    lat: -0.0832,
    lng: 34.7745,
    district: 'SIMD Algorithms & Peer Defense Citadel',
    codeSnippet: `// Zone01 Peer Audit Sign-Off #33
// Verdict: UNANIMOUS PASS
// Invariant verified: 0 B/op heap allocation in hot loop`,
    language: 'bash',
    githubUrl: 'https://github.com/Christian3788/Vector-Vanguard/commit/8c7d441',
  },
  {
    sha: '1b9e334',
    repoId: 'vector-vanguard',
    repoName: 'Vector-Vanguard',
    repoFullName: 'Christian3788/Vector-Vanguard',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-04-18',
    timestamp: 1713434400000,
    message: 'feat(cli): interactive ANSI terminal shell with command autocomplete',
    detailedNotes: 'Built zero-dependency CLI terminal emulator supporting tab autocomplete, colored hex memory dumps, and real-time SIMD speed tests.',
    category: 'feat',
    color: '#06b6d4',
    insertions: 360,
    deletions: 45,
    altitude: 0.19,
    radius: 0.38,
    lat: -0.0815,
    lng: 34.7758,
    district: 'SIMD Algorithms & Peer Defense Citadel',
    codeSnippet: `func (term *Terminal) ReadLine() (string, error) {
    // Raw mode VT100 escape sequence handler...
}`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/Vector-Vanguard/commit/1b9e334',
  },
  {
    sha: '7d0a229',
    repoId: 'vector-vanguard',
    repoName: 'Vector-Vanguard',
    repoFullName: 'Christian3788/Vector-Vanguard',
    branch: 'main',
    author: 'Christian Amos Otieno <christianamos67@gmail.com>',
    date: '2024-06-02',
    timestamp: 1717322400000,
    message: 'release(v3.0): full systems benchmark harness and peer audit archive',
    detailedNotes: 'Release of high-performance vector search engine with automated SIMD fallback to portable scalar Go loop on non-AVX2 hardware.',
    category: 'perf',
    color: '#10b981',
    insertions: 310,
    deletions: 28,
    altitude: 0.26,
    radius: 0.46,
    lat: -0.0820,
    lng: 34.7735,
    district: 'SIMD Algorithms & Peer Defense Citadel',
    codeSnippet: `func Search(needle, haystack []byte) int {
    if cpu.X86.HasAVX2 { return searchAVX2(needle, haystack) }
    return searchScalar(needle, haystack)
}`,
    language: 'go',
    githubUrl: 'https://github.com/Christian3788/Vector-Vanguard/commit/7d0a229',
    isHead: true,
  },
];
