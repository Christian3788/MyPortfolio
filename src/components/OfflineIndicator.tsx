import React, { useEffect, useState } from 'react';
import { WifiOff, Zap } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <aside aria-label="Offline status banner" className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 border border-amber-500/40 px-3.5 py-2 text-xs font-mono font-medium text-amber-200 shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
      <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
      <WifiOff className="w-3.5 h-3.5 text-amber-400" />
      <span>Offline Mode — Cached Systems Telemetry Active</span>
      <span className="text-[10px] bg-amber-400/20 px-1.5 py-0.5 rounded text-amber-100 font-bold ml-1">
        PWA
      </span>
    </aside>
  );
};
