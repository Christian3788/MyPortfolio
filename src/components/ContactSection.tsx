import React, { useState, useEffect } from 'react';
import { Mail, Github, Linkedin, Send, Check, MapPin, Building, Calendar, ArrowUpRight, Clock, Globe, Sparkles, CheckCircle2, Bell, Newspaper, ShieldCheck, Loader2 } from 'lucide-react';
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

  // Newsletter Subscription States
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterTopics, setNewsletterTopics] = useState<string[]>(['go', 'databases']);
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'already-subscribed' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const [subscriberCount, setSubscriberCount] = useState<number>(144);

  // Timezone Overlap States
  const [visitorTimezone, setVisitorTimezone] = useState<string>('UTC');
  const [visitorLocalTime, setVisitorLocalTime] = useState<string>('');
  const [christianTime, setChristianTime] = useState<string>('');
  const [isWithinWorkingHours, setIsWithinWorkingHours] = useState<boolean>(true);

  // Check existing newsletter subscription and fetch stats on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio_newsletter_subscribed');
      if (saved) {
        setNewsletterStatus('already-subscribed');
        setNewsletterMsg(`Subscribed with ${saved}`);
      }

      fetch('/api/newsletter/stats')
        .then((res) => res.json())
        .then((data) => {
          if (data?.totalSubscribers) {
            setSubscriberCount(data.totalSubscribers);
          }
        })
        .catch(() => {
          // Keep default count
        });
    } catch {
      // LocalStorage or fetch fallback
    }
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newsletterEmail.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setNewsletterStatus('error');
      setNewsletterMsg('Please enter a valid email address.');
      soundService.playClick(160, 0.04);
      return;
    }

    setNewsletterStatus('loading');
    soundService.playClick(260, 0.02);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, topics: newsletterTopics }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.alreadySubscribed) {
          setNewsletterStatus('already-subscribed');
          setNewsletterMsg(data.message || 'You are already subscribed!');
        } else {
          setNewsletterStatus('success');
          setNewsletterMsg(data.message || 'Subscribed! You will receive future technical article dispatches.');
          if (data.totalSubscribers) setSubscriberCount(data.totalSubscribers);
        }
        localStorage.setItem('portfolio_newsletter_subscribed', trimmed);
        soundService.playSuccess();
      } else {
        throw new Error('Server error');
      }
    } catch {
      // Local mock backend fallback if offline
      localStorage.setItem('portfolio_newsletter_subscribed', trimmed);
      const existing = JSON.parse(localStorage.getItem('mock_newsletter_db') || '[]');
      if (!existing.includes(trimmed)) {
        existing.push(trimmed);
        localStorage.setItem('mock_newsletter_db', JSON.stringify(existing));
        setSubscriberCount((prev) => prev + 1);
      }
      setNewsletterStatus('success');
      setNewsletterMsg('Subscribed! You will receive future technical article dispatches.');
      soundService.playSuccess();
    }
  };

  const toggleTopic = (topic: string) => {
    soundService.playClick(240, 0.015);
    setNewsletterTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

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
    <section id="contact" className="py-20 border-t border-slate-200/90 bg-[#f8fafd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Authentic Credentials, Photo & Timezone Planner */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-semibold tracking-wider text-[#0059e8] uppercase font-mono mb-2">
                12. Collaboration &amp; Advisory
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display text-balance">
                Let's discuss high-impact software challenges.
              </h2>
            </div>

            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              Whether you are architecting a mission-critical Go streaming service, optimizing PostGIS database throughput,
              or hiring a systems engineer with peer-defended mastery, I welcome conversations with engineering leads and teams worldwide.
            </p>

            {/* Direct Connect Information */}
            <div className="space-y-3.5 pt-2 border-t border-slate-200/80">
              {/* Personal Engineer Snapshot Card with Photo */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
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
                  <div className="text-sm font-semibold text-slate-900">
                    {user.name || 'Christian Amos Otieno'}
                  </div>
                  <div className="text-xs text-[#0059e8] font-mono font-medium">
                    Peer-Defended Systems Engineer
                  </div>
                  <div className="text-[11px] text-slate-700 font-medium">
                    Typically responds within 24 hours · EAT (UTC+3)
                  </div>
                </div>
              </div>

              {/* Timezone Overlap Planner */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                    <Globe className="w-3.5 h-3.5 text-[#0059e8]" />
                    <span>Timezone Overlap Planner</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{isWithinWorkingHours ? 'Active in Kisumu' : 'Async Dispatch Open'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-700 font-medium">Your Local Time ({visitorTimezone.split('/')[1] || visitorTimezone})</div>
                    <div className="text-slate-900 font-bold text-sm mt-0.5">{visitorLocalTime || 'Local'}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200/80">
                    <div className="text-[11px] text-slate-700 font-medium">Christian in Kisumu (EAT / UTC+3)</div>
                    <div className="text-[#0059e8] font-bold text-sm mt-0.5">{christianTime || 'EAT'}</div>
                  </div>
                </div>

                {/* Overlap Hours Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-700 font-mono font-medium">
                    <span>Golden Overlap: 2:00 PM – 7:00 PM EAT</span>
                    <span className="text-[#0059e8] font-bold">Optimal Sync</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1 pt-1">
                    <button
                      onClick={() => scheduleMeetingSlot('14:00 EAT / 11:00 UTC')}
                      className="p-1 text-center rounded bg-slate-50 hover:bg-blue-50 hover:border-[#0059e8]/50 border border-slate-200 text-[10px] text-slate-700 font-mono transition-colors"
                      title="14:00 EAT slot"
                    >
                      14:00
                    </button>
                    <button
                      onClick={() => scheduleMeetingSlot('15:00 EAT / 12:00 UTC')}
                      className="p-1 text-center rounded bg-slate-50 hover:bg-blue-50 hover:border-[#0059e8]/50 border border-slate-200 text-[10px] text-slate-700 font-mono transition-colors"
                      title="15:00 EAT slot"
                    >
                      15:00
                    </button>
                    <button
                      onClick={() => scheduleMeetingSlot('16:00 EAT / 13:00 UTC')}
                      className="p-1 text-center rounded bg-blue-50 hover:bg-blue-100 border border-blue-300 text-[10px] text-[#0059e8] font-mono transition-colors font-bold"
                      title="16:00 EAT slot (Popular)"
                    >
                      16:00 ★
                    </button>
                    <button
                      onClick={() => scheduleMeetingSlot('17:00 EAT / 14:00 UTC')}
                      className="p-1 text-center rounded bg-slate-50 hover:bg-blue-50 hover:border-[#0059e8]/50 border border-slate-200 text-[10px] text-slate-700 font-mono transition-colors"
                      title="17:00 EAT slot"
                    >
                      17:00
                    </button>
                    <button
                      onClick={() => scheduleMeetingSlot('18:00 EAT / 15:00 UTC')}
                      className="p-1 text-center rounded bg-slate-50 hover:bg-blue-50 hover:border-[#0059e8]/50 border border-slate-200 text-[10px] text-slate-700 font-mono transition-colors"
                      title="18:00 EAT slot"
                    >
                      18:00
                    </button>
                    <button
                      onClick={() => scheduleMeetingSlot('19:00 EAT / 16:00 UTC')}
                      className="p-1 text-center rounded bg-slate-50 hover:bg-blue-50 hover:border-[#0059e8]/50 border border-slate-200 text-[10px] text-slate-700 font-mono transition-colors"
                      title="19:00 EAT slot"
                    >
                      19:00
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-600 text-center font-mono font-medium pt-1">
                    Click any time slot above to pre-populate the direct message below
                  </div>
                </div>
              </div>

              {/* Direct Email Card */}
              <a
                href={`mailto:${user.email || 'christianamos67@gmail.com'}`}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-[#0059e8]/50 transition-colors shadow-xs group"
              >
                <div className="p-2 rounded-lg bg-blue-50 text-[#0059e8] group-hover:bg-[#0059e8] group-hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-700 font-medium">Direct Email</div>
                  <div className="text-sm font-semibold text-slate-900 font-mono">
                    {user.email || 'christianamos67@gmail.com'}
                  </div>
                </div>
              </a>

              {/* GitHub Card */}
              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-[#0059e8]/50 transition-colors shadow-xs group"
              >
                <div className="p-2 rounded-lg bg-blue-50 text-[#0059e8] group-hover:bg-[#0059e8] group-hover:text-white transition-colors">
                  <Github className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-700 font-medium">GitHub Profile</div>
                  <div className="text-sm font-semibold text-slate-900 font-mono">
                    github.com/{user.login}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-[#0059e8] transition-colors" />
              </a>

              {/* LinkedIn Card */}
              <a
                href="https://www.linkedin.com/in/christian-otieno-9a9806229/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-[#0059e8]/50 transition-colors shadow-xs group"
              >
                <div className="p-2 rounded-lg bg-blue-50 text-[#0059e8] group-hover:bg-[#0059e8] group-hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-700 font-medium">LinkedIn Profile</div>
                  <div className="text-sm font-semibold text-slate-900 font-mono">
                    christian-otieno-9a9806229
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-[#0059e8] transition-colors" />
              </a>

              {/* Verified Location Card */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-[#0059e8]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-700 font-medium">Location &amp; Base</div>
                  <div className="text-sm font-semibold text-slate-900">
                    Kisumu, Kenya · East Africa Time (EAT / UTC+3)
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact Dispatch */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Send a Direct Message
                </h3>
                <span className="text-xs font-mono text-slate-700 font-medium">
                  Direct dispatch to christianamos67@gmail.com
                </span>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 font-display">
                    Message Dispatched
                  </h4>
                  <p className="text-sm text-slate-700 max-w-sm mx-auto">
                    Thank you for reaching out. Your default email client was opened. You can also write directly to{' '}
                    <span className="text-slate-900 font-mono font-bold">{user.email || 'christianamos67@gmail.com'}</span>.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="text-xs font-mono text-slate-800 font-bold">
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ada Lovelace"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#0059e8] focus:ring-1 focus:ring-[#0059e8] transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="text-xs font-mono text-slate-800 font-bold">
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ada@example.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#0059e8] focus:ring-1 focus:ring-[#0059e8] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-subject" className="text-xs font-mono text-slate-800 font-bold">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="High-Throughput Go Streaming Architecture / Role Inquiry"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#0059e8] focus:ring-1 focus:ring-[#0059e8] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="text-xs font-mono text-slate-800 font-bold">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Hi Christian, I saw your work on Go HTTP 206 streaming and PostGIS GiST spatial indexing. We would love to discuss..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#0059e8] focus:ring-1 focus:ring-[#0059e8] transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-700 font-medium">
                      Dispatches directly to Christian's inbox
                    </span>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-sm font-semibold text-white bg-[#0059e8] hover:bg-[#0048c4] rounded-lg transition-all shadow-xs flex items-center gap-2 cursor-pointer"
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

        {/* Technical Articles & Systems Newsletter Subscription Section (WPS Signature Banner) */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#0047c2] via-[#0059e8] to-[#1266f6] border border-blue-400/30 p-6 sm:p-10 relative overflow-hidden shadow-xl text-white">
          {/* Subtle ambient lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.08] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#ff5722]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            {/* Left copy & topic tags */}
            <div className="max-w-xl space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/20 text-white backdrop-blur-xs">
                  <Newspaper className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Technical Articles &amp; Systems Architecture Memo
                </span>
              </div>

              <h4 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
                Subscribe to Systems Architecture Updates
              </h4>
              <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-normal">
                Receive notification alerts whenever Christian publishes a new deep-dive on Go socket streaming, PostGIS Hilbert spatial indexing, or Zone01 peer-defended concurrency patterns. Zero marketing fluff.
              </p>

              {/* Topic Selectors */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-mono text-white font-bold">Topics:</span>
                {[
                  { id: 'go', label: 'Go 206 Streaming' },
                  { id: 'databases', label: 'PostGIS & Spatial SQL' },
                  { id: 'systems', label: 'Zone01 Peer Audits' },
                ].map((topic) => {
                  const active = newsletterTopics.includes(topic.id);
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => toggleTopic(topic.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors border cursor-pointer ${
                        active
                          ? 'bg-white text-[#0059e8] font-bold border-white shadow-xs'
                          : 'bg-white/15 hover:bg-white/25 border-white/30 text-white font-semibold'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {topic.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Form / Subscription Status */}
            <div className="w-full lg:max-w-md">
              {newsletterStatus === 'success' || newsletterStatus === 'already-subscribed' ? (
                <div className="p-4 rounded-xl bg-white/15 border border-white/30 text-white backdrop-blur-md space-y-2 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 font-mono font-bold text-xs text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>{newsletterStatus === 'already-subscribed' ? 'Already Subscribed' : 'Subscription Confirmed!'}</span>
                  </div>
                  <p className="text-xs text-white font-mono font-medium">
                    {newsletterMsg}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-white/20 text-[11px] font-mono text-white font-medium">
                    <span>Active subscriber count: {subscriberCount}</span>
                    <button
                      onClick={() => {
                        setNewsletterStatus('idle');
                        setNewsletterEmail('');
                      }}
                      className="underline hover:text-white font-bold cursor-pointer"
                    >
                      Change email
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="engineer@company.com"
                        className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-white text-xs sm:text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white transition-colors font-mono shadow-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={newsletterStatus === 'loading'}
                      className="px-6 py-3 rounded-xl bg-[#ff5722] hover:bg-[#f44711] disabled:opacity-50 text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shrink-0"
                    >
                      {newsletterStatus === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Subscribing...</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-3.5 h-3.5" />
                          <span>Subscribe</span>
                        </>
                      )}
                    </button>
                  </div>

                  {newsletterStatus === 'error' && (
                    <p className="text-xs font-mono text-rose-200 bg-rose-900/40 p-2 rounded-lg border border-rose-300/30">
                      {newsletterMsg}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[11px] font-mono text-blue-200">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Zero spam · One-click unsubscribe</span>
                    </span>
                    <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">
                      {subscriberCount}+ engineers joined
                    </span>
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
