import React, { useState } from 'react';
import { Smartphone, Download, Share2, PlusSquare, CheckCircle2, X, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose, lang }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 overflow-hidden space-y-5 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-700 text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider block">
                {lang === 'am' ? 'የሞባይል አፕሊኬሽን' : lang === 'om' ? 'Appilikeeshinii Moobaayilaa' : lang === 'ti' ? 'ናይ ሞባይል ኣፕሊኬሽን' : 'Mobile App Installation'}
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'am' ? 'አፑን በስልክዎ ላይ ይጫኑ' : lang === 'om' ? 'Appicha Moobaayila Keerratti Fe\'i' : lang === 'ti' ? 'ነዚ ኣፕ ኣብ ሞባይልኩም ጽዓንዎ' : 'Install AquaFlow on Phone'}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status: Already Installed */}
        {isInstalled ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {lang === 'am' ? 'አፕሊኬሽኑ በስልክዎ ላይ ተጭኗል!' : 'Application is already installed!'}
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {lang === 'am'
                ? 'በስልክዎ መነሻ ገጽ (Home Screen) ላይ ባለው የአፑ ምልክት አማካኝነት ያለምንም ኢንተርኔት መክፈት ይችላሉ።'
                : 'You can launch it anytime directly from your device home screen.'}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-black"
            >
              {lang === 'am' ? 'ዝጋ' : 'Close'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick Benefits */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center text-xs">
              <div>
                <span className="font-bold text-cyan-800 block">⚡ ፈጣን</span>
                <span className="text-[10px] text-slate-500">በ1 ሰከንድ ይከፈታል</span>
              </div>
              <div>
                <span className="font-bold text-cyan-800 block">📶 ከመስመር ውጭ</span>
                <span className="text-[10px] text-slate-500">ያለ ኔትዎርክ ይሰራል</span>
              </div>
              <div>
                <span className="font-bold text-cyan-800 block">🔔 ማሳወቂያ</span>
                <span className="text-[10px] text-slate-500">የውሃ ሰዓት መልዕክት</span>
              </div>
            </div>

            {/* Direct 1-Click Install Button */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleNativeInstall}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md active:scale-98"
              >
                <Download className="w-4 h-4 text-cyan-200" />
                <span>
                  {isInstallable
                    ? (lang === 'am' ? 'አሁን በ1 ጠቅታ ጫን (Install Now)' : 'Install to Home Screen')
                    : (lang === 'am' ? 'አፕሊኬሽኑን በስልክዎ ላይ ጫን (Install App)' : 'Install on Your Device')}
                </span>
              </button>
              <p className="text-[11px] text-center text-slate-500">
                {lang === 'am' ? 'ምንም አይነት የማስታወሻ ቦታ አይወስድም (ቀላል፣ ደህንነቱ የተጠበቀ PWA)' : 'Takes 0 storage space • Fast, safe & works offline'}
              </p>
            </div>

            {/* Android Chrome Instructions */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">1</span>
                <span>{lang === 'am' ? 'በአንድሮይድ ስልክ (Android / Chrome):' : 'For Android / Chrome Phone:'}</span>
              </div>
              <ol className="text-xs text-slate-600 space-y-1 pl-7 list-decimal leading-relaxed">
                <li>
                  {lang === 'am' ? 'የብራውዘርዎን የላይኛው ቀኝ 3 ነጥቦች (⋮) ይጫኑ።' : 'Tap the top-right 3 dots menu (⋮) in Chrome.'}
                </li>
                <li>
                  {lang === 'am'
                    ? '"መተግበሪያውን ጫን" ወይም "ወደ መነሻ ገጽ አክል" (Install app / Add to Home screen) የሚለውን ይምረጡ።'
                    : 'Select "Install app" or "Add to Home screen".'}
                </li>
                <li>
                  {lang === 'am' ? 'አፑ በስልክዎ ላይ እንደማንኛውም አፕሊኬሽን ይጫናል!' : 'The app icon will appear on your phone home screen!'}
                </li>
              </ol>
            </div>

            {/* iOS Safari iPhone Instructions */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">2</span>
                <span>{lang === 'am' ? 'በአይፎን ስልክ (iPhone / iPad Safari):' : 'For iPhone / iPad (Safari):'}</span>
              </div>
              <ol className="text-xs text-slate-600 space-y-1 pl-7 list-decimal leading-relaxed">
                <li className="flex items-center gap-1.5 flex-wrap">
                  <span>{lang === 'am' ? 'ከስር ያለውን የማጋሪያ ምልክት' : 'Tap the Safari Share icon'}</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-semibold text-slate-700">
                    <Share2 className="w-3 h-3 text-blue-600 inline mr-0.5" /> Share
                  </span>
                  <span>{lang === 'am' ? 'ይጫኑ' : ''}</span>
                </li>
                <li className="flex items-center gap-1.5 flex-wrap">
                  <span>{lang === 'am' ? 'ወደ ታች ዝቅ ብለው' : 'Scroll down and tap'}</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-semibold text-slate-700">
                    <PlusSquare className="w-3 h-3 text-slate-700 inline mr-0.5" /> Add to Home Screen
                  </span>
                  <span>{lang === 'am' ? 'የሚለውን ይጫኑ' : ''}</span>
                </li>
              </ol>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                {lang === 'am' ? 'ተረድቻለሁ / ዝጋ' : 'Understood / Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
