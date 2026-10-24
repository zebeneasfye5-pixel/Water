import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  MoreVertical,
  Compass,
  Copy,
  Check,
  Sparkles,
  Info
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose, lang }) => {
  const { hasPrompt, isInstalled, isIOS, isAndroid, isChrome, isInAppBrowser, install } = usePWAInstall();
  const [isProcessing, setIsProcessing] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [highlightGuide, setHighlightGuide] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    // Haptic feedback if available on mobile
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 30, 40]);
      } catch (_) {}
    }

    setIsProcessing(true);
    setHighlightGuide(false);

    try {
      const result = await install();

      if (result.outcome === 'accepted') {
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2500);
      } else {
        // Either prompt was not available or manual guidance needed (e.g. in-app browser or Safari)
        setHighlightGuide(true);
      }
    } catch (err) {
      console.warn('Install handler error:', err);
      setHighlightGuide(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (_) {}
  };

  const handleOpenInChrome = () => {
    try {
      const currentUrl = window.location.href;
      // Android Intent to open strictly in Google Chrome
      const chromeIntent = `intent://${window.location.host}${window.location.pathname}${window.location.search}#Intent;scheme=https;package=com.android.chrome;end`;
      window.location.href = chromeIntent;
    } catch (_) {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-5 sm:p-6 overflow-hidden space-y-4 animate-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-700 to-cyan-500 text-white flex items-center justify-center shadow-md shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider block">
                {lang === 'am' ? 'ይፋዊ የሞባይል አፕሊኬሽን' : lang === 'om' ? 'Appilikeeshinii Moobaayilaa' : lang === 'ti' ? 'ናይ ሞባይል ኣፕሊኬሽን' : 'Official Mobile App'}
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {lang === 'am' ? 'አፑን በስልክዎ ላይ ይጫኑ' : lang === 'om' ? 'Appicha Moobaayila Keerratti Fe\'i' : lang === 'ti' ? 'ነዚ ኣፕ ኣብ ሞባይልኩም ጽዓንዎ' : 'Install AquaFlow on Phone'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status: Already Installed */}
        {isInstalled ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {lang === 'am' ? 'አፕሊኬሽኑ በስልክዎ ላይ ተጭኗል!' : 'Application is already installed!'}
            </h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              {lang === 'am'
                ? 'በስልክዎ መነሻ ገጽ (Home Screen) ላይ ባለው የአፑ ምልክት አማካኝነት ያለምንም ኢንተርኔት መክፈት ይችላሉ።'
                : 'You can launch it anytime directly from your phone home screen.'}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition shadow-sm"
            >
              {lang === 'am' ? 'ዝጋ' : 'Close'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick Benefits */}
            <div className="grid grid-cols-3 gap-2 bg-gradient-to-r from-slate-50 to-cyan-50/40 p-2.5 rounded-2xl border border-slate-100 text-center text-xs">
              <div className="p-1">
                <span className="font-bold text-cyan-800 block text-xs">⚡ 1 ሰከንድ</span>
                <span className="text-[10px] text-slate-500">ቀጥታ ይከፈታል</span>
              </div>
              <div className="p-1 border-x border-slate-200/60">
                <span className="font-bold text-cyan-800 block text-xs">📶 ኦፍላይን</span>
                <span className="text-[10px] text-slate-500">ያለ ኔትዎርክ ይሰራል</span>
              </div>
              <div className="p-1">
                <span className="font-bold text-cyan-800 block text-xs">🔔 ማሳወቂያ</span>
                <span className="text-[10px] text-slate-500">የውሃ ሰዓት መልዕክት</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleInstallClick}
                disabled={isProcessing}
                className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer ${
                  highlightGuide
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-4 ring-amber-300/60 animate-bounce'
                    : 'bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 text-white'
                }`}
              >
                {isProcessing ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{lang === 'am' ? 'እባክዎ ይጠብቁ...' : 'Connecting...'}</span>
                  </span>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-cyan-200" />
                    <span>
                      {hasPrompt
                        ? (lang === 'am' ? 'አሁን በ1 ጠቅታ ጫን (Install Now)' : 'Install to Home Screen')
                        : highlightGuide
                        ? (lang === 'am' ? '👉 ከላይ ባለ 3 ነጥብ (⋮) ጫን የሚለውን ይምረጡ' : 'Follow Steps Below')
                        : (lang === 'am' ? 'አፕሊኬሽኑን በስልክዎ ላይ ጫን (Install App)' : 'Install on Your Device')}
                    </span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-500">
                {lang === 'am' ? '0MB ማስታወሻ ቦታ • ፈጣን፣ ደህንነቱ የተጠበቀ PWA' : 'Fast, safe, zero-storage PWA • Works on any phone'}
              </p>
            </div>

            {/* In-App Browser Warning & One-Tap Actions */}
            {(isInAppBrowser || highlightGuide) && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-lg bg-amber-200 text-amber-900 shrink-0">
                    <MoreVertical className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="text-xs">
                    <p className="font-extrabold text-amber-950">
                      {lang === 'am'
                        ? 'በስልክዎ ብራውዘር በቀላሉ ለመጫን፦'
                        : 'To complete installation on your phone:'}
                    </p>
                    <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
                      {lang === 'am'
                        ? 'በብራውዘርዎ የላይኛው ቀኝ ጥግ ያለውን ባለ 3 ነጥብ (⋮) ወይም ማጋሪያ (Share) በመጫን "መተግበሪያውን ጫን" (Install app) ወይም "ወደ መነሻ ገጽ አክል" (Add to Home screen) የሚለውን ይምረጡ።'
                        : 'Tap the top-right 3 dots (⋮) or Share icon in your browser, then tap "Install app" or "Add to Home screen".'}
                    </p>
                  </div>
                </div>

                {/* Quick Action buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleOpenInChrome}
                    className="flex-1 py-2 px-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{lang === 'am' ? 'በChrome ክፈት' : 'Open in Chrome'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="py-2 px-3 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-[11px] font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? (lang === 'am' ? 'ተቀድቷል!' : 'Copied!') : (lang === 'am' ? 'ሊንክ ቅዳ' : 'Copy')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Android Chrome Instructions */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              highlightGuide
                ? 'border-cyan-500 bg-cyan-50/70 ring-2 ring-cyan-400'
                : 'border-slate-200 bg-slate-50/70'
            } space-y-2.5`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold">1</span>
                  <span>{lang === 'am' ? 'በአንድሮይድ ስልክ (Android / Chrome):' : 'For Android / Chrome Phone:'}</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Android</span>
              </div>
              <ol className="text-xs text-slate-700 space-y-1.5 pl-7 list-decimal leading-relaxed">
                <li className="font-semibold text-slate-900 flex items-center gap-1.5 flex-wrap">
                  <span>{lang === 'am' ? 'የብራውዘርዎን የላይኛው ቀኝ' : 'Tap the top-right'}</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-bold text-slate-800 shadow-2xs">
                    <MoreVertical className="w-3.5 h-3.5 inline text-cyan-700" /> 3 ነጥቦች (⋮)
                  </span>
                  <span>{lang === 'am' ? 'ይጫኑ።' : 'in Chrome.'}</span>
                </li>
                <li>
                  {lang === 'am'
                    ? 'ከሚመጡት ዝርዝሮች ውስጥ "መተግበሪያውን ጫን" (Install app) ወይም "ወደ መነሻ ገጽ አክል" (Add to Home screen) የሚለውን ይምረጡ።'
                    : 'Select "Install app" or "Add to Home screen".'}
                </li>
                <li className="text-emerald-700 font-medium">
                  {lang === 'am' ? 'አፑ በስልክዎ ላይ እንደማንኛውም አፕሊኬሽን ይጫናል!' : 'The app icon will immediately appear on your phone home screen!'}
                </li>
              </ol>
            </div>

            {/* iOS Safari iPhone Instructions */}
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">2</span>
                  <span>{lang === 'am' ? 'በአይፎን ስልክ (iPhone / iPad Safari):' : 'For iPhone / iPad (Safari):'}</span>
                </div>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">iOS</span>
              </div>
              <ol className="text-xs text-slate-700 space-y-1.5 pl-7 list-decimal leading-relaxed">
                <li className="flex items-center gap-1.5 flex-wrap">
                  <span>{lang === 'am' ? 'ከስር ያለውን የማጋሪያ ምልክት' : 'Tap the Safari Share icon'}</span>
                  <span className="inline-flex items-center px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-bold text-slate-800 shadow-2xs">
                    <Share2 className="w-3.5 h-3.5 text-blue-600 inline mr-1" /> Share
                  </span>
                  <span>{lang === 'am' ? 'ይጫኑ' : ''}</span>
                </li>
                <li className="flex items-center gap-1.5 flex-wrap">
                  <span>{lang === 'am' ? 'ወደ ታች ዝቅ ብለው' : 'Scroll down and tap'}</span>
                  <span className="inline-flex items-center px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-bold text-slate-800 shadow-2xs">
                    <PlusSquare className="w-3.5 h-3.5 text-slate-800 inline mr-1" /> Add to Home Screen
                  </span>
                  <span>{lang === 'am' ? 'የሚለውን ይጫኑ' : ''}</span>
                </li>
              </ol>
            </div>

            <div className="pt-1 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopyLink}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink ? (lang === 'am' ? 'ሊንኩ ተቀድቷል' : 'Copied!') : (lang === 'am' ? 'የድረገፁን ሊንክ ቅዳ' : 'Copy link')}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition shadow-sm"
              >
                {lang === 'am' ? 'ተረድቻለሁ / እሺ' : 'Understood / Done'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
