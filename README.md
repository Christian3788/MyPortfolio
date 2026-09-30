# Christian Amos Otieno · Systems Software Engineer Portfolio

> **High-Throughput Systems, Low-Overhead Network I/O, Distributed Architectures & Zone01 Peer-Defended Engineering**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-Full--Stack-lightgrey?logo=express)](https://expressjs.com/)
[![Gemini API](https://img.shields.io/badge/Gemini-2.5_Flash-8e75ff?logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A high-performance, interactive portfolio and systems engineering showcase for **Christian Amos Otieno**—a software engineer based in **Kisumu, Kenya (EAT / UTC+3)** specializing in low-overhead Go network streaming, PostGIS spatial indexing, distributed concurrency primitives, and computational astrophysics.

---

## ⚡ Flagship Interactive Features

### 1. Dynamic Infinite Scroll Content Generation (`#engineering-stream`)
- **Endless Systems Dispatches**: Continuous feed delivering deep dives into kernel-level I/O, Go runtime internals (`epoll`, memory allocator mcache/mcentral), spatial indexing, and atomic lock semantics.
- **IntersectionObserver Infinite Trigger**: Automatically requests and loads subsequent technical dispatches as the visitor scrolls, with an on/off auto-scroll toggle and manual load triggers.
- **Category & Tag Filtering**: Seamless filtering across `#go`, `#databases`, and `#systems`.
- **Server-Side Gemini Generation**: Connected to `/api/generate-content` for real-time generative technical log expansions with robust zero-downtime offline fallbacks.
- **Instant Code Copy & Takeaway Architecture Badges**: One-click snippet copying with audio click feedback and structured architectural takeaways.

### 2. Floating AI Voice Assistant (`FloatingAiVoiceAssistant.tsx`)
- **Bidirectional Voice Interaction**:
  - **Speech-to-Text (STT)** via the browser's Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`).
  - **Text-to-Speech (TTS)** via `SpeechSynthesis` with automated voice matching for natural, expressive cadence.
- **Live Audio Waveform Simulation**: Multi-bar animated waveform visualizer reacting during active synthesis and recognition.
- **Gemini Server-Side Intelligence**: Queries `/api/assistant` powered by `gemini-3.8-flash` with Christian's architectural resume, Zone01 defenses, and project benchmarks as system instructions.
- **Instantaneous Offline Fallback**: Responds with zero latency to domain queries regarding LYRIC, PostGIS, Zone01 Kisumu, or contact scheduling even without network connectivity.

### 3. Interactive Systems Benchmark & Stress-Test Lab (`#systems-lab`)
- **Interactive Workload Controls**:
  - **Concurrency Slider**: Scale from 20 up to 1,000 concurrent goroutines.
  - **Payload Size Slider**: Scale simulated transfers from 5MB to 100MB.
- **Two Real-World Benchmark Scenarios**:
  - **Go HTTP 206 Zero-Copy vs. Naive Buffering**: Compares `io.CopyN` directly streaming over TCP sockets vs. in-memory `io.ReadAll` (demonstrates a **78%+ reduction in resident memory**).
  - **PostGIS GiST R-Tree vs. Sequential Scan**: Visualizes query execution on 100k polygon records (slashing lookup time from **118.4ms to 3.12ms**).
- **Live Telemetry & Metrics**: Real-time compute progress bar, p50/p95/p99 latency calculations, error rates, throughput (RPS), and interactive delta badges.

### 4. Interactive Architecture Topology Inspector (`ArchitectureTopologyModal.tsx`)
- **Multi-Tier Diagrams**: Inspect system tiers (Client, Reverse Proxy, Application Core, Persistence, Asynchronous Workers) for any flagship project.
- **Flow Visualizer**: Interactive network request flow highlighting cache-hits, connection pools, and database read/write replicas.
- **Metrics Breakdown**: Cold vs. warm start latencies, connection limits, and failure recovery protocols.

### 5. Zone01 Peer Code Defense & Architecture Review Replay (`#peer-defense`)
- **Real-World Audit Artifacts**: Interactive transcripts from Zone01 Kisumu's peer code defense boards.
- **Critique vs. Defense Rebuttals**: Inspect the exact peer objections raised (e.g., lock contention, memory leaks, spatial query degradation) and Christian's benchmark-backed architectural resolutions.
- **Production Code Diffs**: View the exact Git diffs implemented to satisfy peer defense requirements.

### 6. Interactive Gravitational Lensing & Spacetime Canvas (`#research`)
- **Schwarzschild Metric Ray-Tracing**: Real-time canvas simulation of photon deflection around a massive compact object ($\alpha = \frac{4GM}{c^2 b}$).
- **Interactive Physics Sliders**: Dynamically tune the **Lens Mass ($M_\odot$)** and observer distance, watching the Einstein ring expand and background stars shear into relativistic arcs.
- **Accretion Disk Simulation**: Particle-based Keplerian velocity orbital mechanics around the event horizon.

### 7. Interactive 3D Planetary Globe & Global Network Telemetry Hub (`#interactive-globe`)
- **GitHub Commit Metropolis (Hierarchical Zoom Level-of-Detail)**:
  - **Orbital Perspective (`altitude > 1.35`)**: Displays 4 glowing Repository Capital Metropolises (**LYRIC**, **Spatial-Agritech**, **KijijiShare**, and **Vector-Vanguard / Zone01 Core**) with total commit metrics and inter-metropolis branch fiber routes.
  - **Zoom LOD City View (`altitude <= 1.35`)**: As the visitor zooms in, the city illuminates into a dense glowing 3D skyline of 31+ individual Git commits rendered as vertical cyber-spires protruding perpendicular to the terrain.
  - **Commit Spire Visual Encoding**:
    - Spire Altitude/Height proportionate to commit insertions and architectural impact (`0.05` to `0.30`).
    - Glowing neon color-coding: 🟢 `perf:` Go runtime & memory reduction, 🔵 `feat:` PostGIS & RFC range streaming, 🟣 `arch:` Transactional advisory locks & worker pools, 🟡 `audit:` Zone01 peer defense approvals, 🔴 `fix:` Concurrency race & leak fixes.
    - Pulsing radar beacons atop `HEAD` deployment commits.
  - **"Dusk-to-Dawn" Commit Evolution Replay**: Interactive timeline scrubber with Play/Pause and speed toggles (1x/2x) igniting commits sequentially like city lights illuminating at night across Kisumu.
  - **Holographic Commit Inspector**: Clicking any commit spire smoothly glides the camera into the tower, displaying commit SHA, copy button, branch, direct GitHub link, architectural notes, and a Go/SQL code diff preview.
- **HTML5 Real Location Detection**: Requests GPS coordinates on mount via `navigator.geolocation.getCurrentPosition`. Displays non-intrusive status toast with graceful fallback to IP-based lookup (`ipapi.co`) when permission is disabled.
- **OpenStreetMap Nominatim Reverse Geocoding**: Automatically decodes latitude/longitude into physical place names (City, County, State, Country, Flag emoji, and local timezone).
- **Global Edge Datacenter Latency Probes**: Interactive telemetry probing 10 worldwide edge PoPs (Nairobi, Johannesburg, Frankfurt, London, Virginia, Silicon Valley, São Paulo, Singapore, Tokyo, Sydney) measuring packet flight time, jitter, and lowest-latency route selection.
- **Undersea Submarine Fiber-Optic Cables**: 3D pathways of major undersea internet backbones (**2Africa, SEACOM, PEACE, TAT-14, and Transpacific Express**) with an interactive "Trace Packet Route to Kisumu" highlighting the Mombasa Cable Landing Station and terrestrial dark fiber overland run.
- **PostGIS `ST_DWithin` Spatial Playground**: Interactive epicenter and radius slider (100km to 2,500km) executing real-time spatial bounding queries against 60+ agricultural and hydrological IoT telemetry nodes with simulated GiST 2D R-Tree index timings (sub-2ms) and Hilbert space-filling curve cache hit analysis.
- **Cinematic Geodesic Flight Simulator**: Low-altitude (`altitude: 0.42`) camera flight along the Great-Circle route from the user's location into Christian's Systems Lab in Kisumu with live waypoint tracking.
- **Planetary Antipode Finder**: Calculates exact antipodal coordinates (`-lat, lng ± 180°`), computes Earth-core direct tunneling distance (12,742 km), and provides a 1-click camera flip.
- **Global Developer & Stargazer Hexbin Heatmap**: 3D hexagonal density pillars visualizing open-source collaborator and stargazer nodes across global technology hubs.
- **Realistic Day/Night Solar Terminator & Rotating 3D Clouds**: Calculates live solar noon subsolar point and renders a slowly rotating Three.js atmospheric cloud sphere floating above the terrain.
- **Next.js App Router Compatible**: Client-side only with `'use client'` directive, SSR mount guards, and `ResizeObserver`.

### 8. Timezone Overlap Planner & Meeting Dispatch (`#contact`)
- **Client Geo-Detection**: Dynamically detects the visitor's local timezone via `Intl.DateTimeFormat`.
- **24-Hour Overlap Matrix**: Visualizes Christian's working core hours in **Kisumu, Kenya (EAT / UTC+3)** aligned with the visitor's schedule.
- **1-Click Meeting Dispatch**: Pre-fills availability proposals and opens direct email communication.

### 8. Web Audio API Waveform Synthesizer (`AudioVisualizerWidget.tsx`)
- **Polyphonic Audio Synthesizer**: Uses browser Web Audio `OscillatorNode` for real-time sound generation.
- **Waveform Selection**: Toggle between **Sine**, **Triangle**, **Sawtooth**, and **Square** waves on the fly.
- **Biquad Lowpass Filter**: Dynamic slider for cutoff frequencies ranging from 300Hz to 6,000Hz.
- **HTTP 206 Chunk Counter**: Simulates real-time 64KB byte-chunk stream arrivals with an animated frequency spectrum.

### 9. Interactive Terminal & Command Palette
- **In-Browser Terminal Modal**: Full bash-style CLI supporting `help`, `whoami`, `projects`, `bench`, `stress`, `defense`, `skills`, and `contact`.
- **Command Palette (`Cmd+K` / `Ctrl+K`)**: Rapid keyboard navigation across all sections, projects, lab simulations, and persona switchers.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Bundler & Tooling** | [Vite 8](https://vitejs.dev/), [ESBuild](https://esbuild.github.io/), [TSX](https://github.com/privatenumber/tsx) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/) |
| **Backend / API Server** | [Express](https://expressjs.com/), Vite Middleware Integration in `server.ts` |
| **Artificial Intelligence** | [@google/genai](https://www.npmjs.com/package/@google/genai) (`gemini-3.8-flash`) |
| **Audio & Physics** | Web Audio API (`AudioContext`, `BiquadFilterNode`, `OscillatorNode`), HTML5 Canvas 2D |
| **Speech APIs** | Web Speech API (`SpeechRecognition`, `SpeechSynthesis`) |

---

## 📁 Repository Structure

```
├── server.ts                       # Full-stack Express server with Vite middleware & Gemini endpoints
├── index.html                      # HTML entrypoint with metadata, fonts, and OpenGraph tags
├── package.json                    # Project configuration, dependencies, and scripts
├── tsconfig.json                   # Strict TypeScript configuration
├── vite.config.ts                  # Vite build and development configuration
├── src/
│   ├── main.tsx                    # Application entry point
│   ├── App.tsx                     # Main layout & section orchestrator
│   ├── index.css                   # Global Tailwind CSS imports & animations
│   ├── types/
│   │   └── github.ts               # Core data structures for projects, repos, and user profile
│   ├── data/
│   │   ├── githubData.ts           # Curated flagship projects, research, and publications data
│   │   └── experience.ts           # Career milestones & Zone01 apprenticeship details
│   ├── services/
│   │   ├── github.ts               # Real-time GitHub REST API integration with rate-limiting fallbacks
│   │   └── sound.ts                # Audio synthesized tactile feedback system
│   └── components/
│       ├── DynamicInfiniteScrollStream.tsx # Continuous systems dispatches feed with auto-scroll
│       ├── FloatingAiVoiceAssistant.tsx    # Floating bidirectional AI voice assistant
│       ├── StressTestBenchmarkLab.tsx      # Concurrency & payload telemetry benchmark lab
│       ├── GravitationalLensingSimulator.tsx # Relativistic ray-tracing & accretion disk canvas
│       ├── PeerCodeDefenseSection.tsx      # Zone01 code review audit replays & diffs
│       ├── ArchitectureTopologyModal.tsx   # Interactive multi-tier system topology diagram
│       ├── AudioVisualizerWidget.tsx       # Web Audio API polyphonic waveform visualizer
│       ├── SystemsLabSection.tsx           # Embedded systems playground (SIMD, Bloom, GC)
│       ├── FeaturedProjects.tsx            # Flagship systems showcase (LYRIC, kijijiShare, PostGIS)
│       ├── ContactSection.tsx              # Timezone overlap planner & contact form
│       ├── CommandPalette.tsx              # Quick action modal (Cmd+K)
│       ├── InteractiveTerminalModal.tsx    # In-browser CLI terminal emulator
│       ├── ProjectDetailModal.tsx          # Deep-dive architecture modal with README renderer
│       ├── Navbar.tsx                      # Header navigation with sound toggle & persona filter
│       └── Footer.tsx                      # Clean footer with UTC time and copyright
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Christian3788/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (Optional):
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```
   *(Note: If `GEMINI_API_KEY` is not provided, the application runs automatically with comprehensive offline intelligence fallbacks.)*

### Running the Application

- **Development Server**:
  ```bash
  npm run dev
  ```
  Starts the full-stack Express server with Vite middleware on `http://localhost:3000`.

- **Production Build**:
  ```bash
  npm run build
  ```
  Compiles and bundles the frontend into the `dist/` directory.

- **Production Server**:
  ```bash
  npm start
  ```
  Serves the production build using the Express backend.

- **Type Check & Linting**:
  ```bash
  npm run lint
  ```

---

## 🌐 API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/assistant` | `POST` | Processes voice and text queries regarding Christian's architecture and returns both formatted text and crisp spoken speech strings. |
| `/api/generate-content` | `POST` | Generates dynamic technical dispatches for the continuous infinite scroll stream given a cursor and category tag. |
| `/api/newsletter` | `POST` | Mock backend for newsletter subscription storing user emails, targeted systems topics, and returning subscriber count. |
| `/api/newsletter/stats` | `GET` | Returns aggregated technical article newsletter stats and active topic categories. |

---

## 👤 About the Engineer

**Christian Amos Otieno**
- **Location**: Kisumu, Kenya (East Africa Time · UTC+3)
- **Email**: [christianamos67@gmail.com](mailto:christianamos67@gmail.com)
- **GitHub**: [@Christian3788](https://github.com/Christian3788)
- **Specializations**:
  - High-Throughput Network Streaming (Go HTTP 206, `io.CopyN`, TCP socket zero-copy)
  - Relational & Spatial Databases (PostgreSQL, PostGIS, 2D GiST R-trees, Hilbert curves, Transactional Advisory Locks)
  - Systems Performance Engineering (SIMD vector operations, Bloom filters, GC compaction)
  - Peer-Defended Architecture Audits (Zone01 Kisumu)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
