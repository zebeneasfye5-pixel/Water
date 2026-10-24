import { BillRecord, IncidentReport, CustomerRecord, WaterSchedule } from '../types';

/**
 * Utility to export datasets to Excel-compatible CSV files with UTF-8 BOM (\uFEFF)
 * This guarantees proper Ge'ez/Amharic character rendering in Microsoft Excel, Apple Numbers, LibreOffice Calc, and Google Sheets.
 */

function downloadCsv(content: string, filename: string) {
  // \uFEFF is the UTF-8 Byte Order Mark (BOM) needed by Excel to interpret UTF-8
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsvCell(value: any): string {
  if (value === null || value === undefined) return '""';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return `"${stringValue}"`;
}

/**
 * 1. Export Bills & Payments to Excel
 */
export function exportBillsToExcel(bills: BillRecord[], filename = 'AquaFlow_የውሃ_ክፍያ_መረጃዎች_Excel') {
  const headers = [
    'የሂሳብ መለያ (Bill ID)',
    'የደንበኛ መለያ (Customer ID)',
    'የደንበኛ ሙሉ ስም (Customer Name)',
    'ስልክ ቁጥር (Phone)',
    'የቆጣሪ ቁጥር (Meter Number)',
    'ክፍለ ከተማ / ከተማ (Subcity/City)',
    'ቀበሌ (Kebele)',
    'የሂሳብ ወቅት (Period)',
    'ያለፈው ንባብ ሜ³ (Previous Reading)',
    'የአሁኑ ንባብ ሜ³ (Current Reading)',
    'ፍጆታ ሜ³ (Consumption)',
    'መሰረታዊ የውሃ ክፍያ ብር (Base Amount)',
    'የሳኒቴሽን ክፍያ ብር (Sanitation Fee)',
    'የቆጣሪ ኪራይ ብር (Meter Rent)',
    'ጠቅላላ የሚከፈል ብር (Total Birr)',
    'የመክፈያ የመጨረሻ ቀን (Due Date)',
    'የክፍያ ሁኔታ (Status)',
    'የተከፈለበት ቀን (Paid At)',
    'የክፍያ መንገድ (Payment Method)',
    'የደረሰኝ ቁጥር (Receipt No)',
    'የግብይት መለያ (Transaction Ref)'
  ];

  const rows = bills.map(b => [
    escapeCsvCell(b.id),
    escapeCsvCell(b.customerId),
    escapeCsvCell(b.customerName),
    escapeCsvCell(b.customerPhone),
    escapeCsvCell(b.meterNumber),
    escapeCsvCell(b.subCity),
    escapeCsvCell(b.kebele),
    escapeCsvCell(b.billingPeriod),
    escapeCsvCell(b.previousReadingM3),
    escapeCsvCell(b.currentReadingM3),
    escapeCsvCell(b.consumptionM3),
    escapeCsvCell(b.amountBirr.toFixed(2)),
    escapeCsvCell(b.sanitationFeeBirr.toFixed(2)),
    escapeCsvCell(b.meterRentBirr.toFixed(2)),
    escapeCsvCell(b.totalBirr.toFixed(2)),
    escapeCsvCell(b.dueDate),
    escapeCsvCell(b.status === 'paid' ? 'የተከፈለ (Paid)' : 'ያልተከፈለ (Unpaid)'),
    escapeCsvCell(b.paidAt || '-'),
    escapeCsvCell(b.paymentMethod || '-'),
    escapeCsvCell(b.receiptNumber || '-'),
    escapeCsvCell(b.transactionRef || '-')
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCsv(csvContent, `${filename}_${dateStr}.csv`);
}

/**
 * 2. Export Incident Reports to Excel
 */
export function exportIncidentsToExcel(incidents: IncidentReport[], filename = 'AquaFlow_የብልሽት_ሪፖርቶች_Excel') {
  const headers = [
    'የቲኬት ቁጥር (Ticket Number)',
    'አመልክች ስም (Reporter Name)',
    'ስልክ ቁጥር (Phone)',
    'ክፍለ ከተማ / ከተማ (Subcity/City)',
    'ቀበሌ / ወረዳ (Kebele/Woreda)',
    'ትክክለኛ አድራሻ (Exact Location)',
    'የብልሽት ዘርፍ (Category)',
    'የአስቸኳይነት ደረጃ (Urgency)',
    'የሁኔታ መግለጫ (Description)',
    'የአቤቱታው ሁኔታ (Status)',
    'የተመዘገበበት ቀን (Date Reported)',
    'የተመደበ ቴክኒሻን (Assigned Technician)',
    'የቴክኒሻን ስልክ (Technician Phone)',
    'የመፍትሄ ማስታወሻ (Resolution Notes)',
    'የተጠናቀቀበት ቀን (Resolved At)',
    'GPS መገኛ (Coordinates)'
  ];

  const rows = incidents.map(inc => [
    escapeCsvCell(inc.ticketNumber),
    escapeCsvCell(inc.reporterName),
    escapeCsvCell(inc.reporterPhone),
    escapeCsvCell(inc.subCityAm),
    escapeCsvCell(inc.woreda || '-'),
    escapeCsvCell(inc.specificLocation),
    escapeCsvCell(inc.category),
    escapeCsvCell(inc.urgency),
    escapeCsvCell(inc.description),
    escapeCsvCell(inc.status),
    escapeCsvCell(new Date(inc.createdAt).toLocaleString()),
    escapeCsvCell(inc.assignedTechnician || 'ያልተመደበ'),
    escapeCsvCell(inc.technicianPhone || '-'),
    escapeCsvCell(inc.resolutionNotes || '-'),
    escapeCsvCell(inc.resolvedAt ? new Date(inc.resolvedAt).toLocaleString() : '-'),
    escapeCsvCell(inc.gpsCoordinates ? `${inc.gpsCoordinates.latitude.toFixed(6)}, ${inc.gpsCoordinates.longitude.toFixed(6)}` : 'የለም')
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCsv(csvContent, `${filename}_${dateStr}.csv`);
}

/**
 * 3. Export Registered Customers to Excel
 */
export function exportCustomersToExcel(customers: CustomerRecord[], filename = 'AquaFlow_የተመዘገቡ_ደንበኞች_Excel') {
  const headers = [
    'የቆጣሪ መለያ ቁጥር (Meter ID)',
    'ሙሉ ስም (Full Name)',
    'ስልክ ቁጥር (Phone Number)',
    'ሀገር (Country)',
    'ክልል (Region)',
    'ከተማ / ዞን (City/Zone)',
    'ክፍለ ከተማ (Subcity)',
    'ወረዳ (Woreda)',
    'ቀበሌ (Kebele)',
    'የቤት ቁጥር (House Number)',
    'ብሔራዊ መታወቂያ / ፈቃድ (National ID)',
    'የይዞታ ዓይነት (Property Type)',
    'የቆጣሪ ሁኔታ (Meter Status)',
    'የመጨረሻ ንባብ ሜ³ (Last Reading)',
    'ያልተከፈለ ቀሪ ሂሳብ ብር (Current Balance)',
    'የተመዘገበበት ቀን (Registration Date)'
  ];

  const rows = customers.map(c => [
    escapeCsvCell(c.meterId),
    escapeCsvCell(c.fullName),
    escapeCsvCell(c.phone),
    escapeCsvCell(c.country),
    escapeCsvCell(c.region),
    escapeCsvCell(c.city),
    escapeCsvCell(c.subCity || '-'),
    escapeCsvCell(c.woreda || '-'),
    escapeCsvCell(c.kebele),
    escapeCsvCell(c.houseNumber || '-'),
    escapeCsvCell(c.nationalIdNumber || '-'),
    escapeCsvCell(c.propertyType || 'residential'),
    escapeCsvCell(c.meterStatus),
    escapeCsvCell(c.lastReadingM3),
    escapeCsvCell(c.currentBill),
    escapeCsvCell(c.registeredAt)
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCsv(csvContent, `${filename}_${dateStr}.csv`);
}

/**
 * 4. Export Water Grid Schedules to Excel
 */
export function exportSchedulesToExcel(schedules: WaterSchedule[], filename = 'AquaFlow_የውሃ_ስርጭት_መርሃግብር_Excel') {
  const headers = [
    'ዞን መለያ (Zone ID)',
    'ክፍለ ከተማ / ከተማ (Subcity/City)',
    'የዞን ስም (Zone Name)',
    'የሚሸፍናቸው ቀበሌዎች (Covered Kebeles)',
    'የፍሰት ሁኔታ (Flow Status)',
    'የውሃ ግፊት ባር (Pressure Bar)',
    'የማጠራቀሚያው መጠን % (Reservoir Level)',
    'የተጠቃሚዎች ብዛት (Subscribers Count)',
    'የፍሰት ቀናት (Flow Days)',
    'የፍሰት ሰዓታት (Flow Hours)',
    'ማስታወሻ (Notice)'
  ];

  const rows = schedules.map(s => [
    escapeCsvCell(s.id),
    escapeCsvCell(s.subCityAm),
    escapeCsvCell(s.zoneNameAm),
    escapeCsvCell(s.kebeles.join(', ')),
    escapeCsvCell(s.status),
    escapeCsvCell(s.pressureBar),
    escapeCsvCell(`${s.reservoirLevelPercent}%`),
    escapeCsvCell(s.subscribersCount),
    escapeCsvCell(s.flowDaysAm),
    escapeCsvCell(s.flowHoursAm),
    escapeCsvCell(s.noticeAm || '-')
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCsv(csvContent, `${filename}_${dateStr}.csv`);
}

/**
 * Download sample templates for bulk import
 */
export function downloadExcelTemplate(type: 'bills' | 'customers') {
  if (type === 'bills') {
    const headers = [
      'Customer ID',
      'Customer Name',
      'Phone',
      'Meter Number',
      'SubCity',
      'Kebele',
      'Billing Period',
      'Previous Reading M3',
      'Current Reading M3',
      'Total Birr',
      'Due Date'
    ];
    const sampleRows = [
      ['CUST-1001', 'ቀለመወርቅ አስፋው', '0911223344', 'MTR-8801', 'ደሴ', 'ቀበሌ 02', 'መስከረም 2026', '120', '138', '320.00', '2026-11-15'],
      ['CUST-1002', 'ዮናስ ሀብታሙ', '0922334455', 'MTR-8802', 'ባህር ዳር', 'ቀበሌ 04', 'መስከረም 2026', '240', '261', '380.50', '2026-11-15'],
      ['CUST-1003', 'መርአዊ ተስፋዬ', '0933445566', 'MTR-8803', 'ደብረብርሃን', 'ቀበሌ 01', 'መስከረም 2026', '95', '110', '260.00', '2026-11-15']
    ];
    const content = [headers.join(','), ...sampleRows.map(r => r.map(escapeCsvCell).join(','))].join('\n');
    downloadCsv(content, 'AquaFlow_የውሃ_ክፍያ_መመዝገቢያ_Template.csv');
  } else {
    const headers = [
      'Full Name',
      'Phone',
      'Region',
      'City',
      'SubCity',
      'Kebele',
      'House Number',
      'National ID',
      'Meter Serial',
      'Initial Reading'
    ];
    const sampleRows = [
      ['አበበ ከበደ', '0911002233', 'አማራ', 'ደሴ', 'ሆቴል ዞን', 'ቀበሌ 03', 'ቤት ቁጥር 412', 'ET-NAT-98412', 'MTR-DES-01', '0'],
      ['ፋጡማ ዑመር', '0922114455', 'ኦሮሚያ', 'አዳማ', 'ደመካ', 'ቀበሌ 07', 'ቤት ቁጥር 110', 'ET-NAT-55123', 'MTR-ADM-02', '0']
    ];
    const content = [headers.join(','), ...sampleRows.map(r => r.map(escapeCsvCell).join(','))].join('\n');
    downloadCsv(content, 'AquaFlow_የደንበኞች_ምዝገባ_Template.csv');
  }
}
