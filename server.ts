import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

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
  } catch (err: unknown) {
    console.error('Error in /api/assistant:', err);
    return res.json({
      answer: `Christian Amos Otieno is a systems engineer specializing in low-overhead Go HTTP 206 streaming, PostGIS GiST spatial indexing, and Zone01 peer-defended architectures. Direct inquiries can be dispatched to christianamos67@gmail.com.`,
      spokenText: `Christian specializes in Go streaming and PostGIS systems. You can email him at christianamos67@gmail.com.`,
    });
  }
});

// 2. Dynamic Infinite Scroll Content Generation Endpoint
app.post('/api/generate-content', async (req, res) => {
  try {
    const { cursor = 0, tag = 'all' } = req.body;

    if (!ai) {
      return res.json({
        items: [
          {
            id: `log-${cursor}-fallback`,
            title: `Engineering Log #${cursor + 1}: Linux epoll Network Poller in Go`,
            category: 'Systems & Kernel I/O',
            date: 'Recent Dispatch',
            readTime: '4 min read',
            tag: '#go',
            excerpt: 'Analyzing how the Go runtime integrates epoll on Linux to park blocked goroutines without preempting OS worker threads.',
            technicalDeepDive: 'By multiplexing I/O readiness notifications directly into the runtime netpoller, Go achieves asynchronous network throughput while exposing simple synchronous socket APIs.',
            codeSnippet: `// Linux epoll netpoll abstraction in Go runtime\nfunc netpoll(delay int64) gList {\n    var events [128]epollevent\n    n := epollwait(epfd, &events[0], int32(len(events)), int32(delay))\n    // Unpark runnable goroutines without thread preemption\n}`,
            language: 'go',
            architectureTakeaway: 'Avoid blocking OS threads; delegate non-blocking socket state transitions to kernel edge-triggered event queues.',
          },
        ],
      });
    }

    const prompt = `Generate a realistic, deep-dive software engineering dispatch for Christian Amos Otieno's portfolio (focus on Go, PostGIS, Linux networking, SIMD, or memory optimization).
Tag filter: ${tag}. Content sequence number: ${cursor + 1}.
Respond with valid JSON conforming to:
{
  "title": "Clear technical title",
  "category": "Systems Architecture | Database Optimization | Network I/O | Memory Layout",
  "date": "Technical Memo",
  "readTime": "3 min read",
  "tag": "#go | #databases | #systems | #algorithms",
  "excerpt": "A 1-2 sentence overview of the architectural trade-off",
  "technicalDeepDive": "A rigorous 2-3 sentence explanation of the invariant, benchmark delta, or hardware mechanics",
  "codeSnippet": "5-10 lines of realistic Go, SQL, or TypeScript code demonstrating the solution",
  "language": "go | sql | typescript",
  "architectureTakeaway": "One sentence practical rule for engineering leads"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const item = {
      id: `dyn-log-${Date.now()}-${cursor}`,
      title: parsed.title || `Engineering Log #${cursor + 1}: Low-Latency Systems Protocol`,
      category: parsed.category || 'Systems Architecture',
      date: parsed.date || 'Technical Memo',
      readTime: parsed.readTime || '3 min read',
      tag: parsed.tag || (tag !== 'all' ? `#${tag}` : '#systems'),
      excerpt: parsed.excerpt || 'Exploring high-throughput concurrency models and memory allocation boundaries.',
      technicalDeepDive: parsed.technicalDeepDive || 'Memory allocation profiling reveals significant reductions in GC frequency when using sync.Pool for buffer reuse.',
      codeSnippet: parsed.codeSnippet || '// sync.Pool buffer reuse pattern\nvar bufPool = sync.Pool{\n    New: func() any { return make([]byte, 64*1024) },\n}',
      language: parsed.language || 'go',
      architectureTakeaway: parsed.architectureTakeaway || 'Constrain memory allocations in hot loops to eliminate garbage collector latency spikes.',
    };

    return res.json({ items: [item] });
  } catch (err: unknown) {
    console.error('Error in /api/generate-content:', err);
    return res.json({
      items: [
        {
          id: `log-${Date.now()}`,
          title: `Technical Memo: Zero-Allocation Buffer Pooling in Go`,
          category: 'Memory Management',
          date: 'Archived Dispatch',
          readTime: '3 min read',
          tag: '#go',
          excerpt: 'Eliminating GC overhead in high-throughput network handlers with sync.Pool byte slice allocation recycling.',
          technicalDeepDive: 'Recycling 64KB buffers across active connections avoids thousands of short-lived allocations per second, keeping p99 response times below 4ms.',
          codeSnippet: `var bufferPool = sync.Pool{\n    New: func() any { return make([]byte, 65536) },\n}`,
          language: 'go',
          architectureTakeaway: 'Always recycle byte slices in sustained streaming paths.',
        },
      ],
    });
  }
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
