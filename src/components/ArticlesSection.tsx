import React from 'react';
import { ARTICLES } from '../data/fallbackData';
import { BookOpen, ArrowUpRight, Calendar } from 'lucide-react';

export const ArticlesSection: React.FC = () => {
  return (
    <section id="articles" className="py-20 border-t border-slate-200/90 bg-[#f8fafd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-[#0059e8] uppercase font-mono mb-2">
              09. Technical Writing &amp; Publications
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display">
              Engineering Notes &amp; Research Articles
            </h2>
          </div>
          <p className="text-sm text-slate-700 font-medium max-w-md">
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
              className="rounded-xl bg-white border border-slate-200/90 hover:border-[#0059e8]/50 hover:shadow-md transition-all p-6 flex flex-col justify-between group shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <div className="flex items-center gap-1.5 font-mono text-[#0059e8] font-bold">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>0{idx + 1}. Note</span>
                  </div>
                  <span className="font-mono text-slate-600 font-medium">{article.date}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-display group-hover:text-[#0059e8] transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {article.summary}
                </p>
              </div>

              {/* Tags and Action */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-700 font-mono">
                  {article.tags.map((tag, tIdx) => (
                    <React.Fragment key={tag}>
                      <span className="bg-slate-50 px-2 py-0.5 rounded text-slate-800 font-medium border border-slate-200">{tag}</span>
                      {tIdx < article.tags.length - 1 && (
                        <span aria-hidden="true" className="text-slate-500 font-bold">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <span className="text-xs text-[#0059e8] group-hover:text-[#0048c4] font-semibold flex items-center gap-1 transition-colors">
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
