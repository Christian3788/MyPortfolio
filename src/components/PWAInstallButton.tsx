import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundService } from '../services/sound';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'footer' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running as an installed standalone PWA, hide
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    soundService.playClick(240, 0.02);
    const ok = await install();
    if (ok) {
      setInstallSuccess(true);
      soundService.playSuccess();
      setTimeout(() => setInstallSuccess(false), 3000);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'navbar') {
      return (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md transition-all cursor-pointer font-mono shadow-2xs"
          title="Install Portfolio App on Desktop or Mobile (PWA)"
        >
          {installSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px]">Installed!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden xl:inline text-[11px]">Install App</span>
            </>
          )}
        </button>
      );
    }

    return (
      <button
        onClick={handleInstallClick}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer font-mono"
      >
        <Download className="w-4 h-4 text-emerald-600" />
        <span>Install Standalone PWA</span>
      </button>
    );
  }

  // iOS Safari flow (WebKit manual Share -> Add to Home Screen)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => {
            soundService.playClick(220, 0.02);
            setShowIOSGuide(true);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors cursor-pointer font-mono shadow-2xs"
          title="Install on iOS Safari"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#0059e8]" />
          <span className="hidden xl:inline text-[11px]">Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#0059e8]" />
                  <span>Install on iPhone / iPad</span>
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-500 hover:text-slate-800 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-sans">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-blue-50/70 border border-blue-200 text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-[#0059e8] text-white flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Tap the <strong>Share</strong> button (box with upward arrow) in the Safari bottom toolbar.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Scroll down and select <strong>Add to Home Screen</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <span>Tap <strong>Add</strong>. Launch from your home screen for full offline flight mode.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-lg bg-[#0059e8] text-white text-xs font-semibold hover:bg-[#0048c4] transition-colors cursor-pointer shadow-xs"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
