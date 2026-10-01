import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  Download,
  Copy,
  Check,
  Smartphone,
  Globe,
  Mail,
  UserCheck,
  Share2,
  Sparkles
} from 'lucide-react';
import { GithubUser } from '../types/github';
import { soundService } from '../services/sound';

interface ContactQrCodeWidgetProps {
  user: GithubUser;
}

type QrMode = 'vcard' | 'portfolio' | 'email';

export const ContactQrCodeWidget: React.FC<ContactQrCodeWidgetProps> = ({ user }) => {
  const [mode, setMode] = useState<QrMode>('vcard');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Dynamic portfolio URL fallback to current origin
  const portfolioUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://github.com/' + (user.login || 'christian3788');

  // Standard vCard 3.0 string for automatic mobile contact import
  const vCardData = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Otieno;Christian;Amos;;',
    'FN:Christian Amos Otieno',
    'ORG:Zone01 Kisumu',
    'TITLE:Systems & Software Engineer',
    `EMAIL;TYPE=INTERNET,PREF:${user.email || 'christianamos67@gmail.com'}`,
    `URL;TYPE=PORTFOLIO:${portfolioUrl}`,
    `URL;TYPE=GITHUB:https://github.com/${user.login || 'christian3788'}`,
    'URL;TYPE=LINKEDIN:https://www.linkedin.com/in/christian-otieno-9a9806229/',
    'ADR;TYPE=WORK:;;Kisumu;Nyanza;;Kenya',
    'NOTE:Systems-focused software engineer specializing in low-overhead network protocols in Go and PostGIS spatial indexing.',
    'END:VCARD',
  ].join('\r\n');

  const mailtoData = `mailto:${user.email || 'christianamos67@gmail.com'}?subject=${encodeURIComponent(
    'Systems Engineering Inquiry · Christian Amos Otieno'
  )}&body=${encodeURIComponent(
    'Hi Christian,\n\nI reviewed your portfolio and would like to discuss a systems software engineering opportunity.\n\nBest regards,\n'
  )}`;

  // Determine active QR payload
  const activeValue =
    mode === 'vcard'
      ? vCardData
      : mode === 'portfolio'
      ? portfolioUrl
      : mailtoData;

  const handleModeChange = (newMode: QrMode) => {
    soundService.playClick(240, 0.02);
    setMode(newMode);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(mode === 'vcard' ? vCardData : activeValue);
    setCopied(true);
    soundService.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadVcf = () => {
    soundService.playClick(220, 0.02);
    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Christian_Amos_Otieno.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadQrImage = () => {
    soundService.playClick(260, 0.02);
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 400, 400);
        ctx.drawImage(img, 20, 20, 360, 360);
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `Christian_Otieno_QR_${mode}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,89,232,0.06)] p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-50 text-[#0059e8]">
            <QrCode className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-display">
              Scan to Connect &amp; Save Contact
            </h4>
            <p className="text-[11px] text-slate-700 font-sans mt-0.5">
              Point your phone camera to instantly save Christian's vCard or open portfolio.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold text-[#0059e8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0 hidden sm:inline">
          LIVE QR
        </span>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100/90 rounded-xl text-xs font-mono">
        <button
          onClick={() => handleModeChange('vcard')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
            mode === 'vcard'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Save Christian directly into phone Contacts as a vCard"
        >
          <UserCheck className="w-3.5 h-3.5 text-[#0059e8]" />
          <span className="text-[11px]">Save Contact</span>
        </button>

        <button
          onClick={() => handleModeChange('portfolio')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
            mode === 'portfolio'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Open Portfolio Website Link"
        >
          <Globe className="w-3.5 h-3.5 text-sky-600" />
          <span className="text-[11px]">Portfolio URL</span>
        </button>

        <button
          onClick={() => handleModeChange('email')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
            mode === 'email'
              ? 'bg-white text-slate-900 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Compose Email to Christian"
        >
          <Mail className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px]">Direct Mail</span>
        </button>
      </div>

      {/* Main QR Display Section */}
      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
        {/* QR Code Container */}
        <div
          ref={qrRef}
          className="p-3 rounded-xl bg-white border border-slate-300 shadow-sm flex items-center justify-center shrink-0 group relative cursor-pointer"
          onClick={handleDownloadQrImage}
          title="Click to download QR code as PNG"
        >
          <QRCodeSVG
            value={activeValue}
            size={148}
            level="M"
            bgColor="#ffffff"
            fgColor="#0f172a"
            marginSize={2}
            imageSettings={{
              src: '/icon.svg',
              x: undefined,
              y: undefined,
              height: 24,
              width: 24,
              excavate: true,
            }}
          />
          {/* Subtle hover prompt */}
          <div className="absolute inset-0 bg-slate-900/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-mono font-bold backdrop-blur-2xs">
            Save PNG
          </div>
        </div>

        {/* QR Explanation & Context */}
        <div className="space-y-2 text-xs font-sans text-slate-700 flex-1">
          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-[#0059e8]" />
            <span>
              {mode === 'vcard'
                ? 'Direct vCard Mobile Import'
                : mode === 'portfolio'
                ? 'Instant Portfolio Web Link'
                : 'Direct Email Composer'}
            </span>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
            {mode === 'vcard'
              ? 'Scan with iOS Camera or Android Lens to add Christian Amos Otieno (email, LinkedIn, GitHub, and location) straight to your phone address book.'
              : mode === 'portfolio'
              ? 'Instant mobile web access to explore all 44 repositories, 3D planetary telemetry globe, and systems benchmarks on the go.'
              : 'Opens your default mobile mail client with Christian\'s verified address pre-filled.'}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
            <span className="text-slate-500 font-medium">Payload:</span>
            <span className="text-slate-800 font-semibold truncate max-w-[200px] bg-white px-2 py-0.5 rounded border border-slate-200">
              {mode === 'vcard'
                ? 'Christian Amos Otieno.vcf'
                : mode === 'portfolio'
                ? portfolioUrl
                : user.email || 'christianamos67@gmail.com'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
        <button
          onClick={mode === 'vcard' ? handleDownloadVcf : handleCopyPayload}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0059e8] font-bold border border-blue-200 transition-colors shadow-2xs cursor-pointer"
        >
          {mode === 'vcard' ? (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Download .vcf Card</span>
            </>
          ) : copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        <button
          onClick={handleDownloadQrImage}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold border border-slate-200 transition-colors shadow-2xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          <span>Save QR as Image</span>
        </button>
      </div>
    </div>
  );
};
