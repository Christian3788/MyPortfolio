import React, { useState } from 'react';
import { Mail, Github, Send, Check, MapPin, Building, Calendar, ArrowUpRight } from 'lucide-react';
import { GithubUser } from '../types/github';

interface ContactSectionProps {
  user: GithubUser;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ user }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    // Build mailto link so user's client opens directly
    const mailtoUrl = `mailto:${user.email || 'christianamos67@gmail.com'}?subject=${encodeURIComponent(
      subject || `Portfolio Inquiry from ${name}`
    )}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
    
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-semibold tracking-wider text-indigo-400 uppercase font-mono mb-2">
                08. Collaboration & Advisory
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display text-balance">
                Let's discuss high-impact software challenges.
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Whether you are architecting a mission-critical platform, optimizing database throughput,
              or exploring strategic engineering leadership, I welcome conversations with founders, teams, and peers.
            </p>

            {/* Direct Connect Information */}
            <div className="space-y-4 pt-4 border-t border-white/[0.06]">
              {/* Personal Engineer Card with Photo */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0f1118] border border-white/[0.08]">
                <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-slate-800 border border-white/[0.1] shrink-0">
                  <img
                    src="/IMG_20260926_072914.jpg"
                    alt={user.name || 'Christian Amos Otieno'}
                    className="w-full h-full object-cover object-[50%_15%]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/profile.jpg';
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-white">
                    {user.name || 'Christian Amos Otieno'}
                  </div>
                  <div className="text-xs text-indigo-400 font-mono">
                    Peer-Defended Systems Engineer
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Typically responds within 24 hours · EAT (UTC+3)
                  </div>
                </div>
              </div>

              <a
                href={`mailto:${user.email || 'christianamos67@gmail.com'}`}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0f1118] border border-white/[0.08] hover:border-indigo-500/50 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Direct Email</div>
                  <div className="text-sm font-semibold text-white font-mono">
                    {user.email || 'christianamos67@gmail.com'}
                  </div>
                </div>
              </a>

              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0f1118] border border-white/[0.08] hover:border-indigo-500/50 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Github className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-400">GitHub Profile</div>
                  <div className="text-sm font-semibold text-white font-mono">
                    github.com/{user.login}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </a>

              <div className="p-3.5 rounded-xl bg-[#0f1118] border border-white/[0.08] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Location & Timezone</div>
                  <div className="text-sm font-semibold text-white">
                    {user.location || 'Missoula, MT'} · Mountain Time (MT)
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact Dispatch */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#0f1118] border border-white/[0.1] p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <h3 className="text-lg font-bold text-white font-display">
                  Send a Direct Message
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  Direct dispatch to inbox
                </span>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white font-display">Message Prepared</h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Your email client has been triggered to send directly to Christian Amos ({user.email || 'christianamos67@gmail.com'}).
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 text-xs text-indigo-400 hover:text-white transition-colors font-medium"
                  >
                    Send another note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ada Lovelace"
                        className="w-full px-3.5 py-2.5 text-xs bg-[#07080c] border border-white/[0.1] rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ada@example.com"
                        className="w-full px-3.5 py-2.5 text-xs bg-[#07080c] border border-white/[0.1] rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Engineering Discussion / Project Advisory"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#07080c] border border-white/[0.1] rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                      Message & Context
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share details about your architecture, system requirements, or inquiry..."
                      className="w-full px-3.5 py-2.5 text-xs bg-[#07080c] border border-white/[0.1] rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry to Christian Amos</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
