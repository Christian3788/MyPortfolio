import React, { useState, useEffect } from 'react';
import { Mail, Github, Send, Check, MapPin, Building, Calendar, ArrowUpRight, Clock, Globe, Sparkles, CheckCircle2 } from 'lucide-react';
import { GithubUser } from '../types/github';
import { soundService } from '../services/sound';

interface ContactSectionProps {
  user: GithubUser;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ user }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Timezone Overlap States
  const [visitorTimezone, setVisitorTimezone] = useState<string>('UTC');
  const [visitorLocalTime, setVisitorLocalTime] = useState<string>('');
  const [christianTime, setChristianTime] = useState<string>('');
  const [isWithinWorkingHours, setIsWithinWorkingHours] = useState<boolean>(true);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      setVisitorTimezone(tz);

      const updateTimes = () => {
        const now = new Date();
        
        // Visitor Time
        const vTime = now.toLocaleTimeString([], {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        setVisitorLocalTime(vTime);

        // Christian's time in Kisumu, Kenya (Africa/Nairobi)
        const cTime = now.toLocaleTimeString([], {
          timeZone: 'Africa/Nairobi',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        setChristianTime(cTime);

        // Calculate if within Christian's active hours (9 AM - 7 PM EAT)
        const eatHour = parseInt(
          now.toLocaleTimeString([], { timeZone: 'Africa/Nairobi', hour: '2-digit', hour12: false }),
          10
        );
        setIsWithinWorkingHours(eatHour >= 9 && eatHour < 19);
      };

      updateTimes();
      const interval = setInterval(updateTimes, 30000);
      return () => clearInterval(interval);
    } catch {
      setVisitorTimezone('UTC');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    soundService.playSuccess();
    // Build mailto link so user's client opens directly
    const mailtoUrl = `mailto:${user.email || 'christianamos67@gmail.com'}?subject=${encodeURIComponent(
      subject || `Portfolio Inquiry from ${name}`
    )}&body=${encodeURIComponent(
      `From: ${name} (${email})\nVisitor Timezone: ${visitorTimezone}\n\n${message}`
    )}`;
    
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  const scheduleMeetingSlot = (timeSlot: string) => {
    setSubject(`Engineering Architecture Discussion (${timeSlot})`);
    setMessage(
      `Hi Christian,\n\nI would like to schedule a 30-minute systems architecture discussion around ${timeSlot} (overlapping between ${visitorTimezone} and Kisumu EAT).\n\nTopic: `
    );
    soundService.playClick(300, 0.03);
  };

  return (
    <section id="contact" className="py-20 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Authentic Credentials, Photo & Timezone Planner */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-semibold tracking-wider text-indigo-400 uppercase font-mono mb-2">
                08. Collaboration &amp; Advisory
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display text-balance">
                Let's discuss high-impact software challenges.
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Whether you are architecting a mission-critical Go streaming service, optimizing PostGIS database throughput,
              or hiring a systems engineer with peer-defended mastery, I welcome conversations with engineering leads and teams worldwide.
            </p>

            {/* Direct Connect Information */}
            <div className="space-y-3.5 pt-2 border-t border-white/[0.06]">
              {/* Personal Engineer Snapshot Card with Photo */}
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

              {/* Timezone Overlap Planner */}
              <div className="p-4 rounded-xl bg-[#090b12] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Timezone Overlap Planner</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{isWithinWorkingHours ? 'Active in Kisumu' : 'Async Dispatch Open'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[10px] text-slate-500">Your Local Time ({visitorTimezone.split('/')[1] || visitorTimezone})</div>
                    <div className="text-white font-bold text-sm mt-0.5">{visitorLocalTime || 'Local'}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[10px] text-slate-500">Christian in Kisumu (EAT / UTC+3)</div>
                    <div className="text-emerald-400 font-bold text-sm mt-0.5">{christianTime || 'EAT'}</div>
                  </div>
                </div>

                {/* Overlap Hours Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Golden Overlap: 2:00 PM – 7:00 PM EAT</span>
                    <span className="text-indigo-400">Optimal Sync</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1 pt-1">
                    <button
                      onClick={() => scheduleMeetingSlot('14:00 EAT / 11:00 UTC')}
                      className="p-1 text-center rounded bg-white/[0.03] hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-white/[0.06] text-[10px] text-slate-300 font-mono transition-colors"
                      title="14:00 EAT slot"
                    >
                      14:00
                    </button>
                    <button
                      onClick={() => scheduleMeetingSlot('15:00 EAT / 12:00 UTC')}
                      className="p-1 text-center rounded bg-white/[0.03] hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-white/[0.06] text-[10px] text-slate-300 font-mono transition-colors"
                      title="15:00 EAT slot"
                    >
                      15:00
                    </button>
                    <button
                      onClick={() => scheduleMeetingSlot('16:00 EAT / 13:00 UTC')}
                      className="p-1 text-center rounded bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 text-[10px] text-indigo-300 font-mono transition-colors font-bold"
                      title="16:00 EAT slot (Popular)"
                    >
                      16:00 ★
                    </button>
                    <button
                      onClick={() => scheduleMeetingSlot('17:00 EAT / 14:00 UTC')}
                      className="p-1 text-center rounded bg-white/[0.03] hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-white/[0.06] text-[10px] text-slate-300 font-mono transition-colors"
                      title="17:00 EAT slot"
                    >
                      17:00
                    </button>
                    <button
                      onClick={() => scheduleMeetingSlot('18:00 EAT / 15:00 UTC')}
                      className="p-1 text-center rounded bg-white/[0.03] hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-white/[0.06] text-[10px] text-slate-300 font-mono transition-colors"
                      title="18:00 EAT slot"
                    >
                      18:00
                    </button>
                    <button
                      onClick={() => scheduleMeetingSlot('19:00 EAT / 16:00 UTC')}
                      className="p-1 text-center rounded bg-white/[0.03] hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-white/[0.06] text-[10px] text-slate-300 font-mono transition-colors"
                      title="19:00 EAT slot"
                    >
                      19:00
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-500 text-center font-mono pt-1">
                    Click any time slot above to pre-populate the direct message below
                  </div>
                </div>
              </div>

              {/* Direct Email Card */}
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

              {/* GitHub Card */}
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

              {/* Verified Location Card */}
              <div className="p-3.5 rounded-xl bg-[#0f1118] border border-white/[0.08] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Location &amp; Base</div>
                  <div className="text-sm font-semibold text-white">
                    Kisumu, Kenya · East Africa Time (EAT / UTC+3)
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
                  Direct dispatch to christianamos67@gmail.com
                </span>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white font-display">
                    Message Dispatched
                  </h4>
                  <p className="text-sm text-slate-300 max-w-sm mx-auto">
                    Thank you for reaching out. Your default email client was opened. You can also write directly to{' '}
                    <span className="text-white font-mono">{user.email || 'christianamos67@gmail.com'}</span>.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-2 text-xs font-medium text-slate-300 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="text-xs font-mono text-slate-400">
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ada Lovelace"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/[0.1] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="text-xs font-mono text-slate-400">
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ada@example.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/[0.1] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-subject" className="text-xs font-mono text-slate-400">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="High-Throughput Go Streaming Architecture / Role Inquiry"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/[0.1] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="text-xs font-mono text-slate-400">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Hi Christian, I saw your work on Go HTTP 206 streaming and PostGIS GiST spatial indexing. We would love to discuss..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/[0.1] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Dispatches directly to Christian's inbox
                    </span>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                    >
                      <span>Send Dispatch</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
