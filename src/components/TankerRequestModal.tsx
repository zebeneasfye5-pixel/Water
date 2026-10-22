import React, { useState } from 'react';
import { Truck, X, CheckCircle2, Calendar, Phone, MapPin, Droplet, Clock } from 'lucide-react';
import { Language, TankerRequest } from '../types';
import { translations } from '../utils/translations';

interface TankerRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onRequestSubmitted: (request: Omit<TankerRequest, 'id' | 'referenceNumber' | 'status' | 'createdAt'>) => string;
}

export const TankerRequestModal: React.FC<TankerRequestModalProps> = ({
  isOpen,
  onClose,
  lang,
  onRequestSubmitted
}) => {
  const t = translations[lang];
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [subCity, setSubCity] = useState('ቦሌ');
  const [kebele, setKebele] = useState('ቀበሌ 03');
  const [exactAddress, setExactAddress] = useState('');
  const [purpose, setPurpose] = useState<TankerRequest['purpose']>('household_emergency');
  const [volumeLiters, setVolumeLiters] = useState<5000 | 10000>(5000);
  const [preferredDate, setPreferredDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('09:00 AM - 12:00 PM');
  const [notes, setNotes] = useState('');

  const [createdRef, setCreatedRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !phone.trim() || !exactAddress.trim()) return;

    const ref = onRequestSubmitted({
      applicantName,
      phone,
      subCity,
      kebele,
      exactAddress,
      purpose,
      volumeLiters,
      preferredDate,
      deliveryTimeSlot,
      notes
    });

    setCreatedRef(ref);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150 space-y-5">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider block">
                {lang === 'am' ? 'የአደጋ ጊዜ አገልግሎት' : 'Emergency Logistics'}
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {t.tankerTitle}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {createdRef ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {t.tankerRequestedSuccess}
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-w-xs mx-auto">
              <span className="text-[11px] text-slate-500 block">
                {lang === 'am' ? 'የትዕዛዝ መለያ ቁጥር:' : 'Booking Reference:'}
              </span>
              <span className="text-base font-mono font-bold text-cyan-800">
                {createdRef}
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {lang === 'am'
                ? 'የቦቴ መኪናው በጠየቁት ሰዓት ወደ አድራሻዎ እንዲመጣ የጽህፈት ቤቱ የስምሪት አስተባባሪ በስልክ ያነጋግርዎታል።'
                : 'The dispatch supervisor will contact you to verify coordinates and delivery timing.'}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-cyan-700 text-white rounded-lg text-xs font-semibold hover:bg-cyan-800 transition"
            >
              {t.closeModal}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.tankerSubtitle}
            </p>

            {/* Purpose */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.tankerPurpose} *
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
              >
                <option value="household_emergency">{t.purposeShortage}</option>
                <option value="wedding_ceremony">{t.purposeWedding}</option>
                <option value="memorial_mourning">{t.purposeMemorial}</option>
                <option value="medical_center">{t.purposeClinic}</option>
              </select>
            </div>

            {/* Volume selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {t.tankerVolume} *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVolumeLiters(5000)}
                  className={`p-3 rounded-xl border text-left transition ${
                    volumeLiters === 5000
                      ? 'border-cyan-700 bg-cyan-50/60 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Droplet className="w-4 h-4 text-cyan-700 mb-1" />
                  <span className="text-xs font-bold block text-slate-900">{t.vol5k}</span>
                  <span className="text-[10px] text-slate-500">ለመኖሪያ ቤት እና ለአነስተኛ አገልግሎት</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVolumeLiters(10000)}
                  className={`p-3 rounded-xl border text-left transition ${
                    volumeLiters === 10000
                      ? 'border-cyan-700 bg-cyan-50/60 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Truck className="w-4 h-4 text-cyan-700 mb-1" />
                  <span className="text-xs font-bold block text-slate-900">{t.vol10k}</span>
                  <span className="text-[10px] text-slate-500">ለሰርግ፣ ለለቅሶ ወይም ለተቋማት</span>
                </button>
              </div>
            </div>

            {/* Applicant details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.reporterNameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="ስም..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.reporterPhoneLabel} *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0911223344"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono-numbers text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.subCityLabel}
                </label>
                <select
                  value={subCity}
                  onChange={(e) => setSubCity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                >
                  <option value="ቦሌ">ቦሌ (Bole)</option>
                  <option value="የካ">የካ (Yeka)</option>
                  <option value="ቂርቆስ">ቂርቆስ (Kirkos)</option>
                  <option value="አራዳ">አራዳ (Arada)</option>
                  <option value="ንፋስ ስልክ">ንፋስ ስልክ ላፍቶ</option>
                  <option value="ኮልፌ ቀራኒዮ">ኮልፌ ቀራኒዮ</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'am' ? 'ቀበሌ / ወረዳ' : 'Kebele / Woreda'}
                </label>
                <input
                  type="text"
                  value={kebele}
                  onChange={(e) => setKebele(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.exactLocationLabel} *
              </label>
              <input
                type="text"
                required
                value={exactAddress}
                onChange={(e) => setExactAddress(e.target.value)}
                placeholder={lang === 'am' ? 'ምሳሌ፡ ገርጂ መብራት ኃይል አጠገብ፣ የቤት ቁጥር 120...' : 'e.g. Near Gerji Power Station, House 120...'}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
              />
            </div>

            {/* Date and Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.preferredDeliveryDate}
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'am' ? 'የሰዓት ምርጫ' : 'Time Slot'}
                </label>
                <select
                  value={deliveryTimeSlot}
                  onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                >
                  <option value="08:00 AM - 11:00 AM">08:00 AM - 11:00 AM (ጠዋት)</option>
                  <option value="11:00 AM - 02:00 PM">11:00 AM - 02:00 PM (ቀትር)</option>
                  <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM (ከሰዓት)</option>
                  <option value="06:00 PM - 09:00 PM">06:00 PM - 09:00 PM (ምሽት)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-100"
              >
                {t.closeModal}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-700 text-white text-xs font-bold rounded-lg hover:bg-cyan-800 transition shadow-sm flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4" />
                {t.requestTankerBtn}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
