import fs from 'fs';
import path from 'path';
import {
  BillRecord,
  IncidentReport,
  WaterSchedule,
  ContributionProject,
  InnovationIdea,
  EmergencyNotice,
  TankerRequest,
  CustomerRecord,
  WaterUtilityOffice,
  TechnicianProfile
} from '../src/types';
import {
  INITIAL_BILLS,
  INITIAL_INCIDENTS,
  INITIAL_SCHEDULES,
  INITIAL_CONTRIBUTIONS,
  INITIAL_IDEAS,
  INITIAL_NOTICES
} from '../src/data/mockData';
import { INITIAL_UTILITIES } from '../src/data/regionsData';

export interface WebhookLog {
  id: string;
  provider: 'chapa' | 'telebirr' | 'cbe_birr';
  event: string;
  txRef: string;
  meterNumber: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed';
  receivedAt: string;
  payload: any;
}

export interface DatabaseSchema {
  customers: CustomerRecord[];
  bills: BillRecord[];
  incidents: IncidentReport[];
  schedules: WaterSchedule[];
  contributions: ContributionProject[];
  ideas: InnovationIdea[];
  notices: EmergencyNotice[];
  tankers: TankerRequest[];
  utilities: WaterUtilityOffice[];
  technicians: TechnicianProfile[];
  subscribers: { scheduleId: string; phone: string; subscribedAt: string }[];
  webhookLogs: WebhookLog[];
}

const DB_PATH = path.resolve('data/aquaflow_db.json');

// Initial seed customer records matching initial bills across multiple regions
const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'CUST-8812',
    meterId: 'MTR-09412',
    fullName: 'አበበ ተፈራ ገብረመድህን',
    phone: '0911245678',
    country: 'Ethiopia',
    region: 'Addis Ababa',
    city: 'Addis Ababa',
    subCity: 'ቦሌ',
    kebele: 'ቀበሌ 04',
    houseNumber: '142',
    nationalIdNumber: 'ETH-ID-99201',
    propertyType: 'residential',
    currentBill: 395.50,
    currency: 'ETB',
    lastReadingM3: 434,
    meterStatus: 'active',
    registeredAt: '2025-01-10T08:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'CUST-4401',
    meterId: 'MTR-10294',
    fullName: 'ወ/ሮ ትእግስት አስፋው',
    phone: '0922887766',
    country: 'Ethiopia',
    region: 'Addis Ababa',
    city: 'Addis Ababa',
    subCity: 'የካ',
    kebele: 'ቀበሌ 08',
    houseNumber: '891',
    nationalIdNumber: 'ETH-ID-77291',
    propertyType: 'residential',
    currentBill: 313.00,
    currency: 'ETB',
    lastReadingM3: 198,
    meterStatus: 'active',
    registeredAt: '2025-02-14T10:30:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'CUST-3904',
    meterId: 'MTR-04821',
    fullName: 'ዶ/ር ሰለሞን ሀይሉ',
    phone: '0933551122',
    country: 'Ethiopia',
    region: 'Addis Ababa',
    city: 'Addis Ababa',
    subCity: 'ቂርቆስ',
    kebele: 'ቀበሌ 15',
    houseNumber: '302',
    nationalIdNumber: 'ETH-ID-44120',
    propertyType: 'commercial',
    currentBill: 0,
    currency: 'ETB',
    lastReadingM3: 675,
    meterStatus: 'active',
    registeredAt: '2025-03-01T09:15:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'CUST-7721',
    meterId: 'MTR-ETH-OROMIA-0129',
    fullName: 'ጫላ ጉቱ በዳኔ',
    phone: '0911776655',
    country: 'Ethiopia',
    region: 'Oromia Region',
    city: 'Adama',
    subCity: 'ቦሌ ዞን',
    kebele: 'ቀበሌ 03',
    houseNumber: '55B',
    nationalIdNumber: 'ETH-OR-55019',
    propertyType: 'residential',
    currentBill: 275.00,
    currency: 'ETB',
    lastReadingM3: 215,
    meterStatus: 'active',
    registeredAt: '2025-04-12T11:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'CUST-5510',
    meterId: 'MTR-ETH-AMHARA-0881',
    fullName: 'ሙሉቀን ደሴ ካሳ',
    phone: '0918334455',
    country: 'Ethiopia',
    region: 'Amhara Region',
    city: 'Bahir Dar',
    subCity: 'ቀበሌ 04 (ጣና)',
    kebele: 'ቀበሌ 04',
    houseNumber: '081',
    nationalIdNumber: 'ETH-AM-33104',
    propertyType: 'residential',
    currentBill: 340.00,
    currency: 'ETB',
    lastReadingM3: 310,
    meterStatus: 'active',
    registeredAt: '2025-05-18T14:20:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'CUST-9902',
    meterId: 'MTR-ETH-TIGRAY-0412',
    fullName: 'በርሄ ገብረማሪያም ሀድጉ',
    phone: '0914228899',
    country: 'Ethiopia',
    region: 'Tigray Region',
    city: 'Mekelle',
    subCity: 'ሓወልቲ',
    kebele: 'ቀበሌ 02',
    houseNumber: '211',
    nationalIdNumber: 'ETH-TI-11029',
    propertyType: 'residential',
    currentBill: 190.00,
    currency: 'ETB',
    lastReadingM3: 164,
    meterStatus: 'active',
    registeredAt: '2025-06-02T13:45:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'CUST-1049',
    meterId: 'MTR-GLOBAL-INTL-9041',
    fullName: 'Samuel K. Yohannes (Diaspora Partner)',
    phone: '+1 202 555 0194',
    country: 'International',
    region: 'International & Diaspora Global Network',
    city: 'North America (USA & Canada)',
    subCity: 'DMV Metro',
    kebele: 'Global Ward 1',
    houseNumber: '8801',
    nationalIdNumber: 'US-PASS-09281',
    propertyType: 'public_institution',
    currentBill: 0,
    currency: 'USD',
    lastReadingM3: 50,
    meterStatus: 'active',
    registeredAt: '2025-07-20T16:00:00.000Z',
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_TECHNICIANS: TechnicianProfile[] = [
  {
    id: 'tech-01',
    fullName: 'አቶ ታሪኩ በቀለ (ከፍተኛ ቧንቧ መሀንዲስ)',
    phone: '0911445566',
    country: 'Ethiopia',
    region: 'Addis Ababa',
    city: 'Addis Ababa',
    specialization: 'Mainline Leak & Burst Repair',
    licenseNumber: 'TECH-AA-9901',
    utilityAffiliation: 'AAWSA-HQ',
    status: 'available',
    registeredAt: '2025-01-05T08:00:00.000Z'
  },
  {
    id: 'tech-02',
    fullName: 'ገመቹ ዲንቃ (የግፊትና ቫልቭ ቁጥጥር)',
    phone: '0922114477',
    country: 'Ethiopia',
    region: 'Oromia Region',
    city: 'Adama',
    specialization: 'Pressure & Distribution Valve Specialist',
    licenseNumber: 'TECH-OR-8821',
    utilityAffiliation: 'OWEB-REG',
    status: 'available',
    registeredAt: '2025-02-10T09:30:00.000Z'
  },
  {
    id: 'tech-03',
    fullName: 'አብርሃም ንጉሴ (ዲጂታል ቆጣሪ ጥገና)',
    phone: '0918776633',
    country: 'Ethiopia',
    region: 'Amhara Region',
    city: 'Bahir Dar',
    specialization: 'Digital Meter Calibration & IoT Sensors',
    licenseNumber: 'TECH-AM-4412',
    utilityAffiliation: 'AWEB-REG',
    status: 'available',
    registeredAt: '2025-03-12T10:15:00.000Z'
  }
];

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      const dataDir = path.dirname(DB_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(DB_PATH)) {
        const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        // Ensure new collections exist even on legacy files
        if (!parsed.utilities || parsed.utilities.length === 0) parsed.utilities = INITIAL_UTILITIES;
        if (!parsed.technicians || parsed.technicians.length === 0) parsed.technicians = INITIAL_TECHNICIANS;
        if (!parsed.customers || parsed.customers.length === 0) parsed.customers = INITIAL_CUSTOMERS;
        return parsed;
      }
    } catch (err) {
      console.warn('Could not read existing database file, initializing defaults:', err);
    }

    const defaultData: DatabaseSchema = {
      customers: INITIAL_CUSTOMERS,
      bills: INITIAL_BILLS,
      incidents: INITIAL_INCIDENTS,
      schedules: INITIAL_SCHEDULES,
      contributions: INITIAL_CONTRIBUTIONS,
      ideas: INITIAL_IDEAS,
      notices: INITIAL_NOTICES,
      tankers: [],
      utilities: INITIAL_UTILITIES,
      technicians: INITIAL_TECHNICIANS,
      subscribers: [
        { scheduleId: 'sch-1', phone: '0911223344', subscribedAt: new Date().toISOString() },
        { scheduleId: 'sch-2', phone: '0922334455', subscribedAt: new Date().toISOString() }
      ],
      webhookLogs: []
    };

    this.save(defaultData);
    return defaultData;
  }

  private save(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // --- Customer Registration & Lookup ---
  public getCustomers(filter?: { region?: string; country?: string; search?: string }) {
    let list = this.data.customers;
    if (filter?.country && filter.country !== 'all') {
      list = list.filter(c => c.country.toLowerCase() === filter.country!.toLowerCase());
    }
    if (filter?.region && filter.region !== 'all') {
      list = list.filter(c => c.region.toLowerCase().includes(filter.region!.toLowerCase()));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(c =>
        c.meterId.toLowerCase().includes(q) ||
        c.fullName.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public registerCustomer(cust: Partial<CustomerRecord>) {
    // Generate regional meter ID
    const regionPrefix = (cust.region || 'ETH')
      .replace(/[^a-zA-Z]/g, '')
      .toUpperCase()
      .slice(0, 6) || 'ETH';
    const randomSeq = Math.floor(10000 + Math.random() * 90000);
    const meterId = cust.meterId?.trim() ? cust.meterId.trim().toUpperCase() : `MTR-${regionPrefix}-${randomSeq}`;

    // Check if meter already registered
    const existing = this.data.customers.find(c => c.meterId.toUpperCase() === meterId.toUpperCase());
    if (existing) {
      throw new Error(`ይህ የቆጣሪ ቁጥር (${meterId}) አስቀድሞ በሲስተሙ ተመዝግቧል!`);
    }

    const newCustomer: CustomerRecord = {
      id: `CUST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      meterId,
      fullName: cust.fullName || 'አዲስ የተመዘገበ ደንበኛ',
      phone: cust.phone || '0911000000',
      country: cust.country || 'Ethiopia',
      region: cust.region || 'Addis Ababa',
      city: cust.city || 'Addis Ababa',
      subCity: cust.subCity || '',
      kebele: cust.kebele || 'ቀበሌ 01',
      houseNumber: cust.houseNumber || '',
      nationalIdNumber: cust.nationalIdNumber || '',
      propertyType: cust.propertyType || 'residential',
      currentBill: 0,
      currency: cust.currency || 'ETB',
      lastReadingM3: Number(cust.lastReadingM3 || 0),
      meterStatus: 'active',
      gpsCoordinates: cust.gpsCoordinates,
      registeredAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.customers.unshift(newCustomer);

    // Create initial welcome bill record
    const welcomeBill: BillRecord = {
      id: `bill-${Date.now()}`,
      customerId: newCustomer.id,
      customerName: newCustomer.fullName,
      customerPhone: newCustomer.phone,
      meterNumber: newCustomer.meterId,
      subCity: newCustomer.subCity || newCustomer.city,
      kebele: newCustomer.kebele,
      billingPeriod: 'የመጀመሪያ ምዝገባ 2026',
      previousReadingM3: 0,
      currentReadingM3: newCustomer.lastReadingM3,
      consumptionM3: 0,
      amountBirr: 0,
      sanitationFeeBirr: 0,
      meterRentBirr: 0,
      totalBirr: 0,
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'paid',
      paidAt: new Date().toISOString(),
      paymentMethod: 'telebirr',
      receiptNumber: `REC-REG-${randomSeq}`,
      transactionRef: `REG-ZERO-${Date.now()}`
    };

    this.data.bills.unshift(welcomeBill);
    this.save(this.data);
    return newCustomer;
  }

  // --- Water Utilities Registration ---
  public getUtilities() {
    return this.data.utilities;
  }

  public registerUtility(util: Partial<WaterUtilityOffice>) {
    const code = util.code?.trim() ? util.code.trim().toUpperCase() : `WTR-${Date.now().toString().slice(-5)}`;
    const newUtility: WaterUtilityOffice = {
      id: `util-${Date.now()}`,
      nameAm: util.nameAm || 'አዲስ የውሃ ጽ/ቤት',
      nameEn: util.nameEn || 'New Regional Water Office',
      code,
      country: util.country || 'Ethiopia',
      region: util.region || 'Regional Authority',
      headquartersCity: util.headquartersCity || 'Main City',
      contactPhone: util.contactPhone || '0900000000',
      emergencyHotline: util.emergencyHotline || '939',
      directorName: util.directorName || 'ዋና ስራ አስኪያጅ',
      coverageZones: Array.isArray(util.coverageZones) ? util.coverageZones : ['ከተማ ማዕከል'],
      serviceLevel: util.serviceLevel || 'municipal',
      totalSubscribers: 1,
      registeredAt: new Date().toISOString(),
      isVerified: true
    };

    this.data.utilities.unshift(newUtility);
    this.save(this.data);
    return newUtility;
  }

  // --- Technician Registration ---
  public getTechnicians() {
    return this.data.technicians;
  }

  public registerTechnician(tech: Partial<TechnicianProfile>) {
    const newTechnician: TechnicianProfile = {
      id: `tech-${Date.now()}`,
      fullName: tech.fullName || 'የመስክ ባለሙያ',
      phone: tech.phone || '0900000000',
      country: tech.country || 'Ethiopia',
      region: tech.region || 'Addis Ababa',
      city: tech.city || 'Addis Ababa',
      specialization: tech.specialization || 'ቧንቧና ፍሳሽ ጥገና',
      licenseNumber: tech.licenseNumber || `LIC-${Math.floor(1000 + Math.random() * 9000)}`,
      utilityAffiliation: tech.utilityAffiliation || 'AAWSA-HQ',
      status: 'available',
      registeredAt: new Date().toISOString()
    };

    this.data.technicians.unshift(newTechnician);
    this.save(this.data);
    return newTechnician;
  }

  // --- Customers & Bills ---
  public getBills() {
    return this.data.bills;
  }

  public findBillByQuery(query: string) {
    const q = query.trim().toLowerCase();
    return this.data.bills.filter(b => 
      b.meterNumber.toLowerCase().includes(q) ||
      b.customerId.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q)
    );
  }

  public findCustomerByMeter(meterNumber: string) {
    const clean = meterNumber.trim().toUpperCase();
    return this.data.customers.find(c => c.meterId.toUpperCase() === clean);
  }

  public upsertCustomersBulk(records: Partial<CustomerRecord & BillRecord>[]) {
    let addedCount = 0;
    let updatedCount = 0;

    for (const rec of records) {
      if (!rec.meterNumber && !rec.meterId) continue;
      const meterId = (rec.meterNumber || rec.meterId)!.trim().toUpperCase();
      const existingCustomerIdx = this.data.customers.findIndex(c => c.meterId.toUpperCase() === meterId);

      const customerName = rec.customerName || rec.fullName || 'ውሃ ተጠቃሚ ደንበኛ';
      const region = rec.region || 'Addis Ababa';
      const city = rec.city || rec.subCity || 'ቦሌ';
      const subCity = rec.subCity || city;
      const kebele = rec.kebele || 'ቀበሌ 01';
      const phone = rec.customerPhone || rec.phone || '0911000000';
      const currentReading = Number(rec.currentReadingM3 || rec.lastReadingM3 || 100);
      const prevReading = Number(rec.previousReadingM3 || Math.max(0, currentReading - 20));
      const consumption = Math.max(1, currentReading - prevReading);
      const totalAmount = Number(rec.totalBirr || rec.currentBill || (consumption * 15 + 40));

      const customerEntry: CustomerRecord = {
        id: rec.customerId || rec.id || `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        meterId,
        fullName: customerName,
        phone,
        country: rec.country || 'Ethiopia',
        region,
        city,
        subCity,
        kebele,
        currentBill: totalAmount,
        currency: 'ETB',
        lastReadingM3: currentReading,
        meterStatus: 'active',
        registeredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (existingCustomerIdx >= 0) {
        this.data.customers[existingCustomerIdx] = customerEntry;
        updatedCount++;
      } else {
        this.data.customers.push(customerEntry);
        addedCount++;
      }

      // Upsert corresponding bill
      const existingBillIdx = this.data.bills.findIndex(b => b.meterNumber.toUpperCase() === meterId && b.status === 'unpaid');
      const billEntry: BillRecord = {
        id: `bill-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        customerId: customerEntry.id,
        customerName,
        customerPhone: phone,
        meterNumber: meterId,
        subCity,
        kebele,
        billingPeriod: rec.billingPeriod || `${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`,
        previousReadingM3: prevReading,
        currentReadingM3: currentReading,
        consumptionM3: consumption,
        amountBirr: Number((totalAmount * 0.85).toFixed(2)),
        sanitationFeeBirr: Number((totalAmount * 0.10).toFixed(2)),
        meterRentBirr: Number((totalAmount * 0.05).toFixed(2)),
        totalBirr: totalAmount,
        dueDate: rec.dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        status: 'unpaid'
      };

      if (existingBillIdx >= 0) {
        this.data.bills[existingBillIdx] = billEntry;
      } else {
        this.data.bills.unshift(billEntry);
      }
    }

    this.save(this.data);
    return { addedCount, updatedCount, totalInDatabase: this.data.customers.length };
  }

  public payBill(billId: string, paymentMethod: any, txRef: string) {
    const bill = this.data.bills.find(b => b.id === billId || b.meterNumber === billId);
    if (!bill) return null;

    bill.status = 'paid';
    bill.paidAt = new Date().toISOString();
    bill.paymentMethod = paymentMethod;
    bill.transactionRef = txRef;
    bill.receiptNumber = `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const customer = this.data.customers.find(c => c.meterId === bill.meterNumber);
    if (customer) {
      customer.currentBill = 0;
      customer.updatedAt = new Date().toISOString();
    }

    this.save(this.data);
    return bill;
  }

  // --- Incidents ---
  public getIncidents() {
    return this.data.incidents;
  }

  public addIncident(report: Omit<IncidentReport, 'id' | 'ticketNumber' | 'status' | 'createdAt'>) {
    const ticketNumber = `WTR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newIncident: IncidentReport = {
      ...report,
      id: `inc-${Date.now()}`,
      ticketNumber,
      status: 'submitted',
      createdAt: new Date().toISOString()
    };
    this.data.incidents.unshift(newIncident);
    this.save(this.data);
    return newIncident;
  }

  public updateIncident(id: string, updates: Partial<IncidentReport>) {
    const incident = this.data.incidents.find(i => i.id === id || i.ticketNumber === id);
    if (!incident) return null;

    Object.assign(incident, updates);
    if (updates.status === 'resolved' && !incident.resolvedAt) {
      incident.resolvedAt = new Date().toISOString();
    }
    this.save(this.data);
    return incident;
  }

  // --- Water Schedules ---
  public getSchedules() {
    return this.data.schedules;
  }

  public updateSchedule(id: string, status: WaterSchedule['status'], pressureBar: number) {
    const sch = this.data.schedules.find(s => s.id === id);
    if (!sch) return null;
    sch.status = status;
    sch.pressureBar = pressureBar;
    this.save(this.data);
    return sch;
  }

  public addSubscriber(scheduleId: string, phone: string) {
    this.data.subscribers.push({
      scheduleId,
      phone,
      subscribedAt: new Date().toISOString()
    });
    const sch = this.data.schedules.find(s => s.id === scheduleId);
    if (sch) sch.subscribersCount++;
    this.save(this.data);
    return true;
  }

  public getSubscribersBySchedule(scheduleId: string) {
    return this.data.subscribers.filter(s => s.scheduleId === scheduleId);
  }

  // --- Broadcast & Notices ---
  public getNotices() {
    return this.data.notices;
  }

  public addNotice(notice: Omit<EmergencyNotice, 'id' | 'publishedAt'>) {
    const newNotice: EmergencyNotice = {
      ...notice,
      id: `not-${Date.now()}`,
      publishedAt: new Date().toISOString()
    };
    this.data.notices.unshift(newNotice);
    this.save(this.data);
    return newNotice;
  }

  // --- Webhooks ---
  public logWebhook(webhook: Omit<WebhookLog, 'id' | 'receivedAt'>) {
    const entry: WebhookLog = {
      ...webhook,
      id: `wh-${Date.now()}`,
      receivedAt: new Date().toISOString()
    };
    this.data.webhookLogs.unshift(entry);
    this.save(this.data);
    return entry;
  }

  public getWebhookLogs() {
    return this.data.webhookLogs;
  }
}

export const db = new DatabaseManager();
