import React from 'react';
import { ARTICLES } from '../data/fallbackData';
import { BookOpen, ArrowUpRight, Calendar } from 'lucide-react';

export const ArticlesSection: React.FC = () => {
  return (
    <section id="articles" className="py-20 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-indigo-400 uppercase font-mono mb-2">
              08. Technical Writing & Publications
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Engineering Notes & Research Articles
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Deep dives into low-overhead protocol design, concurrency paradigms, and database execution plans.
          </p>
        </div>

        {/* Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.map((article, idx) => (
            <a
              key={article.title}
              href={article.link}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-[#0f1118] border border-white/[0.08] hover:border-white/[0.18] transition-all p-6 flex flex-col justify-between group hover:bg-[#12141f]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 font-mono text-indigo-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>0{idx + 1}. Note</span>
                  </div>
                  <span className="font-mono text-slate-500">{article.date}</span>
                </div>

                <h3 className="text-lg font-bold text-white font-display group-hover:text-indigo-300 transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              {/* Tags and Action */}
              <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  {article.tags.map((tag, tIdx) => (
                    <React.Fragment key={tag}>
                      <span>{tag}</span>
                      {tIdx < article.tags.length - 1 && (
                        <span aria-hidden="true" className="text-slate-600">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <span className="text-xs text-indigo-400 group-hover:text-white flex items-center gap-1 transition-colors">
                  <span>Read Note</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
