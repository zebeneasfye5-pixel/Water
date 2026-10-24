import React from 'react';
import {
  X,
  LayoutDashboard,
  Droplets,
  CreditCard,
  AlertCircle,
  UserPlus,
  Lightbulb,
  Shield,
  FileCheck2,
  Truck,
  Smartphone,
  Phone,
  FileSpreadsheet,
  ChevronRight,
  Globe,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Language, BillRecord, WaterSchedule } from '../types';
import { translations } from '../utils/translations';

interface DashboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeNav: string;
  onSelectNav: (nav: 'schedule' | 'citizen-dashboard' | 'payments' | 'incident' | 'knowledge' | 'staff' | 'register' | 'contract') => void;
  lang: Language;
  onOpenTankerModal: () => void;
  onOpenInstallModal: () => void;
  bills: BillRecord[];
  schedules: WaterSchedule[];
}

export const DashboardDrawer: React.FC<DashboardDrawerProps> = ({
  isOpen,
  onClose,
  activeNav,
  onSelectNav,
  lang,
  onOpenTankerModal,
  onOpenInstallModal,
  bills,
  schedules
}) => {
  if (!isOpen) return null;

  const isEthiopic = lang === 'am' || lang === 'ti';
  const t = translations[lang];

  // Quick citizen preview
  const primaryBill = bills[0];
  const primarySchedule = schedules[0];

  const handleNavClick = (nav: 'schedule' | 'citizen-dashboard' | 'payments' | 'incident' | 'knowledge' | 'staff' | 'register' | 'contract') => {
    onSelectNav(nav);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel from Right */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 border-l border-slate-200">
          
          {/* 1. Drawer Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 block">
                  {isEthiopic ? 'የተሟላ ዳሽቦርድ እና ሜኑ' : 'Full Dashboard & Menu'}
                </span>
                <h3 className="text-base font-black text-white tracking-tight">
                  {isEthiopic ? 'አኳፍሎው የቁጥጥር ማዕከል' : 'AquaFlow Control Hub'}
                </h3>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              title="Close Menu (✕)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Quick Live Status Snippet in Drawer */}
          <div className="px-5 py-3.5 bg-cyan-50/70 border-b border-cyan-100 flex items-center justify-between text-xs text-slate-700 font-mono-numbers">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-800">
                {isEthiopic ? 'የአሁኑ ፍሰት:' : 'Zone Flow:'} {primarySchedule?.pressureBar || 3.8} Bar
              </span>
            </div>
            <div className="text-[11px] text-slate-600">
              {isEthiopic ? 'ያልተከፈለ ሂሳብ:' : 'Balance:'}{' '}
              <strong className="text-cyan-900 font-bold">{primaryBill?.totalBirr || 395.50} ETB</strong>
            </div>
          </div>

          {/* 3. Navigation Sections Body */}
          <div className="p-5 sm:p-6 space-y-6 flex-1">
            
            {/* Section A: Citizen Core Services */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {isEthiopic ? '👤 የዜጎችና የነዋሪዎች አገልግሎት' : '👤 Citizen Services'}
                </span>
                <span className="text-[10px] text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full font-bold">
                  {isEthiopic ? 'የቀጥታ' : 'Live'}
                </span>
              </div>

              <div className="space-y-1">
                {/* 1. Citizen Dashboard */}
                <button
                  onClick={() => handleNavClick('citizen-dashboard')}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between transition text-left ${
                    activeNav === 'citizen-dashboard'
                      ? 'bg-cyan-700 text-white shadow-md'
                      : 'hover:bg-slate-50 text-slate-800 border border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      activeNav === 'citizen-dashboard' ? 'bg-white/20 text-white' : 'bg-cyan-100 text-cyan-800'
                    }`}>
                      <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">
                        {isEthiopic ? 'የተጠቃሚ ዳሽቦርድ (My Dashboard)' : 'My Citizen Dashboard'}
                      </span>
                      <span className={`text-[11px] block ${
                        activeNav === 'citizen-dashboard' ? 'text-cyan-100' : 'text-slate-500'
                      }`}>
                        {isEthiopic ? 'የግል ቆጣሪ፣ የውሃ ፍሰት እና የፍጆታ ግራፍ' : 'Meter status, balance & consumption'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>

                {/* 2. Schedule */}
                <button
                  onClick={() => handleNavClick('schedule')}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between transition text-left ${
                    activeNav === 'schedule'
                      ? 'bg-cyan-700 text-white shadow-md'
                      : 'hover:bg-slate-50 text-slate-800 border border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      activeNav === 'schedule' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                    }`}>
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">
                        {isEthiopic ? 'የውሃ ስርጭት መርሃግብር' : 'Water Distribution Schedule'}
                      </span>
                      <span className={`text-[11px] block ${
                        activeNav === 'schedule' ? 'text-cyan-100' : 'text-slate-500'
                      }`}>
                        {isEthiopic ? 'የዞኖች የፍሰት ሰዓት፣ ላይክ፣ ሼርና ኮሜንት' : 'Flow days, hours, likes & comments'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>

                {/* 3. Payments */}
                <button
                  onClick={() => handleNavClick('payments')}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between transition text-left ${
                    activeNav === 'payments'
                      ? 'bg-cyan-700 text-white shadow-md'
                      : 'hover:bg-slate-50 text-slate-800 border border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      activeNav === 'payments' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">
                        {isEthiopic ? 'የውሃ ክፍያና ደረሰኝ (Bills & Payments)' : 'Bills & Payments'}
                      </span>
                      <span className={`text-[11px] block ${
                        activeNav === 'payments' ? 'text-cyan-100' : 'text-slate-500'
                      }`}>
                        {isEthiopic ? 'ቴሌብር፣ ሲቢኢ ብር፣ ቻፓ እና ደረሰኝ' : 'Telebirr, CBE Birr & instant receipts'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>

                {/* 4. Incident Reporting */}
                <button
                  onClick={() => handleNavClick('incident')}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between transition text-left ${
                    activeNav === 'incident'
                      ? 'bg-cyan-700 text-white shadow-md'
                      : 'hover:bg-slate-50 text-slate-800 border border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      activeNav === 'incident' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                    }`}>
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">
                        {isEthiopic ? 'የቧንቧ ብልሽት አቤቱታ በፎቶና ጂፒኤስ' : 'Report Issue with Photo/GPS'}
                      </span>
                      <span className={`text-[11px] block ${
                        activeNav === 'incident' ? 'text-cyan-100' : 'text-slate-500'
                      }`}>
                        {isEthiopic ? 'በካሜራ ቪዲዮ/ፎቶ እና በካርታ ጥቆማ' : 'Live video/photo proof & GPS pin'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>

                {/* 5. Registration */}
                <button
                  onClick={() => handleNavClick('register')}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between transition text-left ${
                    activeNav === 'register'
                      ? 'bg-cyan-700 text-white shadow-md'
                      : 'hover:bg-slate-50 text-slate-800 border border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      activeNav === 'register' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'
                    }`}>
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">
                        {isEthiopic ? 'የደንበኛና ቆጣሪ ምዝገባ' : 'New Customer Registration'}
                      </span>
                      <span className={`text-[11px] block ${
                        activeNav === 'register' ? 'text-cyan-100' : 'text-slate-500'
                      }`}>
                        {isEthiopic ? 'ለሁሉም የኢትዮጵያ ከተሞችና ገጠራማ ቀበሌዎች' : 'All urban & rural woredas'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>
              </div>
            </div>

            {/* Section B: Utility Authority Operations */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {isEthiopic ? '🏛️ የተቋሙ አስተዳደርና ስራ አስፈፃሚ' : '🏛️ Utility Operations'}
              </span>

              <div className="space-y-1">
                {/* 6. Admin Control Room */}
                <button
                  onClick={() => handleNavClick('staff')}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between transition text-left ${
                    activeNav === 'staff'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'hover:bg-slate-50 text-slate-800 border border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      activeNav === 'staff' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-800'
                    }`}>
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">
                        {isEthiopic ? 'የተቋሙ አስተዳደርና ስራ አስፈፃሚ ዳሽቦርድ' : 'Utility Command Center & Executive'}
                      </span>
                      <span className={`text-[11px] block ${
                        activeNav === 'staff' ? 'text-slate-300' : 'text-slate-500'
                      }`}>
                        {isEthiopic ? 'የመስክ ስምሪት፣ ኤክሴል ማዕከልና ቁጥጥር' : 'Field dispatch, Excel hub & control room'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>

                {/* 7. SLA Contract */}
                <button
                  onClick={() => handleNavClick('contract')}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between transition text-left ${
                    activeNav === 'contract'
                      ? 'bg-purple-900 text-white shadow-md'
                      : 'hover:bg-purple-50/50 text-slate-800 border border-purple-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      activeNav === 'contract' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'
                    }`}>
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">
                        {isEthiopic ? 'የሶፍትዌር ግንባታና የአገልግሎት ውል (SLA)' : 'Software SLA Agreement & Contract'}
                      </span>
                      <span className={`text-[11px] block ${
                        activeNav === 'contract' ? 'text-purple-200' : 'text-slate-500'
                      }`}>
                        {isEthiopic ? 'ይፋዊ ርክክብ፣ የክፍያ ስምምነትና ማህተም' : 'Legal handover, milestones & seals'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>

                {/* 8. Knowledge & Ideas */}
                <button
                  onClick={() => handleNavClick('knowledge')}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between transition text-left ${
                    activeNav === 'knowledge'
                      ? 'bg-cyan-700 text-white shadow-md'
                      : 'hover:bg-slate-50 text-slate-800 border border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      activeNav === 'knowledge' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                    }`}>
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">
                        {isEthiopic ? 'የፈጠራና እውቀት መጋሪያ' : 'Innovation & Knowledge Hub'}
                      </span>
                      <span className={`text-[11px] block ${
                        activeNav === 'knowledge' ? 'text-cyan-100' : 'text-slate-500'
                      }`}>
                        {isEthiopic ? 'የውሃ ቆጣቢ ቴክኖሎጂዎችና ጥናቶች' : 'Water conservation & engineering ideas'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>
              </div>
            </div>

            {/* Section C: Quick Utilities */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {isEthiopic ? '⚡ ፈጣን አገልግሎቶች' : '⚡ Quick Actions'}
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenTankerModal();
                  }}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition space-y-1"
                >
                  <Truck className="w-4 h-4 text-cyan-700" />
                  <span className="text-xs font-bold text-slate-900 block">
                    {isEthiopic ? 'ቦቴ ውሃ እዘዝ' : 'Order Tanker'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    5,000 / 10,000 L
                  </span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenInstallModal();
                  }}
                  className="p-3 rounded-2xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-left transition space-y-1"
                >
                  <Smartphone className="w-4 h-4 text-cyan-800" />
                  <span className="text-xs font-bold text-cyan-900 block">
                    {isEthiopic ? 'አፕ በስልክ ጫን' : 'Install App'}
                  </span>
                  <span className="text-[10px] text-cyan-700 block">
                    PWA Mobile
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. Drawer Footer: Emergency Hotline & Seal */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-700" />
              <div>
                <span className="text-[10px] text-slate-400 block">{isEthiopic ? 'የነጻ የጥሪ ማዕከል' : 'Hotline'}</span>
                <a href="tel:8844" className="font-extrabold text-cyan-900 font-mono-numbers">8844 / 933</a>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">AquaFlow v2.4</span>
              <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {isEthiopic ? 'የተረጋገጠ ሲስተም' : 'Verified'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
