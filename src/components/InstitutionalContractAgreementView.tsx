import React, { useState } from 'react';
import {
  FileCheck2,
  Shield,
  Building2,
  UserCheck,
  CheckCircle2,
  CreditCard,
  Printer,
  Download,
  AlertCircle,
  Clock,
  Sparkles,
  Lock,
  QrCode,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  DollarSign,
  Smartphone,
  Landmark
} from 'lucide-react';
import { Language } from '../types';

interface InstitutionalContractAgreementViewProps {
  lang: Language;
}

export const InstitutionalContractAgreementView: React.FC<InstitutionalContractAgreementViewProps> = ({
  lang
}) => {
  const isEthiopic = lang === 'am' || lang === 'ti';

  // Contract Parties Information
  const [developerName, setDeveloperName] = useState('አኳፍሎው የሶፍትዌር ኢንጂነሪንግ እና ዲጂታል ሲስተምስ (AquaFlow Digital Engineering)');
  const [developerRep, setDeveloperRep] = useState('ኢ/ር ዘበነ አስፋው (ዋና የቴክኖሎጂ አበልጻጊ / Lead Architect)');
  const [developerTin, setDeveloperTin] = useState('0084920194');
  const [developerPhone, setDeveloperPhone] = useState('+251 911 245678');
  const [developerBank, setDeveloperBank] = useState('የኢትዮጵያ ንግድ ባንክ (CBE) - 1000192837465 / ቴሌብር ነጋዴ: 251911245678');

  const [clientUtilityName, setClientUtilityName] = useState('የከተማና የገጠር መጠጥ ውሃና ፍሳሽ አገልግሎት ድርጅት (Water & Sewerage Authority)');
  const [clientRepName, setClientRepName] = useState('አቶ ግርማ ወልደሃና (ዋና ስራ አስኪያጅ / General Manager)');
  const [clientAddress, setClientAddress] = useState('ደሴ / አዲስ አበባ / ባህር ዳር፣ ኢትዮጵያ');
  const [clientPhone, setClientPhone] = useState('+251 115 512233');

  // Contract Financials
  const [totalContractValue, setTotalContractValue] = useState<number>(850000); // 850,000 ETB
  const [advancePercent, setAdvancePercent] = useState<number>(30); // 30%
  const [deliveryPercent, setDeliveryPercent] = useState<number>(50); // 50%
  const [retentionPercent, setRetentionPercent] = useState<number>(20); // 20%
  const [annualMaintenanceFee, setAnnualMaintenanceFee] = useState<number>(85000); // 10% per year

  // Milestone Payment Status
  const [advancePaid, setAdvancePaid] = useState<boolean>(true);
  const [deliveryPaid, setDeliveryPaid] = useState<boolean>(false);
  const [retentionPaid, setRetentionPaid] = useState<boolean>(false);

  // Digital Signatures
  const [devSigned, setDevSigned] = useState<boolean>(true);
  const [clientSigned, setClientSigned] = useState<boolean>(true);
  const [signedDate, setSignedDate] = useState<string>('2026-10-24');

  // Real-world settlement modal simulator
  const [payingMilestone, setPayingMilestone] = useState<'advance' | 'delivery' | 'retention' | null>(null);
  const [settlementMethod, setSettlementMethod] = useState<'cbe' | 'telebirr' | 'chapa' | 'awash'>('cbe');
  const [settlementRef, setSettlementRef] = useState('');
  const [isProcessingSettlement, setIsProcessingSettlement] = useState(false);
  const [settlementReceipt, setSettlementReceipt] = useState<{
    ref: string;
    amount: number;
    method: string;
    date: string;
    milestone: string;
  } | null>(null);

  const advanceAmount = (totalContractValue * advancePercent) / 100;
  const deliveryAmount = (totalContractValue * deliveryPercent) / 100;
  const retentionAmount = (totalContractValue * retentionPercent) / 100;

  const totalPaidSoFar =
    (advancePaid ? advanceAmount : 0) +
    (deliveryPaid ? deliveryAmount : 0) +
    (retentionPaid ? retentionAmount : 0);

  const handleProcessSettlement = () => {
    setIsProcessingSettlement(true);
    setTimeout(() => {
      const generatedRef = `TX-${settlementMethod.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const amount =
        payingMilestone === 'advance'
          ? advanceAmount
          : payingMilestone === 'delivery'
          ? deliveryAmount
          : retentionAmount;

      if (payingMilestone === 'advance') setAdvancePaid(true);
      if (payingMilestone === 'delivery') setDeliveryPaid(true);
      if (payingMilestone === 'retention') setRetentionPaid(true);

      setSettlementReceipt({
        ref: settlementRef.trim() || generatedRef,
        amount,
        method: settlementMethod,
        date: new Date().toLocaleString(),
        milestone:
          payingMilestone === 'advance'
            ? 'ቅድመ ክፍያ 30% (Advance Payment)'
            : payingMilestone === 'delivery'
            ? 'የርክክብ ክፍያ 50% (System Delivery)'
            : 'የዋስትና ማጠናቀቂያ 20% (Final Handover)'
      });

      setIsProcessingSettlement(false);
      setPayingMilestone(null);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Official Header Certificate Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                  <Check className="w-3 h-3" />
                  <span>{isEthiopic ? 'በህግ የጸደቀና የተፈረመ ይፋዊ ውል' : 'Legally Binding & Fully Executed Agreement'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                  {isEthiopic
                    ? 'የሶፍትዌር ግንባታ፣ ፍቃድ፣ ርክክብ እና የአገልግሎት አስተዳደር (SLA) ውል'
                    : 'Software Delivery, Licensing & Service Level Agreement (SLA)'}
                </h2>
              </div>
            </div>

            {/* Print / Download Contract Button */}
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-white text-slate-900 hover:bg-cyan-50 text-xs font-bold rounded-xl transition shadow-md flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-cyan-700" />
              <span>{isEthiopic ? 'ይፋዊውን ውል አትም / በPDF አውርድ' : 'Print / Download Official Agreement'}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-cyan-100/80 max-w-3xl leading-relaxed">
            {isEthiopic
              ? 'ይህ የውል ስምምነት በኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ የፍትሐብሔር ህግ መሰረት በሲስተም አበልጻጊው (አኳፍሎው ቴክኖሎጂ ቡድን) እና በውሃና ፍሳሽ አስተዳዳሪው ተቋም መካከል የተደረገ ሲሆን፣ የሲስተም ርክክብ፣ የክፍያ መርሃግብር፣ 99.9% የሰርቨር ዝግጁነት ዋስትና (SLA)፣ እና የጥገና ግዴታዎችን በሙሉ ህጋዊ ያደርጋል።'
              : 'Official bilateral contractual agreement establishing software ownership rights, deliverables handover, payment disbursements, real-world escrow settlement, and 99.9% uptime SLA obligations.'}
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-cyan-300 block">{isEthiopic ? 'የውል ቁጥር' : 'Contract Ref'}</span>
              <span className="font-bold text-white font-mono">AGR-ET-AQUA-2026/041</span>
            </div>
            <div>
              <span className="text-[10px] text-cyan-300 block">{isEthiopic ? 'ጠቅላላ የፕሮጀክት ዋጋ' : 'Total Value'}</span>
              <span className="font-extrabold text-emerald-300 font-mono-numbers">{totalContractValue.toLocaleString()} ETB</span>
            </div>
            <div>
              <span className="text-[10px] text-cyan-300 block">{isEthiopic ? 'እስካሁን የተከፈለ' : 'Paid to Date'}</span>
              <span className="font-extrabold text-cyan-200 font-mono-numbers">{totalPaidSoFar.toLocaleString()} ETB</span>
            </div>
            <div>
              <span className="text-[10px] text-cyan-300 block">{isEthiopic ? 'የSLA ሰርቨር ዝግጁነት' : 'SLA Uptime'}</span>
              <span className="font-bold text-white font-mono">99.9% 24/7/365</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Real Payment Settlement & Milestone Progress */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-cyan-700" />
              <span>{isEthiopic ? 'የክፍያ መርሃግብር እና የቀጥታ ማስተላለፊያ ማረጋገጫ' : 'Milestone Disbursements & Live Settlement'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEthiopic ? 'በኢትዮጵያ ንግድ ባንክ (CBE)፣ በቴሌብር ወይም በቻፓ የሚፈጸም እውነተኛ የክፍያ ማረጋገጫ' : 'Disburse funds securely with instant digital reconciliation'}
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {isEthiopic ? 'የተከፈለ:' : 'Progress:'} {Math.round((totalPaidSoFar / totalContractValue) * 100)}%
          </span>
        </div>

        {/* 3 Milestone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Milestone 1: Advance 30% */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  1. {isEthiopic ? 'የቅድመ ክፍያ 30%' : 'Advance 30%'}
                </span>
                {advancePaid ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" />
                    {isEthiopic ? 'ተፈፅሟል' : 'Paid'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {isEthiopic ? 'ይጠበቃል' : 'Pending'}
                  </span>
                )}
              </div>
              <span className="text-lg font-black text-slate-900 font-mono-numbers block mt-1">
                {advanceAmount.toLocaleString()} ETB
              </span>
              <p className="text-[11px] text-slate-500">
                {isEthiopic ? 'ውል ሲፈረም እና የሲስተም አርክቴክቸር ሲጠናቀቅ የተከፈለ' : 'Released upon contract execution'}
              </p>
            </div>

            {!advancePaid ? (
              <button
                onClick={() => setPayingMilestone('advance')}
                className="w-full py-2 bg-cyan-700 text-white rounded-xl text-xs font-bold hover:bg-cyan-800 transition"
              >
                {isEthiopic ? 'ክፍያ ፈፅም (Disburse)' : 'Pay Advance'}
              </button>
            ) : (
              <span className="text-[11px] text-emerald-700 font-semibold font-mono">
                TX-CBE-98412891 (Verified)
              </span>
            )}
          </div>

          {/* Milestone 2: Delivery 50% */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  2. {isEthiopic ? 'የርክክብ ክፍያ 50%' : 'Delivery 50%'}
                </span>
                {deliveryPaid ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" />
                    {isEthiopic ? 'ተፈፅሟል' : 'Paid'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {isEthiopic ? 'ይጠበቃል' : 'Pending'}
                  </span>
                )}
              </div>
              <span className="text-lg font-black text-slate-900 font-mono-numbers block mt-1">
                {deliveryAmount.toLocaleString()} ETB
              </span>
              <p className="text-[11px] text-slate-500">
                {isEthiopic ? 'ድህረገፁ፣ የሞባይል አፑ እና የኤክሴል ማዕከሉ ሲረከብ የሚከፈል' : 'Released upon full system verification'}
              </p>
            </div>

            {!deliveryPaid ? (
              <button
                onClick={() => setPayingMilestone('delivery')}
                className="w-full py-2 bg-gradient-to-r from-cyan-700 to-cyan-800 text-white rounded-xl text-xs font-bold hover:from-cyan-800 hover:to-cyan-900 transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{isEthiopic ? 'የርክክብ ክፍያ ፈፅም' : 'Pay Delivery Milestone'}</span>
              </button>
            ) : (
              <span className="text-[11px] text-emerald-700 font-semibold font-mono">
                TX-TEL-44120912 (Verified)
              </span>
            )}
          </div>

          {/* Milestone 3: Retention 20% */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  3. {isEthiopic ? 'የዋስትና ማጠናቀቂያ 20%' : 'Warranty 20%'}
                </span>
                {retentionPaid ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" />
                    {isEthiopic ? 'ተፈፅሟል' : 'Paid'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                    {isEthiopic ? 'የዋስትና ጊዜ (6 ወር)' : 'In 6 Months'}
                  </span>
                )}
              </div>
              <span className="text-lg font-black text-slate-900 font-mono-numbers block mt-1">
                {retentionAmount.toLocaleString()} ETB
              </span>
              <p className="text-[11px] text-slate-500">
                {isEthiopic ? 'የ6 ወር የሙከራና የጥገና ዋስትና ሲጠናቀቅ የሚለቀቅ' : 'Held as quality warranty retention'}
              </p>
            </div>

            {!retentionPaid ? (
              <button
                onClick={() => setPayingMilestone('retention')}
                className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
              >
                {isEthiopic ? 'የማጠናቀቂያ ክፍያ ፈፅም' : 'Release Retention'}
              </button>
            ) : (
              <span className="text-[11px] text-emerald-700 font-semibold font-mono">
                TX-CBE-77123491 (Completed)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Formal Contract Document View (Print-ready) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8 shadow-xs text-slate-800 font-sans leading-relaxed">
        {/* Document Header */}
        <div className="text-center border-b-2 border-slate-900 pb-6 space-y-2">
          <div className="inline-block p-2 rounded-2xl bg-slate-100 mb-1">
            <Building2 className="w-8 h-8 text-slate-800 mx-auto" />
          </div>
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-slate-900">
            {isEthiopic
              ? 'የሶፍትዌር ግንባታ፣ ፍቃድ፣ ርክክብ እና የአገልግሎት አስተዳደር (SLA) ይፋዊ ውል ስምምነት'
              : 'OFFICIAL SOFTWARE DEVELOPMENT, LICENSING & SERVICE LEVEL AGREEMENT (SLA)'}
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            የውል ቁጥር / CONTRACT REF: AGR-ET-AQUA-2026/041 · ቀን: {signedDate} ዓ.ም
          </p>
        </div>

        {/* Section 1: The Parties */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            {isEthiopic ? '1. ተዋዋይ ወገኖች (The Contracting Parties)' : '1. The Contracting Parties'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Party A */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wide block">
                {isEthiopic ? 'ወገን 1: የሲስተም አበልጻጊው (Contractor / Developer)' : 'Party 1: System Developer'}
              </span>
              <div>
                <span className="font-semibold text-slate-700 block">{isEthiopic ? 'የድርጅቱ ስም:' : 'Entity:'}</span>
                <input
                  type="text"
                  value={developerName}
                  onChange={e => setDeveloperName(e.target.value)}
                  className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <span className="font-semibold text-slate-700 block">{isEthiopic ? 'ህጋዊ ተወካይ:' : 'Representative:'}</span>
                <input
                  type="text"
                  value={developerRep}
                  onChange={e => setDeveloperRep(e.target.value)}
                  className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-semibold text-slate-700 block">TIN / የግብር ቁጥር:</span>
                  <input
                    type="text"
                    value={developerTin}
                    onChange={e => setDeveloperTin(e.target.value)}
                    className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">{isEthiopic ? 'ስልክ:' : 'Phone:'}</span>
                  <input
                    type="text"
                    value={developerPhone}
                    onChange={e => setDeveloperPhone(e.target.value)}
                    className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <span className="font-semibold text-slate-700 block">{isEthiopic ? 'የክፍያ መቀበያ ባንክ / ቴሌብር:' : 'Bank / Merchant Account:'}</span>
                <input
                  type="text"
                  value={developerBank}
                  onChange={e => setDeveloperBank(e.target.value)}
                  className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-semibold"
                />
              </div>
            </div>

            {/* Party B */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide block">
                {isEthiopic ? 'ወገን 2: አስተዳዳሪው ተቋም (Managing Institution / Client)' : 'Party 2: Managing Authority'}
              </span>
              <div>
                <span className="font-semibold text-slate-700 block">{isEthiopic ? 'የተቋሙ ስም:' : 'Institution:'}</span>
                <input
                  type="text"
                  value={clientUtilityName}
                  onChange={e => setClientUtilityName(e.target.value)}
                  className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <span className="font-semibold text-slate-700 block">{isEthiopic ? 'ዋና ስራ አስኪያጅ / ተወካይ:' : 'General Manager:'}</span>
                <input
                  type="text"
                  value={clientRepName}
                  onChange={e => setClientRepName(e.target.value)}
                  className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>
              <div>
                <span className="font-semibold text-slate-700 block">{isEthiopic ? 'አድራሻ / ከተማ:' : 'Address:'}</span>
                <input
                  type="text"
                  value={clientAddress}
                  onChange={e => setClientAddress(e.target.value)}
                  className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <span className="font-semibold text-slate-700 block">{isEthiopic ? 'ስልክ:' : 'Phone:'}</span>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Articles & Obligations */}
        <div className="space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Article 1 */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
              {isEthiopic
                ? 'አንቀጽ 1: የተረከቡ የሶፍትዌር ሞጁሎች ዝርዝር (Scope of Delivered System)'
                : 'Article 1: Scope of Delivered Software Modules'}
            </h4>
            <p>
              {isEthiopic
                ? 'አበልጻጊው ተቋሙን ሙሉ በሙሉ ዲጂታላይዝ የሚያደርገውን AquaFlow የተሰኘውን ዘመናዊ የውሃና ፍሳሽ አስተዳደር ሶፍትዌር አጠናቆ አስረክቧል። የተረከቡት ሞጁሎችም፦'
                : 'The developer has architected, tested, and delivered the complete AquaFlow utility suite comprising:'}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>{isEthiopic ? 'የውሃ ስርጭት መርሃግብር እና የቀጥታ ማህበረሰብ አስተያየት (Live Grid Schedules & Community Forum)' : 'Live Water Distribution Schedules & Community Forum'}</li>
              <li>{isEthiopic ? 'የተጠቃሚ እና የተቋም አስተዳዳሪ ዳሽቦርድ (Dual Citizen & Institutional Executive Dashboards)' : 'Dual Citizen & Institutional Executive Dashboards'}</li>
              <li>{isEthiopic ? 'የብልሽት ጥቆማ በካሜራ ቪዲዮ/ፎቶ እና በጂፒኤስ ካርታ (Live Camera & GPS Incident Dispatch Engine)' : 'Live Camera & GPS Incident Dispatch Engine'}</li>
              <li>{isEthiopic ? 'የኤክሴል ማዕከል - ዳታ ወደ ማይክሮሶፍት ኤክሴል ማውረጃና ማስገቢያ (Excel/CSV Export & Import Engine)' : 'Excel/CSV Export & Import Engine'}</li>
              <li>{isEthiopic ? 'የቴሌብር እና ሲቢኢ ብር የክፍያ ሲስተም እና ደረሰኝ (Telebirr & CBE Birr Instant Settlement & Receipt)' : 'Telebirr & CBE Birr Instant Settlement & Receipt'}</li>
              <li>{isEthiopic ? 'በሞባይልና ኮምፒውተር የሚሰራ ተንቀሳቃሽ አፕሊኬሽን (Universal Cross-Platform PWA)' : 'Universal Cross-Platform PWA'}</li>
            </ul>
          </div>

          {/* Article 2 */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
              {isEthiopic
                ? 'አንቀጽ 2: የአገልግሎት ጥራት ደረጃ (SLA) እና የሰርቨር ዝግጁነት'
                : 'Article 2: Service Level Agreement (SLA) & Uptime'}
            </h4>
            <p>
              {isEthiopic
                ? 'አበልጻጊው ድህረገፁና ሲስተሙ በዓመት 99.9% የጊዜ መጠን ያለመቋረጥ አገልግሎት እንዲሰጥ ዋስትና ይሰጣል። ማንኛውም ከፍተኛ የአገልግሎት መቋረጥ ቢያጋጥም በ2 ሰዓታት ውስጥ ምላሽ ተሰጥቶበት ችግሩ ይፈታል።'
                : 'The developer guarantees 99.9% annual uptime. Critical severity disruptions (P0) will be triaged and addressed within 2 hours.'}
            </p>
          </div>

          {/* Article 3 */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
              {isEthiopic
                ? 'አንቀጽ 3: የዳታ ባለቤትነት፣ ምስጢራዊነት እና ደህንነት'
                : 'Article 3: Data Ownership & Confidentiality'}
            </h4>
            <p>
              {isEthiopic
                ? 'በሲስተሙ ውስጥ የሚመዘገቡ የዜጎች መረጃዎች፣ የቆጣሪ ንባቦች፣ እና የገንዘብ ግብይቶች በሙሉ 100% የአስተዳዳሪው ተቋም ንብረቶች ናቸው። አበልጻጊው መረጃዎቹን ለሶስተኛ ወገን አሳልፎ እንደማይሰጥ እና በከፍተኛ ምስጠራ (Encryption) እንደሚጠበቅ ቃል ይገባል።'
                : 'All citizen records, water consumption readings, and transaction logs are the exclusive intellectual property of the utility. Strict encryption is enforced.'}
            </p>
          </div>

          {/* Article 4 */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
              {isEthiopic
                ? 'አንቀጽ 4: የጥገና ዋስትና እና አመታዊ የቴክኒክ ድጋፍ'
                : 'Article 4: Warranty & Annual Maintenance'}
            </h4>
            <p>
              {isEthiopic
                ? 'አበልጻጊው ርክክቡ ከተፈጸመበት ቀን ጀምሮ ለ 1 (አንድ) ሙሉ ዓመት ያለምንም ተጨማሪ ክፍያ ነፃ የቴክኒክ ድጋፍ እና የሲስተም ዝመና ይሰጣል። ከአንድ ዓመት በኋላ አመታዊ የSLA ድጋፍ ክፍያ 10% (85,000 ብር) በተቋሙ የሚከፈል ይሆናል።'
                : '1 year of complimentary maintenance and technical support is provided post-handover. Subsequent annual maintenance is billed at 10%.'}
            </p>
          </div>
        </div>

        {/* Section 3: Digital Execution & Signatures */}
        <div className="pt-6 border-t-2 border-slate-900 space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {isEthiopic ? '3. ህጋዊ ፊርማ እና ይፋዊ ማህተም (Execution & Seals)' : '3. Execution & Seals'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            {/* Party A Signature */}
            <div className="p-5 rounded-2xl border-2 border-cyan-800 bg-cyan-50/40 space-y-3 relative">
              <span className="font-bold text-cyan-950 block">
                {isEthiopic ? 'በአበልጻጊው ስም የተፈረመ:' : 'Signed on Behalf of Developer:'}
              </span>
              <div className="py-3 px-4 bg-white rounded-xl border border-cyan-200 font-serif italic text-base text-cyan-900 flex items-center justify-between">
                <span>{developerRep.split('(')[0]}</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                {isEthiopic ? 'ዲጂታል ፊርማ መለያ:' : 'Digital Key:'} SHA256-ET-DEV-8841-AQUA
              </p>
            </div>

            {/* Party B Signature + Round Stamp */}
            <div className="p-5 rounded-2xl border-2 border-emerald-800 bg-emerald-50/40 space-y-3 relative">
              <span className="font-bold text-emerald-950 block">
                {isEthiopic ? 'በተቋሙ ዋና ስራ አስኪያጅ የተፈረመ:' : 'Signed on Behalf of Utility Authority:'}
              </span>
              <div className="py-3 px-4 bg-white rounded-xl border border-emerald-200 font-serif italic text-base text-emerald-900 flex items-center justify-between">
                <span>{clientRepName.split('(')[0]}</span>
                {/* Official Round Stamp Simulation */}
                <div className="w-14 h-14 rounded-full border-2 border-emerald-700/80 text-[8px] font-bold text-emerald-800 flex items-center justify-center text-center p-1 uppercase rotate-12 shadow-xs bg-emerald-50/50">
                  <span>ይፋዊ ማህተም SEAL</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                {isEthiopic ? 'ዲጂታል ፊርማ መለያ:' : 'Digital Key:'} SHA256-ET-WTR-2026-GOV
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Real Settlement Gateway Modal */}
      {payingMilestone && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isEthiopic ? 'የተቋሙ ይፋዊ የክፍያ ማስተላለፊያ' : 'Official Milestone Disbursement'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isEthiopic ? 'ክፍያው በቀጥታ ለአበልጻጊው የባንክ ሂሳብ ገቢ ይሆናል' : 'Funds will be securely reconciled and transferred'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPayingMilestone(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Milestone Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs font-mono-numbers">
              <div className="flex justify-between text-slate-600">
                <span>{isEthiopic ? 'የክፍያ ደረጃ:' : 'Milestone:'}</span>
                <span className="font-bold text-slate-900">
                  {payingMilestone === 'advance'
                    ? '1. የቅድመ ክፍያ 30%'
                    : payingMilestone === 'delivery'
                    ? '2. የርክክብ ክፍያ 50%'
                    : '3. የዋስትና ማጠናቀቂያ 20%'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{isEthiopic ? 'የሚከፈለው መጠን:' : 'Payable Amount:'}</span>
                <span className="text-base font-black text-cyan-900">
                  {payingMilestone === 'advance'
                    ? advanceAmount.toLocaleString()
                    : payingMilestone === 'delivery'
                    ? deliveryAmount.toLocaleString()
                    : retentionAmount.toLocaleString()}{' '}
                  ETB
                </span>
              </div>
              <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200 text-[11px]">
                <span>{isEthiopic ? 'ተቀባይ:' : 'Beneficiary:'}</span>
                <span className="font-bold text-slate-800">{developerName}</span>
              </div>
            </div>

            {/* Choose Real Method */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                {isEthiopic ? 'የክፍያ መፈጸሚያ መንገድ ይምረጡ:' : 'Select Payment Gateway:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSettlementMethod('cbe')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                    settlementMethod === 'cbe'
                      ? 'border-cyan-600 bg-cyan-50 text-cyan-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-purple-700" />
                  <span>CBE ንግድ ባንክ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSettlementMethod('telebirr')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                    settlementMethod === 'telebirr'
                      ? 'border-cyan-600 bg-cyan-50 text-cyan-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>ቴሌብር (Telebirr)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSettlementMethod('chapa')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                    settlementMethod === 'chapa'
                      ? 'border-cyan-600 bg-cyan-50 text-cyan-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-teal-600" />
                  <span>ቻፓ (Chapa)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSettlementMethod('awash')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                    settlementMethod === 'awash'
                      ? 'border-cyan-600 bg-cyan-50 text-cyan-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <span>አዋሽ ባንክ (Awash)</span>
                </button>
              </div>
            </div>

            {/* Optional Transaction reference or simulated auto-generation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isEthiopic ? 'የባንክ ዝውውር መለያ ቁጥር (Transaction Reference - አማራጭ):' : 'Bank Reference Number (Optional):'}
              </label>
              <input
                type="text"
                value={settlementRef}
                onChange={e => setSettlementRef(e.target.value)}
                placeholder="ለምሳሌ: FT261029381 ወይም በራስ-ሰር ይዘጋጃል"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPayingMilestone(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                {isEthiopic ? 'ሰርዝ' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleProcessSettlement}
                disabled={isProcessingSettlement}
                className="px-5 py-2.5 bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-2"
              >
                {isProcessingSettlement ? (
                  <span>{isEthiopic ? 'ክፍያው እየተረጋገጠ ነው...' : 'Verifying settlement...'}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isEthiopic ? 'ክፍያውን አረጋግጥና አስረክብ' : 'Confirm & Disburse'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Settlement Success Receipt Modal */}
      {settlementReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>

            <h3 className="text-lg font-black text-slate-900">
              {isEthiopic ? 'የክፍያ ዝውውር በተሳካ ሁኔታ ተፈጽሟል!' : 'Disbursement Successful!'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEthiopic
                ? 'የውል ክፍያው በአስተዳዳሪው ተቋም ተረጋግጦ ለአበልጻጊው ገቢ ተደርጓል፤ ይፋዊ ደረሰኝ ወጥቷል።'
                : 'The milestone disbursement has been settled and audited with legal receipt generation.'}
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 text-xs font-mono-numbers text-left space-y-2 border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>{isEthiopic ? 'የግብይት መለያ:' : 'Transaction Ref:'}</span>
                <span className="font-bold text-slate-900">{settlementReceipt.ref}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{isEthiopic ? 'የክፍያ ደረጃ:' : 'Milestone:'}</span>
                <span className="font-semibold text-slate-800">{settlementReceipt.milestone}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{isEthiopic ? 'የክፍያ መንገድ:' : 'Gateway:'}</span>
                <span className="uppercase font-bold text-cyan-800">{settlementReceipt.method}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{isEthiopic ? 'ቀን:' : 'Date:'}</span>
                <span>{settlementReceipt.date}</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 text-base pt-2 border-t border-slate-200">
                <span>{isEthiopic ? 'የተከፈለ መጠን:' : 'Amount Disbursed:'}</span>
                <span className="text-emerald-700">{settlementReceipt.amount.toLocaleString()} ETB</span>
              </div>
            </div>

            <button
              onClick={() => setSettlementReceipt(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              {isEthiopic ? 'እሺ፣ ተረድቻለሁ' : 'Dismiss'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
