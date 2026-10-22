import React, { useState } from 'react';
import { Search, CreditCard, CheckCircle2, QrCode, FileText, Download, Printer, ShieldCheck, HeartHandshake, ArrowRight, X, Sparkles } from 'lucide-react';
import { BillRecord, ContributionProject, Language } from '../types';
import { translations } from '../utils/translations';

interface BillingAndPaymentViewProps {
  bills: BillRecord[];
  contributions: ContributionProject[];
  lang: Language;
  onPayBill: (billId: string, method: any, transactionRef: string) => void;
  onContribute: (projectId: string, amount: number, contributorName: string) => void;
}

export const BillingAndPaymentView: React.FC<BillingAndPaymentViewProps> = ({
  bills,
  contributions,
  lang,
  onPayBill,
  onContribute
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'bills' | 'contributions'>('bills');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBill, setSelectedBill] = useState<BillRecord | null>(bills[0] || null);

  // Payment Modal State
  const [isPayingBill, setIsPayingBill] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'cbe_birr' | 'chapa' | 'awash_bank'>('telebirr');
  const [paymentPhone, setPaymentPhone] = useState('0911245678');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<BillRecord | null>(null);

  // Contribution Modal State
  const [selectedProject, setSelectedProject] = useState<ContributionProject | null>(null);
  const [contribAmount, setContribAmount] = useState<number>(500);
  const [contributorName, setContributorName] = useState('');
  const [contribSuccess, setContribSuccess] = useState(false);

  const isEthiopic = lang === 'am' || lang === 'ti';

  // Filter bills
  const filteredBills = bills.filter(b => {
    return (
      b.meterNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleStartPayment = (bill: BillRecord) => {
    setSelectedBill(bill);
    setPaymentPhone(bill.customerPhone || '0911245678');
    setIsPayingBill(true);
  };

  const handleExecutePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBill) return;
    setIsProcessing(true);

    const txRef = `${paymentMethod.toUpperCase().slice(0, 3)}-${Math.floor(10000000 + Math.random() * 90000000)}`;

    try {
      // Call live backend settlement endpoint
      await fetch(`/api/bills/${selectedBill.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod,
          transactionRef: txRef
        })
      });

      // Also trigger webhook settlement
      await fetch('/api/payments/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'charge.complete',
          status: 'success',
          tx_ref: txRef,
          meter_number: selectedBill.meterNumber,
          amount: selectedBill.totalBirr,
          currency: 'ETB',
          provider: paymentMethod
        })
      });
    } catch (err) {
      console.warn('Backend payment sync fallback:', err);
    }

    onPayBill(selectedBill.id, paymentMethod, txRef);
    setIsProcessing(false);
    setIsPayingBill(false);

    const updatedBill = {
      ...selectedBill,
      status: 'paid' as const,
      paidAt: new Date().toISOString(),
      paymentMethod,
      receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      transactionRef: txRef
    };
    setSelectedBill(updatedBill);
    setCompletedReceipt(updatedBill);
  };

  const handleExecuteContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || contribAmount <= 0) return;
    onContribute(selectedProject.id, contribAmount, contributorName || (lang === 'am' ? 'የከተማው ነዋሪ' : 'Community Member'));
    setContribSuccess(true);
    setTimeout(() => {
      setContribSuccess(false);
      setSelectedProject(null);
      setContribAmount(500);
      setContributorName('');
    }, 2400);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-800 uppercase tracking-wider mb-1">
          <CreditCard className="w-4 h-4 text-cyan-600" />
          <span>{lang === 'am' ? 'ክፍያዎች እና የማህበረሰብ ፈንድ' : 'Billing & Community Funds'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.billingTitle}
        </h2>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          {t.billingSubtitle}
        </p>

        {/* Segmented Controls for Sub-tabs */}
        <div className="flex items-center gap-2 mt-6 p-1 bg-slate-100 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('bills')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'bills'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            {t.tabBills}
          </button>
          <button
            onClick={() => setActiveTab('contributions')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'contributions'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            {t.tabContributions}
          </button>
        </div>
      </div>

      {/* TAB 1: MONTHLY WATER BILLS */}
      {activeTab === 'bills' && (
        <div className="space-y-6">
          {/* Bill Search & Lookup */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.meterSearchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:bg-white transition"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-500 hidden sm:inline">
                {lang === 'am' ? 'የሙከራ ቆጣሪ:' : 'Demo Meters:'}
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('MTR-09412')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-mono text-slate-700"
              >
                MTR-09412
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery('MTR-10294')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-mono text-slate-700"
              >
                MTR-10294
              </button>
            </div>
          </div>

          {/* Bills Grid & Selected Bill Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* List of Bills (Left column 5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {lang === 'am' ? 'የተገኙ የደንበኞች ሂሳቦች' : 'Matched Consumer Bills'} ({filteredBills.length})
              </h3>

              {filteredBills.length === 0 ? (
                <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                  {lang === 'am' ? 'በዚህ መለያ ምንም አይነት ሂሳብ አልተገኘም' : 'No bills found matching this query'}
                </div>
              ) : (
                filteredBills.map((b) => {
                  const isSelected = selectedBill?.id === b.id;
                  const isPaid = b.status === 'paid';

                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBill(b)}
                      className={`p-4 rounded-xl border cursor-pointer transition ${
                        isSelected
                          ? 'border-cyan-700 bg-cyan-50/40 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{b.customerName}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span className="font-mono">{b.meterNumber}</span>
                            <span aria-hidden="true">·</span>
                            <span>{b.subCity}</span>
                          </div>
                        </div>

                        {/* Paid vs Unpaid status */}
                        <div>
                          {isPaid ? (
                            <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {t.statusPaid}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-amber-700">
                              {t.statusUnpaid}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500">{b.billingPeriod}</span>
                        <span className="font-bold font-mono-numbers text-slate-900 text-sm">
                          {b.totalBirr.toFixed(2)} ETB
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bill Statement Detail (Right column 7 cols) */}
            {selectedBill ? (
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-start justify-between border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider block mb-1">
                      {lang === 'am' ? 'ይፋዊ የፍጆታ ደረሰኝ ሰነድ' : 'Official Utility Statement'}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {selectedBill.customerName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedBill.subCity} · {selectedBill.kebele} · {selectedBill.customerPhone}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-mono">
                      {selectedBill.meterNumber}
                    </span>
                    <span
                      className={`text-xs font-bold inline-block mt-1 px-2.5 py-0.5 rounded-full ${
                        selectedBill.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {selectedBill.status === 'paid' ? t.statusPaid : t.statusUnpaid}
                    </span>
                  </div>
                </div>

                {/* Consumption and Meter Breakdown */}
                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-500 block">
                      {lang === 'am' ? 'ያለፈው ንባብ' : 'Previous Reading'}
                    </span>
                    <span className="text-sm font-bold font-mono-numbers text-slate-800">
                      {selectedBill.previousReadingM3} m³
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">
                      {lang === 'am' ? 'የአሁኑ ንባብ' : 'Current Reading'}
                    </span>
                    <span className="text-sm font-bold font-mono-numbers text-slate-800">
                      {selectedBill.currentReadingM3} m³
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-cyan-800 font-semibold block">
                      {t.consumption}
                    </span>
                    <span className="text-sm font-extrabold font-mono-numbers text-cyan-700">
                      {selectedBill.consumptionM3} m³
                    </span>
                  </div>
                </div>

                {/* Line Item Tariffs */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>{t.baseAmount} ({selectedBill.consumptionM3} m³)</span>
                    <span className="font-mono-numbers">{selectedBill.amountBirr.toFixed(2)} ETB</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{t.sanitationFee}</span>
                    <span className="font-mono-numbers">{selectedBill.sanitationFeeBirr.toFixed(2)} ETB</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{t.meterRent}</span>
                    <span className="font-mono-numbers">{selectedBill.meterRentBirr.toFixed(2)} ETB</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between text-sm font-bold text-slate-900">
                    <span>{t.totalPayable}</span>
                    <span className="text-base font-extrabold text-cyan-800 font-mono-numbers">
                      {selectedBill.totalBirr.toFixed(2)} ETB
                    </span>
                  </div>
                </div>

                {/* Action or Paid Proof */}
                {selectedBill.status === 'unpaid' ? (
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                    <div className="text-xs text-amber-900">
                      <span className="font-bold block">{lang === 'am' ? 'የክፍያ ማሳሰቢያ' : 'Payment Reminder'}</span>
                      <span>{t.dueDate}: {selectedBill.dueDate}</span>
                    </div>
                    <button
                      onClick={() => handleStartPayment(selectedBill)}
                      className="w-full sm:w-auto px-6 py-2.5 bg-cyan-700 text-white rounded-lg text-xs font-semibold hover:bg-cyan-800 transition shadow-sm flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                    >
                      <CreditCard className="w-4 h-4" />
                      {t.payNowBtn} ({selectedBill.totalBirr.toFixed(2)} ETB)
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{lang === 'am' ? 'ክፍያው ተጠናቋል' : 'Bill Paid'}</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-700">
                        {selectedBill.receiptNumber || 'REC-2026-90412'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 flex items-center justify-between">
                      <span>Ref: {selectedBill.transactionRef || 'TEL-88492019'}</span>
                      <button
                        onClick={() => setCompletedReceipt(selectedBill)}
                        className="text-xs text-cyan-800 hover:text-cyan-900 font-semibold underline flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        {t.downloadReceipt}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* TAB 2: COMMUNITY CONTRIBUTION PROJECTS */}
      {activeTab === 'contributions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contributions.map((proj) => {
              const progressPercent = Math.min(100, Math.round((proj.collectedBirr / proj.targetBirr) * 100));

              return (
                <div
                  key={proj.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-cyan-800">
                        {isEthiopic ? proj.subCityAm : proj.subCityEn}
                      </span>
                      <span className="text-slate-400">
                        {isEthiopic ? 'እስከ' : 'Due'} {proj.deadline}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {isEthiopic ? proj.titleAm : proj.titleEn}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3">
                      {isEthiopic ? proj.descriptionAm : proj.descriptionEn}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">
                          {proj.collectedBirr.toLocaleString()} ETB
                        </span>
                        <span className="text-cyan-700 font-mono-numbers">
                          {progressPercent}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-600 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>{t.contribTarget} {proj.targetBirr.toLocaleString()} ETB</span>
                        <span>{proj.contributorsCount} {t.contributors}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-6">
                    <button
                      onClick={() => setSelectedProject(proj)}
                      className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2 whitespace-nowrap shrink-0 shadow-xs"
                    >
                      <HeartHandshake className="w-4 h-4 text-cyan-400" />
                      {t.contributeBtn}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PAYMENT GATEWAY MODAL (Telebirr / CBE Birr / Chapa) */}
      {isPayingBill && selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider block mb-0.5">
                  {t.paymentModalTitle}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedBill.customerName}
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {selectedBill.meterNumber} · {selectedBill.totalBirr.toFixed(2)} ETB
                </span>
              </div>
              <button
                onClick={() => setIsPayingBill(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecutePayment} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  {t.choosePaymentMethod}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Telebirr */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('telebirr')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                      paymentMethod === 'telebirr'
                        ? 'border-emerald-600 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-emerald-800">telebirr</span>
                    <span className="text-[10px] text-slate-500">ቴሌብር ፈጣን ክፍያ</span>
                  </button>

                  {/* CBE Birr */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cbe_birr')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                      paymentMethod === 'cbe_birr'
                        ? 'border-purple-600 bg-purple-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-purple-900">CBE Birr</span>
                    <span className="text-[10px] text-slate-500">ንግድ ባንክ ብር</span>
                  </button>

                  {/* Chapa */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('chapa')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                      paymentMethod === 'chapa'
                        ? 'border-cyan-600 bg-cyan-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-cyan-800">Chapa / Card</span>
                    <span className="text-[10px] text-slate-500">ቻፓ እና ቪዛ ካርድ</span>
                  </button>

                  {/* Awash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('awash_bank')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                      paymentMethod === 'awash_bank'
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-blue-900">Awash Birr</span>
                    <span className="text-[10px] text-slate-500">አዋሽ ባንክ</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.enterPhoneForPayment}
                </label>
                <input
                  type="tel"
                  required
                  value={paymentPhone}
                  onChange={(e) => setPaymentPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono-numbers focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>

              {/* Total to deduct */}
              <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-600">{t.totalPayable}:</span>
                <span className="text-base font-extrabold text-slate-900 font-mono-numbers">
                  {selectedBill.totalBirr.toFixed(2)} ETB
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPayingBill(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-100"
                >
                  {t.closeModal}
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 bg-cyan-700 text-white text-xs font-semibold rounded-lg hover:bg-cyan-800 disabled:opacity-50 transition flex items-center gap-1.5 shadow-sm"
                >
                  {isProcessing ? (
                    <span>{t.processingPayment}</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      {t.confirmAndPay}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTRIBUTION MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider block mb-0.5">
                  {lang === 'am' ? 'የማህበረሰብ የልማት መዋጮ' : 'Community Fund Contribution'}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {lang === 'am' ? selectedProject.titleAm : selectedProject.titleEn}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {contribSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  {t.paymentSuccessTitle}
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  {t.thankYouContribution}
                </p>
              </div>
            ) : (
              <form onSubmit={handleExecuteContribution} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'am' ? 'የለጋሽ ስም (አማራጭ)' : 'Contributor Name (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    placeholder={lang === 'am' ? 'ስምዎን እዚህ ያስገቡ...' : 'Enter your name...'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    {t.customAmountBirr}
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[200, 500, 1000, 5000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setContribAmount(amt)}
                        className={`py-1.5 text-xs font-mono font-bold rounded-lg border transition ${
                          contribAmount === amt
                            ? 'border-cyan-700 bg-cyan-50 text-cyan-800'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {amt} ETB
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={contribAmount}
                    onChange={(e) => setContribAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono-numbers text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-100"
                  >
                    {t.closeModal}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-700 text-white text-xs font-semibold rounded-lg hover:bg-cyan-800 transition flex items-center gap-1.5 shadow-sm"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    {lang === 'am' ? `በቴሌብር ${contribAmount} ብር አበርክት` : `Contribute ${contribAmount} ETB`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PRINTABLE OFFICIAL RECEIPT MODAL */}
      {completedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {lang === 'am' ? 'ይፋዊ ዲጂታል የክፍያ ደረሰኝ' : 'Official Digital Payment Receipt'}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {translations[lang].agencyName}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setCompletedReceipt(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Paper Area */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/60 font-sans space-y-4">
              <div className="flex justify-between items-start text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">{t.receiptNumber}</span>
                  <span className="font-mono font-bold text-slate-800">
                    {completedReceipt.receiptNumber || 'REC-2026-90412'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">{t.transactionRef}</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {completedReceipt.transactionRef || 'TEL-88492019'}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.customerName}:</span>
                  <span className="font-semibold text-slate-800">{completedReceipt.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.meterNumber}:</span>
                  <span className="font-mono text-slate-800">{completedReceipt.meterNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.billingPeriod}:</span>
                  <span className="text-slate-800">{completedReceipt.billingPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.consumption}:</span>
                  <span className="font-mono-numbers text-slate-800">{completedReceipt.consumptionM3} m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'am' ? 'የተከፈለበት ቀን:' : 'Payment Timestamp:'}</span>
                  <span className="text-slate-800">{new Date(completedReceipt.paidAt || Date.now()).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-slate-300 pt-3 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">{lang === 'am' ? 'ጠቅላላ የተከፈለ' : 'Total Paid'}</span>
                  <span className="text-lg font-extrabold text-slate-900 font-mono-numbers">
                    {completedReceipt.totalBirr.toFixed(2)} ETB
                  </span>
                </div>
                <div className="w-16 h-16 bg-white p-1 rounded border border-slate-200 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-800" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-black transition flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                {lang === 'am' ? 'ደረሰኝ አትም / Print' : 'Print Receipt'}
              </button>
              <button
                onClick={() => setCompletedReceipt(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                {t.closeModal}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
