/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Droplets,
  CreditCard,
  AlertCircle,
  Lightbulb,
  Truck,
  Shield,
  PhoneCall,
  Globe,
  Bell,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCheck2,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  Language,
  WaterSchedule,
  BillRecord,
  ContributionProject,
  IncidentReport,
  InnovationIdea,
  EmergencyNotice,
  TankerRequest
} from './types';
import {
  INITIAL_SCHEDULES,
  INITIAL_BILLS,
  INITIAL_CONTRIBUTIONS,
  INITIAL_INCIDENTS,
  INITIAL_IDEAS,
  INITIAL_NOTICES
} from './data/mockData';
import { translations } from './utils/translations';
import { WaterScheduleView } from './components/WaterScheduleView';
import { BillingAndPaymentView } from './components/BillingAndPaymentView';
import { IncidentReportingView } from './components/IncidentReportingView';
import { InnovationKnowledgeView } from './components/InnovationKnowledgeView';
import { TankerRequestModal } from './components/TankerRequestModal';
import { AdminDispatchView } from './components/AdminDispatchView';

// Hero image generated asset
import heroImage from './assets/images/water_utility_hero_1792630539286.jpg';
import crewImage from './assets/images/water_technician_crew_1792630539696.jpg';
import tankerImage from './assets/images/water_community_tanker_1792630539282.jpg';

export const SUPPORTED_LANGUAGES: { code: Language; label: string; nativeName: string; flag: string }[] = [
  { code: 'am', label: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  { code: 'om', label: 'Afaan Oromoo', nativeName: 'Afaan Oromoo', flag: '🌳' },
  { code: 'ti', label: 'Tigrinya', nativeName: 'ትግርኛ', flag: '🇪🇹' },
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', label: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('aquaflow_lang');
    return (saved as Language) || 'am';
  });
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<'schedule' | 'payments' | 'incident' | 'knowledge' | 'staff'>('schedule');
  const [isTankerModalOpen, setIsTankerModalOpen] = useState(false);

  // Sync language to local storage
  useEffect(() => {
    localStorage.setItem('aquaflow_lang', lang);
  }, [lang]);

  // Persistent States
  const [schedules, setSchedules] = useState<WaterSchedule[]>(() => {
    const saved = localStorage.getItem('aquaflow_schedules');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  const [bills, setBills] = useState<BillRecord[]>(() => {
    const saved = localStorage.getItem('aquaflow_bills');
    return saved ? JSON.parse(saved) : INITIAL_BILLS;
  });

  const [contributions, setContributions] = useState<ContributionProject[]>(() => {
    const saved = localStorage.getItem('aquaflow_contributions');
    return saved ? JSON.parse(saved) : INITIAL_CONTRIBUTIONS;
  });

  const [incidents, setIncidents] = useState<IncidentReport[]>(() => {
    const saved = localStorage.getItem('aquaflow_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [ideas, setIdeas] = useState<InnovationIdea[]>(() => {
    const saved = localStorage.getItem('aquaflow_ideas');
    return saved ? JSON.parse(saved) : INITIAL_IDEAS;
  });

  const [notices, setNotices] = useState<EmergencyNotice[]>(() => {
    const saved = localStorage.getItem('aquaflow_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [tankerRequests, setTankerRequests] = useState<TankerRequest[]>(() => {
    const saved = localStorage.getItem('aquaflow_tankers');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('aquaflow_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('aquaflow_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('aquaflow_contributions', JSON.stringify(contributions));
  }, [contributions]);

  useEffect(() => {
    localStorage.setItem('aquaflow_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('aquaflow_ideas', JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem('aquaflow_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('aquaflow_tankers', JSON.stringify(tankerRequests));
  }, [tankerRequests]);

  const t = translations[lang];

  // Handlers
  const handleSubscribePhone = (scheduleId: string, phone: string) => {
    setSchedules(prev =>
      prev.map(s => (s.id === scheduleId ? { ...s, subscribersCount: s.subscribersCount + 1 } : s))
    );
  };

  const handlePayBill = (billId: string, method: any, txRef: string) => {
    setBills(prev =>
      prev.map(b =>
        b.id === billId
          ? {
              ...b,
              status: 'paid',
              paidAt: new Date().toISOString(),
              paymentMethod: method,
              transactionRef: txRef,
              receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
            }
          : b
      )
    );
  };

  const handleContribute = (projectId: string, amount: number, contributorName: string) => {
    setContributions(prev =>
      prev.map(p =>
        p.id === projectId
          ? {
              ...p,
              collectedBirr: p.collectedBirr + amount,
              contributorsCount: p.contributorsCount + 1
            }
          : p
      )
    );
  };

  const handleSubmitIncident = (newReport: Omit<IncidentReport, 'id' | 'ticketNumber' | 'status' | 'createdAt'>) => {
    const ticketNumber = `WTR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newIncident: IncidentReport = {
      ...newReport,
      id: `inc-${Date.now()}`,
      ticketNumber,
      status: 'submitted',
      createdAt: new Date().toISOString()
    };
    setIncidents(prev => [newIncident, ...prev]);
    return ticketNumber;
  };

  const handleUpvoteIdea = (ideaId: string) => {
    setIdeas(prev =>
      prev.map(idea => {
        if (idea.id === ideaId) {
          const hasVoted = idea.hasUpvoted;
          return {
            ...idea,
            hasUpvoted: !hasVoted,
            upvotes: hasVoted ? idea.upvotes - 1 : idea.upvotes + 1
          };
        }
        return idea;
      })
    );
  };

  const handleAddComment = (ideaId: string, commentText: string, author: string) => {
    setIdeas(prev =>
      prev.map(idea => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            comments: [
              ...idea.comments,
              {
                id: `c-${Date.now()}`,
                author,
                text: commentText,
                date: new Date().toISOString().split('T')[0]
              }
            ]
          };
        }
        return idea;
      })
    );
  };

  const handleSubmitIdea = (newIdea: Omit<InnovationIdea, 'id' | 'upvotes' | 'comments' | 'submittedAt'>) => {
    const created: InnovationIdea = {
      ...newIdea,
      id: `idea-${Date.now()}`,
      upvotes: 1,
      hasUpvoted: true,
      comments: [],
      submittedAt: new Date().toISOString()
    };
    setIdeas(prev => [created, ...prev]);
  };

  const handleTankerSubmitted = (request: Omit<TankerRequest, 'id' | 'referenceNumber' | 'status' | 'createdAt'>) => {
    const ref = `TNK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTanker: TankerRequest = {
      ...request,
      id: `tnk-${Date.now()}`,
      referenceNumber: ref,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setTankerRequests(prev => [newTanker, ...prev]);
    return ref;
  };

  const handleUpdateIncidentStatus = (
    incidentId: string,
    status: IncidentReport['status'],
    technicianName?: string,
    technicianPhone?: string,
    resolutionNotes?: string
  ) => {
    setIncidents(prev =>
      prev.map(inc =>
        inc.id === incidentId
          ? {
              ...inc,
              status,
              assignedTechnician: technicianName || inc.assignedTechnician,
              technicianPhone: technicianPhone || inc.technicianPhone,
              resolutionNotes: resolutionNotes || inc.resolutionNotes,
              resolvedAt: status === 'resolved' ? new Date().toISOString() : inc.resolvedAt
            }
          : inc
      )
    );
  };

  const handleUpdateScheduleStatus = (scheduleId: string, status: WaterSchedule['status'], pressureBar: number) => {
    setSchedules(prev =>
      prev.map(sch =>
        sch.id === scheduleId
          ? {
              ...sch,
              status,
              pressureBar,
              nextFlowStart: status === 'active_flowing' ? new Date().toISOString() : sch.nextFlowStart
            }
          : sch
      )
    );
  };

  const handlePublishNotice = (notice: Omit<EmergencyNotice, 'id' | 'publishedAt'>) => {
    const created: EmergencyNotice = {
      ...notice,
      id: `not-${Date.now()}`,
      publishedAt: new Date().toISOString()
    };
    setNotices(prev => [created, ...prev]);
  };

  const activeNotice = notices.find(n => n.active);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-cyan-600 selection:text-white">
      {/* 1. TOP EMERGENCY BANNER (If active) */}
      {activeNotice && (
        <aside aria-label="Emergency broadcast" className="bg-red-700 text-white px-4 py-2.5 text-xs font-medium border-b border-red-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
              <span className="font-bold uppercase tracking-wider text-[11px] bg-red-900/60 px-2 py-0.5 rounded">
                {lang === 'am' ? 'አስቸኳይ ማሳሰቢያ' : 'Urgent Alert'}
              </span>
              <span className="font-semibold">{lang === 'am' ? activeNotice.titleAm : activeNotice.titleEn}:</span>
              <span className="hidden sm:inline opacity-95">
                {lang === 'am' ? activeNotice.messageAm : activeNotice.messageEn}
              </span>
            </div>
            <button
              onClick={() => {
                setNotices(prev => prev.map(n => n.id === activeNotice.id ? { ...n, active: false } : n));
              }}
              className="text-white/80 hover:text-white shrink-0 p-1"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* 2. TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveNav('schedule')}
            className="flex items-center gap-2 text-slate-900 hover:text-cyan-800 transition text-left whitespace-nowrap shrink-0 group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-700 text-white flex items-center justify-center shadow-xs">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight block leading-tight">
                {lang === 'am' ? 'የውሃና ፍሳሽ ዲጂታል ፖርታል' : 'AquaFlow Water Utility'}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {lang === 'am' ? 'የከተማው ይፋዊ አገልግሎት' : 'Official Municipal Bureau'}
              </span>
            </div>
          </button>

          {/* Zone 2: Concise Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveNav('schedule')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeNav === 'schedule' ? 'text-cyan-800 border-b-2 border-cyan-700' : ''
              }`}
            >
              {t.navSchedule}
            </button>
            <button
              onClick={() => setActiveNav('payments')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeNav === 'payments' ? 'text-cyan-800 border-b-2 border-cyan-700' : ''
              }`}
            >
              {t.navPayments}
            </button>
            <button
              onClick={() => setActiveNav('incident')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 ${
                activeNav === 'incident' ? 'text-cyan-800 border-b-2 border-cyan-700' : ''
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-cyan-600" />
              <span>{t.navReportIncident}</span>
            </button>
            <button
              onClick={() => setActiveNav('knowledge')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeNav === 'knowledge' ? 'text-cyan-800 border-b-2 border-cyan-700' : ''
              }`}
            >
              {t.navKnowledge}
            </button>
            <button
              onClick={() => setActiveNav('staff')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1 ${
                activeNav === 'staff' ? 'text-slate-900 font-bold border-b-2 border-slate-900' : 'text-slate-500'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t.navStaffPortal}</span>
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action & Utilities */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Dropdown Selector (7 Languages) */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 hover:bg-slate-50 flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-2xs"
                title="Select Language / ቋንቋ ምረጥ"
              >
                <span className="text-sm">
                  {SUPPORTED_LANGUAGES.find(l => l.code === lang)?.flag || '🌐'}
                </span>
                <span className="font-medium">
                  {SUPPORTED_LANGUAGES.find(l => l.code === lang)?.nativeName || 'አማርኛ'}
                </span>
                <span className="text-[10px] text-slate-400">▾</span>
              </button>

              {/* Dropdown Menu */}
              {isLangMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                      {lang === 'am' ? 'ቋንቋ ይምረጡ' : lang === 'om' ? 'Afaan Filadhu' : lang === 'ti' ? 'ቋንቋ ምረጹ' : 'Choose Language'}
                    </div>
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLang(l.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between transition ${
                          lang === l.code
                            ? 'bg-cyan-50 font-bold text-cyan-900'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm">{l.flag}</span>
                          <span>{l.nativeName}</span>
                        </span>
                        {lang === l.code && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Tanker Request Button */}
            <button
              onClick={() => setIsTankerModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition whitespace-nowrap shrink-0"
            >
              <Truck className="w-3.5 h-3.5 text-cyan-700" />
              <span>{t.navTanker}</span>
            </button>

            {/* Primary Action Button (Report Issue in Photo/Video) */}
            <button
              onClick={() => setActiveNav('incident')}
              className="px-4 py-2 text-xs font-bold text-white bg-cyan-700 rounded-lg hover:bg-cyan-800 shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.reportIssueBtn}</span>
              <span className="sm:hidden">{lang === 'am' ? 'አቤቱታ' : 'Report'}</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-slate-100 text-xs bg-slate-50">
          <button
            onClick={() => setActiveNav('schedule')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap shrink-0 ${
              activeNav === 'schedule' ? 'bg-cyan-700 text-white' : 'text-slate-600'
            }`}
          >
            {t.navSchedule}
          </button>
          <button
            onClick={() => setActiveNav('payments')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap shrink-0 ${
              activeNav === 'payments' ? 'bg-cyan-700 text-white' : 'text-slate-600'
            }`}
          >
            {t.navPayments}
          </button>
          <button
            onClick={() => setActiveNav('incident')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap shrink-0 ${
              activeNav === 'incident' ? 'bg-cyan-700 text-white' : 'text-slate-600'
            }`}
          >
            {t.navReportIncident}
          </button>
          <button
            onClick={() => setActiveNav('knowledge')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap shrink-0 ${
              activeNav === 'knowledge' ? 'bg-cyan-700 text-white' : 'text-slate-600'
            }`}
          >
            {t.navKnowledge}
          </button>
          <button
            onClick={() => setActiveNav('staff')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap shrink-0 ${
              activeNav === 'staff' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            {t.navStaffPortal}
          </button>
          <button
            onClick={() => setIsTankerModalOpen(true)}
            className="px-3 py-1.5 rounded-md font-medium text-cyan-800 bg-cyan-100/60 whitespace-nowrap shrink-0"
          >
            {t.navTanker}
          </button>
        </div>
      </header>

      {/* 3. HERO SHOWCASE SECTION (Only show on citizen views when in schedule tab) */}
      {activeNav === 'schedule' && (
        <section className="bg-white border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column 7 cols */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/60 text-xs font-semibold text-cyan-900">
                <span className="w-2 h-2 rounded-full bg-cyan-600" />
                <span>{t.heroBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
                {t.heroTitle}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                {t.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('main-content-anchor');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-cyan-700 text-white rounded-xl text-xs font-bold hover:bg-cyan-800 transition shadow-sm flex items-center gap-2"
                >
                  <Droplets className="w-4 h-4" />
                  <span>{t.checkScheduleBtn}</span>
                </button>
                <button
                  onClick={() => setActiveNav('incident')}
                  className="px-6 py-3 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 transition shadow-2xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-cyan-700" />
                  <span>{t.reportIssueBtn}</span>
                </button>
                <button
                  onClick={() => setActiveNav('payments')}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  {t.payBillBtn}
                </button>
              </div>

              {/* Quick Trust / Adjacency Points */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-xs text-slate-600">
                <div>
                  <span className="font-extrabold text-slate-900 text-base font-mono-numbers block">24/7</span>
                  <span className="text-[11px] text-slate-500">{lang === 'am' ? 'የአደጋ ጊዜ ምላሽ' : 'Rapid Response'}</span>
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 text-base font-mono-numbers block">100%</span>
                  <span className="text-[11px] text-slate-500">{lang === 'am' ? 'ዲጂታል የክፍያ ደረሰኝ' : 'Instant Receipts'}</span>
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 text-base font-mono-numbers block">10+</span>
                  <span className="text-[11px] text-slate-500">{lang === 'am' ? 'ክፍለ ከተሞች በሲስተም' : 'Connected Subcities'}</span>
                </div>
              </div>
            </div>

            {/* Right Column 5 cols - Real High Fidelity Generated Utility Imagery */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 aspect-16/10 sm:aspect-4/3 relative group">
                <img
                  src={heroImage}
                  alt="Modern Municipal Water Treatment Facility"
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300 block">
                      {lang === 'am' ? 'የውሃ ማጣሪያ እና ማከፋፈያ ማዕከል' : 'Central Water Distribution Plant'}
                    </span>
                    <p className="text-xs text-white/90 font-medium mt-0.5">
                      {lang === 'am' ? 'በቀን ከ500,000 ሜትር ኪዩብ በላይ ንጹህ የመጠጥ ውሃ ስርጭት' : 'Over 500,000 m³ daily potable transmission'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Quick Card */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-lg items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {lang === 'am' ? 'የውሃ ጥራት ደረጃ: 99.4%' : 'Potability Index: 99.4%'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {lang === 'am' ? 'በላቦራቶሪ የተረጋገጠ' : 'WHO Standard Certified'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. MAIN CONTENT VIEWPORT */}
      <main id="main-content-anchor" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeNav === 'schedule' && (
          <WaterScheduleView
            schedules={schedules}
            lang={lang}
            onSubscribePhone={handleSubscribePhone}
          />
        )}

        {activeNav === 'payments' && (
          <BillingAndPaymentView
            bills={bills}
            contributions={contributions}
            lang={lang}
            onPayBill={handlePayBill}
            onContribute={handleContribute}
          />
        )}

        {activeNav === 'incident' && (
          <IncidentReportingView
            incidents={incidents}
            lang={lang}
            onSubmitIncident={handleSubmitIncident}
          />
        )}

        {activeNav === 'knowledge' && (
          <InnovationKnowledgeView
            ideas={ideas}
            lang={lang}
            onUpvoteIdea={handleUpvoteIdea}
            onAddComment={handleAddComment}
            onSubmitIdea={handleSubmitIdea}
          />
        )}

        {activeNav === 'staff' && (
          <AdminDispatchView
            incidents={incidents}
            schedules={schedules}
            bills={bills}
            contributions={contributions}
            notices={notices}
            lang={lang}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
            onUpdateScheduleStatus={handleUpdateScheduleStatus}
            onPublishNotice={handlePublishNotice}
          />
        )}
      </main>

      {/* 5. TANKER REQUEST MODAL */}
      <TankerRequestModal
        isOpen={isTankerModalOpen}
        onClose={() => setIsTankerModalOpen(false)}
        lang={lang}
        onRequestSubmitted={handleTankerSubmitted}
      />

      {/* 6. COMPREHENSIVE FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Col 1: Wordmark & Agency Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white">
                <div className="w-7 h-7 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
                  <Droplets className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-sm tracking-tight">
                  {lang === 'am' ? 'የውሃና ፍሳሽ ባለስልጣን' : 'Water & Sewerage Authority'}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {lang === 'am'
                  ? 'የከተማዋን ነዋሪዎች ንጹህና አስተማማኝ የመጠጥ ውሃ ፍላጎት በዘመናዊ የዲጂታል ቴክኖሎጂ ተደራሽ ለማድረግ የተዘጋጀ ይፋዊ ፖርታል።'
                  : 'Delivering sustainable, transparent, and digitally managed potable water and sanitation across all city districts.'}
              </p>
              <div className="text-slate-300 font-medium">
                {t.emergencyHotline}
              </div>
            </div>

            {/* Col 2: Services */}
            <div className="space-y-2">
              <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
                {lang === 'am' ? 'ዲጂታል አገልግሎቶች' : 'Digital Services'}
              </h4>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setActiveNav('schedule')} className="hover:text-white transition">
                    {t.navSchedule}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveNav('payments')} className="hover:text-white transition">
                    {t.navPayments}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveNav('incident')} className="hover:text-white transition">
                    {t.navReportIncident}
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsTankerModalOpen(true)} className="hover:text-white transition">
                    {t.navTanker}
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Innovation & Community */}
            <div className="space-y-2">
              <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
                {lang === 'am' ? 'የማህበረሰብ ተሳትፎ' : 'Civic Engagement'}
              </h4>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setActiveNav('knowledge')} className="hover:text-white transition">
                    {t.navKnowledge}
                  </button>
                </li>
                <li>
                  <span className="text-slate-500">{lang === 'am' ? 'የዝናብ ውሃ ማቆር ፕሮጀክቶች' : 'Rainwater Programs'}</span>
                </li>
                <li>
                  <span className="text-slate-500">{lang === 'am' ? 'የቀበሌ የውሃ አምባሳደሮች' : 'Kebele Ambassadors'}</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Administrative Dispatch */}
            <div className="space-y-2">
              <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
                {lang === 'am' ? 'ለሰራተኞች' : 'Internal Staff'}
              </h4>
              <p className="text-slate-500 text-xs">
                {lang === 'am'
                  ? 'የውሃ ጽ/ቤት ሰራተኞች እና የመስክ ቴክኒሻኖች አቤቱታዎችን ለማስተናገድ እዚህ ይግቡ።'
                  : 'Field technicians and district dispatchers management console.'}
              </p>
              <button
                onClick={() => setActiveNav('staff')}
                className="mt-2 px-3 py-1.5 bg-slate-800 text-cyan-300 hover:bg-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t.switchRoleToStaff}</span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© {new Date().getFullYear()} {translations[lang].agencyName}. {lang === 'am' ? 'መብቱ በህግ የተጠበቀ ነው።' : 'All rights reserved.'}</p>
            <div className="flex items-center gap-4 text-slate-500">
              <span>{lang === 'am' ? 'የቴሌብር / ንግድ ባንክ ደህንነቱ የተጠበቀ ክፍያ' : 'Telebirr & CBE Birr Integrated'}</span>
              <span>·</span>
              <span>ISO 9001:2015</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
