import React, { useState } from 'react';
import {
  User,
  Droplets,
  CreditCard,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Phone,
  Calendar,
  FileText,
  Truck,
  ArrowRight,
  TrendingUp,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  Zap,
  MapPin,
  Sparkles
} from 'lucide-react';
import { BillRecord, IncidentReport, WaterSchedule, Language } from '../types';
import { translations } from '../utils/translations';

interface CitizenDashboardViewProps {
  bills: BillRecord[];
  incidents: IncidentReport[];
  schedules: WaterSchedule[];
  lang: Language;
  onPayBill: (billId: string, method: string) => void;
  onNavigateToReport: () => void;
  onNavigateToSchedule: () => void;
  onOpenTankerModal: () => void;
}

export const CitizenDashboardView: React.FC<CitizenDashboardViewProps> = ({
  bills,
  incidents,
  schedules,
  lang,
  onPayBill,
  onNavigateToReport,
  onNavigateToSchedule,
  onOpenTankerModal
}) => {
  const isEthiopic = lang === 'am' || lang === 'ti';
  const t = translations[lang];

  // Selected Citizen Account (allows switching between demo profiles or custom lookup)
  const [selectedMeterNumber, setSelectedMeterNumber] = useState<string>(
    bills[0]?.meterNumber || 'MTR-09412'
  );
  const [customSearchQuery, setCustomSearchQuery] = useState('');

  // Find current citizen bill record
  const currentCitizenBill = bills.find(b => b.meterNumber === selectedMeterNumber) || bills[0];

  // Find citizen incidents (matched by phone or name or subCity)
  const citizenIncidents = incidents.filter(
    i =>
      (currentCitizenBill && i.reporterPhone === currentCitizenBill.customerPhone) ||
      (currentCitizenBill && i.reporterName.toLowerCase().includes(currentCitizenBill.customerName.toLowerCase().split(' ')[0])) ||
      (currentCitizenBill && i.subCityAm.includes(currentCitizenBill.subCity))
  );

  // Find schedule for citizen zone
  const citizenSchedule =
    schedules.find(s => currentCitizenBill && (s.subCityAm.includes(currentCitizenBill.subCity) || s.subCityEn.toLowerCase().includes(currentCitizenBill.subCity.toLowerCase()))) ||
    schedules[0];

  // Monthly consumption mock data for visual bars
  const consumptionHistory = [
    { month: isEthiopic ? 'ሰኔ' : 'June', m3: 18, amount: 270, status: 'paid' },
    { month: isEthiopic ? 'ሐምሌ' : 'July', m3: 21, amount: 315, status: 'paid' },
    { month: isEthiopic ? 'ነሐሴ' : 'August', m3: 25, amount: 375, status: 'paid' },
    { month: isEthiopic ? 'መስከረም' : 'September', m3: currentCitizenBill?.consumptionM3 || 22, amount: currentCitizenBill?.totalBirr || 395.50, status: currentCitizenBill?.status || 'unpaid' }
  ];

  const maxM3 = Math.max(...consumptionHistory.map(c => c.m3));

  // Quick printable receipt simulation
  const [printingReceipt, setPrintingReceipt] = useState<BillRecord | null>(null);

  return (
    <div className="space-y-6">
      {/* 1. Account Selector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-11 h-11 rounded-2xl bg-cyan-700 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                {currentCitizenBill?.customerName || 'አቶ ዮሐንስ ተስፋዬ'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {isEthiopic ? 'ንቁ ቆጣሪ' : 'Active Meter'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono-numbers">
              {isEthiopic ? 'የቆጣሪ ቁጥር:' : 'Meter ID:'} <span className="font-bold text-slate-700">{currentCitizenBill?.meterNumber}</span> · {currentCitizenBill?.subCity}፣ {currentCitizenBill?.kebele}
            </p>
          </div>
        </div>

        {/* Account Switcher Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-slate-500 font-medium whitespace-nowrap">
            {isEthiopic ? 'መለያ ቀይር:' : 'Switch Account:'}
          </label>
          <select
            value={selectedMeterNumber}
            onChange={e => setSelectedMeterNumber(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 w-full sm:w-auto"
          >
            {bills.map(b => (
              <option key={b.id} value={b.meterNumber}>
                {b.customerName} ({b.meterNumber} - {b.subCity})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Top Metric Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card A: Water Availability in My Zone */}
        <div className="bg-gradient-to-br from-cyan-900 to-slate-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-200">
                {isEthiopic ? 'የአካባቢዬ የውሃ ፍሰት ሁኔታ' : 'Zone Water Status'}
              </span>
              {citizenSchedule?.status === 'active_flowing' ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isEthiopic ? 'እየፈሰሰ ነው' : 'Flowing'}
                </span>
              ) : citizenSchedule?.status === 'upcoming' ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {isEthiopic ? 'በመጠባበቅ ላይ' : 'Upcoming'}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {isEthiopic ? 'ጥገና ላይ' : 'Maintenance'}
                </span>
              )}
            </div>

            <h3 className="text-xl font-black text-white">
              {citizenSchedule?.zoneNameAm || 'ቦሌ መድሃኒአለም ዞን'}
            </h3>

            <p className="text-xs text-cyan-100/80 leading-relaxed">
              {citizenSchedule?.noticeAm || 'ውሃው በመደበኛ ግፊት በመፍሰስ ላይ ነው። ታንከራችሁን ሙሉ!'}
            </p>

            <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-cyan-300 block">{isEthiopic ? 'የውሃ ጫና (Pressure)' : 'Pressure'}</span>
                <span className="font-bold font-mono-numbers text-white">{citizenSchedule?.pressureBar || 3.8} Bar</span>
              </div>
              <div>
                <span className="text-[10px] text-cyan-300 block">{isEthiopic ? 'የማጠራቀሚያ መጠን' : 'Reservoir'}</span>
                <span className="font-bold font-mono-numbers text-white">{citizenSchedule?.reservoirLevelPercent || 85}%</span>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToSchedule}
            className="mt-4 w-full py-2 bg-white/15 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
          >
            <span>{isEthiopic ? 'ሙሉ የሰፈሬን መርሃግብር ተመልከት' : 'View Full Schedule'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card B: Outstanding Bill & Payment */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {isEthiopic ? 'ያልተከፈለ የወቅቱ ሂሳብ' : 'Current Water Bill'}
              </span>
              {currentCitizenBill?.status === 'paid' ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {isEthiopic ? 'ተከፍሏል' : 'Paid'}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {isEthiopic ? 'ያልተከፈለ' : 'Unpaid'}
                </span>
              )}
            </div>

            <div>
              <span className="text-3xl font-black text-slate-900 font-mono-numbers tracking-tight block">
                {currentCitizenBill?.status === 'paid' ? '0.00' : currentCitizenBill?.totalBirr.toFixed(2)}{' '}
                <span className="text-sm font-semibold text-slate-500">ETB</span>
              </span>
              <p className="text-xs text-slate-500 mt-1">
                {currentCitizenBill?.billingPeriod} · {isEthiopic ? 'የመክፈያ ቀን:' : 'Due Date:'}{' '}
                <span className="font-semibold text-slate-800">{currentCitizenBill?.dueDate}</span>
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 text-xs space-y-1.5 border border-slate-100 font-mono-numbers">
              <div className="flex justify-between text-slate-600">
                <span>{isEthiopic ? 'ያለፈው ንባብ:' : 'Prev Reading:'}</span>
                <span>{currentCitizenBill?.previousReadingM3} ሜ³</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{isEthiopic ? 'የአሁኑ ንባብ:' : 'Current Reading:'}</span>
                <span>{currentCitizenBill?.currentReadingM3} ሜ³</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>{isEthiopic ? 'ወርሃዊ ፍጆታ:' : 'Consumption:'}</span>
                <span>{currentCitizenBill?.consumptionM3} ሜ³</span>
              </div>
            </div>
          </div>

          {currentCitizenBill?.status === 'unpaid' ? (
            <button
              onClick={() => onPayBill(currentCitizenBill.id, 'telebirr')}
              className="mt-4 w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isEthiopic ? 'አሁን በቴሌብር / ሲቢኢ ክፈል' : 'Pay Now via Telebirr/CBE'}</span>
            </button>
          ) : (
            <button
              onClick={() => setPrintingReceipt(currentCitizenBill)}
              className="mt-4 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-cyan-700" />
              <span>{isEthiopic ? 'የክፍያ ደረሰኝ አትም / አውርድ' : 'View & Print Receipt'}</span>
            </button>
          )}
        </div>

        {/* Card C: Emergency Tanker & Fast Actions */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {isEthiopic ? 'የአደጋ ጊዜ ፈጣን አገልግሎት' : 'Fast Actions'}
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
            </div>

            <div className="space-y-2.5">
              {/* Action 1: Order Tanker */}
              <button
                onClick={onOpenTankerModal}
                className="w-full p-3 rounded-2xl bg-cyan-50/80 hover:bg-cyan-100/80 border border-cyan-200 transition text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-700 text-white flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {isEthiopic ? 'የድንገተኛ ቦቴ ውሃ ማዘዣ' : 'Order Water Tanker'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {isEthiopic ? '5,000 / 10,000 ሊትር ወደ ቤት' : 'Rapid Delivery'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-cyan-700 group-hover:translate-x-0.5 transition" />
              </button>

              {/* Action 2: Report Leakage with Camera */}
              <button
                onClick={onNavigateToReport}
                className="w-full p-3 rounded-2xl bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200 transition text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {isEthiopic ? 'የቧንቧ ብልሽት በፎቶ/ቪዲዮ ጥቆማ' : 'Report Water Leak / Burst'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {isEthiopic ? 'በጂፒኤስ ካርታ በቀጥታ' : 'GPS Location & Camera'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-700 group-hover:translate-x-0.5 transition" />
              </button>
            </div>
          </div>

          {/* Emergency Hotline Banner */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-cyan-700" />
              <span>{isEthiopic ? 'የነጻ የጥሪ ማዕከል:' : 'Hotline:'}</span>
            </div>
            <a href="tel:8844" className="font-extrabold text-cyan-800 font-mono-numbers">
              8844 / 933
            </a>
          </div>
        </div>
      </div>

      {/* 3. Consumption Analytics & Ticket Progress Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column 7: Water Consumption Trends */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-700" />
                <span>{isEthiopic ? 'የወራት የውሃ ፍጆታ ንፅፅር (ሜ³)' : 'Monthly Water Consumption Trend (m³)'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isEthiopic ? 'ያለፉት 4 ወራት የውሃ አጠቃቀም እና የወጣው ወጪ' : 'Past 4 months consumption and spend'}
              </p>
            </div>
            <span className="text-xs font-bold font-mono-numbers text-slate-700">
              {isEthiopic ? 'አማካይ:' : 'Avg:'} 21.5 ሜ³ / ወር
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-4 grid grid-cols-4 gap-3 items-end h-48 border-b border-slate-100 pb-4">
            {consumptionHistory.map((item, idx) => {
              const heightPercent = Math.round((item.m3 / (maxM3 * 1.2)) * 100);
              const isCurrent = idx === consumptionHistory.length - 1;

              return (
                <div key={item.month} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-bold font-mono-numbers text-slate-700">
                    {item.m3} ሜ³
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 group-hover:opacity-90 ${
                      isCurrent
                        ? 'bg-gradient-to-t from-cyan-700 to-cyan-500 shadow-md'
                        : 'bg-slate-200 group-hover:bg-slate-300'
                    }`}
                  />
                  <div className="text-center">
                    <span className="text-xs font-bold text-slate-800 block">{item.month}</span>
                    <span className="text-[10px] text-slate-400 font-mono-numbers block">{item.amount} ብር</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-cyan-600 inline-block" />
              <span>{isEthiopic ? 'የወቅቱ ወር' : 'Current Month'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-200 inline-block" />
              <span>{isEthiopic ? 'ያለፉት ወራት' : 'Past Months'}</span>
            </div>
          </div>
        </div>

        {/* Right Column 5: My Reported Incident Tickets with Live Stepper */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{isEthiopic ? 'ያቀረብኳቸው አቤቱታዎች' : 'My Reported Incidents'}</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {citizenIncidents.length} {isEthiopic ? 'ጥሪዎች' : 'Tickets'}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {citizenIncidents.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  {isEthiopic ? 'ምንም አይነት ንቁ የብልሽት ጥሪ የለዎትም።' : 'No active incident reports found.'}
                </div>
              ) : (
                citizenIncidents.map(inc => {
                  const step =
                    inc.status === 'resolved'
                      ? 4
                      : inc.status === 'in_progress'
                      ? 3
                      : inc.status === 'assigned'
                      ? 2
                      : 1;

                  return (
                    <div key={inc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 font-mono">{inc.ticketNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inc.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inc.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-cyan-100 text-cyan-800'
                        }`}>
                          {inc.status === 'resolved'
                            ? (isEthiopic ? 'ተጠግኗል' : 'Resolved')
                            : inc.status === 'in_progress'
                            ? (isEthiopic ? 'በጥገና ላይ' : 'In Progress')
                            : (isEthiopic ? 'ተመዝግቧል' : 'Submitted')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-snug font-medium line-clamp-2">
                        {inc.description}
                      </p>

                      {/* 4-Step Progress Track */}
                      <div className="space-y-1">
                        <div className="grid grid-cols-4 gap-1.5">
                          {[1, 2, 3, 4].map(s => (
                            <div
                              key={s}
                              className={`h-1.5 rounded-full ${
                                s <= step
                                  ? step === 4
                                    ? 'bg-emerald-500'
                                    : 'bg-cyan-600'
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                          <span>{isEthiopic ? 'ተመዘገበ' : 'Reported'}</span>
                          <span>{isEthiopic ? 'ተመደበ' : 'Assigned'}</span>
                          <span>{isEthiopic ? 'በስራ ላይ' : 'Working'}</span>
                          <span>{isEthiopic ? 'ተጠናቀቀ' : 'Fixed'}</span>
                        </div>
                      </div>

                      {inc.assignedTechnician && (
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                          <span className="text-[11px] truncate max-w-[180px]">{inc.assignedTechnician}</span>
                          {inc.technicianPhone && (
                            <a
                              href={`tel:${inc.technicianPhone}`}
                              className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono-numbers text-[11px] font-bold flex items-center gap-1"
                            >
                              <Phone className="w-2.5 h-2.5" />
                              <span>{inc.technicianPhone}</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button
            onClick={onNavigateToReport}
            className="mt-4 w-full py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <span>{isEthiopic ? 'አዲስ አቤቱታ አቅርብ' : 'Submit New Incident'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Modal for Receipt Print Preview */}
      {printingReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="text-center space-y-1 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-800 mx-auto flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                {isEthiopic ? 'ይፋዊ የውሃ ክፍያ ደረሰኝ' : 'Official Water Payment Receipt'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {printingReceipt.receiptNumber || `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`}
              </p>
            </div>

            <div className="space-y-2 text-xs font-mono-numbers divide-y divide-slate-100">
              <div className="flex justify-between py-1 text-slate-600">
                <span>{isEthiopic ? 'የደንበኛ ስም:' : 'Customer:'}</span>
                <span className="font-bold text-slate-900">{printingReceipt.customerName}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>{isEthiopic ? 'የቆጣሪ ቁጥር:' : 'Meter Number:'}</span>
                <span className="font-bold text-slate-900">{printingReceipt.meterNumber}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>{isEthiopic ? 'የክፍያ ወቅት:' : 'Period:'}</span>
                <span>{printingReceipt.billingPeriod}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>{isEthiopic ? 'የተጠቀሙት ውሃ:' : 'Consumption:'}</span>
                <span>{printingReceipt.consumptionM3} ሜ³</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>{isEthiopic ? 'የክፍያ መንገድ:' : 'Payment Method:'}</span>
                <span className="uppercase font-semibold">{printingReceipt.paymentMethod || 'Telebirr'}</span>
              </div>
              <div className="flex justify-between py-2 text-base font-black text-slate-900 pt-2">
                <span>{isEthiopic ? 'ጠቅላላ የተከፈለ:' : 'Total Paid:'}</span>
                <span className="text-cyan-800">{printingReceipt.totalBirr.toFixed(2)} ETB</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPrintingReceipt(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                {isEthiopic ? 'ዝጋ' : 'Close'}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>{isEthiopic ? 'ደረሰኝ አትም' : 'Print Receipt'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
