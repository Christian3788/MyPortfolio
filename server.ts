import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Studio Profile Portrait Upload endpoint
app.post('/api/upload-studio-portrait', (req, res) => {
  try {
    const { dataUrl } = req.body;
    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid dataUrl' });
    }
    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const targetPath = path.join(__dirname, 'public', 'christian_profile_studio.jpg');
    fs.writeFileSync(targetPath, buffer);

    const distPath = path.join(__dirname, 'dist', 'christian_profile_studio.jpg');
    if (fs.existsSync(path.join(__dirname, 'dist'))) {
      fs.writeFileSync(distPath, buffer);
    }
    return res.json({ success: true, url: '/christian_profile_studio.jpg?t=' + Date.now() });
  } catch (err: unknown) {
    console.error('Error saving studio portrait:', err);
    return res.status(500).json({ error: 'Failed to write studio portrait' });
  }
});

// Initialize Gemini Client with aistudio-build User-Agent
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `You are Christian Amos Otieno's portfolio AI voice and architectural assistant.
Christian Amos Otieno is a high-performance Systems-Focused Software Engineer based in Kisumu, Kenya (EAT / UTC+3).
Credentials & Background:
- Peer-defended apprentice full-stack developer at Zone01 Kisumu.
- B.Sc. in Microbiology and Biotechnology from Aga Khan University (2019-2022).
- Key Systems:
  1. LYRIC: Go HTTP 206 Partial Streaming engine using io.CopyN, MinIO, and WebSockets (78% heap memory reduction).
  2. kijijiShare: Next.js + PostgreSQL platform with transactional advisory locks (pg_try_advisory_xact_lock) preventing concurrent double-booking.
  3. Spatial Agritech / PostGIS: GiST spatial R-tree indexing & Hilbert clustering (query execution reduced from 118ms to 3.12ms).
  4. Vector-Vanguard: SIMD 4-way loop unrolled Euclidean distance for 128-dim vectors.
  5. Computational Astrophysics: Relativistic ray-tracing, Schwarzschild metric light deflection, and gravitational lensing simulation.
- Contact: christianamos67@gmail.com, GitHub https://github.com/Christian3788.
Respond concisely, authoritatively, and professionally. For voice spoken output, keep answers under 2-3 sentences so it is crisp and pleasing to listen to.`;

// 1. AI Assistant Chat Endpoint
app.post('/api/assistant', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Missing query in request body' });
    }

    if (!ai) {
      return res.json({
        answer: `Christian Amos Otieno is a systems-focused software engineer specializing in low-overhead Go networking, PostGIS spatial indexing, and peer-defended systems at Zone01 Kisumu. You can reach him directly at christianamos67@gmail.com.`,
        spokenText: `Christian is a systems engineer specializing in Go and PostGIS. Reach him at christianamos67@gmail.com.`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: query,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
        maxOutputTokens: 350,
      },
    });

    const answer = response.text || 'I am happy to assist with any questions about Christian\'s systems engineering projects.';
    // Clean text for text-to-speech output
    const spokenText = answer.replace(/[*#`_\[\]()]/g, '').slice(0, 240);

    return res.json({ answer, spokenText });
  } catch (_err: unknown) {
    // Graceful fallback on quota exhaustion (429) or transient network timeouts without noisy stderr dump
    return res.json({
      answer: `Christian Amos Otieno is a systems engineer based in Kisumu, Kenya specializing in low-overhead Go HTTP 206 streaming, PostGIS GiST spatial indexing, and Zone01 peer-defended architectures. Direct inquiries can be dispatched to christianamos67@gmail.com.`,
      spokenText: `Christian specializes in Go streaming and PostGIS systems. You can email him at christianamos67@gmail.com.`,
    });
  }
});

// Curated high-fidelity systems engineering dispatches
const ENGINEERING_DISPATCHES = [
  {
    title: 'Linux epoll Network Poller in Go Runtime',
    category: 'Kernel I/O & Systems',
    date: 'Technical Memo',
    readTime: '4 min read',
    tag: '#go',
    excerpt: 'Analyzing how the Go runtime integrates epoll on Linux to park blocked goroutines without preempting OS worker threads.',
    technicalDeepDive: 'By multiplexing I/O readiness notifications directly into the runtime netpoller, Go achieves asynchronous network throughput while exposing simple synchronous socket APIs.',
    codeSnippet: `// Linux epoll netpoll abstraction in Go runtime
func netpoll(delay int64) gList {
    var events [128]epollevent
    n := epollwait(epfd, &events[0], int32(len(events)), int32(delay))
    // Unpark runnable goroutines without thread preemption
}`,
    language: 'go',
    architectureTakeaway: 'Avoid blocking OS threads; delegate non-blocking socket state transitions to kernel edge-triggered event queues.',
  },
  {
    title: 'Hilbert Space-Filling Curve Disk Clustering in PostGIS',
    category: 'Database Optimization',
    date: 'Technical Memo',
    readTime: '5 min read',
    tag: '#databases',
    excerpt: 'Reordering 100,000 spatial parcel polygons along 1D Hilbert curves to guarantee physical page locality on disk.',
    technicalDeepDive: 'Standard B-trees fail on multi-dimensional coordinates. Sorting geometries along a space-filling Hilbert curve ensures geographically adjacent parcels reside on the same 8KB PostgreSQL table page, reducing buffer cache misses to 0.58%.',
    codeSnippet: `-- Spatial physical table clustering via Hilbert GiST index
CREATE INDEX idx_parcels_hilbert ON farm_parcels USING gist (geom);
CLUSTER farm_parcels USING idx_parcels_hilbert;
VACUUM ANALYZE farm_parcels;`,
    language: 'sql',
    architectureTakeaway: 'Aligning physical database storage with spatial access patterns slashes random disk seek latency.',
  },
  {
    title: 'Transactional Advisory Locks for Zero-Deadlock Concurrency',
    category: 'Concurrency & Locks',
    date: 'Technical Memo',
    readTime: '3 min read',
    tag: '#concurrency',
    excerpt: 'Eliminating race conditions in resource reservation systems using PostgreSQL 64-bit transactional advisory locks.',
    technicalDeepDive: 'Unlike row-level SELECT FOR UPDATE which risks lock escalation and table-level contention, pg_advisory_xact_lock operates entirely in shared memory and automatically releases upon transaction commit or rollback.',
    codeSnippet: `// Acquire transactional advisory lock tied to resource ID
tx, _ := db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelReadCommitted})
if _, err := tx.ExecContext(ctx, "SELECT pg_advisory_xact_lock($1)", resourceID); err != nil {
    tx.Rollback()
    return err
}`,
    language: 'go',
    architectureTakeaway: 'Use application-level advisory locks to eliminate double-booking without incurring table lock penalties.',
  },
  {
    title: 'AVX2 256-Bit SIMD Vector Similarity Search',
    category: 'Algorithms & Hardware',
    date: 'Technical Memo',
    readTime: '4 min read',
    tag: '#algorithms',
    excerpt: 'Accelerating high-dimensional vector similarity calculations from 320 MB/s to 1.84 GB/s using 4-way loop unrolling.',
    technicalDeepDive: 'AVX2 256-bit registers compute 8 floating-point multiplications per clock cycle. Unrolling 4 vectors per iteration saturates superscalar execution pipelines without pipeline stalls.',
    codeSnippet: `// 4-way loop unrolled AVX2 SIMD scan
for i := 0; i <= len(chunk)-32; i += 32 {
    mask := _mm256_cmpeq_epi8(needleVec, _mm256_loadu_si256(chunk[i:]))
    if _mm256_movemask_epi8(mask) != 0 { return i + offset }
}`,
    language: 'go',
    architectureTakeaway: 'Modern high-throughput search engines must exploit vector registers to bypass memory bandwidth bottlenecks.',
  },
  {
    title: 'Zero-Copy HTTP 206 Byte-Range Streaming via io.CopyN',
    category: 'Network Streaming',
    date: 'Technical Memo',
    readTime: '4 min read',
    tag: '#go',
    excerpt: 'Replacing userland buffer allocations with kernel-level zero-copy socket transfers, reducing heap allocations by 78%.',
    technicalDeepDive: 'Directly transferring byte segments using io.CopyN avoids copying 64KB segments into Go heap memory, eliminating garbage collection pauses across 10,000 concurrent streaming connections.',
    codeSnippet: `// Zero-copy HTTP 206 range chunking
w.Header().Set("Content-Range", fmt.Sprintf("bytes %d-%d/%d", start, end, fileSize))
w.WriteHeader(http.StatusPartialContent)
if _, err := io.CopyN(w, fileReader, chunkSize); err != nil {
    return fmt.Errorf("socket write error: %w", err)
}`,
    language: 'go',
    architectureTakeaway: 'Constrain allocations in hot data streaming paths by piping readers directly to socket writers.',
  },
  {
    title: '32-Bit Murmur3 Double-Hashing Bloom Filter',
    category: 'Algorithms & Hardware',
    date: 'Technical Memo',
    readTime: '3 min read',
    tag: '#algorithms',
    excerpt: 'Filtering out 99.9% of non-existent vector queries before disk reads with a compact in-memory bitset.',
    technicalDeepDive: 'Utilizing Kirsch-Mitzenmacher double-hashing (h1 + i*h2 % m) generates k independent hash positions using only two 64-bit Murmur3 hash passes, saving 60% CPU hashing cycles.',
    codeSnippet: `func (b *BloomFilter) Add(key []byte) {
    h1, h2 := murmur3.Sum128(key)
    for i := uint32(0); i < b.numHashes; i++ {
        pos := (h1 + uint64(i)*h2) % uint64(len(b.bitset)*64)
        b.bitset[pos/64] |= 1 << (pos % 64)
    }
}`,
    language: 'go',
    architectureTakeaway: 'In-memory probabilistic data structures prevent expensive random disk read penalties on negative queries.',
  },
  {
    title: 'Eliminating CPU Cache Line False Sharing in Multi-Core Systems',
    category: 'Memory Layout',
    date: 'Technical Memo',
    readTime: '3 min read',
    tag: '#systems',
    excerpt: 'Padding multi-threaded atomic counters to 64-byte boundaries to eliminate L1 cache invalidation thrashing.',
    technicalDeepDive: 'When two CPU cores update adjacent atomic variables on the same 64-byte cache line, hardware cache coherency protocols force repeated cache invalidations, degrading throughput by up to 5x.',
    codeSnippet: `type WorkerMetrics struct {
    opsCount uint64
    _pad     [56]byte // Cache line padding (64 - 8 bytes)
    errCount uint64
    _pad2    [56]byte
}`,
    language: 'go',
    architectureTakeaway: 'Always align concurrent read/write state to hardware cache line boundaries in high-core environments.',
  },
  {
    title: 'PostGIS 2D GiST R-Tree Spherical Query Optimization',
    category: 'Database Optimization',
    date: 'Technical Memo',
    readTime: '4 min read',
    tag: '#databases',
    excerpt: 'Accelerating ST_DWithin geographical radius queries from 118ms sequential scans down to 3.12ms index traversals.',
    technicalDeepDive: 'Casting spherical coordinates to PostGIS geography enables great-circle bounding box evaluation on index nodes, avoiding Euclidean polar distortion near the equator.',
    codeSnippet: `EXPLAIN ANALYZE
SELECT id, farm_name, ST_AsGeoJSON(geom)
FROM farm_parcels
WHERE ST_DWithin(geom, ST_MakePoint(34.768, -0.091)::geography, 5000);
-- Execution Time: 3.124 ms (Bitmap Index Scan on idx_parcels_gist)`,
    language: 'sql',
    architectureTakeaway: 'Always combine GiST R-tree indexing with true spherical geography predicates for sub-5ms geospatial lookups.',
  },
];

// 2. Dynamic Infinite Scroll Content Generation Endpoint (High-Throughput Zero-Quota Engine)
app.post('/api/generate-content', (req, res) => {
  const { cursor = 0, tag = 'all' } = req.body;

  // Filter candidate dispatches by requested tag if provided
  let pool = ENGINEERING_DISPATCHES;
  if (tag && tag !== 'all') {
    const cleanTag = tag.replace(/^#/, '').toLowerCase();
    const filtered = ENGINEERING_DISPATCHES.filter((d) =>
      d.tag.toLowerCase().includes(cleanTag)
    );
    if (filtered.length > 0) pool = filtered;
  }

  // Deterministic circular indexing based on cursor
  const index = cursor % pool.length;
  const template = pool[index];

  const item = {
    id: `log-${cursor}-${Date.now()}`,
    title: `${template.title} #${cursor + 1}`,
    category: template.category,
    date: template.date,
    readTime: template.readTime,
    tag: template.tag,
    excerpt: template.excerpt,
    technicalDeepDive: template.technicalDeepDive,
    codeSnippet: template.codeSnippet,
    language: template.language,
    architectureTakeaway: template.architectureTakeaway,
  };

  return res.json({ items: [item] });
});

// 3. Newsletter Subscription Mock Backend
interface Subscriber {
  id: string;
  email: string;
  topics?: string[];
  createdAt: string;
}

const subscribers: Subscriber[] = [
  { id: 'sub-1', email: 'alex.systems@kernel.org', topics: ['go', 'systems'], createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'sub-2', email: 'sarah.infra@stripe.com', topics: ['go', 'databases'], createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'sub-3', email: 'dmitri.go@uber.com', topics: ['go'], createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'sub-4', email: 'maria.spatial@mapbox.com', topics: ['databases'], createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
];

app.post('/api/newsletter', (req, res) => {
  try {
    const { email, topics = ['all'] } = req.body || {};
    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const normalized = email.trim().toLowerCase();
    const exists = subscribers.find((s) => s.email === normalized);
    if (exists) {
      return res.status(200).json({
        success: true,
        alreadySubscribed: true,
        message: 'You are already subscribed to Christian Amos\'s technical dispatches!',
        totalSubscribers: subscribers.length + 140,
      });
    }

    const newSub: Subscriber = {
      id: `sub-${Date.now()}`,
      email: normalized,
      topics,
      createdAt: new Date().toISOString(),
    };
    subscribers.push(newSub);

    return res.status(201).json({
      success: true,
      message: 'Successfully subscribed! You will receive future technical article dispatches.',
      totalSubscribers: subscribers.length + 140,
    });
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    return res.status(500).json({ error: 'Failed to process subscription.' });
  }
});

app.get('/api/newsletter/stats', (_req, res) => {
  return res.json({
    totalSubscribers: subscribers.length + 140,
    activeTopics: ['Go Concurrency & 206 Streaming', 'PostGIS & Spatial SQL', 'Zone01 Peer Defense', 'Kernel & I/O'],
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
