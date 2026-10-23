import { Router, Request, Response } from 'express';
import { db } from '../db';
import { REGIONS_DIRECTORY } from '../../src/data/regionsData';

export const registrationRouter = Router();

// GET regions directory hierarchy
registrationRouter.get('/regions', (_req: Request, res: Response) => {
  res.json({ success: true, count: REGIONS_DIRECTORY.length, regions: REGIONS_DIRECTORY });
});

// GET all registered customers
registrationRouter.get('/customers', (req: Request, res: Response) => {
  const { region, country, search } = req.query;
  const customers = db.getCustomers({
    region: region as string,
    country: country as string,
    search: search as string
  });
  res.json({ success: true, count: customers.length, customers });
});

// POST register a new customer water meter
registrationRouter.post('/customer', (req: Request, res: Response) => {
  try {
    const {
      fullName,
      phone,
      country,
      region,
      city,
      woreda,
      subCity,
      kebele,
      houseNumber,
      nationalIdNumber,
      propertyType,
      lastReadingM3,
      meterId,
      currency,
      gpsCoordinates
    } = req.body;

    if (!fullName || !phone || !region || !city) {
      return res.status(400).json({
        success: false,
        error: 'ሙሉ ስም፣ ስልክ ቁጥር፣ ክልል እና ከተማ አስፈላጊ ናቸው (Full name, phone, region, and city are required)'
      });
    }

    const registered = db.registerCustomer({
      fullName,
      phone,
      country: country || 'Ethiopia',
      region,
      city,
      woreda: woreda || '',
      subCity: subCity || city,
      kebele: kebele || 'ቀበሌ 01',
      houseNumber: houseNumber || '',
      nationalIdNumber: nationalIdNumber || '',
      propertyType: propertyType || 'residential',
      lastReadingM3: Number(lastReadingM3 || 0),
      meterId: meterId?.trim() ? meterId.trim() : undefined,
      currency: currency || (country === 'International' ? 'USD' : 'ETB'),
      gpsCoordinates
    });

    res.status(201).json({
      success: true,
      message: 'የውሃ ተጠቃሚ ደንበኛ ምዝገባ በስኬት ተጠናቋል! የቆጣሪ መለያ ቁጥር ወጥቷል።',
      customer: registered,
      certificate: {
        certificateNumber: `CERT-${registered.meterId}`,
        issuedAt: registered.registeredAt,
        status: 'verified_active'
      }
    });
  } catch (err: any) {
    console.error('Customer registration error:', err);
    res.status(400).json({ success: false, error: err.message || 'Customer registration failed' });
  }
});

// GET all registered utilities
registrationRouter.get('/utilities', (_req: Request, res: Response) => {
  const utilities = db.getUtilities();
  res.json({ success: true, count: utilities.length, utilities });
});

// POST register a regional or municipal water office
registrationRouter.post('/utility', (req: Request, res: Response) => {
  try {
    const {
      nameAm,
      nameEn,
      code,
      country,
      region,
      headquartersCity,
      contactPhone,
      emergencyHotline,
      directorName,
      coverageZones,
      serviceLevel
    } = req.body;

    if (!nameAm || !region || !emergencyHotline) {
      return res.status(400).json({
        success: false,
        error: 'የተቋሙ ስም፣ ክልል እና የአስቸኳይ ጊዜ ስልክ ቁጥር አስፈላጊ ናቸው'
      });
    }

    const registered = db.registerUtility({
      nameAm,
      nameEn: nameEn || nameAm,
      code,
      country: country || 'Ethiopia',
      region,
      headquartersCity: headquartersCity || region,
      contactPhone: contactPhone || emergencyHotline,
      emergencyHotline,
      directorName: directorName || 'ስራ አስኪያጅ',
      coverageZones: Array.isArray(coverageZones) && coverageZones.length > 0 ? coverageZones : [headquartersCity || region],
      serviceLevel: serviceLevel || 'regional'
    });

    res.status(201).json({
      success: true,
      message: 'የውሃ ጽሕፈት ቤቱ/ተቋሙ በስኬት ተመዝግቧል!',
      utility: registered
    });
  } catch (err: any) {
    console.error('Utility registration error:', err);
    res.status(400).json({ success: false, error: err.message || 'Utility registration failed' });
  }
});

// GET all technicians
registrationRouter.get('/technicians', (_req: Request, res: Response) => {
  const technicians = db.getTechnicians();
  res.json({ success: true, count: technicians.length, technicians });
});

// POST register a field technician
registrationRouter.post('/technician', (req: Request, res: Response) => {
  try {
    const {
      fullName,
      phone,
      country,
      region,
      city,
      specialization,
      licenseNumber,
      utilityAffiliation
    } = req.body;

    if (!fullName || !phone || !region) {
      return res.status(400).json({
        success: false,
        error: 'የቴክኒሻኑ ስም፣ ስልክ እና ክልል አስፈላጊ ናቸው'
      });
    }

    const registered = db.registerTechnician({
      fullName,
      phone,
      country: country || 'Ethiopia',
      region,
      city: city || region,
      specialization: specialization || 'ቧንቧና ፍሳሽ ጥገና',
      licenseNumber,
      utilityAffiliation
    });

    res.status(201).json({
      success: true,
      message: 'የመስክ ቴክኒሻኑ በስኬት ተመዝግቧል!',
      technician: registered
    });
  } catch (err: any) {
    console.error('Technician registration error:', err);
    res.status(400).json({ success: false, error: err.message || 'Technician registration failed' });
  }
});
