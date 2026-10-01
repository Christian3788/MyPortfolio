import React, { useState } from 'react';
import { X, Printer, Download, Mail, MapPin, Github, Linkedin, Building, FileText, Copy, Check, Code } from 'lucide-react';
import { GithubUser, ExperienceItem, FeaturedProject } from '../types/github';
import { soundService } from '../services/sound';

interface ResumeModalProps {
  user: GithubUser;
  experience: ExperienceItem[];
  featuredProjects: FeaturedProject[];
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  user,
  experience,
  featuredProjects,
  isOpen,
  onClose,
}) => {
  const [copiedFormat, setCopiedFormat] = useState<'md' | 'txt' | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    soundService.playClick(200, 0.02);
    window.print();
  };

  const generateMarkdown = () => {
    return `# ${user.name || 'Christian Amos Otieno'}
**Senior Systems & Full-Stack Software Engineer**
Location: ${user.location || 'Kisumu, Kenya'} | Timezone: EAT (UTC+3)
Email: ${user.email || 'christianamos67@gmail.com'}
GitHub: ${user.html_url || 'https://github.com/christian3788'}
LinkedIn: https://www.linkedin.com/in/christian-otieno-9a9806229/

---

## Professional Summary
Systems-focused software engineer specializing in low-overhead network protocols in Go, high-throughput spatial indexing in PostGIS, and deterministic interfaces in Next.js & TypeScript. Proven record of delivering resilient cloud microservices, zero-copy streaming, and peer-defended code mastery at Zone01 Kisumu. Background in microbiology and biotechnology with computational research focus in biochemical reaction networks and relativistic physics simulations.

---

## Experience & Engineering Leadership
${experience.map((exp) => `### ${exp.role} · ${exp.company}
*${exp.location} | ${exp.period}*
${exp.highlights.map((h) => `- ${h}`).join('\n')}
**Core Toolchain:** ${exp.technologies.join(', ')}
`).join('\n')}

---

## Flagship Systems Architecture
${featuredProjects.map((p) => `### ${p.title} (${p.category})
- **Problem:** ${p.problem}
- **Solution:** ${p.solution}
- **Tech Stack:** ${p.techStack.join(', ')}
- **Repository:** ${p.githubUrl}
`).join('\n')}

---

## Education & Scientific Training
- **B.Sc. in Microbiology and Biotechnology** — Aga Khan University (2019 – 2022)
  *Research:* Reaction-diffusion kinetics, enzyme active-site spatial modeling, stochastic simulation.
- **Apprentice Full-Stack Developer** — Zone01 Kisumu (2024 – Present)
  *Focus:* Systems programming in Go, PostgreSQL/PostGIS, concurrency, live peer code defense.
- **Neuro-Analytics & Brain-Data Integration** — Skills for Africa (2023 – 2024)
`;
  };

  const generatePlainText = () => {
    return `================================================================================
${(user.name || 'Christian Amos Otieno').toUpperCase()}
Systems-Focused Software Engineer
Location: ${user.location || 'Kisumu, Kenya'} | Email: ${user.email || 'christianamos67@gmail.com'}
GitHub: ${user.html_url || 'https://github.com/christian3788'} | LinkedIn: https://www.linkedin.com/in/christian-otieno-9a9806229/
================================================================================

PROFESSIONAL SUMMARY
Systems-focused software engineer specializing in low-overhead network protocols in Go,
high-throughput spatial indexing in PostGIS, and deterministic interfaces in Next.js & TypeScript.
Peer-defended mastery at Zone01 Kisumu. Background in biotechnology & computational physics.

WORK EXPERIENCE
${experience.map((exp) => `--------------------------------------------------------------------------------
${exp.role.toUpperCase()} — ${exp.company}
${exp.location} | ${exp.period}
${exp.highlights.map((h) => `* ${h}`).join('\n')}
Toolchain: ${exp.technologies.join(', ')}
`).join('\n')}

FLAGSHIP SYSTEMS
${featuredProjects.map((p) => `--------------------------------------------------------------------------------
${p.title.toUpperCase()} [${p.category}]
* Problem:  ${p.problem}
* Solution: ${p.solution}
* Stack:    ${p.techStack.join(', ')}
* Source:   ${p.githubUrl}
`).join('\n')}

EDUCATION & CREDENTIALS
* B.Sc. in Microbiology and Biotechnology — Aga Khan University (2019 - 2022)
* Apprentice Full-Stack Developer — Zone01 Kisumu (2024 - Present)
* Neuro-Analytics & Brain-Data Integration — Skills for Africa (2023 - 2024)
================================================================================
`;
  };

  const handleCopy = (format: 'md' | 'txt') => {
    const text = format === 'md' ? generateMarkdown() : generatePlainText();
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    soundService.playSuccess();
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  const handleDownloadJSON = () => {
    soundService.playClick(240, 0.02);
    const resumeData = {
      name: user.name || 'Christian Amos Otieno',
      title: 'Systems-Focused Software Engineer',
      location: user.location || 'Kisumu, Kenya',
      email: user.email || 'christianamos67@gmail.com',
      github: user.html_url,
      linkedin: 'https://www.linkedin.com/in/christian-otieno-9a9806229/',
      experience,
      education: [
        'B.Sc. in Microbiology and Biotechnology – Aga Khan University (2019 - 2022)',
        'Apprentice Full-Stack Developer – Zone01 Kisumu (2024 - Present)',
        'Neuro-Analytics & Brain-Data Integration – Skills for Africa (2023 - 2024)',
      ],
      featuredProjects: featuredProjects.map((p) => ({
        title: p.title,
        category: p.category,
        problem: p.problem,
        solution: p.solution,
        techStack: p.techStack,
      })),
    };
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Christian_Amos_Otieno_Resume.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-6 sm:p-10 space-y-8 max-h-[92vh] overflow-y-auto text-slate-900 print:bg-white print:text-black print:max-h-none print:shadow-none print:border-none"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Actions Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <div className="text-xs font-mono uppercase tracking-wider text-[#0059e8] font-semibold">
            Curriculum Vitae · Christian Amos Otieno
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleCopy('md')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer shadow-xs ${
                copiedFormat === 'md'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                  : 'text-slate-700 bg-white hover:bg-slate-50 border-slate-200'
              }`}
              title="Copy ATS-friendly Markdown version"
            >
              {copiedFormat === 'md' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Code className="w-3.5 h-3.5 text-[#0059e8]" />}
              <span>{copiedFormat === 'md' ? 'Markdown Copied!' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={() => handleCopy('txt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer shadow-xs ${
                copiedFormat === 'txt'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                  : 'text-slate-700 bg-white hover:bg-slate-50 border-slate-200'
              }`}
              title="Copy clean plaintext version"
            >
              {copiedFormat === 'txt' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedFormat === 'txt' ? 'Plain Text Copied!' : 'Copy Plain Text'}</span>
            </button>

            <a
              href="/resume.pdf"
              download="Christian_Amos_Otieno_Resume.pdf"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#0059e8] hover:bg-[#0048c4] rounded-lg transition-colors shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Official PDF</span>
            </a>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/90 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/90 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resume Header */}
        <div className="flex flex-col sm:flex-row items-start gap-6 border-b border-slate-200 pb-6 print:border-black/20">
          <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-300 print:border-black/30 shadow-sm shrink-0">
            <img
              src="/christian_profile_studio.jpg"
              alt={user.name || 'Christian Amos Otieno'}
              className="w-full h-full object-cover object-[50%_25%] contrast-[1.12]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/profile.jpg';
              }}
            />
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h1 className="text-3xl font-extrabold text-slate-900 print:text-black font-display tracking-tight">
                {user.name || 'Christian Amos Otieno'}
              </h1>
              <div className="text-sm font-semibold text-[#0059e8] print:text-blue-700 font-mono">
                Systems-Focused Software Engineer
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700 font-mono font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0059e8]" />
                {user.location || 'Kisumu, Kenya'}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#0059e8]" />
                {user.email || 'christianamos67@gmail.com'}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Github className="w-3.5 h-3.5 text-[#0059e8]" />
                github.com/{user.login}
              </span>
              <span>·</span>
              <a
                href="https://www.linkedin.com/in/christian-otieno-9a9806229/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-[#0059e8] print:text-black transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0059e8]" />
                linkedin.com/in/christian-otieno-9a9806229
              </a>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#0059e8]" />
                Zone01 Kisumu &amp; Aga Khan University
              </span>
            </div>

            <p className="text-sm text-slate-700 print:text-slate-700 leading-relaxed pt-1">
              Systems-focused software engineer specializing in low-overhead network protocols in Go, high-throughput spatial
              indexing in PostGIS, and deterministic interfaces in Next.js &amp; TypeScript. Proven record designing HTTP 206
              byte-range streaming engines, SIMD vector search algorithms, and peer-defended distributed microservices.
            </p>
          </div>
        </div>

        {/* Core Competencies */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0059e8] print:text-blue-700 font-mono">
            Core Technical Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 print:text-slate-800">
            <div>
              <span className="font-semibold text-slate-900 print:text-black">Languages &amp; Runtimes: </span>
              Go, TypeScript, JavaScript, Python 3, SQL, HTML5/CSS, Bash
            </div>
            <div>
              <span className="font-semibold text-slate-900 print:text-black">Databases &amp; Spatial: </span>
              PostgreSQL, PostGIS (GiST Indexing), Prisma ORM, Redis Pub/Sub, MinIO
            </div>
            <div>
              <span className="font-semibold text-slate-900 print:text-black">Frameworks &amp; Protocols: </span>
              Next.js, React, HTTP 206 Partial Content, WebSockets, REST, Docker
            </div>
            <div>
              <span className="font-semibold text-slate-900 print:text-black">Algorithms &amp; Systems: </span>
              SIMD 4-way loop unrolling, vector similarity search, Bloom filters, IPCC climate modeling
            </div>
          </div>
        </div>

        {/* Experience & Apprenticeship */}
        <div className="space-y-6 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0059e8] print:text-blue-700 font-mono">
            Experience &amp; Engineering Practice
          </h2>

          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                  <div className="font-bold text-slate-900 print:text-black text-sm">
                    {exp.role} <span className="font-normal text-slate-600 print:text-slate-600">· {exp.company}</span>
                  </div>
                  <div className="text-xs text-[#0059e8] print:text-slate-600 font-mono">
                    {exp.period} · {exp.location}
                  </div>
                </div>

                <p className="text-xs text-slate-700 print:text-slate-700 leading-relaxed">
                  {exp.summary}
                </p>

                <ul className="space-y-1.5 text-xs text-slate-700 print:text-slate-800 pl-4 list-disc">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="leading-relaxed">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education Credentials */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0059e8] print:text-blue-700 font-mono">
            Formal Education
          </h2>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 print:border-slate-300 print:bg-slate-50 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 print:text-black">B.Sc. in Microbiology and Biotechnology</span>
              <span className="text-slate-700 font-mono font-medium">2019 - 2022</span>
            </div>
            <div className="text-[#0059e8] print:text-blue-700 font-semibold">Aga Khan University · Nairobi, Kenya</div>
            <p className="text-slate-700 print:text-slate-700 leading-relaxed">
              Rigorous scientific and computational foundation in reaction-diffusion dynamics, cellular automata,
              bioinformatics pipelines, and stochastic mathematical modeling.
            </p>
          </div>
        </div>

        {/* Key Projects */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0059e8] print:text-blue-700 font-mono">
            Selected System Deployments
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredProjects.map((p) => (
              <div key={p.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 print:border-slate-300 print:bg-slate-50 space-y-1">
                <div className="font-bold text-xs text-slate-900 print:text-black">{p.title}</div>
                <p className="text-[11px] text-slate-700 print:text-slate-700 line-clamp-2 leading-relaxed">{p.description}</p>
                <div className="text-[10px] text-[#0059e8] print:text-blue-700 font-mono font-medium">
                  {p.techStack.join(' · ')}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
