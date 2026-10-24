export type Language = 'am' | 'en' | 'om' | 'ti' | 'fr' | 'de' | 'zh';

export type FlowStatus = 'active_flowing' | 'upcoming' | 'maintenance' | 'offline';

export interface CommunityComment {
  id: string;
  author: string;
  text: string;
  date: string;
  isStaff?: boolean;
}

export interface WaterSchedule {
  id: string;
  subCityAm: string;
  subCityEn: string;
  zoneNameAm: string;
  zoneNameEn: string;
  kebeles: string[];
  status: FlowStatus;
  nextFlowStart: string; // ISO string or relative time
  nextFlowEnd: string;
  pressureBar: number; // e.g. 3.4 bar
  reservoirLevelPercent: number; // e.g. 78%
  subscribersCount: number;
  noticeAm?: string;
  noticeEn?: string;
  flowDaysAm: string;
  flowDaysEn: string;
  flowHoursAm: string;
  flowHoursEn: string;
  likesCount?: number;
  hasLiked?: boolean;
  sharesCount?: number;
  comments?: CommunityComment[];
}

export interface BillRecord {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  meterNumber: string;
  subCity: string;
  kebele: string;
  billingPeriod: string;
  previousReadingM3: number;
  currentReadingM3: number;
  consumptionM3: number;
  amountBirr: number;
  sanitationFeeBirr: number;
  meterRentBirr: number;
  totalBirr: number;
  dueDate: string;
  status: 'unpaid' | 'paid';
  paidAt?: string;
  paymentMethod?: 'telebirr' | 'cbe_birr' | 'chapa' | 'awash_bank' | 'cash';
  receiptNumber?: string;
  transactionRef?: string;
}

export interface ContributionProject {
  id: string;
  titleAm: string;
  titleEn: string;
  descriptionAm: string;
  descriptionEn: string;
  subCityAm: string;
  subCityEn: string;
  category: 'pipe_expansion' | 'well_drilling' | 'school_water' | 'reservoir_upgrade';
  targetBirr: number;
  collectedBirr: number;
  contributorsCount: number;
  deadline: string;
  organizerAm: string;
  organizerEn: string;
  status: 'active' | 'completed';
}

export interface IncidentReport {
  id: string;
  ticketNumber: string;
  reporterName: string;
  reporterPhone: string;
  subCityAm: string;
  subCityEn: string;
  woreda?: string;
  specificLocation: string;
  category: 'pipe_burst' | 'water_contamination' | 'low_pressure' | 'meter_breakdown' | 'illegal_connection' | 'sewer_overflow';
  urgency: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  photoUrl?: string;
  videoUrl?: string;
  audioVoiceUrl?: string;
  status: 'submitted' | 'assigned' | 'in_progress' | 'resolved';
  createdAt: string;
  gpsCoordinates?: { latitude: number; longitude: number; accuracy?: number };
  assignedTechnician?: string;
  technicianPhone?: string;
  resolutionNotes?: string;
  resolutionPhotoUrl?: string;
  resolvedAt?: string;
}

export interface InnovationIdea {
  id: string;
  titleAm: string;
  titleEn: string;
  authorName: string;
  authorRoleAm: string;
  authorRoleEn: string;
  category: 'conservation' | 'rainwater' | 'tech_efficiency' | 'leak_prevention' | 'policy';
  summaryAm: string;
  summaryEn: string;
  detailsAm: string;
  detailsEn: string;
  upvotes: number;
  hasUpvoted?: boolean;
  sharesCount?: number;
  status: 'community_proposal' | 'utility_reviewed' | 'adopted_in_field';
  submittedAt: string;
  comments: {
    id: string;
    author: string;
    text: string;
    date: string;
    isStaff?: boolean;
  }[];
}

export interface TankerRequest {
  id: string;
  referenceNumber: string;
  applicantName: string;
  phone: string;
  subCity: string;
  kebele: string;
  exactAddress: string;
  purpose: 'household_emergency' | 'wedding_ceremony' | 'memorial_mourning' | 'medical_center' | 'construction';
  volumeLiters: 5000 | 10000;
  preferredDate: string;
  deliveryTimeSlot: string;
  status: 'pending' | 'approved_dispatched' | 'completed';
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  truckPlateNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface EmergencyNotice {
  id: string;
  titleAm: string;
  titleEn: string;
  messageAm: string;
  messageEn: string;
  severity: 'urgent' | 'warning' | 'info';
  affectedAreasAm: string;
  affectedAreasEn: string;
  publishedAt: string;
  active: boolean;
}

export interface CustomerRecord {
  id: string;
  meterId: string;
  fullName: string;
  phone: string;
  country: string;
  region: string;
  city: string;
  woreda?: string;
  subCity?: string;
  kebele: string;
  houseNumber?: string;
  nationalIdNumber?: string;
  propertyType?: 'residential' | 'commercial' | 'industrial' | 'agricultural' | 'public_institution';
  currentBill: number;
  currency?: string;
  lastReadingM3: number;
  meterStatus: 'active' | 'pending_verification' | 'faulty' | 'disconnected';
  gpsCoordinates?: { latitude: number; longitude: number; accuracy?: number };
  registeredAt: string;
  updatedAt: string;
}

export interface WaterUtilityOffice {
  id: string;
  nameAm: string;
  nameEn: string;
  code: string;
  country: string;
  region: string;
  headquartersCity: string;
  contactPhone: string;
  emergencyHotline: string;
  directorName: string;
  coverageZones: string[];
  serviceLevel: 'municipal' | 'regional' | 'national' | 'international';
  totalSubscribers: number;
  registeredAt: string;
  isVerified: boolean;
}

export interface TechnicianProfile {
  id: string;
  fullName: string;
  phone: string;
  country: string;
  region: string;
  city: string;
  specialization: string;
  licenseNumber: string;
  utilityAffiliation?: string;
  status: 'available' | 'on_duty' | 'off_duty';
  registeredAt: string;
}

