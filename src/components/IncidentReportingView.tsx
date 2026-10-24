import React, { useState } from 'react';
import {
  Camera,
  Video,
  Mic,
  AlertCircle,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  Wrench,
  Search,
  Copy,
  Check,
  ExternalLink,
  Upload,
  Crosshair,
  RefreshCw,
  Navigation
} from 'lucide-react';
import { IncidentReport, Language } from '../types';
import { translations } from '../utils/translations';
import { MediaCaptureModal } from './MediaCaptureModal';
import { REGIONS_DIRECTORY } from '../data/regionsData';
import { InteractiveGpsMap } from './InteractiveGpsMap';

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
  const [selectedRegionId, setSelectedRegionId] = useState<string>('addis_ababa');
  const selectedRegion = REGIONS_DIRECTORY.find(r => r.id === selectedRegionId) || REGIONS_DIRECTORY[0];
  const subCityOptions = selectedRegion.majorCities;
  const [subCity, setSubCity] = useState(subCityOptions[0]?.am || 'ቦሌ');
  const [woreda, setWoreda] = useState('ወረዳ 03');
  const [specificLocation, setSpecificLocation] = useState('');
  const [category, setCategory] = useState<IncidentReport['category']>('pipe_burst');
  const [urgency, setUrgency] = useState<IncidentReport['urgency']>('critical');
  const [description, setDescription] = useState('');

  // High Precision GPS State
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>(null);
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Media state
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [attachedPhoto, setAttachedPhoto] = useState<string | undefined>();
  const [attachedVideo, setAttachedVideo] = useState<string | undefined>();
  const [attachedAudio, setAttachedAudio] = useState<string | undefined>();
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // Ticket submission feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [copiedTicket, setCopiedTicket] = useState(false);

  // Ticket Tracking search
  const [trackSearchId, setTrackSearchId] = useState('');
  const [searchedIncident, setSearchedIncident] = useState<IncidentReport | null>(incidents[0] || null);

  // High Precision GPS Fetcher
  const handleUseLocation = () => {
    setIsGettingGps(true);
    setGpsError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(6));
          const lng = Number(pos.coords.longitude.toFixed(6));
          const accuracy = Math.round(pos.coords.accuracy);

          setGpsCoords({ latitude: lat, longitude: lng, accuracy });
          setIsGettingGps(false);

          const locText = lang === 'am'
            ? `ጂፒኤስ፡ ${lat}°N, ${lng}°E (ትክክለኛነት፡ ±${accuracy} ሜትር)`
            : `GPS: ${lat}°N, ${lng}°E (Precision: ±${accuracy}m)`;

          if (!specificLocation) {
            setSpecificLocation(locText);
          }
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setIsGettingGps(false);
          // Fallback coordinate in Addis Ababa center
          const fallbackLat = 9.0105;
          const fallbackLng = 38.7612;
          setGpsCoords({ latitude: fallbackLat, longitude: fallbackLng, accuracy: 25 });
          if (!specificLocation) {
            setSpecificLocation(
              lang === 'am'
                ? `አዲስ አበባ (9.0105° N, 38.7612° E)`
                : `Addis Ababa (9.0105° N, 38.7612° E)`
            );
          }
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
      );
    } else {
      setIsGettingGps(false);
      setGpsError('Geolocation is not supported by this browser.');
    }
  };

  // Upload file directly to `/api/incidents/upload`
  const handleDirectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingMedia(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const res = await fetch('/api/incidents/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        if (data.urls && data.urls.length > 0) {
          const firstUrl = data.urls[0];
          const isVideo = files[0].type.startsWith('video/');
          if (isVideo) {
            setAttachedVideo(firstUrl);
          } else {
            setAttachedPhoto(firstUrl);
          }
        }
      } else {
        // Fallback to local Data URL
        const reader = new FileReader();
        const file = files[0];
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (file.type.startsWith('video/')) {
            setAttachedVideo(result);
          } else {
            setAttachedPhoto(result);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Direct upload error, falling back to data URL:', err);
      const reader = new FileReader();
      const file = files[0];
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (file.type.startsWith('video/')) {
          setAttachedVideo(result);
        } else {
          setAttachedPhoto(result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !reporterName.trim() || !reporterPhone.trim()) return;

    setIsSubmitting(true);

    const chosenGps = gpsCoords || { latitude: 9.0105, longitude: 38.7612, accuracy: 15 };

    const reportPayload = {
      type: category,
      title: `${category.replace('_', ' ')} በ${subCity} ${woreda}`,
      description,
      subCity,
      woreda,
      kebele: woreda || 'ቀበሌ 01',
      specificLocation,
      gpsCoordinates: chosenGps,
      photos: attachedPhoto ? [attachedPhoto] : [],
      videos: attachedVideo ? [attachedVideo] : [],
      severity: urgency,
      reporterName,
      reporterPhone,
      isAnonymous: false
    };

    try {
      // Post to backend database
      await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportPayload)
      });
    } catch (err) {
      console.warn('Backend incident record error:', err);
    }

    const ticketNum = onSubmitIncident({
      reporterName,
      reporterPhone,
      subCityAm: subCity,
      subCityEn: subCityOptions.find(o => o.am === subCity)?.en || subCity,
      woreda,
      specificLocation,
      category,
      urgency,
      description,
      gpsCoordinates: chosenGps,
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
    setGpsCoords(null);
    setAttachedPhoto(undefined);
    setAttachedVideo(undefined);
    setAttachedAudio(undefined);
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

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mt-6 p-1 bg-slate-100 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'submit'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-cyan-600" />
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
            <Clock className="w-4 h-4 text-indigo-600" />
            {t.tabTrackIncident}
          </button>
        </div>
      </div>

      {/* TAB 1: SUBMIT REPORT */}
      {activeTab === 'submit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          {createdTicketId ? (
            <div className="text-center py-10 space-y-4 max-w-md mx-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{t.reportSuccessTitle}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.ticketSaveInstruction}
              </p>

              <div className="bg-slate-100 p-4 rounded-xl flex items-center justify-between border border-slate-200 font-mono-numbers">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
                    {t.yourTicketNumber}
                  </span>
                  <span className="text-lg font-bold text-slate-900 font-mono">{createdTicketId}</span>
                </div>
                <button
                  onClick={() => handleCopyTicket(createdTicketId)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition flex items-center gap-1.5"
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

              {/* Location details with Live High-Precision GPS */}
              <div className="space-y-4 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200">
                <div className="border-b border-slate-200 pb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {lang === 'am' ? 'የብልሽቱ ትክክለኛ አድራሻ እና የሳተላይት GPS ካርታ' : 'Incident Address & High-Resolution Satellite GPS'}
                    </span>
                  </div>
                  <span className="text-[11px] text-cyan-800 font-semibold bg-cyan-100/70 px-2 py-0.5 rounded-full">
                    {lang === 'am' ? 'ለባለሞያዎች አቅጣጫ መጠቆሚያ' : 'For Dispatch Navigation'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {lang === 'am' ? 'ክልል / ዞን' : 'Region'} *
                    </label>
                    <select
                      value={selectedRegionId}
                      onChange={(e) => {
                        setSelectedRegionId(e.target.value);
                        const reg = REGIONS_DIRECTORY.find(r => r.id === e.target.value);
                        if (reg && reg.majorCities.length > 0) {
                          setSubCity(reg.majorCities[0].am);
                        }
                      }}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    >
                      {REGIONS_DIRECTORY.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.flag} {lang === 'am' ? r.nameAm : r.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        {lang === 'am' ? 'ከተማ / ገጠራማ አካባቢ' : 'City / Town / Rural Area'} *
                      </label>
                      <span className="text-[10px] text-cyan-800 font-semibold bg-cyan-100/60 px-1.5 py-0.2 rounded">
                        {lang === 'am' ? 'ማንኛውንም ቦታ ይፃፉ' : 'Any location allowed'}
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      list="incident-cities-datalist"
                      value={subCity}
                      onChange={(e) => setSubCity(e.target.value)}
                      placeholder={lang === 'am' ? 'ምሳሌ፡ ደብረ ማርቆስ፣ ላሊበላ፣ እንጅባራ፣ ወይም ገጠር...' : 'Type any city, town, or rural area...'}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 shadow-2xs"
                    />

                    <datalist id="incident-cities-datalist">
                      {subCityOptions.map(sc => (
                        <option key={sc.en} value={lang === 'am' ? sc.am : sc.en} />
                      ))}
                    </datalist>

                    <div className="flex items-center gap-1 flex-wrap pt-1.5">
                      <span className="text-[10px] text-slate-400">{lang === 'am' ? 'ፈጣን፦' : 'Quick:'}</span>
                      {subCityOptions.slice(0, 6).map(sc => {
                        const label = lang === 'am' ? sc.am : sc.en;
                        return (
                          <button
                            key={sc.en}
                            type="button"
                            onClick={() => setSubCity(label)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium border transition ${
                              subCity === label
                                ? 'bg-cyan-700 text-white border-cyan-800'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {lang === 'am' ? 'ወረዳ / ቀበሌ' : 'Woreda / Kebele'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={woreda}
                      onChange={(e) => setWoreda(e.target.value)}
                      placeholder={lang === 'am' ? 'ምሳሌ፡ ወረዳ 03 ወይም ቀበሌ 01' : 'e.g., Woreda 03'}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {t.exactLocationLabel} (የመንገድ ወይም የሰፈር መጠሪያ) *
                    </label>
                    <button
                      type="button"
                      onClick={handleUseLocation}
                      disabled={isGettingGps}
                      className="text-[11px] text-cyan-800 hover:text-cyan-950 font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-100/80 hover:bg-cyan-200/80 border border-cyan-300 transition shadow-2xs"
                    >
                      {isGettingGps ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-800" />
                      ) : (
                        <Crosshair className="w-3.5 h-3.5 text-cyan-800" />
                      )}
                      <span>{lang === 'am' ? 'የአሁኑን መገኛዬን (GPS) በራስ-ሰር ያግኙ' : 'Capture Live Phone GPS'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={specificLocation}
                    onChange={(e) => setSpecificLocation(e.target.value)}
                    placeholder={t.locationPlaceholder}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  />
                </div>

                {/* GPS Coordinates & Interactive Satellite Map with clear technician instruction */}
                <div className="space-y-2 pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs px-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                      <span>{lang === 'am' ? 'የብልሽቱ ትክክለኛ የሳተላይት መገኛ ካርታ (ባለሞያዎች ቦታውን በምስል እንዲረዱት ካርታው ላይ ጠቁም)' : 'Exact Satellite Leak Map (Click/drag pin to pinpoint break)'}</span>
                    </span>
                    <span className="text-[11px] font-mono text-cyan-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                      {gpsCoords ? `📍 ${gpsCoords.latitude.toFixed(5)}°N, ${gpsCoords.longitude.toFixed(5)}°E (±${gpsCoords.accuracy || 15}m)` : '📍 9.01050°N, 38.76120°E'}
                    </span>
                  </div>

                  <InteractiveGpsMap
                    latitude={gpsCoords?.latitude || 9.0105}
                    longitude={gpsCoords?.longitude || 38.7612}
                    accuracy={gpsCoords?.accuracy || 15}
                    label={category ? `${category.replace('_', ' ')} (${subCity} ${woreda})` : (lang === 'am' ? 'የብልሽት ቦታ' : 'Leak Location')}
                    isEditable={true}
                    variant="incident"
                    height="300px"
                    lang={lang}
                    onLocationChange={(coords) => {
                      setGpsCoords(coords);
                      if (!specificLocation || specificLocation.includes('ጂፒኤስ፡') || specificLocation.includes('GPS:')) {
                        setSpecificLocation(
                          lang === 'am'
                            ? `ጂፒኤስ፡ ${coords.latitude.toFixed(5)}°N, ${coords.longitude.toFixed(5)}°E (±${coords.accuracy || 10}m)`
                            : `GPS: ${coords.latitude.toFixed(5)}°N, ${coords.longitude.toFixed(5)}°E (±${coords.accuracy || 10}m)`
                        );
                      }
                    }}
                  />
                  <p className="text-[11px] text-slate-500 italic px-1">
                    {lang === 'am'
                      ? '💡 ካርታው ላይ ያለውን ቀይ ምልክት ጣትዎን በመጠቀም ብልሽቱ ወዳለበት ትክክለኛ ቤት ወይም የመንገድ ዳርቻ ያንቀሳቅሱ። ባለሞያዎች ይህንን ምስል በቀጥታ ያዩታል።'
                      : '💡 Drag the red pin to the exact spot where the pipe or valve is leaking so technicians can navigate directly.'}
                  </p>
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

              {/* MEDIA ATTACHMENT SECTION (Core Requirement: Photo & Video with File Storage) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-cyan-700" />
                      {t.mediaSectionTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {t.mediaSectionSubtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Direct File Upload button */}
                    <label className="cursor-pointer px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-100 transition shadow-2xs flex items-center gap-1.5 whitespace-nowrap">
                      <Upload className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{lang === 'am' ? 'ፋይል ጫን' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleDirectFileUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Camera Modal trigger */}
                    <button
                      type="button"
                      onClick={() => setIsMediaModalOpen(true)}
                      className="px-3 py-2 bg-cyan-700 text-white rounded-lg text-xs font-semibold hover:bg-cyan-800 transition shadow-2xs flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{lang === 'am' ? 'ካሜራ ክፈት' : 'Open Camera'}</span>
                    </button>
                  </div>
                </div>

                {isUploadingMedia && (
                  <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-lg text-xs text-cyan-800 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-700" />
                    <span>{lang === 'am' ? 'ማስረጃው ወደ ሰርቨር ማከማቻ (File Storage) እየተጫነ ነው...' : 'Uploading media to server storage...'}</span>
                  </div>
                )}

                {/* Previews if attached */}
                {(attachedPhoto || attachedVideo || attachedAudio) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {attachedPhoto && (
                      <div className="relative rounded-lg overflow-hidden border border-slate-300 bg-white group">
                        <img
                          src={attachedPhoto}
                          alt="Incident proof"
                          className="w-full h-36 object-cover"
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
                          className="w-full h-36 object-cover"
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
                      <Upload className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 block">
                      {lang === 'am' ? 'የቧንቧውን ብልሽት በፎቶ ወይም በቪዲዮ ለማያያዝ እዚህ ይጫኑ' : 'Click to capture live photo or record a video of the leak'}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {lang === 'am' ? 'የስልክ ካሜራ፣ ዌብካም ወይም ፋይል አያይዝ (በቀጥታ ወደ ሰርቨር ማከማቻ ይቀመጣል)' : 'Supports webcam, phone camera, or file upload stored in server'}
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
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{t.submittingReport}</span>
                    </>
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

      {/* TAB 2: TRACK TICKET */}
      {activeTab === 'track' && (
        <div className="space-y-6">
          {/* Search box */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={trackSearchId}
                onChange={(e) => setTrackSearchId(e.target.value)}
                placeholder={lang === 'am' ? 'ምሳሌ፡ WTR-2026-0842...' : 'e.g., WTR-2026-0842...'}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:bg-white"
              />
            </div>
            <button
              onClick={handleSearchTrackTicket}
              className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
            >
              {lang === 'am' ? 'ቲኬት ፈልግ' : 'Search Ticket'}
            </button>
          </div>

          {/* Incident Detail Card */}
          {searchedIncident ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-800">{searchedIncident.ticketNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      searchedIncident.status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : searchedIncident.status === 'in_progress'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : searchedIncident.status === 'assigned'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {searchedIncident.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {searchedIncident.category.replace('_', ' ')}
                  </h3>
                </div>

                <div className="text-right text-xs text-slate-500">
                  <span>{new Date(searchedIncident.createdAt).toLocaleDateString()}</span>
                  <span className="block text-[11px] text-slate-400">
                    {new Date(searchedIncident.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Status progression bar */}
              <div className="py-2">
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className={`p-2.5 rounded-xl border ${
                    ['submitted', 'assigned', 'in_progress', 'resolved'].includes(searchedIncident.status)
                      ? 'bg-cyan-50 border-cyan-200 text-cyan-900 font-semibold'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-cyan-600" />
                    <span>{lang === 'am' ? 'ሪፖርት ተደርጓል' : 'Submitted'}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${
                    ['assigned', 'in_progress', 'resolved'].includes(searchedIncident.status)
                      ? 'bg-blue-50 border-blue-200 text-blue-900 font-semibold'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    <Wrench className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                    <span>{lang === 'am' ? 'ቴክኒሻን ተመድቧል' : 'Assigned'}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${
                    ['in_progress', 'resolved'].includes(searchedIncident.status)
                      ? 'bg-amber-50 border-amber-200 text-amber-900 font-semibold'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    <Clock className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                    <span>{lang === 'am' ? 'በጥገና ላይ' : 'Repairing'}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${
                    searchedIncident.status === 'resolved'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    <Check className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                    <span>{lang === 'am' ? 'ተጠናቋል' : 'Resolved'}</span>
                  </div>
                </div>
              </div>

              {/* Information grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 block">{lang === 'am' ? 'የቦታው አድራሻ' : 'Location'}:</span>
                  <span className="font-semibold text-slate-900">{searchedIncident.subCityAm}</span>
                  <p className="text-slate-600">{searchedIncident.specificLocation}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 block">{lang === 'am' ? 'የተመደበው ቴክኒሻን' : 'Assigned Technician'}:</span>
                  <span className="font-semibold text-slate-900">
                    {searchedIncident.assignedTechnician || (lang === 'am' ? 'በቅርቡ ይመደባል' : 'Pending dispatch')}
                  </span>
                  {searchedIncident.technicianPhone && (
                    <span className="block font-mono text-cyan-800">{searchedIncident.technicianPhone}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold block text-slate-900 mb-1">{t.descriptionLabel}:</span>
                <p className="leading-relaxed">{searchedIncident.description}</p>
              </div>

              {/* Map of Incident Location */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>{lang === 'am' ? 'የብልሽቱ ትክክለኛ የሳተላይት መገኛ ካርታ' : 'Geographic Satellite Location'}</span>
                  </span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${searchedIncident.gpsCoordinates?.latitude || 9.0105},${searchedIncident.gpsCoordinates?.longitude || 38.7612}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-[11px] font-bold shadow-xs transition"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{lang === 'am' ? 'ባለሞያ በGoogle Maps አቅጣጫ እንዲያይ' : 'Open in Google Maps'}</span>
                  </a>
                </div>
                <InteractiveGpsMap
                  latitude={searchedIncident.gpsCoordinates?.latitude || 9.0105}
                  longitude={searchedIncident.gpsCoordinates?.longitude || 38.7612}
                  accuracy={searchedIncident.gpsCoordinates?.accuracy || 20}
                  label={`${searchedIncident.ticketNumber} - ${searchedIncident.subCityAm}`}
                  isEditable={false}
                  variant="incident"
                  height="260px"
                  lang={lang}
                />
              </div>

              {/* Media attached proof */}
              {(searchedIncident.photoUrl || searchedIncident.videoUrl) && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-900 block">{t.mediaSectionTitle}:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {searchedIncident.photoUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-200">
                        <img src={searchedIncident.photoUrl} alt="Incident proof" className="w-full h-40 object-cover" />
                      </div>
                    )}
                    {searchedIncident.videoUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950">
                        <video src={searchedIncident.videoUrl} controls className="w-full h-40 object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
              {lang === 'am' ? 'የተፈለገው የቲኬት ቁጥር አልተገኘም። እባክዎ ቁጥሩን በትክክል ያስገቡ።' : 'Ticket not found. Please verify the ticket number.'}
            </div>
          )}
        </div>
      )}

      {/* Media Capture Modal */}
      {isMediaModalOpen && (
        <MediaCaptureModal
          isOpen={isMediaModalOpen}
          onClose={() => setIsMediaModalOpen(false)}
          lang={lang}
          onMediaCaptured={({ photoUrl, videoUrl, audioVoiceUrl }) => {
            if (photoUrl) setAttachedPhoto(photoUrl);
            if (videoUrl) setAttachedVideo(videoUrl);
            if (audioVoiceUrl) setAttachedAudio(audioVoiceUrl);
            setIsMediaModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
