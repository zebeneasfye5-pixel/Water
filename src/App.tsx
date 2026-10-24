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
  ChevronRight,
  Smartphone,
  Download,
  UserPlus,
  LayoutDashboard,
  Menu
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
import { PWAInstallModal } from './components/PWAInstallModal';
import { MobileInstallFloatingBanner } from './components/MobileInstallFloatingBanner';
import { RegistrationPortalView } from './components/RegistrationPortalView';
import { CitizenDashboardView } from './components/CitizenDashboardView';
import { InstitutionalContractAgreementView } from './components/InstitutionalContractAgreementView';
import { DashboardDrawer } from './components/DashboardDrawer';
import { CustomerRecord } from './types';

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<'schedule' | 'citizen-dashboard' | 'payments' | 'incident' | 'knowledge' | 'staff' | 'register' | 'contract'>('schedule');
  const [isTankerModalOpen, setIsTankerModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

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

  const [customers, setCustomers] = useState<CustomerRecord[]>(() => {
    const saved = localStorage.getItem('aquaflow_customers');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'cust-1',
        fullName: 'አበበ ተፈራ ገብረመድህን',
        phone: '0911245678',
        meterId: 'MTR-09412',
        country: 'Ethiopia',
        region: 'አዲስ አበባ',
        city: 'ቦሌ',
        subCity: 'ቦሌ',
        kebele: 'ቀበሌ 04',
        houseNumber: 'ቤት 412',
        nationalIdNumber: 'ET-NAT-98412',
        propertyType: 'residential',
        currentBill: 395.50,
        lastReadingM3: 434,
        meterStatus: 'active',
        registeredAt: '2026-01-15',
        updatedAt: '2026-10-23'
      },
      {
        id: 'cust-2',
        fullName: 'ወ/ሮ ትእግስት አስፋው',
        phone: '0922887766',
        meterId: 'MTR-10294',
        country: 'Ethiopia',
        region: 'አዲስ አበባ',
        city: 'የካ',
        subCity: 'የካ',
        kebele: 'ቀበሌ 08',
        houseNumber: 'ቤት 104',
        nationalIdNumber: 'ET-NAT-44120',
        propertyType: 'residential',
        currentBill: 313.00,
        lastReadingM3: 198,
        meterStatus: 'active',
        registeredAt: '2026-02-10',
        updatedAt: '2026-10-23'
      },
      {
        id: 'cust-3',
        fullName: 'ዶ/ር ሰለሞን ሀይሉ',
        phone: '0933551122',
        meterId: 'MTR-04821',
        country: 'Ethiopia',
        region: 'አዲስ አበባ',
        city: 'ቂርቆስ',
        subCity: 'ቂርቆስ',
        kebele: 'ቀበሌ 15',
        houseNumber: 'ቤት 99',
        nationalIdNumber: 'ET-NAT-77124',
        propertyType: 'commercial',
        currentBill: 0,
        lastReadingM3: 675,
        meterStatus: 'active',
        registeredAt: '2026-03-01',
        updatedAt: '2026-10-23'
      },
      {
        id: 'cust-4',
        fullName: 'ጫላ ጉቱ በዳኔ',
        phone: '0911776655',
        meterId: 'MTR-ETH-OROMIA-0129',
        country: 'Ethiopia',
        region: 'ኦሮሚያ',
        city: 'አዳማ',
        subCity: 'ቦሌ ዞን',
        kebele: 'ቀበሌ 03',
        houseNumber: 'ቤት 22',
        nationalIdNumber: 'ET-NAT-33102',
        propertyType: 'residential',
        currentBill: 275.00,
        lastReadingM3: 215,
        meterStatus: 'active',
        registeredAt: '2026-04-12',
        updatedAt: '2026-10-23'
      },
      {
        id: 'cust-5',
        fullName: 'ሙሉቀን ደሴ ካሳ',
        phone: '0918334455',
        meterId: 'MTR-AMH-BAHIR-4410',
        country: 'Ethiopia',
        region: 'አማራ',
        city: 'ባህር ዳር',
        subCity: 'ጣና ዞን',
        kebele: 'ቀበሌ 04',
        houseNumber: 'ቤት 55',
        nationalIdNumber: 'ET-NAT-55194',
        propertyType: 'residential',
        currentBill: 310.00,
        lastReadingM3: 165,
        meterStatus: 'active',
        registeredAt: '2026-05-18',
        updatedAt: '2026-10-23'
      }
    ];
  });

  // Sync customers to local storage
  useEffect(() => {
    localStorage.setItem('aquaflow_customers', JSON.stringify(customers));
  }, [customers]);

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

  // Initial sync from live backend database
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [billsRes, incRes, notRes] = await Promise.all([
          fetch('/api/bills').catch(() => null),
          fetch('/api/incidents').catch(() => null),
          fetch('/api/broadcast/notices').catch(() => null)
        ]);
        if (billsRes && billsRes.ok) {
          const bData = await billsRes.json();
          if (bData.bills && bData.bills.length > 0) setBills(bData.bills);
        }
        if (incRes && incRes.ok) {
          const iData = await incRes.json();
          if (iData.incidents && iData.incidents.length > 0) setIncidents(iData.incidents);
        }
        if (notRes && notRes.ok) {
          const nData = await notRes.json();
          if (nData.notices && nData.notices.length > 0) setNotices(nData.notices);
        }
      } catch (err) {
        // Safe offline / local fallback
      }
    };
    fetchInitialData();
  }, []);

  const t = translations[lang];

  // Handlers
  const handleSubscribePhone = (scheduleId: string, phone: string) => {
    setSchedules(prev =>
      prev.map(s => (s.id === scheduleId ? { ...s, subscribersCount: s.subscribersCount + 1 } : s))
    );
  };

  const handlePayBill = (billId: string, method: any, txRef?: string) => {
    const reference = txRef || `TX-${method?.toUpperCase() || 'PAY'}-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setBills(prev =>
      prev.map(b =>
        b.id === billId
          ? {
              ...b,
              status: 'paid',
              paidAt: new Date().toISOString(),
              paymentMethod: method,
              transactionRef: reference,
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

  const handleLikeSchedule = (scheduleId: string) => {
    setSchedules(prev =>
      prev.map(s => {
        if (s.id === scheduleId) {
          const liked = s.hasLiked ?? false;
          return {
            ...s,
            hasLiked: !liked,
            likesCount: Math.max(0, (s.likesCount ?? 0) + (liked ? -1 : 1))
          };
        }
        return s;
      })
    );
  };

  const handleCommentSchedule = (scheduleId: string, text: string, author: string) => {
    setSchedules(prev =>
      prev.map(s => {
        if (s.id === scheduleId) {
          const currentComments = s.comments || [];
          return {
            ...s,
            comments: [
              ...currentComments,
              {
                id: `sc-${Date.now()}`,
                author: author.trim() || (lang === 'am' ? 'ነዋሪ' : 'Resident'),
                text: text.trim(),
                date: new Date().toISOString().split('T')[0],
                isStaff: false
              }
            ]
          };
        }
        return s;
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

      {/* 2. TOP BAR - CLEAN, MODERN & PACKED IN 3-LINE (☰) HAMBURGER DRAWER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Title */}
          <button
            onClick={() => setActiveNav('citizen-dashboard')}
            className="flex items-center gap-2.5 text-slate-900 hover:text-cyan-800 transition text-left whitespace-nowrap shrink-0 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-800 to-cyan-600 text-white flex items-center justify-center shadow-xs group-hover:scale-102 transition">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight block leading-tight text-slate-900">
                {lang === 'am' ? 'የውሃና ፍሳሽ ዲጂታል ፖርታል' : 'AquaFlow Water Utility'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium block">
                {lang === 'am' ? 'የከተማና የገጠር ይፋዊ አገልግሎት' : 'Official Public Bureau'}
              </span>
            </div>
          </button>

          {/* Center: Current Active View Indicator Badge */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-bold text-slate-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
            <span>
              {activeNav === 'citizen-dashboard'
                ? (lang === 'am' ? '📊 የተጠቃሚ ዳሽቦርድ' : '📊 My Dashboard')
                : activeNav === 'schedule'
                ? (lang === 'am' ? '💧 የውሃ ስርጭት መርሃግብር' : '💧 Water Distribution Schedule')
                : activeNav === 'payments'
                ? (lang === 'am' ? '💳 የክፍያና ደረሰኝ ማዕከል' : '💳 Payments & Bills')
                : activeNav === 'incident'
                ? (lang === 'am' ? '🚨 የብልሽት አቤቱታ በፎቶና ጂፒኤስ' : '🚨 Incident Reporting')
                : activeNav === 'register'
                ? (lang === 'am' ? '📝 የደንበኛና ቆጣሪ ምዝገባ' : '📝 New Customer Registration')
                : activeNav === 'staff'
                ? (lang === 'am' ? '🛡️ የተቋም አስተዳደርና ኮንትሮል ሩም' : '🛡️ Utility Control Room')
                : activeNav === 'contract'
                ? (lang === 'am' ? '📜 የሶፍትዌር ግንባታና የአገልግሎት ውል (SLA)' : '📜 Handover & SLA Contract')
                : (lang === 'am' ? '💡 የፈጠራና እውቀት መጋሪያ' : '💡 Innovation Hub')}
            </span>
          </div>

          {/* Right: Language Selector + The 3-Line (☰) Hamburger Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Language Dropdown Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-1.5 whitespace-nowrap shadow-2xs transition"
                title="Select Language / ቋንቋ ምረጥ"
              >
                <span className="text-sm">
                  {SUPPORTED_LANGUAGES.find(l => l.code === lang)?.flag || '🌐'}
                </span>
                <span className="hidden sm:inline font-medium text-xs">
                  {SUPPORTED_LANGUAGES.find(l => l.code === lang)?.nativeName || 'አማርኛ'}
                </span>
                <span className="text-[10px] text-slate-400">▾</span>
              </button>

              {isLangMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                      {lang === 'am' ? 'ቋንቋ ይምረጡ' : 'Choose Language'}
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

            {/* THE PROMINENT 3-LINE (☰) HAMBURGER MENU / DASHBOARD BUTTON */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-gradient-to-r from-cyan-700 via-cyan-800 to-slate-900 hover:from-cyan-800 hover:to-black text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition active:scale-95 group border border-cyan-600/30"
              title={lang === 'am' ? 'የተሟላ ዳሽቦርድ እና ዝርዝር መረጃዎች (☰)' : 'Open All Dashboards & Menu (☰)'}
            >
              <Menu className="w-4 h-4 stroke-[2.5] text-cyan-200 group-hover:text-white transition" />
              <span className="font-bold tracking-tight">
                {lang === 'am' ? 'ዳሽቦርድ (☰)' : 'Menu (☰)'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. COMPACT CONTEXT BANNER (Sleek and minimal) */}
      {activeNav === 'schedule' && (
        <section className="bg-gradient-to-r from-cyan-900 via-slate-900 to-cyan-950 text-white py-4 px-4 sm:px-6 lg:px-8 border-b border-cyan-800/40">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div>
                <span className="font-extrabold text-white text-sm block">
                  {lang === 'am' ? 'የከተማና የገጠር የውሃ ስርጭት መርሃግብር' : 'Municipal Water Distribution Grid'}
                </span>
                <span className="text-[11px] text-cyan-200/80">
                  {lang === 'am' ? 'በቀን ከ500,000 ሜ³ በላይ ንጹህ ውሃ ስርጭት · WHO ደረጃ የተረጋገጠ (99.4%)' : 'Over 500,000 m³ daily potable transmission · WHO standard 99.4%'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-cyan-200"
              >
                <Menu className="w-3.5 h-3.5" />
                <span>{lang === 'am' ? 'ሁሉንም አገልግሎቶች በዳሽቦርድ ክፈት' : 'Open All in Dashboard'}</span>
              </button>
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
            onLikeSchedule={handleLikeSchedule}
            onCommentSchedule={handleCommentSchedule}
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

        {activeNav === 'register' && (
          <RegistrationPortalView
            lang={lang}
            onCustomerRegistered={(newCust) => {
              setCustomers(prev => [newCust, ...prev]);
              setBills(prev => [
                {
                  id: `bill-${Date.now()}`,
                  customerId: newCust.id,
                  customerName: newCust.fullName,
                  customerPhone: newCust.phone,
                  meterNumber: newCust.meterId,
                  subCity: newCust.subCity || newCust.city,
                  kebele: newCust.kebele,
                  billingPeriod: 'የመጀመሪያ ምዝገባ 2026',
                  previousReadingM3: 0,
                  currentReadingM3: newCust.lastReadingM3,
                  consumptionM3: 0,
                  amountBirr: 0,
                  sanitationFeeBirr: 0,
                  meterRentBirr: 0,
                  totalBirr: 0,
                  dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                  status: 'paid'
                },
                ...prev
              ]);
            }}
            onNavigateToSchedule={() => setActiveNav('schedule')}
            onNavigateToBilling={() => setActiveNav('payments')}
          />
        )}

        {activeNav === 'citizen-dashboard' && (
          <CitizenDashboardView
            bills={bills}
            incidents={incidents}
            schedules={schedules}
            lang={lang}
            onPayBill={handlePayBill}
            onNavigateToReport={() => setActiveNav('incident')}
            onNavigateToSchedule={() => setActiveNav('schedule')}
            onOpenTankerModal={() => setIsTankerModalOpen(true)}
          />
        )}

        {activeNav === 'contract' && (
          <InstitutionalContractAgreementView lang={lang} />
        )}

        {activeNav === 'staff' && (
          <AdminDispatchView
            incidents={incidents}
            schedules={schedules}
            bills={bills}
            contributions={contributions}
            notices={notices}
            customers={customers}
            lang={lang}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
            onUpdateScheduleStatus={handleUpdateScheduleStatus}
            onPublishNotice={handlePublishNotice}
            onBillsUpdated={(updated) => setBills(updated)}
            onCustomersImported={(newCust) => setCustomers(prev => [...newCust, ...prev])}
          />
        )}
      </main>

      {/* 4B. 3-LINE (☰) HAMBURGER DASHBOARD DRAWER */}
      <DashboardDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeNav={activeNav}
        onSelectNav={(nav) => setActiveNav(nav)}
        lang={lang}
        onOpenTankerModal={() => setIsTankerModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        bills={bills}
        schedules={schedules}
      />

      {/* 5. TANKER REQUEST MODAL */}
      <TankerRequestModal
        isOpen={isTankerModalOpen}
        onClose={() => setIsTankerModalOpen(false)}
        lang={lang}
        onRequestSubmitted={handleTankerSubmitted}
      />

      {/* 5B. MOBILE PWA INSTALL MODAL */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        lang={lang}
      />

      {/* Floating Quick Mobile Install Banner */}
      <MobileInstallFloatingBanner
        lang={lang}
        onOpenModal={() => setIsInstallModalOpen(true)}
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
