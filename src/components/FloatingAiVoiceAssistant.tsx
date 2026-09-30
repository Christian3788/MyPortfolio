import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, X, MessageSquare, Send, Bot, User, Play, Square, Loader2 } from 'lucide-react';
import { soundService } from '../services/sound';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const FloatingAiVoiceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hello! I am Christian Amos Otieno's portfolio AI voice assistant. Ask me anything about his Go HTTP 206 streaming engine, PostGIS spatial indexing, Zone01 peer defenses, or how to contact him.",
      timestamp: 'Now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Stop speech when closing
  useEffect(() => {
    if (!isOpen && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  // Initialize SpeechRecognition if available
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        handleSendQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const speakText = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const clean = text.replace(/[*#`_\[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick an expressive English voice if present
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      soundService.playClick(180, 0.02);
    } else {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      soundService.playClick(320, 0.03);
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSendQuery = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || isLoading) return;

    setInputQuery('');
    soundService.playClick(240, 0.02);

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: Message = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        speakText(data.spokenText || data.answer);
      } else {
        throw new Error('API offline');
      }
    } catch {
      // High-accuracy offline answer matching
      let fallbackAnswer = "Christian Amos Otieno is a systems-focused software engineer based in Kisumu, Kenya, specializing in Go network streaming, PostGIS spatial indexing, and Zone01 peer-defended mastery.";
      const lower = q.toLowerCase();

      if (lower.includes('lyric') || lower.includes('stream') || lower.includes('206')) {
        fallbackAnswer = "LYRIC is Christian's Go HTTP 206 streaming engine that uses io.CopyN on raw sockets, reducing heap memory footprint by 78% under concurrent load compared to naive buffering.";
      } else if (lower.includes('gis') || lower.includes('postgis') || lower.includes('spatial')) {
        fallbackAnswer = "Christian optimized PostGIS spatial queries on 100k polygon records using 2D GiST R-tree indexing and Hilbert curve clustering, reducing query time from 118ms to 3.12ms.";
      } else if (lower.includes('zone01') || lower.includes('peer') || lower.includes('defense')) {
        fallbackAnswer = "At Zone01 Kisumu, Christian defended production architectures including atomic advisory lock claims in KijijiShare and zero-copy Go memory pipelines with unanimous board approvals.";
      } else if (lower.includes('contact') || lower.includes('email') || lower.includes('hire')) {
        fallbackAnswer = "You can contact Christian directly at christianamos67@gmail.com or via GitHub at github.com/Christian3788. He is based in Kisumu (UTC+3) with 24-hour response turnaround.";
      }

      const fallbackMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: fallbackAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      speakText(fallbackAnswer);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputQuery(prompt);
    handleSendQuery(prompt);
  };

  return (
    <aside aria-label="AI Voice Assistant" className="fixed bottom-6 right-6 z-50">
      
      {/* Expanded Voice Assistant Dialog */}
      {isOpen && (
        <div
          role="region"
          aria-label="AI Voice Assistant Chat Window"
          className="relative mb-3 w-[92vw] sm:w-[400px] h-[520px] rounded-2xl bg-white/98 border border-slate-200/90 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 text-slate-900"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full bg-[#0059e8] flex items-center justify-center text-white shadow-xs">
                <Bot className="w-4 h-4" />
                {isSpeaking && (
                  <span className="absolute -inset-1 rounded-full bg-blue-500/40 animate-ping pointer-events-none" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-display">
                  <span>Christian AI Voice Assistant</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[10px] text-slate-700 font-mono font-medium">
                  {isSpeaking ? 'Speaking audio...' : isListening ? 'Listening to voice...' : 'Gemini 3.8-Flash Ready'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  if (window.speechSynthesis) window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  voiceEnabled ? 'text-[#0059e8] hover:text-[#0048c4]' : 'text-slate-500 hover:text-slate-800'
                }`}
                title={voiceEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Minimize Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Voice Waveform Activity Strip */}
          {(isSpeaking || isListening) && (
            <div className="px-4 py-2 bg-blue-50 border-b border-blue-200 flex items-center justify-between text-[11px] font-mono text-[#0059e8]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0059e8] animate-pulse" />
                <span>{isSpeaking ? 'Synthesizing voice response...' : 'Listening to speech...'}</span>
              </div>
              <div className="flex items-center gap-1 h-3">
                <span className="w-1 h-3 bg-[#0059e8] animate-pulse" />
                <span className="w-1 h-2 bg-blue-400 animate-pulse" />
                <span className="w-1 h-3.5 bg-[#0059e8] animate-pulse" />
                <span className="w-1 h-1.5 bg-blue-400 animate-pulse" />
              </div>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0059e8] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3 rounded-xl leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#0059e8] text-white font-medium rounded-tr-none shadow-xs'
                      : 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-none shadow-xs font-normal'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  <div className={`text-[9px] mt-1 text-right font-mono ${m.role === 'user' ? 'text-blue-100' : 'text-slate-600 font-medium'}`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-slate-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-blue-50 text-[#0059e8] flex items-center justify-center">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span>Reasoning with Gemini...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono text-slate-700">
            <span className="text-slate-600 font-bold shrink-0">Ask:</span>
            <button
              onClick={() => handleQuickPrompt("Tell me about LYRIC's Go streaming architecture")}
              className="px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 whitespace-nowrap transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              LYRIC Streamer
            </button>
            <button
              onClick={() => handleQuickPrompt("What did Christian defend at Zone01 Kisumu?")}
              className="px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 whitespace-nowrap transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              Zone01 Defenses
            </button>
            <button
              onClick={() => handleQuickPrompt("Explain the PostGIS GiST index optimization")}
              className="px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 whitespace-nowrap transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              PostGIS 3.12ms
            </button>
            <button
              onClick={() => handleQuickPrompt("How can I interview Christian for a role?")}
              className="px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 whitespace-nowrap transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              Contact / Hire
            </button>
          </div>

          {/* Query Input & Voice Trigger */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-[#0059e8]'
                }`}
                title={isListening ? 'Stop listening' : 'Speak via microphone'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Speak or type a question..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#0059e8] focus:ring-1 focus:ring-[#0059e8] transition-colors"
              />

              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="p-2.5 rounded-xl bg-[#0059e8] hover:bg-[#0048c4] disabled:opacity-40 text-white transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Trigger Orb */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          soundService.playClick(320, 0.03);
        }}
        className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-[#0059e8] hover:bg-[#0048c4] text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
        title="Open Christian's AI Voice Assistant"
      >
        <div className="relative flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
          </div>

          <span className="text-xs font-bold font-display tracking-tight text-white pr-1 hidden sm:inline">
            AI Voice Assistant
          </span>
        </div>
      </button>

    </aside>
  );
};
