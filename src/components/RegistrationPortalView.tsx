import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Building2,
  Wrench,
  CheckCircle2,
  Globe,
  MapPin,
  Crosshair,
  FileCheck,
  Search,
  Download,
  Copy,
  Check,
  Phone,
  Shield,
  Layers,
  Sparkles,
  QrCode,
  Printer,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Droplets
} from 'lucide-react';
import { Language, CustomerRecord, WaterUtilityOffice, TechnicianProfile } from '../types';
import { translations } from '../utils/translations';
import { REGIONS_DIRECTORY, RegionInfo } from '../data/regionsData';
import { InteractiveGpsMap } from './InteractiveGpsMap';

interface RegistrationPortalViewProps {
  lang: Language;
  onCustomerRegistered?: (newCustomer: CustomerRecord) => void;
  onNavigateToSchedule?: () => void;
  onNavigateToBilling?: () => void;
}

export const RegistrationPortalView: React.FC<RegistrationPortalViewProps> = ({
  lang,
  onCustomerRegistered,
  onNavigateToSchedule,
  onNavigateToBilling
}) => {
  const isEthiopic = lang === 'am' || lang === 'ti';
  const isOromo = lang === 'om';
  const [activeRegTab, setActiveRegTab] = useState<'customer' | 'utility' | 'technician' | 'directory'>('customer');

  // Customer Registration State
  const [custCountry, setCustCountry] = useState<'Ethiopia' | 'International'>('Ethiopia');
  const [custRegionId, setCustRegionId] = useState<string>('addis_ababa');
  const [custCity, setCustCity] = useState<string>('ቦሌ');
  const [custAreaType, setCustAreaType] = useState<'urban' | 'rural'>('urban');
  const [custWoreda, setCustWoreda] = useState<string>('ወረዳ 03');
  const [custSubCity, setCustSubCity] = useState<string>('');
  const [custKebele, setCustKebele] = useState<string>('ቀበሌ 01');
  const [custHouseNo, setCustHouseNo] = useState<string>('');
  const [custFullName, setCustFullName] = useState<string>('');
  const [custPhone, setCustPhone] = useState<string>('0911000000');
  const [custNationalId, setCustNationalId] = useState<string>('');
  const [custPropertyType, setCustPropertyType] = useState<CustomerRecord['propertyType']>('residential');
  const [custMeterSerial, setCustMeterSerial] = useState<string>('');
  const [custInitialReading, setCustInitialReading] = useState<number>(0);
  const [custGpsCoords, setCustGpsCoords] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>(null);
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [isSubmittingCustomer, setIsSubmittingCustomer] = useState(false);
  const [registeredSuccessResult, setRegisteredSuccessResult] = useState<{
    customer: CustomerRecord;
    certificate: { certificateNumber: string; issuedAt: string; status: string };
  } | null>(null);
  const [copiedMeterId, setCopiedMeterId] = useState(false);

  // Utility Registration State
  const [utilNameAm, setUtilNameAm] = useState('');
  const [utilNameEn, setUtilNameEn] = useState('');
  const [utilCountry, setUtilCountry] = useState('Ethiopia');
  const [utilRegion, setUtilRegion] = useState('Oromia Region');
  const [utilCity, setUtilCity] = useState('Adama');
  const [utilHotline, setUtilHotline] = useState('8844');
  const [utilPhone, setUtilPhone] = useState('0911000000');
  const [utilDirector, setUtilDirector] = useState('');
  const [utilCoverageZones, setUtilCoverageZones] = useState('');
  const [utilServiceLevel, setUtilServiceLevel] = useState<'municipal' | 'regional' | 'national' | 'international'>('regional');
  const [isSubmittingUtility, setIsSubmittingUtility] = useState(false);
  const [utilitySuccessMsg, setUtilitySuccessMsg] = useState<string | null>(null);

  // Technician Registration State
  const [techName, setTechName] = useState('');
  const [techPhone, setTechPhone] = useState('0911000000');
  const [techRegion, setTechRegion] = useState('Addis Ababa');
  const [techCity, setTechCity] = useState('Addis Ababa');
  const [techSpecialization, setTechSpecialization] = useState('የቧንቧ ፍሳሽና መሰበር ጥገና');
  const [techLicense, setTechLicense] = useState('');
  const [techUtility, setTechUtility] = useState('AAWSA-HQ');
  const [isSubmittingTech, setIsSubmittingTech] = useState(false);
  const [techSuccessMsg, setTechSuccessMsg] = useState<string | null>(null);

  // Directory Data
  const [directoryUtilities, setDirectoryUtilities] = useState<WaterUtilityOffice[]>([]);
  const [directoryCustomers, setDirectoryCustomers] = useState<CustomerRecord[]>([]);
  const [directoryFilterRegion, setDirectoryFilterRegion] = useState<string>('all');
  const [directorySearchQuery, setDirectorySearchQuery] = useState<string>('');
  const [isLoadingDirectory, setIsLoadingDirectory] = useState(false);

  // Selected Region Info helper
  const selectedRegion = REGIONS_DIRECTORY.find(r => r.id === custRegionId) || REGIONS_DIRECTORY[0];

  // Update default city when region changes
  useEffect(() => {
    if (selectedRegion && selectedRegion.majorCities.length > 0) {
      setCustCity(isEthiopic ? selectedRegion.majorCities[0].am : selectedRegion.majorCities[0].en);
    }
  }, [custRegionId, isEthiopic]);

  // Load directory on mount or tab switch
  useEffect(() => {
    if (activeRegTab === 'directory') {
      fetchDirectory();
    }
  }, [activeRegTab, directoryFilterRegion]);

  const fetchDirectory = async () => {
    setIsLoadingDirectory(true);
    try {
      const [utilRes, custRes] = await Promise.all([
        fetch('/api/register/utilities'),
        fetch(`/api/register/customers?region=${directoryFilterRegion}`)
      ]);
      if (utilRes.ok) {
        const uData = await utilRes.json();
        if (uData.utilities) setDirectoryUtilities(uData.utilities);
      }
      if (custRes.ok) {
        const cData = await custRes.json();
        if (cData.customers) setDirectoryCustomers(cData.customers);
      }
    } catch (e) {
      console.warn('Directory fetch error:', e);
    } finally {
      setIsLoadingDirectory(false);
    }
  };

  // High Precision GPS Capture
  const handleCaptureGps = () => {
    setIsGettingGps(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCustGpsCoords({
            latitude: Number(pos.coords.latitude.toFixed(6)),
            longitude: Number(pos.coords.longitude.toFixed(6)),
            accuracy: Math.round(pos.coords.accuracy)
          });
          setIsGettingGps(false);
        },
        (err) => {
          console.warn('GPS error:', err);
          setIsGettingGps(false);
          setCustGpsCoords({ latitude: 9.0105, longitude: 38.7612, accuracy: 20 });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsGettingGps(false);
    }
  };

  // Handle Customer Submit
  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custFullName.trim() || !custPhone.trim()) return;

    setIsSubmittingCustomer(true);
    try {
      const payload = {
        fullName: custFullName,
        phone: custPhone,
        country: custCountry,
        region: selectedRegion.nameEn,
        city: custCity,
        woreda: custWoreda,
        subCity: custSubCity || custCity,
        kebele: custKebele || 'ቀበሌ 01',
        houseNumber: custHouseNo,
        nationalIdNumber: custNationalId,
        propertyType: custPropertyType,
        meterId: custMeterSerial,
        lastReadingM3: Number(custInitialReading) || 0,
        currency: custCountry === 'International' ? 'USD' : 'ETB',
        gpsCoordinates: custGpsCoords || undefined
      };

      const res = await fetch('/api/register/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setRegisteredSuccessResult(data);
        if (onCustomerRegistered) {
          onCustomerRegistered(data.customer);
        }
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err: any) {
      alert(err.message || 'Error communicating with server');
    } finally {
      setIsSubmittingCustomer(false);
    }
  };

  // Handle Utility Submit
  const handleUtilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utilNameAm.trim() || !utilHotline.trim()) return;

    setIsSubmittingUtility(true);
    setUtilitySuccessMsg(null);
    try {
      const payload = {
        nameAm: utilNameAm,
        nameEn: utilNameEn || utilNameAm,
        country: utilCountry,
        region: utilRegion,
        headquartersCity: utilCity,
        emergencyHotline: utilHotline,
        contactPhone: utilPhone,
        directorName: utilDirector || 'ዋና ስራ አስኪያጅ',
        coverageZones: utilCoverageZones ? utilCoverageZones.split(',').map(s => s.trim()) : [utilCity],
        serviceLevel: utilServiceLevel
      };

      const res = await fetch('/api/register/utility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setUtilitySuccessMsg(`የውሃ ጽሕፈት ቤት "${utilNameAm}" በስኬት ተመዝግቧል! ኮድ: ${data.utility.code}`);
        setUtilNameAm('');
        setUtilNameEn('');
        setUtilDirector('');
      } else {
        alert(data.error || 'Failed to register utility');
      }
    } catch (err: any) {
      alert(err.message || 'Error registering utility');
    } finally {
      setIsSubmittingUtility(false);
    }
  };

  // Handle Technician Submit
  const handleTechnicianSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!techName.trim() || !techPhone.trim()) return;

    setIsSubmittingTech(true);
    setTechSuccessMsg(null);
    try {
      const payload = {
        fullName: techName,
        phone: techPhone,
        region: techRegion,
        city: techCity,
        specialization: techSpecialization,
        licenseNumber: techLicense || `LIC-${Math.floor(1000 + Math.random() * 9000)}`,
        utilityAffiliation: techUtility
      };

      const res = await fetch('/api/register/technician', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setTechSuccessMsg(`የመስክ ባለሙያ "${techName}" በስኬት ተመዝግቧል!`);
        setTechName('');
      } else {
        alert(data.error || 'Failed to register technician');
      }
    } catch (err: any) {
      alert(err.message || 'Error registering technician');
    } finally {
      setIsSubmittingTech(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMeterId(true);
    setTimeout(() => setCopiedMeterId(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-800 uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4 text-cyan-600" />
            <span>{isEthiopic ? 'አገር አቀፍና አለም አቀፍ የውሃ ምዝገባ ፖርታል' : 'National & Global Water Registration'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isEthiopic ? 'የተጠቃሚ፣ የቆጣሪና የተቋማት ይፋዊ ምዝገባ' : 'Official Water Connection & Utility Registry'}
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-3xl">
            {isEthiopic
              ? 'ለመላው የኢትዮጵያ ክልሎች፣ ከተሞች፣ የውሃ ጽሕፈት ቤቶች እንዲሁም ለውጭ አገር የዲያስፖራ ማህበረሰብ የሚሰራ እውነተኛ ዲጂታል የውሃ አገልግሎት ምዝገባ ስርዓት።'
              : 'Universal registration system serving all Ethiopian regional states, municipalities, rural water schemes, and global diaspora water action networks.'}
          </p>
        </div>

        {/* Coverage Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            14 {isEthiopic ? 'የኢትዮጵያ ክልሎች' : 'Ethiopian Regions'}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold">
            🌍 {isEthiopic ? 'አለም አቀፍ ድንበር ተሻጋሪ' : 'Global & Cross-Border'}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveRegTab('customer')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
            activeRegTab === 'customer'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserPlus className="w-4 h-4 text-cyan-600" />
          <span>{isEthiopic ? 'የውሃ ቆጣሪና ተጠቃሚ መመዝገቢያ' : 'New Customer / Meter Registration'}</span>
        </button>

        <button
          onClick={() => setActiveRegTab('utility')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
            activeRegTab === 'utility'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>{isEthiopic ? 'የውሃ ጽ/ቤት / ተቋም መመዝገቢያ' : 'Register Water Office / Utility'}</span>
        </button>

        <button
          onClick={() => setActiveRegTab('technician')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
            activeRegTab === 'technician'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-4 h-4 text-emerald-600" />
          <span>{isEthiopic ? 'የመስክ ቧንቧ ቴክኒሻን መመዝገቢያ' : 'Technician Accreditation'}</span>
        </button>

        <button
          onClick={() => setActiveRegTab('directory')}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
            activeRegTab === 'directory'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-4 h-4 text-purple-600" />
          <span>{isEthiopic ? 'የተመዘገቡ ተቋማትና ደንበኞች ማውጫ' : 'All-Region Registry Directory'}</span>
        </button>
      </div>

      {/* TAB 1: CUSTOMER METER REGISTRATION */}
      {activeRegTab === 'customer' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
          {registeredSuccessResult ? (
            <div className="max-w-xl mx-auto text-center space-y-6 animate-in zoom-in-95 duration-200 py-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  {isEthiopic ? 'ይፋዊ የዲጂታል ቆጣሪ ምዝገባ ተጠናቋል!' : 'Registration Certificate Issued!'}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {registeredSuccessResult.customer.fullName}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {isEthiopic
                    ? 'የውሃ ቆጣሪ መረጃዎ በመላው አገር አቀፍ የውሃ መረጃ ቋት (National Water Registry) ውስጥ በቋሚነት ተመዝግቧል።'
                    : 'Your water meter profile is active and verified in the national water utility ledger.'}
                </p>
              </div>

              {/* Digital Certificate Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white rounded-2xl p-6 text-left shadow-xl border border-cyan-800/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl"></div>

                <div className="flex items-start justify-between border-b border-slate-700/60 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider block">
                      {isEthiopic ? 'ብሔራዊ የውሃ አገልግሎት መታወቂያ' : 'Official Water Service Card'}
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">
                      {registeredSuccessResult.customer.fullName}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active & Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block">{isEthiopic ? 'የቆጣሪ ልዩ ቁጥር (Meter ID)' : 'Meter ID'}:</span>
                    <span className="font-mono font-extrabold text-cyan-300 text-sm tracking-wide">
                      {registeredSuccessResult.customer.meterId}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">{isEthiopic ? 'ክልልና ከተማ' : 'Region / City'}:</span>
                    <span className="font-semibold text-slate-200">
                      {registeredSuccessResult.customer.region} - {registeredSuccessResult.customer.city}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">{isEthiopic ? 'ወረዳና ቀበሌ' : 'Woreda & Kebele'}:</span>
                    <span className="font-semibold text-cyan-200">
                      {registeredSuccessResult.customer.woreda ? `${registeredSuccessResult.customer.woreda}፣ ` : ''}{registeredSuccessResult.customer.kebele}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">{isEthiopic ? 'ስልክ ቁጥር' : 'Phone'}:</span>
                    <span className="font-mono text-slate-200">{registeredSuccessResult.customer.phone}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">{isEthiopic ? 'የመነሻ ንባብ' : 'Initial Reading'}:</span>
                    <span className="font-mono text-slate-200">{registeredSuccessResult.customer.lastReadingM3} m³</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Cert #: <strong className="font-mono text-slate-300">{registeredSuccessResult.certificate.certificateNumber}</strong></span>
                  <span>Issued: {new Date(registeredSuccessResult.certificate.issuedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(registeredSuccessResult.customer.meterId)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  {copiedMeterId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedMeterId ? (isEthiopic ? 'የቆጣሪ ቁጥር ተቀድቷል' : 'Copied!') : (isEthiopic ? 'የቆጣሪ ቁጥር ቅዳ' : 'Copy Meter ID')}</span>
                </button>

                {onNavigateToSchedule && (
                  <button
                    type="button"
                    onClick={onNavigateToSchedule}
                    className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Droplets className="w-4 h-4" />
                    <span>{isEthiopic ? 'የውሃ ስርጭት መርሃ-ግብር ተመልከት' : 'View Water Schedule'}</span>
                  </button>
                )}

                {onNavigateToBilling && (
                  <button
                    type="button"
                    onClick={onNavigateToBilling}
                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
                  >
                    <span>{isEthiopic ? 'ወደ ክፍያ ገጽ ሂድ' : 'Go to Billing'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setRegisteredSuccessResult(null)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-medium"
                >
                  {isEthiopic ? 'ሌላ ቆጣሪ መዝግብ' : 'Register Another'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomerSubmit} className="space-y-6">
              {/* Form Intro */}
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  {isEthiopic ? 'የአዲስ ውሃ ቆጣሪና ተጠቃሚ ማመልከቻ ፎርም' : 'New Water Customer & Meter Application Form'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isEthiopic
                    ? 'ከታች ያሉትን መረጃዎች በትክክል በመሙላት የውሃ ቆጣሪዎን በመረጃ ቋቱ ያስመዝግቡ፤ የመመዝገቢያ ወጪ 0.00 ብር ነው።'
                    : 'Register your municipal or rural water meter connection directly into the synchronized database.'}
                </p>
              </div>

              {/* Geographic Hierarchy (Country & Region Selector) */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-600" />
                    <span>{isEthiopic ? '1. የጂኦግራፊያዊ መገኛና ክልል መረጣ (ያለ ምንም ገደብ)' : '1. Geographic Location & Jurisdiction'}</span>
                  </span>

                  {/* Area Type: Urban City vs Rural Scheme */}
                  <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setCustAreaType('urban');
                        if (custCity.includes('የገጠር')) {
                          setCustCity(isEthiopic ? selectedRegion.majorCities[0].am : selectedRegion.majorCities[0].en);
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        custAreaType === 'urban'
                          ? 'bg-cyan-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>🏙️</span>
                      <span>{isEthiopic ? 'ከተማ (Urban)' : 'City / Urban'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCustAreaType('rural');
                        setCustCity(isEthiopic ? 'የገጠር ቀበሌ የውሃ ቦኖ' : 'Rural Water Scheme');
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        custAreaType === 'rural'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>🌾</span>
                      <span>{isEthiopic ? 'ገጠራማ ቦታ (Rural Scheme)' : 'Rural Scheme'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-cyan-50/70 border border-cyan-200 rounded-xl text-xs text-cyan-950 flex items-center gap-2">
                  <span className="text-base">📌</span>
                  <span className="font-semibold">
                    {isEthiopic
                      ? 'ይህ ሲስተም ማንኛውንም የኢትዮጵያ ከተማ፣ ወረዳ ወይም ገጠራማ ቀበሌ ያለገደብ ይመዘግባል። ከታች ባለው ክፍት ሳጥን ውስጥ የትኛውንም ከተማ ወይም ገጠር በነጻነት ይፃፉ።'
                      : 'This portal accepts ANY city, town, or rural village in Ethiopia and abroad without restriction. Type freely below.'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isEthiopic ? 'አገር (Country)' : 'Country'} *
                    </label>
                    <select
                      value={custCountry}
                      onChange={(e) => {
                        const c = e.target.value as any;
                        setCustCountry(c);
                        if (c === 'International') {
                          setCustRegionId('international_diaspora');
                        } else {
                          setCustRegionId('addis_ababa');
                        }
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-medium"
                    >
                      <option value="Ethiopia">🇪🇹 ኢትዮጵያ (Ethiopia)</option>
                      <option value="International">🌍 አለም አቀፍ / ዲያስፖራ (International / Global)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isEthiopic ? 'ክልል / ዞን (Region / State)' : 'Region / State'} *
                    </label>
                    <select
                      value={custRegionId}
                      onChange={(e) => setCustRegionId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-medium"
                    >
                      {REGIONS_DIRECTORY.filter(r => custCountry === 'International' ? r.country === 'International' : r.country === 'Ethiopia').map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.flag} {isEthiopic ? r.nameAm : r.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Free-text Unrestricted City / Rural Area Input with Datalist & Quick Chips */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      {isEthiopic
                        ? (custAreaType === 'rural' ? 'የገጠራማው አካባቢ / የቀበሌ መጠሪያ (Rural Area / Village)' : 'የከተማ / ክፍለ ከተማ መጠሪያ (City / Sub-City)')
                        : 'City, Town, or Rural Village Name'} *
                    </label>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      {isEthiopic ? '✓ ማንኛውንም ከተማ ወይም ገጠር ያለገደብ ይፃፉ' : '✓ Any City or Rural Village Allowed'}
                    </span>
                  </div>

                  <input
                    type="text"
                    required
                    list="cust-city-suggestions"
                    value={custCity}
                    onChange={(e) => setCustCity(e.target.value)}
                    placeholder={
                      isEthiopic
                        ? 'ምሳሌ፡ ደብረ ማርቆስ፣ ላሊበላ፣ እንጅባራ፣ ወልዲያ፣ ወይም ማንኛውም የገጠር ቀበሌ...'
                        : 'e.g. Debre Markos, Lalibela, Injibara, Woldiya, or any rural village...'
                    }
                    className="w-full px-3.5 py-2.5 border-2 border-cyan-600/60 rounded-xl text-xs bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600 shadow-xs"
                  />

                  {/* Browser Native Auto-Complete Datalist */}
                  <datalist id="cust-city-suggestions">
                    {selectedRegion.majorCities.map((c) => (
                      <option key={c.en} value={isEthiopic ? c.am : c.en} />
                    ))}
                  </datalist>

                  {/* Quick Clickable Suggestions for Region */}
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      {isEthiopic ? 'በ1 ጠቅታ ለመሙላት ወይም ሌላ ከተማ/ገጠር በሳጥኑ ውስጥ በነፃነት ይፃፉ፦' : 'Click to autofill or type custom name above:'}
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {selectedRegion.majorCities.map((c) => {
                        const val = isEthiopic ? c.am : c.en;
                        return (
                          <button
                            key={c.en}
                            type="button"
                            onClick={() => setCustCity(val)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                              custCity === val
                                ? 'bg-cyan-700 text-white border-cyan-800 shadow-xs'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isEthiopic ? 'ወረዳ (Woreda / District)' : 'Woreda / District'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={custWoreda}
                      onChange={(e) => setCustWoreda(e.target.value)}
                      placeholder={isEthiopic ? 'ምሳሌ፡ ወረዳ 03 ወይም ወረዳ 12' : 'e.g. Woreda 03'}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isEthiopic ? 'ቀበሌ / ሰፈር' : 'Kebele / Neighborhood'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={custKebele}
                      onChange={(e) => setCustKebele(e.target.value)}
                      placeholder={isEthiopic ? 'ምሳሌ፡ ቀበሌ 04 ወይም ሩዋንዳ ሰፈር' : 'e.g. Kebele 04 or Zone A'}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isEthiopic ? 'የቤት ቁጥር (House Number)' : 'House Number'}
                    </label>
                    <input
                      type="text"
                      value={custHouseNo}
                      onChange={(e) => setCustHouseNo(e.target.value)}
                      placeholder={isEthiopic ? 'ምሳሌ፡ 842 ወይም አዲስ መንደር' : 'e.g. House 842'}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Identification Details */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>{isEthiopic ? '2. የደንበኛው የግል መረጃና መታወቂያ' : '2. Customer Identification'}</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isEthiopic ? 'የደንበኛው ሙሉ ስም (ከአያት ጋር)' : 'Full Name (with grandfather)'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={custFullName}
                      onChange={(e) => setCustFullName(e.target.value)}
                      placeholder={isEthiopic ? 'ምሳሌ፡ አበበ ተፈራ ገብረመድህን' : 'e.g. Abebe Tefera Gebre'}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isEthiopic ? 'ተንቀሳቃሽ ስልክ ቁጥር (ኤስኤምኤስ የሚላክበት)' : 'Phone Number (for SMS Alerts)'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      placeholder="0911223344"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isEthiopic ? 'ብሔራዊ መታወቂያ / የቀበሌ መታወቂያ / ፓስፖርት' : 'National ID / Kebele ID / Passport'}
                    </label>
                    <input
                      type="text"
                      value={custNationalId}
                      onChange={(e) => setCustNationalId(e.target.value)}
                      placeholder="ETH-ID-884920"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isEthiopic ? 'የግንኙነት / የንብረት አይነት' : 'Property Type'} *
                    </label>
                    <select
                      value={custPropertyType}
                      onChange={(e) => setCustPropertyType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-medium"
                    >
                      <option value="residential">{isEthiopic ? 'የመኖሪያ ቤት (Residential)' : 'Residential'}</option>
                      <option value="commercial">{isEthiopic ? 'የንግድ ተቋም / ሆቴል (Commercial)' : 'Commercial / Business'}</option>
                      <option value="industrial">{isEthiopic ? 'ፋብሪካ / ኢንዱስትሪ (Industrial)' : 'Industrial / Factory'}</option>
                      <option value="agricultural">{isEthiopic ? 'ግብርና / መስኖ (Agricultural)' : 'Agricultural / Irrigation'}</option>
                      <option value="public_institution">{isEthiopic ? 'ትምህርት ቤት / ሆስፒታል / የመንግስት (Public Institution)' : 'Public / Institutional'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Water Meter & Reading Details */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-600" />
                  <span>{isEthiopic ? '3. የቆጣሪ ቁጥር፣ ንባብ እና ጂፒኤስ መገኛ' : '3. Meter Serial & GPS Coordinates'}</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isEthiopic ? 'የቆጣሪ ልዩ መለያ (ካለዎት ያስገቡ፣ ካልሆነ በሲስተም ይመነጫል)' : 'Meter Serial Number (Optional - system generates if blank)'}
                    </label>
                    <input
                      type="text"
                      value={custMeterSerial}
                      onChange={(e) => setCustMeterSerial(e.target.value)}
                      placeholder="ምሳሌ፡ MTR-09412 ወይም ባዶ ይተዉት"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isEthiopic ? 'የመነሻ የውሃ ንባብ (Initial Reading in m³)' : 'Initial Meter Reading (m³)'} *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={custInitialReading}
                      onChange={(e) => setCustInitialReading(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                {/* GPS Capture & Interactive Visual Map */}
                <div className="pt-2 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {isEthiopic ? 'የቆጣሪው ትክክለኛ የሳተላይት መገኛ (GPS & Satellite Geotag)' : 'Geotag Meter Location on Satellite Map'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {custGpsCoords
                          ? `${custGpsCoords.latitude}° N, ${custGpsCoords.longitude}° E (ትክክለኛነት፡ ±${custGpsCoords.accuracy || 10}m)`
                          : (isEthiopic ? 'ከስልክዎ GPS ይውሰዱ ወይም በካርታው ላይ ጠቅ በማድረግ የቆጣሪውን ትክክለኛ ቦታ ያመልክቱ' : 'Click to tag precise meter coordinates')}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCaptureGps}
                      disabled={isGettingGps}
                      className="px-3.5 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs"
                    >
                      {isGettingGps ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5" />}
                      <span>{isEthiopic ? 'የአሁኑን GPS ጠቁም' : 'Tag GPS Point'}</span>
                    </button>
                  </div>

                  {/* Visual Map Rendering with Satellite & Street Imagery */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-600 px-1">
                      <span className="font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                        {isEthiopic ? 'የሳተላይት ካርታ እይታ (በካርታው ላይ በመጫን ወይም ፒኑን በማንቀሳቀስ የቆጣሪውን ቦታ ያስተካክሉ)' : 'Interactive Satellite View (Click or drag pin to exact water meter)'}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {(custGpsCoords?.latitude || 9.0105).toFixed(4)}°N, {(custGpsCoords?.longitude || 38.7612).toFixed(4)}°E
                      </span>
                    </div>

                    <InteractiveGpsMap
                      latitude={custGpsCoords?.latitude || 9.0105}
                      longitude={custGpsCoords?.longitude || 38.7612}
                      accuracy={custGpsCoords?.accuracy || 15}
                      label={custFullName ? `${custFullName} - ቆጣሪ` : 'አዲስ የውሃ ቆጣሪ'}
                      isEditable={true}
                      variant="meter"
                      height="300px"
                      lang={lang}
                      onLocationChange={(coords) => {
                        setCustGpsCoords(coords);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingCustomer}
                className="w-full sm:w-auto px-8 py-3 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-extrabold shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmittingCustomer ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{isEthiopic ? 'ቆጣሪው በመመዝገብ ላይ ነው...' : 'Registering in National Database...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isEthiopic ? 'ምዝገባውን አረጋግጥና ቆጣሪ አስመዝግብ (Complete Registration)' : 'Complete Official Registration'}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: UTILITY OFFICE REGISTRATION */}
      {activeRegTab === 'utility' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              {isEthiopic ? 'የክልል፣ የከተማ ወይም የአለም አቀፍ የውሃ ጽ/ቤት ምዝገባ' : 'Register Regional, Municipal, or Cross-Border Water Authority'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEthiopic
                ? 'በየትኛውም የኢትዮጵያ ክልል ወይም ከተማ የሚገኝ የውሃ ጽሕፈት ቤት በዚህ ሲስተም ተመዝግቦ የውሃ ስርጭት መርሃ-ግብር ማስተዳደር እና የህዝብ አቤቱታዎችን መቀበል ይችላል።'
                : 'Enables regional water bureaus, municipal water utilities, and rural water committees to onboard their network.'}
            </p>
          </div>

          {utilitySuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{utilitySuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleUtilitySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isEthiopic ? 'የተቋሙ ስም (በአማርኛ)' : 'Utility Official Name (Amharic)'} *
                </label>
                <input
                  type="text"
                  required
                  value={utilNameAm}
                  onChange={(e) => setUtilNameAm(e.target.value)}
                  placeholder="ምሳሌ፡ የባህር ዳር ከተማ ውሃና ፍሳሽ አገልግሎት"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isEthiopic ? 'የተቋሙ ስም (በእንግሊዝኛ)' : 'Utility Official Name (English)'}
                </label>
                <input
                  type="text"
                  value={utilNameEn}
                  onChange={(e) => setUtilNameEn(e.target.value)}
                  placeholder="e.g. Bahir Dar Water Supply Service"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isEthiopic ? 'ክልል / ዞን' : 'Region'} *
                </label>
                <select
                  value={utilRegion}
                  onChange={(e) => setUtilRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                >
                  {REGIONS_DIRECTORY.map(r => (
                    <option key={r.id} value={r.nameEn}>
                      {r.flag} {isEthiopic ? r.nameAm : r.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isEthiopic ? 'ዋና መቀመጫ ከተማ' : 'Headquarters City'} *
                </label>
                <input
                  type="text"
                  required
                  value={utilCity}
                  onChange={(e) => setUtilCity(e.target.value)}
                  placeholder="e.g. Hawassa, Adama, Mekelle"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isEthiopic ? 'የአገልግሎት ደረጃ' : 'Jurisdiction Level'}
                </label>
                <select
                  value={utilServiceLevel}
                  onChange={(e) => setUtilServiceLevel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                >
                  <option value="municipal">የከተማ / ማዘጋጃ ቤት (Municipal)</option>
                  <option value="regional">ክልላዊ ቢሮ (Regional State)</option>
                  <option value="national">ብሔራዊ / ፌደራል (National)</option>
                  <option value="international">ድንበር ተሻጋሪ / አለም አቀፍ (International)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isEthiopic ? 'የአስቸኳይ ጊዜ ስልክ መስመር (Hotline)' : 'Emergency Hotline'} *
                </label>
                <input
                  type="text"
                  required
                  value={utilHotline}
                  onChange={(e) => setUtilHotline(e.target.value)}
                  placeholder="939 ወይም 8844"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isEthiopic ? 'መደበኛ ቢሮ ስልክ' : 'Office Contact Phone'}
                </label>
                <input
                  type="tel"
                  value={utilPhone}
                  onChange={(e) => setUtilPhone(e.target.value)}
                  placeholder="0115510000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isEthiopic ? 'ዋና ስራ አስኪያጅ / ዳይሬክተር' : 'Director / General Manager'}
                </label>
                <input
                  type="text"
                  value={utilDirector}
                  onChange={(e) => setUtilDirector(e.target.value)}
                  placeholder="አቶ ከበደ ለማ"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isEthiopic ? 'የሚሸፈኑ ዞኖችና ቀጠናዎች (በነጠላ ሰረዝ ይለዩ)' : 'Coverage Zones (comma separated)'}
              </label>
              <input
                type="text"
                value={utilCoverageZones}
                onChange={(e) => setUtilCoverageZones(e.target.value)}
                placeholder="ዞን 1, ዞን 2, መሀል ከተማ, ኢንዱስትሪ መንደር..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingUtility}
              className="py-2.5 px-6 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
            >
              {isSubmittingUtility ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Building2 className="w-4 h-4" />}
              <span>{isEthiopic ? 'የውሃ ጽሕፈት ቤቱን አስመዝግብ' : 'Register Water Authority'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: FIELD TECHNICIAN REGISTRATION */}
      {activeRegTab === 'technician' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              {isEthiopic ? 'የመስክ ቧንቧና ውሃ ጥገና ቴክኒሻን ምዝገባ' : 'Field Plumber & Technician Accreditation'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEthiopic
                ? 'የተፈቀደላቸው ባለሙያዎች በየክልላቸው የሚከሰቱ የቧንቧ መሰበርና የውሃ ጥገና ስራዎችን ለመረከብ እዚህ ይመዝገቡ።'
                : 'Accreditation portal for field technicians, pipeline welders, and leakage engineers.'}
            </p>
          </div>

          {techSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{techSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleTechnicianSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isEthiopic ? 'የቴክኒሻኑ ሙሉ ስም' : 'Technician Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={techName}
                  onChange={(e) => setTechName(e.target.value)}
                  placeholder="አቶ ዳዊት በቀለ"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isEthiopic ? 'ስልክ ቁጥር' : 'Phone Number'} *
                </label>
                <input
                  type="tel"
                  required
                  value={techPhone}
                  onChange={(e) => setTechPhone(e.target.value)}
                  placeholder="0911000000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isEthiopic ? 'የስምሪት ክልል' : 'Deployment Region'}
                </label>
                <select
                  value={techRegion}
                  onChange={(e) => setTechRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                >
                  {REGIONS_DIRECTORY.map(r => (
                    <option key={r.id} value={r.nameEn}>
                      {r.flag} {isEthiopic ? r.nameAm : r.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isEthiopic ? 'የሙያ ዘርፍ / ልዩ ሙያ' : 'Specialization'}
                </label>
                <input
                  type="text"
                  value={techSpecialization}
                  onChange={(e) => setTechSpecialization(e.target.value)}
                  placeholder="ምሳሌ፡ የዋና መስመር ቧንቧ ጥገና"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isEthiopic ? 'የሙያ ፈቃድ ቁጥር' : 'License / Certificate Number'}
                </label>
                <input
                  type="text"
                  value={techLicense}
                  onChange={(e) => setTechLicense(e.target.value)}
                  placeholder="TECH-99120"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingTech}
              className="py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
            >
              {isSubmittingTech ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wrench className="w-4 h-4" />}
              <span>{isEthiopic ? 'የቴክኒሻን ምዝገባ አጠናቅቅ' : 'Complete Technician Accreditation'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: DIRECTORY & SEARCH ACROSS ALL REGIONS */}
      {activeRegTab === 'directory' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isEthiopic ? 'አገር አቀፍና አለም አቀፍ የተመዘገቡ የውሃ ተቋማት ማውጫ' : 'National & Global Water Utility Directory'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isEthiopic ? 'በሲስተሙ የተገናኙ የ14ቱ የኢትዮጵያ ክልሎችና አለም አቀፍ ተቋማት ይፋዊ ዝርዝር' : 'Verified utility registry across 14 Ethiopian regions and global hubs'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={directoryFilterRegion}
                  onChange={(e) => setDirectoryFilterRegion(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white font-medium"
                >
                  <option value="all">{isEthiopic ? 'ሁሉንም ክልሎች አሳይ' : 'All Regions'}</option>
                  {REGIONS_DIRECTORY.map(r => (
                    <option key={r.id} value={r.nameEn}>
                      {r.flag} {isEthiopic ? r.nameAm : r.nameEn}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={fetchDirectory}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-600"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingDirectory ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Utility Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {REGIONS_DIRECTORY.filter(r => directoryFilterRegion === 'all' || r.nameEn.toLowerCase().includes(directoryFilterRegion.toLowerCase())).map((reg) => (
                <div key={reg.id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-sm transition space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xl">{reg.flag}</span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">
                        {isEthiopic ? reg.nameAm : reg.nameEn}
                      </h4>
                      <p className="text-[11px] text-slate-500">{reg.country}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-100 text-cyan-800">
                      {reg.primaryUtility.code}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-100 text-xs space-y-1.5">
                    <div className="font-medium text-slate-800 line-clamp-1">
                      {isEthiopic ? reg.primaryUtility.nameAm : reg.primaryUtility.nameEn}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600">
                      <span>{isEthiopic ? 'የአደጋ ጊዜ መስመር' : 'Emergency Hotline'}:</span>
                      <strong className="font-mono text-cyan-800 font-bold">{reg.primaryUtility.hotline}</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">{isEthiopic ? 'ዋና ዋና ከተሞች' : 'Cities'}:</span>{' '}
                    {reg.majorCities.map(c => isEthiopic ? c.am : c.en).slice(0, 4).join('፣ ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
