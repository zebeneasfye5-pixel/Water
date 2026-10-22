import React, { useState, useEffect } from 'react';
import { Search, Bell, Droplets, Clock, Gauge, AlertTriangle, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import { WaterSchedule, Language } from '../types';
import { translations } from '../utils/translations';

interface WaterScheduleViewProps {
  schedules: WaterSchedule[];
  lang: Language;
  onSubscribePhone: (scheduleId: string, phone: string) => void;
}

export const WaterScheduleView: React.FC<WaterScheduleViewProps> = ({
  schedules,
  lang,
  onSubscribePhone
}) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSubCity, setSelectedSubCity] = useState<string>('all');
  const [subscribeModalSchedule, setSubscribeModalSchedule] = useState<WaterSchedule | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Keep countdown updated
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute countdown string
  const getCountdown = (targetTimeIso: string) => {
    const diff = new Date(targetTimeIso).getTime() - now;
    if (diff <= 0) return lang === 'am' ? 'አሁን' : 'Now';
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const isEthiopic = lang === 'am' || lang === 'ti';
  const subCities = Array.from(new Set(schedules.map(s => isEthiopic ? s.subCityAm : s.subCityEn)));

  const filteredSchedules = schedules.filter(sch => {
    const zoneName = isEthiopic ? sch.zoneNameAm : sch.zoneNameEn;
    const subCity = isEthiopic ? sch.subCityAm : sch.subCityEn;
    const matchesSearch =
      zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.kebeles.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ? true : sch.status === statusFilter;

    const matchesSubCity =
      selectedSubCity === 'all' ? true : subCity === selectedSubCity;

    return matchesSearch && matchesStatus && matchesSubCity;
  });

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeModalSchedule || !phoneNumber.trim()) return;
    onSubscribePhone(subscribeModalSchedule.id, phoneNumber);
    setSubscribedSuccess(true);
    setTimeout(() => {
      setSubscribedSuccess(false);
      setSubscribeModalSchedule(null);
      setPhoneNumber('');
    }, 2200);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-800 uppercase tracking-wider mb-1">
            <Droplets className="w-4 h-4 text-cyan-600" />
            <span>{lang === 'am' ? 'የውሃ ስርጭት እና ፍሰት መከታተያ' : 'Water Grid Distribution & Schedule'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.scheduleHeader}
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            {t.scheduleSubheader}
          </p>
        </div>

        {/* Global Stats bar */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-right">
            <span className="text-[11px] text-slate-500 block">
              {lang === 'am' ? 'በአሁኑ ሰዓት ንቁ ፍሰት' : 'Active Grids Now'}
            </span>
            <span className="text-lg font-bold text-emerald-600 font-mono-numbers">
              {schedules.filter(s => s.status === 'active_flowing').length} / {schedules.length}
            </span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-right">
            <span className="text-[11px] text-slate-500 block">
              {lang === 'am' ? 'የከተማው አማካይ ጫና' : 'Avg Grid Pressure'}
            </span>
            <span className="text-lg font-bold text-cyan-700 font-mono-numbers">
              2.8 Bar
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:bg-white transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sub-city dropdown */}
          <div className="w-full lg:w-48 shrink-0">
            <select
              value={selectedSubCity}
              onChange={(e) => setSelectedSubCity(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:bg-white"
            >
              <option value="all">
                {lang === 'am' ? 'ሁሉም ክፍለ ከተሞች' : 'All Sub-Cities'}
              </option>
              {subCities.map((sc) => (
                <option key={sc} value={sc}>
                  {sc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status segmented filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.allZones} ({schedules.length})
          </button>
          <button
            onClick={() => setStatusFilter('active_flowing')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              statusFilter === 'active_flowing'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {t.flowingNow} ({schedules.filter(s => s.status === 'active_flowing').length})
          </button>
          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              statusFilter === 'upcoming'
                ? 'bg-cyan-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            {t.upcomingFlow} ({schedules.filter(s => s.status === 'upcoming').length})
          </button>
          <button
            onClick={() => setStatusFilter('maintenance')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              statusFilter === 'maintenance'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {t.underMaintenance} ({schedules.filter(s => s.status === 'maintenance').length})
          </button>
        </div>
      </div>

      {/* Grid of Schedules */}
      {filteredSchedules.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Droplets className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">
            {lang === 'am' ? 'ምንም አይነት ዞን አልተገኘም' : 'No matching zones found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'am' ? 'እባክዎ የፍለጋ ቃሉን ወይም ፊልተሩን ይቀይሩ' : 'Try adjusting your search criteria or sub-city filter'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchedules.map((sch) => {
            const isFlowing = sch.status === 'active_flowing';
            const isUpcoming = sch.status === 'upcoming';
            const isMaintenance = sch.status === 'maintenance';

            return (
              <div
                key={sch.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between overflow-hidden"
              >
                {/* Card Top */}
                <div className="p-5 space-y-4">
                  {/* Status header with clean typography */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="font-semibold text-slate-800">
                        {isEthiopic ? sch.subCityAm : sch.subCityEn}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{sch.kebeles.join(', ')}</span>
                    </div>

                    {/* Status indicator */}
                    {isFlowing && (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {t.activeFlowingBadge}
                      </span>
                    )}
                    {isUpcoming && (
                      <span className="text-xs font-semibold text-cyan-700 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-cyan-500" />
                        {t.upcomingBadge}
                      </span>
                    )}
                    {isMaintenance && (
                      <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        {t.maintenanceBadge}
                      </span>
                    )}
                  </div>

                  {/* Main Zone Title */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {isEthiopic ? sch.zoneNameAm : sch.zoneNameEn}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {isEthiopic ? sch.flowDaysAm : sch.flowDaysEn} · {isEthiopic ? sch.flowHoursAm : sch.flowHoursEn}
                    </p>
                  </div>

                  {/* Countdown Timer Module */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {isFlowing ? t.flowEndsIn : t.nextFlowStartsIn}
                    </div>
                    <div className="text-xl font-bold font-mono-numbers text-slate-900 mt-1">
                      {isFlowing
                        ? getCountdown(sch.nextFlowEnd)
                        : getCountdown(sch.nextFlowStart)}
                    </div>
                  </div>

                  {/* Operational Telemetry: Pressure & Reservoir */}
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[11px]">
                        {t.pressureLevel}
                      </span>
                      <span className="font-semibold text-slate-800 font-mono-numbers">
                        {sch.pressureBar} Bar
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">
                        {t.reservoirStatus}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-600 rounded-full"
                            style={{ width: `${sch.reservoirLevelPercent}%` }}
                          />
                        </div>
                        <span className="font-mono-numbers text-[11px] font-semibold text-slate-700">
                          {sch.reservoirLevelPercent}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Official Notice if any */}
                  {(sch.noticeAm || sch.noticeEn) && (
                    <div className="bg-cyan-50/60 border border-cyan-100 rounded-lg p-2.5 text-xs text-cyan-900">
                      {lang === 'am' ? sch.noticeAm : sch.noticeEn}
                    </div>
                  )}
                </div>

                {/* Card Action: SMS Alert Subscription */}
                <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {sch.subscribersCount} {lang === 'am' ? 'ተመዝጋቢዎች' : 'subscribers'}
                  </span>
                  <button
                    onClick={() => setSubscribeModalSchedule(sch)}
                    className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 transition-colors"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    {lang === 'am' ? 'በኤስኤምኤስ ተከታተል' : 'Get SMS Alert'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SMS Subscription Modal */}
      {subscribeModalSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider block mb-1">
                  {lang === 'am' ? 'የውሃ መርሃ-ግብር ማሳወቂያ' : 'Distribution Alert'}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {lang === 'am' ? subscribeModalSchedule.zoneNameAm : subscribeModalSchedule.zoneNameEn}
                </h3>
              </div>
              <button
                onClick={() => setSubscribeModalSchedule(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-2 mb-4">
              {lang === 'am'
                ? 'ወደዚህ ዞን ውሃ ሊለቀቅ 1 ሰዓት ሲቀረው እንዲሁም ውሃው ሲቋረጥ በነጻ የስልክ አጭር የጽሁፍ መልዕክት (SMS) ይላክልዎታል።'
                : 'Receive a free SMS 1 hour before water is turned on, as well as upon valve closure.'}
            </p>

            {subscribedSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.subscribedSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.phonePrompt}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0911223344"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono-numbers text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSubscribeModalSchedule(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-100"
                  >
                    {lang === 'am' ? 'ሰርዝ' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-700 text-white text-xs font-semibold rounded-lg hover:bg-cyan-800 shadow-sm flex items-center gap-1.5"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    {lang === 'am' ? 'በኤስኤምኤስ መዝግበኝ' : 'Subscribe via SMS'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
