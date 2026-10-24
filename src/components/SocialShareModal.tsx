import React, { useState } from 'react';
import { Share2, X, Copy, Check, ExternalLink, Send, MessageCircle } from 'lucide-react';
import { Language } from '../types';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  summary: string;
  url?: string;
  lang: Language;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  title,
  summary,
  url,
  lang
}) => {
  const [copied, setCopied] = useState(false);
  const isEthiopic = lang === 'am' || lang === 'ti';
  const targetUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = `${title}\n\n${summary}\n\n🔗 ${targetUrl}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (_) {}
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${title} - ${summary}`,
          url: targetUrl
        });
        onClose();
      } catch (_) {}
    } else {
      handleCopy();
    }
  };

  const openTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(targetUrl)}&text=${encodeURIComponent(`${title}\n${summary}`)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  const openWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${summary}\n${targetUrl}`)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const openFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(targetUrl)}&quote=${encodeURIComponent(title)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-700 text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEthiopic ? 'መረጃውን ለሌሎች ያጋሩ (Share)' : 'Share with Neighbors'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isEthiopic ? 'ለማህበረሰብዎ በቴሌግራም፣ ዋትስአፕ ወይም ፌስቡክ ያጋሩ' : 'Share to Telegram, WhatsApp, or Facebook'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview snippet */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
          <strong className="text-slate-900 font-bold block">{title}</strong>
          <p className="text-slate-600 line-clamp-2">{summary}</p>
        </div>

        {/* Share buttons grid */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <button
            type="button"
            onClick={openTelegram}
            className="p-3 rounded-2xl bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-[#0088cc] flex flex-col items-center justify-center gap-1.5 transition font-bold text-xs"
          >
            <Send className="w-5 h-5 text-[#229ED9]" />
            <span>Telegram</span>
          </button>

          <button
            type="button"
            onClick={openWhatsApp}
            className="p-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] flex flex-col items-center justify-center gap-1.5 transition font-bold text-xs"
          >
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={openFacebook}
            className="p-3 rounded-2xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-[#1877F2] flex flex-col items-center justify-center gap-1.5 transition font-bold text-xs"
          >
            <span className="text-lg font-black leading-none text-[#1877F2]">f</span>
            <span>Facebook</span>
          </button>
        </div>

        {/* Copy link bar */}
        <div className="pt-1 flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={targetUrl}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 truncate"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (isEthiopic ? 'ተቀድቷል!' : 'Copied!') : (isEthiopic ? 'ሊንክ ቅዳ' : 'Copy')}</span>
          </button>
        </div>

        {/* Mobile native share trigger */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>{isEthiopic ? 'በስልክዎ መተግበሪያዎች አጋራ (More Apps)' : 'Share via Device Apps'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
