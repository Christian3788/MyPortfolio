import React from 'react';
import { X, Printer, Download, Mail, MapPin, Github, Linkedin, Building, FileText } from 'lucide-react';
import { GithubUser, ExperienceItem, FeaturedProject } from '../types/github';

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
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl rounded-2xl bg-[#0e1017] border border-white/[0.12] shadow-2xl p-6 sm:p-10 space-y-8 max-h-[92vh] overflow-y-auto print:bg-white print:text-black print:max-h-none print:shadow-none print:border-none"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Actions Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] print:hidden">
          <div className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
            Curriculum Vitae · Christian Amos Otieno
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/resume.pdf"
              download="Christian_Amos_Otieno_Resume.pdf"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Official PDF</span>
            </a>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-white/[0.04]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resume Header */}
        <div className="flex flex-col sm:flex-row items-start gap-6 border-b border-white/[0.08] pb-6 print:border-black/20">
          <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden bg-slate-800 border border-white/[0.15] print:border-black/30 shrink-0 shadow-lg">
            <img
              src="/IMG_20260926_072914.jpg"
              alt={user.name || 'Christian Amos Otieno'}
              className="w-full h-full object-cover object-[50%_15%]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/profile.jpg';
              }}
            />
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h1 className="text-3xl font-extrabold text-white print:text-black font-display tracking-tight">
                {user.name || 'Christian Amos Otieno'}
              </h1>
              <div className="text-sm font-semibold text-indigo-400 print:text-indigo-700 font-mono">
                Systems-Focused Software Engineer
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 print:text-slate-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {user.location || 'Kisumu, Kenya'}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {user.email || 'christianamos67@gmail.com'}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Github className="w-3.5 h-3.5" />
                github.com/{user.login}
              </span>
              <span>·</span>
              <a
                href="https://www.linkedin.com/in/christian-otieno-9a9806229/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-white print:text-black transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0a66c2]" />
                linkedin.com/in/christian-otieno-9a9806229
              </a>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5" />
                Zone01 Kisumu & Aga Khan University
              </span>
            </div>

            <p className="text-sm text-slate-300 print:text-slate-700 leading-relaxed pt-1">
              Systems-focused software engineer specializing in low-overhead network protocols in Go, high-throughput spatial
              indexing in PostGIS, and deterministic interfaces in Next.js & TypeScript. Proven record designing HTTP 206
              byte-range streaming engines, SIMD vector search algorithms, and peer-defended distributed microservices.
            </p>
          </div>
        </div>

        {/* Core Competencies */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 print:text-indigo-700 font-mono">
            Core Technical Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 print:text-slate-800">
            <div>
              <span className="font-semibold text-white print:text-black">Languages & Runtimes: </span>
              Go, TypeScript, JavaScript, Python 3, SQL, HTML5/CSS, Bash
            </div>
            <div>
              <span className="font-semibold text-white print:text-black">Databases & Spatial: </span>
              PostgreSQL, PostGIS (GiST Indexing), Prisma ORM, Redis Pub/Sub, MinIO
            </div>
            <div>
              <span className="font-semibold text-white print:text-black">Frameworks & Protocols: </span>
              Next.js, React, HTTP 206 Partial Content, WebSockets, REST, Docker
            </div>
            <div>
              <span className="font-semibold text-white print:text-black">Algorithms & Systems: </span>
              SIMD 4-way loop unrolling, vector similarity search, Bloom filters, IPCC climate modeling
            </div>
          </div>
        </div>

        {/* Experience & Apprenticeship */}
        <div className="space-y-6 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 print:text-indigo-700 font-mono">
            Experience & Engineering Practice
          </h2>

          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                  <div className="font-bold text-white print:text-black text-sm">
                    {exp.role} <span className="font-normal text-slate-400 print:text-slate-600">· {exp.company}</span>
                  </div>
                  <div className="text-xs text-indigo-400 print:text-slate-600 font-mono">
                    {exp.period} · {exp.location}
                  </div>
                </div>

                <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                  {exp.summary}
                </p>

                <ul className="space-y-1.5 text-xs text-slate-300 print:text-slate-800 pl-4 list-disc">
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 print:text-indigo-700 font-mono">
            Formal Education
          </h2>
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] print:border-slate-300 print:bg-slate-50 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white print:text-black">B.Sc. in Microbiology and Biotechnology</span>
              <span className="text-slate-400 font-mono">2019 - 2022</span>
            </div>
            <div className="text-indigo-400 print:text-indigo-700">Aga Khan University · Nairobi, Kenya</div>
            <p className="text-slate-300 print:text-slate-700">
              Rigorous scientific and computational foundation in reaction-diffusion dynamics, cellular automata,
              bioinformatics pipelines, and stochastic mathematical modeling.
            </p>
          </div>
        </div>

        {/* Key Projects */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 print:text-indigo-700 font-mono">
            Selected System Deployments
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredProjects.map((p) => (
              <div key={p.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] print:border-slate-300 print:bg-slate-50 space-y-1">
                <div className="font-bold text-xs text-white print:text-black">{p.title}</div>
                <p className="text-[11px] text-slate-300 print:text-slate-700 line-clamp-2">{p.description}</p>
                <div className="text-[10px] text-indigo-300 print:text-indigo-700 font-mono">
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
