import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Database,
  ArrowDownToLine,
  RefreshCw,
  Table,
  Check,
  Calendar,
  Layers
} from 'lucide-react';
import { BillRecord, IncidentReport, CustomerRecord, WaterSchedule, Language } from '../types';
import {
  exportBillsToExcel,
  exportIncidentsToExcel,
  exportCustomersToExcel,
  exportSchedulesToExcel,
  downloadExcelTemplate
} from '../utils/excelExport';

interface ExcelManagementCenterProps {
  bills: BillRecord[];
  incidents: IncidentReport[];
  customers: CustomerRecord[];
  schedules: WaterSchedule[];
  lang: Language;
  onBillsImported?: (newBills: BillRecord[]) => void;
  onCustomersImported?: (newCustomers: CustomerRecord[]) => void;
}

export const ExcelManagementCenter: React.FC<ExcelManagementCenterProps> = ({
  bills,
  incidents,
  customers,
  schedules,
  lang,
  onBillsImported,
  onCustomersImported
}) => {
  const isEthiopic = lang === 'am' || lang === 'ti';
  const [activeTable, setActiveTable] = useState<'bills' | 'incidents' | 'customers' | 'schedules'>('bills');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importType, setImportType] = useState<'bills' | 'customers'>('bills');
  const [pastedData, setPastedData] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string; count?: number } | null>(null);

  // Filtered views
  const filteredBills = bills.filter(b => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.meterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerPhone.includes(searchTerm) ||
      b.subCity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredIncidents = incidents.filter(i => {
    const matchesSearch =
      i.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.reporterPhone.includes(searchTerm) ||
      i.specificLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.meterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.meterStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredSchedules = schedules.filter(s => {
    const matchesSearch =
      s.subCityAm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.zoneNameAm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.kebeles.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate high-level financial figures
  const totalBillsAmount = bills.reduce((acc, b) => acc + b.totalBirr, 0);
  const totalPaidAmount = bills.filter(b => b.status === 'paid').reduce((acc, b) => acc + b.totalBirr, 0);
  const totalUnpaidAmount = bills.filter(b => b.status === 'unpaid').reduce((acc, b) => acc + b.totalBirr, 0);

  // Simple CSV parser for import
  const handleProcessImport = () => {
    if (!pastedData.trim()) return;
    try {
      const lines = pastedData.trim().split('\n');
      if (lines.length < 2) {
        setImportStatus({ success: false, message: isEthiopic ? 'እባክዎ ቢያንስ ርእስና አንድ የዳታ ረድፍ ያስገቡ' : 'Please provide headers and at least one row.' });
        return;
      }

      // Check header or parse lines
      const dataRows = lines.slice(1).filter(l => l.trim().length > 0);
      let count = 0;

      if (importType === 'bills') {
        const parsedBills: BillRecord[] = dataRows.map((row, idx) => {
          const cols = row.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          const customerName = cols[1] || cols[0] || `ደንበኛ ${idx + 1}`;
          const phone = cols[2] || '0911000000';
          const meterNo = cols[3] || `MTR-${Math.floor(10000 + Math.random() * 90000)}`;
          const subCity = cols[4] || 'ደሴ / አዲስ አበባ';
          const kebele = cols[5] || 'ቀበሌ 01';
          const period = cols[6] || 'ጥቅምት 2026';
          const prev = parseFloat(cols[7]) || 100;
          const curr = parseFloat(cols[8]) || 120;
          const consumption = Math.max(1, curr - prev);
          const total = parseFloat(cols[9]) || consumption * 15;

          count++;
          return {
            id: `bill-imp-${Date.now()}-${idx}`,
            customerId: cols[0] || `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
            customerName,
            customerPhone: phone,
            meterNumber: meterNo,
            subCity,
            kebele,
            billingPeriod: period,
            previousReadingM3: prev,
            currentReadingM3: curr,
            consumptionM3: consumption,
            amountBirr: total * 0.85,
            sanitationFeeBirr: total * 0.1,
            meterRentBirr: total * 0.05,
            totalBirr: total,
            dueDate: cols[10] || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
            status: 'unpaid'
          };
        });

        if (onBillsImported) {
          onBillsImported(parsedBills);
        }
        setImportStatus({
          success: true,
          message: isEthiopic ? `${count} አዳዲስ የውሃ ሂሳብ መረጃዎች በተሳካ ሁኔታ ወደ ኤክሴል ሲስተም ገብተዋል!` : `Successfully imported ${count} bill records!`,
          count
        });
      } else {
        const parsedCustomers: CustomerRecord[] = dataRows.map((row, idx) => {
          const cols = row.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          count++;
          return {
            id: `cust-imp-${Date.now()}-${idx}`,
            fullName: cols[0] || `አዲስ ደንበኛ ${idx + 1}`,
            phone: cols[1] || '0911000000',
            region: cols[2] || 'አማራ',
            city: cols[3] || 'ደሴ',
            subCity: cols[4] || '',
            kebele: cols[5] || 'ቀበሌ 01',
            houseNumber: cols[6] || 'ቤት 01',
            nationalIdNumber: cols[7] || `NAT-${Math.floor(100000 + Math.random() * 900000)}`,
            meterId: cols[8] || `MTR-IMP-${Math.floor(1000 + Math.random() * 9000)}`,
            country: 'Ethiopia',
            propertyType: 'residential',
            currentBill: 0,
            lastReadingM3: parseFloat(cols[9]) || 0,
            meterStatus: 'active',
            registeredAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
          };
        });

        if (onCustomersImported) {
          onCustomersImported(parsedCustomers);
        }
        setImportStatus({
          success: true,
          message: isEthiopic ? `${count} አዳዲስ ደንበኞች በኤክሴል ተመዝግበው ገብተዋል!` : `Successfully imported ${count} customer records!`,
          count
        });
      }

      setPastedData('');
    } catch (err: any) {
      setImportStatus({
        success: false,
        message: isEthiopic ? `ፋይሉን ማንበብ አልተቻለም: ${err?.message || 'እባክዎ ትክክለኛ የCSV ቅርጽ ይጠቀሙ'}` : `Parse error: ${err?.message}`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner with Quick Download Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                  <Check className="w-3 h-3" />
                  <span>{isEthiopic ? 'ኤክሴል (Excel/CSV) ማዕከል ዝግጁ ነው' : 'Excel Export & Analytics Engine Ready'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                  {isEthiopic ? 'የተቋሙ የኤክሴል ዳታ ማስተዳደሪያ እና ሪፖርት ማውጫ' : 'Utility Excel Data Management & Export Hub'}
                </h2>
              </div>
            </div>

            {/* Quick Import Button */}
            <button
              onClick={() => {
                setImportStatus(null);
                setIsImportModalOpen(true);
              }}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>{isEthiopic ? 'ከኤክሴል ዳታ አስገባ (Import)' : 'Import Excel Data'}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-cyan-100/80 max-w-2xl leading-relaxed">
            {isEthiopic
              ? 'ይህ ክፍል ተቋሙ የውሃ ሂሳብ፣ የደንበኞች መዝገብ፣ የብልሽት ጥሪዎች እና የስርጭት ሰሌዳዎችን ወደ ማይክሮሶፍት ኤክሴል (Microsoft Excel) ወይም ጎግል ሺትስ (Google Sheets) በአማርኛ ፊደል ሳይዛባ በአንድ ጠቅታ እንዲያወርድና እንዲያስተዳድር የተዘጋጀ ነው።'
              : 'Export full datasets formatted for Microsoft Excel with native Amharic UTF-8 support, or bulk-import new meter reading batches via CSV/Excel templates.'}
          </p>

          {/* 4 Quick Download Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {/* Card 1: Bills */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/15 transition group">
              <div>
                <span className="text-[11px] font-semibold text-cyan-200 block">
                  {isEthiopic ? 'የውሃ ክፍያና ደረሰኝ' : 'Billing & Collections'}
                </span>
                <span className="text-lg font-black text-white font-mono-numbers block mt-1">
                  {bills.length} {isEthiopic ? 'መዝገቦች' : 'Bills'}
                </span>
                <span className="text-[11px] text-emerald-300 font-medium block">
                  {isEthiopic ? 'የተሰበሰበ:' : 'Collected:'} {totalPaidAmount.toLocaleString()} ETB
                </span>
              </div>
              <button
                onClick={() => exportBillsToExcel(bills)}
                className="mt-3 w-full py-2 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-cyan-50 transition flex items-center justify-center gap-1.5 shadow-sm group-hover:scale-101"
              >
                <ArrowDownToLine className="w-3.5 h-3.5 text-cyan-700" />
                <span>{isEthiopic ? 'ሂሳብ ወደ ኤክሴል አውርድ' : 'Export Bills to Excel'}</span>
              </button>
            </div>

            {/* Card 2: Incidents */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/15 transition group">
              <div>
                <span className="text-[11px] font-semibold text-amber-200 block">
                  {isEthiopic ? 'የብልሽትና አደጋ ሪፖርት' : 'Incident Reports'}
                </span>
                <span className="text-lg font-black text-white font-mono-numbers block mt-1">
                  {incidents.length} {isEthiopic ? 'ጥሪዎች' : 'Tickets'}
                </span>
                <span className="text-[11px] text-slate-300 font-medium block">
                  {incidents.filter(i => i.status === 'resolved').length} {isEthiopic ? 'የተጠገኑ' : 'Resolved'}
                </span>
              </div>
              <button
                onClick={() => exportIncidentsToExcel(incidents)}
                className="mt-3 w-full py-2 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-amber-50 transition flex items-center justify-center gap-1.5 shadow-sm group-hover:scale-101"
              >
                <ArrowDownToLine className="w-3.5 h-3.5 text-amber-700" />
                <span>{isEthiopic ? 'ብልሽት ወደ ኤክሴል አውርድ' : 'Export Incidents to Excel'}</span>
              </button>
            </div>

            {/* Card 3: Customers */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/15 transition group">
              <div>
                <span className="text-[11px] font-semibold text-emerald-200 block">
                  {isEthiopic ? 'የደንበኞች መዝገብ' : 'Customer Registry'}
                </span>
                <span className="text-lg font-black text-white font-mono-numbers block mt-1">
                  {customers.length || bills.length} {isEthiopic ? 'ተጠቃሚዎች' : 'Accounts'}
                </span>
                <span className="text-[11px] text-emerald-200 font-medium block">
                  {isEthiopic ? 'በሁሉም ከተሞችና ቀበሌዎች' : 'All Regions & Woredas'}
                </span>
              </div>
              <button
                onClick={() => exportCustomersToExcel(customers)}
                className="mt-3 w-full py-2 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-emerald-50 transition flex items-center justify-center gap-1.5 shadow-sm group-hover:scale-101"
              >
                <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isEthiopic ? 'ደንበኞች ወደ ኤክሴል አውርድ' : 'Export Customers'}</span>
              </button>
            </div>

            {/* Card 4: Schedules */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/15 transition group">
              <div>
                <span className="text-[11px] font-semibold text-cyan-200 block">
                  {isEthiopic ? 'የስርጭት መርሃግብር' : 'Water Grid Distribution'}
                </span>
                <span className="text-lg font-black text-white font-mono-numbers block mt-1">
                  {schedules.length} {isEthiopic ? 'ዞኖች' : 'Zones'}
                </span>
                <span className="text-[11px] text-cyan-200 font-medium block">
                  {schedules.filter(s => s.status === 'active_flowing').length} {isEthiopic ? 'በፍሰት ላይ ያሉ' : 'Flowing Now'}
                </span>
              </div>
              <button
                onClick={() => exportSchedulesToExcel(schedules)}
                className="mt-3 w-full py-2 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-cyan-50 transition flex items-center justify-center gap-1.5 shadow-sm group-hover:scale-101"
              >
                <ArrowDownToLine className="w-3.5 h-3.5 text-cyan-700" />
                <span>{isEthiopic ? 'መርሃግብር ወደ ኤክሴል አውርድ' : 'Export Schedules'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Data Table Explorer */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
        {/* Table Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto">
            <button
              onClick={() => {
                setActiveTable('bills');
                setStatusFilter('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTable === 'bills'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-600" />
              <span>{isEthiopic ? 'የውሃ ሂሳብ መረጃዎች' : 'Bills Table'} ({bills.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTable('incidents');
                setStatusFilter('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTable === 'incidents'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{isEthiopic ? 'የብልሽት ጥሪዎች' : 'Incidents Table'} ({incidents.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTable('customers');
                setStatusFilter('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTable === 'customers'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isEthiopic ? 'የተመዘገቡ ደንበኞች' : 'Customers'} ({customers.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTable('schedules');
                setStatusFilter('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTable === 'schedules'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-700" />
              <span>{isEthiopic ? 'የውሃ ስርጭት ሰሌዳ' : 'Schedules'} ({schedules.length})</span>
            </button>
          </div>

          {/* Template Download & Export current active table */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadExcelTemplate(activeTable === 'customers' ? 'customers' : 'bills')}
              className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition flex items-center gap-1.5"
              title="Download Excel CSV Template"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{isEthiopic ? 'የኤክሴል ቴምፕሌት አውርድ' : 'Download Template'}</span>
            </button>

            <button
              onClick={() => {
                if (activeTable === 'bills') exportBillsToExcel(filteredBills);
                else if (activeTable === 'incidents') exportIncidentsToExcel(filteredIncidents);
                else if (activeTable === 'customers') exportCustomersToExcel(filteredCustomers);
                else exportSchedulesToExcel(filteredSchedules);
              }}
              className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>{isEthiopic ? 'ይህን ሰንጠረዥ አውርድ' : 'Export Table'}</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={isEthiopic ? 'በስም፣ በቆጣሪ፣ በስልክ፣ በከተማ/ቀበሌ ፈልግ...' : 'Search by name, meter, phone, kebele...'}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:bg-white"
            />
          </div>

          {/* Status quick chips */}
          <div className="flex items-center gap-2 text-xs w-full sm:w-auto overflow-x-auto">
            <span className="text-slate-400 text-[11px] font-semibold">{isEthiopic ? 'ሁኔታ:' : 'Filter:'}</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isEthiopic ? 'ሁሉም' : 'All'}
            </button>
            {activeTable === 'bills' && (
              <>
                <button
                  onClick={() => setStatusFilter('paid')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    statusFilter === 'paid' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {isEthiopic ? 'የተከፈለ' : 'Paid'}
                </button>
                <button
                  onClick={() => setStatusFilter('unpaid')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    statusFilter === 'unpaid' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  {isEthiopic ? 'ያልተከፈለ' : 'Unpaid'}
                </button>
              </>
            )}
            {activeTable === 'incidents' && (
              <>
                <button
                  onClick={() => setStatusFilter('submitted')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    statusFilter === 'submitted' ? 'bg-cyan-700 text-white' : 'bg-cyan-50 text-cyan-800'
                  }`}
                >
                  {isEthiopic ? 'አዲስ' : 'Submitted'}
                </button>
                <button
                  onClick={() => setStatusFilter('in_progress')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    statusFilter === 'in_progress' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800'
                  }`}
                >
                  {isEthiopic ? 'በስራ ላይ' : 'In Progress'}
                </button>
                <button
                  onClick={() => setStatusFilter('resolved')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    statusFilter === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800'
                  }`}
                >
                  {isEthiopic ? 'የተጠናቀቀ' : 'Resolved'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* 3. The Rendered Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          {activeTable === 'bills' && (
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">የቆጣሪ ቁጥር</th>
                  <th className="py-3 px-3">የደንበኛ ሙሉ ስም</th>
                  <th className="py-3 px-3">ስልክ</th>
                  <th className="py-3 px-3">ከተማ/ቀበሌ</th>
                  <th className="py-3 px-3">የሂሳብ ወቅት</th>
                  <th className="py-3 px-3">ፍጆታ (ሜ³)</th>
                  <th className="py-3 px-3">ጠቅላላ ብር</th>
                  <th className="py-3 px-3">የክፍያ ሁኔታ</th>
                  <th className="py-3 px-3">ደረሰኝ ቁጥር</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono-numbers">
                {filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      {isEthiopic ? 'ምንም አይነት የሂሳብ መረጃ አልተገኘም' : 'No bills found matching your filter'}
                    </td>
                  </tr>
                ) : (
                  filteredBills.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-bold text-slate-900">{b.meterNumber}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{b.customerName}</td>
                      <td className="py-3 px-3 text-slate-600">{b.customerPhone}</td>
                      <td className="py-3 px-3 text-slate-600">{b.subCity}፣ {b.kebele}</td>
                      <td className="py-3 px-3 text-slate-500">{b.billingPeriod}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{b.consumptionM3} ሜ³</td>
                      <td className="py-3 px-3 font-black text-cyan-900">{b.totalBirr.toFixed(2)} ETB</td>
                      <td className="py-3 px-3">
                        {b.status === 'paid' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" />
                            {isEthiopic ? 'የተከፈለ' : 'Paid'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            {isEthiopic ? 'ያልተከፈለ' : 'Unpaid'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">{b.receiptNumber || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTable === 'incidents' && (
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">ቲኬት ቁጥር</th>
                  <th className="py-3 px-3">አመልክች</th>
                  <th className="py-3 px-3">ስልክ</th>
                  <th className="py-3 px-3">ከተማ/ቦታ</th>
                  <th className="py-3 px-3">የብልሽት ዘርፍ</th>
                  <th className="py-3 px-3">ደረጃ</th>
                  <th className="py-3 px-3">የተመደበ ቴክኒሻን</th>
                  <th className="py-3 px-3">የአቤቱታው ሁኔታ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      {isEthiopic ? 'ምንም አይነት የብልሽት ጥሪ አልተገኘም' : 'No incidents found'}
                    </td>
                  </tr>
                ) : (
                  filteredIncidents.map(inc => (
                    <tr key={inc.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{inc.ticketNumber}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{inc.reporterName}</td>
                      <td className="py-3 px-3 text-slate-600 font-mono-numbers">{inc.reporterPhone}</td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{inc.subCityAm}፣ {inc.specificLocation}</td>
                      <td className="py-3 px-3 text-slate-700 capitalize">{inc.category.replace('_', ' ')}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inc.urgency === 'critical'
                            ? 'bg-rose-100 text-rose-800'
                            : inc.urgency === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {inc.urgency}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{inc.assignedTechnician || 'ያልተመደበ'}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inc.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inc.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-cyan-100 text-cyan-800'
                        }`}>
                          {inc.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTable === 'customers' && (
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">የቆጣሪ መለያ</th>
                  <th className="py-3 px-3">ሙሉ ስም</th>
                  <th className="py-3 px-3">ስልክ</th>
                  <th className="py-3 px-3">ክልልና ከተማ</th>
                  <th className="py-3 px-3">ቀበሌ</th>
                  <th className="py-3 px-3">ብሔራዊ መታወቂያ</th>
                  <th className="py-3 px-3">ሁኔታ</th>
                  <th className="py-3 px-3">የመጨረሻ ንባብ ሜ³</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono-numbers">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      {isEthiopic ? 'ምንም አይነት የተመዘገበ ደንበኛ አልተገኘም' : 'No registered customers found'}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-bold text-cyan-900">{c.meterId}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{c.fullName}</td>
                      <td className="py-3 px-3 text-slate-600">{c.phone}</td>
                      <td className="py-3 px-3 text-slate-600">{c.region}፣ {c.city}</td>
                      <td className="py-3 px-3 text-slate-600">{c.kebele}</td>
                      <td className="py-3 px-3 text-slate-400">{c.nationalIdNumber || '-'}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {c.meterStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">{c.lastReadingM3} ሜ³</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTable === 'schedules' && (
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">ዞን</th>
                  <th className="py-3 px-3">ከተማ/ክፍለ ከተማ</th>
                  <th className="py-3 px-3">ቀበሌዎች</th>
                  <th className="py-3 px-3">የፍሰት ሁኔታ</th>
                  <th className="py-3 px-3">የውሃ ግፊት (Bar)</th>
                  <th className="py-3 px-3">ማጠራቀሚያ (%)</th>
                  <th className="py-3 px-3">ተጠቃሚዎች</th>
                  <th className="py-3 px-3">የፍሰት ሰዓታት</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono-numbers">
                {filteredSchedules.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">{s.zoneNameAm}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{s.subCityAm}</td>
                    <td className="py-3 px-3 text-slate-600">{s.kebeles.join(', ')}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'active_flowing'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.status === 'upcoming'
                          ? 'bg-cyan-100 text-cyan-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">{s.pressureBar} bar</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{s.reservoirLevelPercent}%</td>
                    <td className="py-3 px-3 text-slate-600">{s.subscribersCount.toLocaleString()}</td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">{s.flowHoursAm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 4. Bulk Excel / CSV Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isEthiopic ? 'ከኤክሴል (CSV/Excel) ዳታ ማስገቢያ ሞጁል' : 'Import Excel / CSV Dataset'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isEthiopic ? 'የተዘጋጀውን የኤክሴል ወይም የCSV ጽሁፍ እዚህ ይለጥፉ' : 'Paste comma-separated data or export from spreadsheet'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Import Category Selector */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setImportType('bills')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  importType === 'bills' ? 'bg-cyan-700 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {isEthiopic ? 'የውሃ ሂሳብ መዝገብ አስገባ' : 'Import Bills'}
              </button>
              <button
                type="button"
                onClick={() => setImportType('customers')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  importType === 'customers' ? 'bg-cyan-700 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {isEthiopic ? 'አዳዲስ ደንበኞች አስገባ' : 'Import Customers'}
              </button>
              <button
                type="button"
                onClick={() => downloadExcelTemplate(importType)}
                className="ml-auto px-3 py-1.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-medium hover:bg-slate-50 flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>{isEthiopic ? 'ቴምፕሌት አውርድ' : 'Template'}</span>
              </button>
            </div>

            {/* Status Alert */}
            {importStatus && (
              <div
                className={`p-4 rounded-2xl text-xs flex items-center gap-3 ${
                  importStatus.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border border-rose-200 text-rose-900'
                }`}
              >
                {importStatus.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span>{importStatus.message}</span>
              </div>
            )}

            {/* Textarea for CSV */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isEthiopic ? 'የኤክሴል ወይም የCSV ዳታ ጽሁፍ:' : 'CSV / Excel Data:'}
              </label>
              <textarea
                rows={7}
                value={pastedData}
                onChange={e => setPastedData(e.target.value)}
                placeholder={
                  importType === 'bills'
                    ? 'CustomerID,CustomerName,Phone,MeterNumber,City,Kebele,Period,PrevReading,CurrReading,TotalBirr\nCUST-901,አበበ ደስታ,0911223344,MTR-884,ደሴ,ቀበሌ 03,ጥቅምት 2026,110,132,330'
                    : 'FullName,Phone,Region,City,SubCity,Kebele,HouseNumber,NationalID,MeterSerial,InitialReading\nተፈራ አለሙ,0911223344,አማራ,ደሴ,መሃል,ቀበሌ 01,ቤት 41,ET-NAT-881,MTR-01,0'
                }
                className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                {isEthiopic ? 'ዝጋ' : 'Close'}
              </button>
              <button
                type="button"
                onClick={handleProcessImport}
                disabled={!pastedData.trim()}
                className="px-5 py-2 bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isEthiopic ? 'ዳታውን ወደ ሲስተም ጫን' : 'Process Import'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
