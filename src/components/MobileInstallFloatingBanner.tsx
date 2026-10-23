import React, { useState } from 'react';
import { Smartphone, Download, X, Droplets, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';

interface MobileInstallFloatingBannerProps {
  lang: Language;
  onOpenModal: () => void;
}

export const MobileInstallFloatingBanner: React.FC<MobileInstallFloatingBannerProps> = ({
  lang,
  onOpenModal
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const isEthiopic = lang === 'am' || lang === 'om' || lang === 'ti';

  if (isInstalled || dismissed) return null;

  const handleQuickInstall = async () => {
    if (isInstallable) {
      const ok = await install();
      if (!ok) {
        onOpenModal();
      }
    } else {
      onOpenModal();
    }
  };

  return (
    <aside
      aria-label="Mobile app installation prompt"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-40 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-cyan-500/30 animate-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-center justify-between gap-3">
        {/* App Icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-md">
          <Droplets className="w-5 h-5 text-white" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
              {isEthiopic ? 'ይፋዊ የሞባይል አፕ' : 'Official Mobile App'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h4 className="text-xs font-bold text-white truncate">
            {isEthiopic ? 'አፑን በስልክዎ ላይ ይጫኑ' : 'Install AquaFlow App'}
          </h4>
          <p className="text-[11px] text-slate-300 truncate">
            {isEthiopic ? 'ፈጣን፣ ቀላል፣ ያለ ኔትዎርክ የሚሰራ' : '1-click install • Works offline'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleQuickInstall}
            className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-slate-950" />
            <span>{isEthiopic ? 'አፕ ጫን' : 'Install'}</span>
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
