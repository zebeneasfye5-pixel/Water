import React, { useState } from 'react';
import { Wrench, Shield, Users, AlertTriangle, Radio, CheckCircle2, Clock, Phone, Droplet, Video, Eye, X, Edit3, Send } from 'lucide-react';
import { IncidentReport, WaterSchedule, BillRecord, ContributionProject, EmergencyNotice, Language } from '../types';
import { translations } from '../utils/translations';

interface AdminDispatchViewProps {
  incidents: IncidentReport[];
  schedules: WaterSchedule[];
  bills: BillRecord[];
  contributions: ContributionProject[];
  notices: EmergencyNotice[];
  lang: Language;
  onUpdateIncidentStatus: (incidentId: string, status: IncidentReport['status'], technicianName?: string, technicianPhone?: string, resolutionNotes?: string) => void;
  onUpdateScheduleStatus: (scheduleId: string, status: WaterSchedule['status'], pressureBar: number) => void;
  onPublishNotice: (notice: Omit<EmergencyNotice, 'id' | 'publishedAt'>) => void;
}

export const AdminDispatchView: React.FC<AdminDispatchViewProps> = ({
  incidents,
  schedules,
  bills,
  contributions,
  notices,
  lang,
  onUpdateIncidentStatus,
  onUpdateScheduleStatus,
  onPublishNotice
}) => {
  const t = translations[lang];
  const isEthiopic = lang === 'am' || lang === 'ti';
  const [activeAdminTab, setActiveAdminTab] = useState<'incidents' | 'schedules' | 'broadcast'>('incidents');

  // Media Inspection Modal
  const [inspectingIncident, setInspectingIncident] = useState<IncidentReport | null>(null);

  // Assign Technician Modal
  const [assigningIncident, setAssigningIncident] = useState<IncidentReport | null>(null);
  const [techName, setTechName] = useState('አቶ ታሪኩ በቀለ (ከፍተኛ ቧንቧ ባለሙያ)');
  const [techPhone, setTechPhone] = useState('0911445566');
  const [assignNotes, setAssignNotes] = useState('');

  // Resolve Modal
  const [resolvingIncident, setResolvingIncident] = useState<IncidentReport | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Emergency Broadcast Form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [affectedZones, setAffectedZones] = useState('ቦሌ እና የካ ክፍለ ከተሞች');
  const [broadcastSeverity, setBroadcastSeverity] = useState<'urgent' | 'warning' | 'info'>('urgent');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Financial aggregates
  const totalCollectedBills = bills.filter(b => b.status === 'paid').reduce((acc, b) => acc + b.totalBirr, 0);
  const totalContributions = contributions.reduce((acc, c) => acc + c.collectedBirr, 0);

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningIncident) return;
    onUpdateIncidentStatus(assigningIncident.id, 'assigned', techName, techPhone, assignNotes);
    setAssigningIncident(null);
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingIncident) return;
    onUpdateIncidentStatus(resolvingIncident.id, 'resolved', resolvingIncident.assignedTechnician, resolvingIncident.technicianPhone, resolutionNotes || 'ጥገናው ተጠናቆ ውሃው ተለቋል።');
    setResolvingIncident(null);
    setResolutionNotes('');
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    onPublishNotice({
      titleAm: broadcastTitle,
      titleEn: broadcastTitle,
      messageAm: broadcastMessage,
      messageEn: broadcastMessage,
      severity: broadcastSeverity,
      affectedAreasAm: affectedZones,
      affectedAreasEn: affectedZones,
      active: true
    });
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setBroadcastTitle('');
      setBroadcastMessage('');
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-800 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-cyan-600" />
            <span>{lang === 'am' ? 'የውሃ ጽ/ቤት አስተዳደር እና የመስክ ስምሪት' : 'Water Bureau Control Room'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.staffTitle}
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            {t.staffSubtitle}
          </p>
        </div>

        {/* Global Operational KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-400 block">{t.activeIncidentsCount}</span>
            <span className="text-xl font-bold font-mono-numbers text-red-600">
              {incidents.filter(i => i.status !== 'resolved').length}
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-400 block">{t.activeRepairsCount}</span>
            <span className="text-xl font-bold font-mono-numbers text-amber-600">
              {incidents.filter(i => i.status === 'in_progress').length}
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-400 block">{t.resolvedTodayCount}</span>
            <span className="text-xl font-bold font-mono-numbers text-emerald-600">
              {incidents.filter(i => i.status === 'resolved').length}
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] text-slate-400 block">{lang === 'am' ? 'የገቢ ድምር' : 'Revenue'}</span>
            <span className="text-sm font-bold font-mono-numbers text-slate-900 block truncate">
              {(totalCollectedBills + totalContributions).toLocaleString()} ETB
            </span>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveAdminTab('incidents')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
            activeAdminTab === 'incidents'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-4 h-4" />
          {t.incidentDispatchTab}
        </button>
        <button
          onClick={() => setActiveAdminTab('schedules')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
            activeAdminTab === 'schedules'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Droplet className="w-4 h-4" />
          {t.manageScheduleTab}
        </button>
        <button
          onClick={() => setActiveAdminTab('broadcast')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
            activeAdminTab === 'broadcast'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Radio className="w-4 h-4" />
          {t.emergencyBroadcastTab}
        </button>
      </div>

      {/* TAB 1: INCIDENT DISPATCH & VIDEO/PHOTO REVIEW */}
      {activeAdminTab === 'incidents' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'am' ? 'የገቡ አቤቱታዎች እና የመስክ ስምሪት' : 'Live Incident Dispatch Queue'}
            </h3>
            <span className="text-xs text-slate-500">
              {incidents.length} {lang === 'am' ? 'ሪፖርቶች' : 'reports'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">{lang === 'am' ? 'ቦታ እና ዞን' : 'Location'}</th>
                  <th className="py-3 px-4">{lang === 'am' ? 'የችግሩ አይነት' : 'Category'}</th>
                  <th className="py-3 px-4">{lang === 'am' ? 'ማስረጃ (ቪዲዮ/ፎቶ)' : 'Media Proof'}</th>
                  <th className="py-3 px-4">{lang === 'am' ? 'ደረጃ' : 'Status'}</th>
                  <th className="py-3 px-4">{lang === 'am' ? 'ቴክኒሻን' : 'Technician'}</th>
                  <th className="py-3 px-4 text-right">{lang === 'am' ? 'እርምጃ' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {inc.ticketNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {isEthiopic ? inc.subCityAm : inc.subCityEn}
                      </div>
                      <div className="text-[11px] text-slate-500 max-w-xs truncate">
                        {inc.specificLocation}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 block">{inc.category.replace('_', ' ')}</span>
                      <span className={`text-[10px] font-bold uppercase ${
                        inc.urgency === 'critical' ? 'text-red-600' : 'text-slate-500'
                      }`}>
                        {inc.urgency}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {(inc.photoUrl || inc.videoUrl) ? (
                        <button
                          onClick={() => setInspectingIncident(inc)}
                          className="px-2.5 py-1 bg-cyan-50 border border-cyan-200 text-cyan-800 rounded-lg text-xs font-semibold hover:bg-cyan-100 flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-700" />
                          <span>{inc.videoUrl ? 'Watch Video' : 'View Photo'}</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No media</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          inc.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inc.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-800'
                            : inc.status === 'assigned'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {inc.assignedTechnician ? (
                        <div>
                          <span className="font-medium text-slate-800 block">{inc.assignedTechnician}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{inc.technicianPhone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {inc.status !== 'resolved' && (
                          <>
                            <button
                              onClick={() => {
                                setAssigningIncident(inc);
                                setTechName(inc.assignedTechnician || 'አቶ ካሳሁን ደረጀ');
                                setTechPhone(inc.technicianPhone || '0912334455');
                              }}
                              className="px-2.5 py-1 border border-slate-300 text-slate-700 rounded text-xs font-medium hover:bg-slate-100"
                            >
                              {t.assignTechnicianBtn}
                            </button>
                            <button
                              onClick={() => setResolvingIncident(inc)}
                              className="px-2.5 py-1 bg-emerald-700 text-white rounded text-xs font-medium hover:bg-emerald-800"
                            >
                              {t.markResolvedBtn}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: WATER DISTRIBUTION SCHEDULE MANAGER */}
      {activeAdminTab === 'schedules' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {lang === 'am' ? 'የዞን የውሃ ቫልቮች እና የስርጭት ሰሌዳ መቆጣጠሪያ' : 'Zone Distribution Grid & Pressure Control'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {lang === 'am'
                ? 'በከተማዋ ውስጥ ያሉ የዞን ቫልቮችን ሁኔታ በቀጥታ ይለውጡ፤ ለውጡ ለህዝቡ ወዲያውኑ ይታያል።'
                : 'Instantly toggle live water flow status and pipeline pressures per district.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schedules.map(sch => (
                <div key={sch.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {isEthiopic ? sch.zoneNameAm : sch.zoneNameEn}
                      </h4>
                      <span className="text-xs text-slate-500">
                        {isEthiopic ? sch.subCityAm : sch.subCityEn}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-800">
                      {sch.pressureBar} Bar
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200/60">
                    <button
                      onClick={() => onUpdateScheduleStatus(sch.id, 'active_flowing', 3.6)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                        sch.status === 'active_flowing'
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {lang === 'am' ? 'ውሃ ክፈት' : 'Open Flow'}
                    </button>
                    <button
                      onClick={() => onUpdateScheduleStatus(sch.id, 'upcoming', 1.5)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                        sch.status === 'upcoming'
                          ? 'bg-cyan-700 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {lang === 'am' ? 'በተራ ያዝ' : 'Upcoming'}
                    </button>
                    <button
                      onClick={() => onUpdateScheduleStatus(sch.id, 'maintenance', 0.2)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                        sch.status === 'maintenance'
                          ? 'bg-amber-700 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {lang === 'am' ? 'ጥገና' : 'Maintenance'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EMERGENCY BROADCAST & SMS */}
      {activeAdminTab === 'broadcast' && (
        <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t.emergencyBroadcastTab}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'am'
                ? 'ለተመረጡት ዞን ነዋሪዎች በድረ-ገጹ አናት ላይ የሚለጠፍ እና በኤስኤምኤስ (SMS) የሚተላለፍ አስቸኳይ መልዕክት'
                : 'Publish urgent alerts across website top banner and trigger notification SMS'}
            </p>
          </div>

          {broadcastSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{lang === 'am' ? 'ማሳሰቢያው በድረ-ገጹ ላይ ተለጥፏል፤ ለነዋሪዎችም ተሰራጭቷል!' : 'Alert broadcasted to live portal and dispatched!'}</span>
            </div>
          ) : (
            <form onSubmit={handleBroadcastSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'am' ? 'የማሳሰቢያው ርዕስ' : 'Notice Headline'} *
                </label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder={t.broadcastTitlePlaceholder}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'am' ? 'ተጎጂ ዞኖች / ሰፈሮች' : 'Affected Neighborhoods'} *
                </label>
                <input
                  type="text"
                  required
                  value={affectedZones}
                  onChange={(e) => setAffectedZones(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'am' ? 'ዝርዝር መልዕክት' : 'Detailed Message'} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder={t.broadcastMessagePlaceholder}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  {t.broadcastSendBtn}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* MEDIA INSPECTION MODAL (Photo & Video Player) */}
      {inspectingIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {inspectingIncident.ticketNumber} — {t.viewAttachedMedia}
                </h4>
                <p className="text-xs text-slate-500">
                  {inspectingIncident.reporterName} ({inspectingIncident.reporterPhone}) · {inspectingIncident.specificLocation}
                </p>
              </div>
              <button
                onClick={() => setInspectingIncident(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {inspectingIncident.videoUrl && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1">
                    {lang === 'am' ? 'የተጠቃሚው የቪዲዮ ማስረጃ (Live Video Playback):' : 'Citizen Video Clip Recording:'}
                  </span>
                  <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                    <video
                      src={inspectingIncident.videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {inspectingIncident.photoUrl && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1">
                    {lang === 'am' ? 'የተጠቃሚው የፎቶ ማስረጃ:' : 'Citizen High-Res Snapshot:'}
                  </span>
                  <img
                    src={inspectingIncident.photoUrl}
                    alt="Leak proof"
                    className="w-full h-64 object-cover rounded-xl border border-slate-200"
                  />
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectingIncident(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-black"
              >
                {t.closeModal}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN TECHNICIAN MODAL */}
      {assigningIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900">
                {t.assignTechnicianBtn} ({assigningIncident.ticketNumber})
              </h4>
              <button onClick={() => setAssigningIncident(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'am' ? 'የቴክኒሻኑ ሙሉ ስም እና የስራ መደብ' : 'Technician Name & Title'}
                </label>
                <input
                  type="text"
                  required
                  value={techName}
                  onChange={(e) => setTechName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'am' ? 'የቴክኒሻኑ ስልክ' : 'Technician Phone'}
                </label>
                <input
                  type="tel"
                  required
                  value={techPhone}
                  onChange={(e) => setTechPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'am' ? 'የስምሪት ትዕዛዝ / ማስታወሻ' : 'Dispatch Instructions'}
                </label>
                <textarea
                  rows={2}
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  placeholder="ምሳሌ፡ 2 ኢንች የብረት ቧንቧ ማያያዣ ይዛችሁ ሂዱ..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningIncident(null)}
                  className="px-3 py-1.5 border border-slate-300 text-xs rounded-lg"
                >
                  {t.closeModal}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-700 text-white text-xs font-semibold rounded-lg hover:bg-cyan-800"
                >
                  {lang === 'am' ? 'ቴክኒሻን አሰማራ' : 'Dispatch Tech'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESOLVE INCIDENT MODAL */}
      {resolvingIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900">
                {t.markResolvedBtn} ({resolvingIncident.ticketNumber})
              </h4>
              <button onClick={() => setResolvingIncident(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResolveSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'am' ? 'የተከናወነ የጥገና ማስታወሻ' : 'Resolution Log Summary'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder={lang === 'am' ? 'የተሰበረው ቧንቧ ተቀይሮ ቫልቭ ተከፍቷል፤ ፍሳሽ የለም...' : 'Repaired broken section, pressure normalized...'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResolvingIncident(null)}
                  className="px-3 py-1.5 border border-slate-300 text-xs rounded-lg"
                >
                  {t.closeModal}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800"
                >
                  {lang === 'am' ? 'ጥገናውን አጠናቅቅ' : 'Complete Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
