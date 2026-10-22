import React, { useState } from 'react';
import { Camera, Video, Mic, AlertCircle, MapPin, Send, CheckCircle2, Clock, Wrench, Search, Copy, Check, ExternalLink } from 'lucide-react';
import { IncidentReport, Language } from '../types';
import { translations } from '../utils/translations';
import { MediaCaptureModal } from './MediaCaptureModal';

interface IncidentReportingViewProps {
  incidents: IncidentReport[];
  lang: Language;
  onSubmitIncident: (newReport: Omit<IncidentReport, 'id' | 'ticketNumber' | 'status' | 'createdAt'>) => string;
}

export const IncidentReportingView: React.FC<IncidentReportingViewProps> = ({
  incidents,
  lang,
  onSubmitIncident
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');

  // Form Fields
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [subCity, setSubCity] = useState('ቦሌ');
  const [specificLocation, setSpecificLocation] = useState('');
  const [category, setCategory] = useState<IncidentReport['category']>('pipe_burst');
  const [urgency, setUrgency] = useState<IncidentReport['urgency']>('critical');
  const [description, setDescription] = useState('');

  // Media state
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [attachedPhoto, setAttachedPhoto] = useState<string | undefined>();
  const [attachedVideo, setAttachedVideo] = useState<string | undefined>();
  const [attachedAudio, setAttachedAudio] = useState<string | undefined>();

  // Ticket submission feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [copiedTicket, setCopiedTicket] = useState(false);

  // Ticket Tracking search
  const [trackSearchId, setTrackSearchId] = useState('');
  const [searchedIncident, setSearchedIncident] = useState<IncidentReport | null>(incidents[0] || null);

  const subCityOptions = [
    { am: 'ቦሌ', en: 'Bole' },
    { am: 'የካ', en: 'Yeka' },
    { am: 'ቂርቆስ', en: 'Kirkos' },
    { am: 'አራዳ', en: 'Arada' },
    { am: 'ንፋስ ስልክ ላፍቶ', en: 'Nifas Silk Lafto' },
    { am: 'ኮልፌ ቀራኒዮ', en: 'Kolfe Keranio' },
    { am: 'ጉለሌ', en: 'Gulele' },
    { am: 'አቃቂ ቃሊቲ', en: 'Akaki Kality' },
    { am: 'ልደታ', en: 'Lideta' },
    { am: 'አዲስ ከተማ', en: 'Addis Ketema' }
  ];

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setSpecificLocation(
            lang === 'am'
              ? `የአሁኑ መገኛ (GPS): ${lat}°N, ${lng}°E (በቦታው ላይ ተገኝቶ የተወሰደ)`
              : `Current GPS: ${lat}°N, ${lng}°E (Captured on-site)`
          );
        },
        () => {
          setSpecificLocation(
            lang === 'am'
              ? 'ቦሌ መድሃኒአለም አደባባይ አጠገብ (9.0012° N, 38.7845° E)'
              : 'Bole Medhanealem Roundabout (9.0012° N, 38.7845° E)'
          );
        }
      );
    } else {
      setSpecificLocation('ቦሌ መድሃኒአለም አደባባይ አጠገብ');
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !reporterName.trim() || !reporterPhone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const ticketNum = onSubmitIncident({
        reporterName,
        reporterPhone,
        subCityAm: subCity,
        subCityEn: subCityOptions.find(o => o.am === subCity)?.en || subCity,
        specificLocation,
        category,
        urgency,
        description,
        photoUrl: attachedPhoto,
        videoUrl: attachedVideo,
        audioVoiceUrl: attachedAudio
      });

      setIsSubmitting(false);
      setCreatedTicketId(ticketNum);

      // Reset form
      setReporterName('');
      setReporterPhone('');
      setDescription('');
      setSpecificLocation('');
      setAttachedPhoto(undefined);
      setAttachedVideo(undefined);
      setAttachedAudio(undefined);
    }, 1200);
  };

  const handleCopyTicket = (ticket: string) => {
    navigator.clipboard.writeText(ticket);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2000);
  };

  const handleSearchTrackTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackSearchId.trim()) return;
    const found = incidents.find(
      inc => inc.ticketNumber.toLowerCase() === trackSearchId.trim().toLowerCase()
    );
    setSearchedIncident(found || null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-800 uppercase tracking-wider mb-1">
          <AlertCircle className="w-4 h-4 text-cyan-600" />
          <span>{lang === 'am' ? 'የአደጋና የብልሽት ሪፖርት' : 'Incident & Leakage Reporting'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.reportTitle}
        </h2>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          {t.reportSubtitle}
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 p-1 bg-slate-100 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'submit'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            {t.tabSubmitIncident}
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'track'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            {t.tabTrackIncident}
          </button>
        </div>
      </div>

      {/* TAB 1: SUBMIT NEW INCIDENT */}
      {activeTab === 'submit' && (
        <div className="max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {createdTicketId ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {t.reportSuccessTitle}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {t.ticketSaveInstruction}
              </p>

              {/* Ticket ID Box with Copy */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm mx-auto flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">{t.yourTicketNumber}</span>
                  <span className="text-lg font-bold font-mono text-cyan-800">
                    {createdTicketId}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyTicket(createdTicketId)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 shadow-2xs"
                >
                  {copiedTicket ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTicket ? (lang === 'am' ? 'ተቀድቷል' : 'Copied') : (lang === 'am' ? 'ቅዳ' : 'Copy')}</span>
                </button>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setTrackSearchId(createdTicketId);
                    setActiveTab('track');
                    const match = incidents.find(i => i.ticketNumber === createdTicketId);
                    if (match) setSearchedIncident(match);
                    setCreatedTicketId(null);
                  }}
                  className="px-5 py-2.5 bg-cyan-700 text-white rounded-lg text-xs font-semibold hover:bg-cyan-800 transition shadow-sm"
                >
                  {lang === 'am' ? 'የጥገና ሂደቱን አሁን ተከታተል' : 'Track Repair Progress Now'}
                </button>
                <button
                  onClick={() => setCreatedTicketId(null)}
                  className="px-4 py-2.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  {lang === 'am' ? 'ሌላ አቤቱታ አቅርብ' : 'Submit Another Report'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitForm} className="space-y-6">
              {/* Category & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.issueCategory} *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:bg-white"
                  >
                    <option value="pipe_burst">{t.catPipeBurst}</option>
                    <option value="water_contamination">{t.catWaterContam}</option>
                    <option value="low_pressure">{t.catLowPressure}</option>
                    <option value="meter_breakdown">{t.catMeterBreakdown}</option>
                    <option value="illegal_connection">{t.catIllegalConnect}</option>
                    <option value="sewer_overflow">{t.catSewerOverflow}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.urgencyLabel} *
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:bg-white"
                  >
                    <option value="critical">{t.urgencyCritical}</option>
                    <option value="high">{t.urgencyHigh}</option>
                    <option value="medium">{t.urgencyMedium}</option>
                    <option value="low">{t.urgencyLow}</option>
                  </select>
                </div>
              </div>

              {/* Location details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.subCityLabel} *
                  </label>
                  <select
                    value={subCity}
                    onChange={(e) => setSubCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:bg-white"
                  >
                    {subCityOptions.map(sc => (
                      <option key={sc.am} value={sc.am}>
                        {lang === 'am' ? sc.am : sc.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {t.exactLocationLabel} *
                    </label>
                    <button
                      type="button"
                      onClick={handleUseLocation}
                      className="text-[11px] text-cyan-700 hover:text-cyan-800 font-semibold flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3" />
                      {t.useMyLocation}
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={specificLocation}
                    onChange={(e) => setSpecificLocation(e.target.value)}
                    placeholder={t.locationPlaceholder}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Reporter contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.reporterNameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder={lang === 'am' ? 'ሙሉ ስምዎን ያስገቡ...' : 'Enter your full name...'}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.reporterPhoneLabel} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    placeholder="0911223344"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono-numbers text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.descriptionLabel} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.descriptionPlaceholder}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:bg-white resize-none"
                />
              </div>

              {/* MEDIA ATTACHMENT SECTION (Core User Requirement) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-cyan-700" />
                      {t.mediaSectionTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {t.mediaSectionSubtitle}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMediaModalOpen(true)}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-100 transition shadow-2xs flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    <Video className="w-3.5 h-3.5 text-cyan-700" />
                    <span>{lang === 'am' ? 'ፎቶ ወይም ቪዲዮ አንሳ/ቅረጽ' : 'Open Photo/Video Recorder'}</span>
                  </button>
                </div>

                {/* Previews if attached */}
                {(attachedPhoto || attachedVideo || attachedAudio) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {attachedPhoto && (
                      <div className="relative rounded-lg overflow-hidden border border-slate-300 bg-white group">
                        <img
                          src={attachedPhoto}
                          alt="Incident proof"
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                          {lang === 'am' ? 'የተያያዘ ፎቶ' : 'Attached Photo'}
                        </div>
                        <button
                          type="button"
                          onClick={() => setAttachedPhoto(undefined)}
                          className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white rounded text-[10px] font-semibold"
                        >
                          {t.removeMedia}
                        </button>
                      </div>
                    )}

                    {attachedVideo && (
                      <div className="relative rounded-lg overflow-hidden border border-slate-300 bg-slate-950 group">
                        <video
                          src={attachedVideo}
                          controls
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                          {lang === 'am' ? 'የተያያዘ ቪዲዮ' : 'Attached Video'}
                        </div>
                        <button
                          type="button"
                          onClick={() => setAttachedVideo(undefined)}
                          className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white rounded text-[10px] font-semibold"
                        >
                          {t.removeMedia}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => setIsMediaModalOpen(true)}
                    className="border-2 border-dashed border-slate-300 hover:border-cyan-600 rounded-lg p-5 text-center cursor-pointer transition bg-white"
                  >
                    <div className="flex items-center justify-center gap-3 text-slate-400 mb-1">
                      <Camera className="w-5 h-5 text-cyan-600" />
                      <Video className="w-5 h-5 text-indigo-600" />
                      <Mic className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 block">
                      {lang === 'am' ? 'የቧንቧውን ብልሽት በፎቶ ወይም በቪዲዮ ለማያያዝ እዚህ ይጫኑ' : 'Click to capture live photo or record a video of the leak'}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {lang === 'am' ? 'የሞባይል ካሜራ፣ ዌብካም ወይም ፋይል አያይዝ' : 'Supports webcam, phone camera, or file upload'}
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-cyan-700 text-white rounded-xl text-xs font-bold hover:bg-cyan-800 disabled:opacity-50 transition shadow-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>{t.submittingReport}</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.submitReportBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: TRACK EXISTING INCIDENT TICKET */}
      {activeTab === 'track' && (
        <div className="space-y-6 max-w-4xl">
          {/* Search Box */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={trackSearchId}
                onChange={(e) => setTrackSearchId(e.target.value)}
                placeholder={t.trackInputPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:bg-white"
              />
            </div>
            <button
              onClick={handleSearchTrackTicket}
              className="px-6 py-2.5 bg-cyan-700 text-white rounded-lg text-xs font-semibold hover:bg-cyan-800 transition whitespace-nowrap shrink-0 shadow-2xs"
            >
              {t.trackBtn}
            </button>
          </div>

          {/* Quick Demo Tickets click */}
          <div className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto pb-1">
            <span className="shrink-0">{lang === 'am' ? 'የሙከራ ትኬቶች:' : 'Demo Tickets:'}</span>
            {incidents.slice(0, 3).map(inc => (
              <button
                key={inc.ticketNumber}
                type="button"
                onClick={() => {
                  setTrackSearchId(inc.ticketNumber);
                  setSearchedIncident(inc);
                }}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:border-cyan-600 rounded text-xs font-mono text-slate-700 shrink-0"
              >
                {inc.ticketNumber} ({lang === 'am' ? inc.subCityAm : inc.subCityEn})
              </button>
            ))}
          </div>

          {/* Searched Incident Details */}
          {searchedIncident ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold font-mono text-slate-900">
                      {searchedIncident.ticketNumber}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        searchedIncident.urgency === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : searchedIncident.urgency === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {searchedIncident.urgency.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === 'am' ? searchedIncident.subCityAm : searchedIncident.subCityEn} · {searchedIncident.specificLocation}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">
                    {lang === 'am' ? 'የተመዘገበበት ሰዓት' : 'Logged At'}
                  </span>
                  <span className="text-xs font-medium text-slate-700">
                    {new Date(searchedIncident.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Visual Workflow Steps */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                  {lang === 'am' ? 'የጥገና ሂደት ደረጃ' : 'Repair Status Pipeline'}
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { key: 'submitted', label: t.statusSubmitted },
                    { key: 'assigned', label: t.statusAssigned },
                    { key: 'in_progress', label: t.statusInProgress },
                    { key: 'resolved', label: t.statusResolved }
                  ].map((step, idx) => {
                    const stepOrder = ['submitted', 'assigned', 'in_progress', 'resolved'];
                    const currentIdx = stepOrder.indexOf(searchedIncident.status);
                    const isDone = currentIdx >= idx;
                    const isCurrent = currentIdx === idx;

                    return (
                      <div key={step.key} className="space-y-2">
                        <div
                          className={`h-2 rounded-full transition ${
                            isDone ? 'bg-cyan-600' : 'bg-slate-200'
                          }`}
                        />
                        <span
                          className={`text-xs block font-medium leading-tight ${
                            isCurrent
                              ? 'text-cyan-800 font-bold'
                              : isDone
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Incident Description */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {lang === 'am' ? 'የአቤቱታው ዝርዝር' : 'Incident Details'}
                </span>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {searchedIncident.description}
                </p>
              </div>

              {/* Technician Assignment Details */}
              {searchedIncident.assignedTechnician && (
                <div className="bg-cyan-50/50 p-4 rounded-xl border border-cyan-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-cyan-700" />
                    <span className="text-xs font-bold text-cyan-900">
                      {t.assignedTech} {searchedIncident.assignedTechnician}
                    </span>
                  </div>
                  {searchedIncident.technicianPhone && (
                    <p className="text-xs text-cyan-800 font-mono">
                      {t.techPhone} {searchedIncident.technicianPhone}
                    </p>
                  )}
                  {searchedIncident.resolutionNotes && (
                    <p className="text-xs text-slate-700 pt-1 border-t border-cyan-200/50">
                      <span className="font-semibold">{t.resolutionNotes}</span> {searchedIncident.resolutionNotes}
                    </p>
                  )}
                </div>
              )}

              {/* Attached Photo & Video Player Proof */}
              {(searchedIncident.photoUrl || searchedIncident.videoUrl) && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    {lang === 'am' ? 'የተያያዙ የቪዲዮ እና የፎቶ ማስረጃዎች' : 'Attached Video & Photo Proof'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {searchedIncident.photoUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                        <img
                          src={searchedIncident.photoUrl}
                          alt="Incident proof"
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-2 bg-slate-900 text-white text-[11px] font-medium flex items-center justify-between">
                          <span>{lang === 'am' ? 'የፎቶ ማስረጃ' : 'Photo Proof'}</span>
                          <span className="text-[10px] text-slate-400">High Res</span>
                        </div>
                      </div>
                    )}

                    {searchedIncident.videoUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-black">
                        <video
                          src={searchedIncident.videoUrl}
                          controls
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-2 bg-slate-900 text-white text-[11px] font-medium flex items-center justify-between">
                          <span className="text-red-400 flex items-center gap-1">
                            <Video className="w-3.5 h-3.5" />
                            {lang === 'am' ? 'የቪዲዮ ቅጂ' : 'Video Recording'}
                          </span>
                          <span className="text-[10px] text-slate-400">Playable</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              {t.ticketNotFound}
            </div>
          )}
        </div>
      )}

      {/* Media Capture Modal */}
      <MediaCaptureModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        lang={lang}
        initialMedia={{
          photoUrl: attachedPhoto,
          videoUrl: attachedVideo,
          audioVoiceUrl: attachedAudio
        }}
        onMediaCaptured={({ photoUrl, videoUrl, audioVoiceUrl }) => {
          if (photoUrl) setAttachedPhoto(photoUrl);
          if (videoUrl) setAttachedVideo(videoUrl);
          if (audioVoiceUrl) setAttachedAudio(audioVoiceUrl);
        }}
      />
    </div>
  );
};
