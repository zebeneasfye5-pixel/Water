import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../db';

export const incidentsRouter = Router();

// Ensure upload directory exists
const UPLOADS_DIR = path.resolve('public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `incident-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max for video/photo
  }
});

// GET all incidents
incidentsRouter.get('/', (_req: Request, res: Response) => {
  const incidents = db.getIncidents();
  res.json({ success: true, count: incidents.length, incidents });
});

// POST single or multiple file uploads
incidentsRouter.post('/upload', upload.array('files', 5), (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    const uploadedUrls = files.map(f => `/uploads/${f.filename}`);
    res.json({
      success: true,
      message: `${files.length} file(s) uploaded successfully`,
      urls: uploadedUrls,
      files: files.map(f => ({
        originalName: f.originalname,
        filename: f.filename,
        mimetype: f.mimetype,
        size: f.size,
        url: `/uploads/${f.filename}`
      }))
    });
  } catch (err: any) {
    console.error('File upload error:', err);
    res.status(500).json({ success: false, error: err.message || 'File upload failed' });
  }
});

// POST create incident with GPS coordinates and media
incidentsRouter.post('/', (req: Request, res: Response) => {
  try {
    const {
      type,
      category,
      description,
      subCity,
      specificLocation,
      photos,
      videos,
      severity,
      urgency,
      reporterName,
      reporterPhone
    } = req.body;

    const chosenCategory = category || type || 'pipe_burst';
    const chosenUrgency = urgency || severity || 'medium';

    if (!description || !reporterName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required incident fields (description, reporterName)'
      });
    }

    const created = db.addIncident({
      reporterName: reporterName || 'ስም ያልታወቀ',
      reporterPhone: reporterPhone || '0900000000',
      subCityAm: subCity || 'ቦሌ',
      subCityEn: subCity || 'Bole',
      specificLocation: specificLocation || '',
      category: chosenCategory,
      urgency: chosenUrgency,
      description,
      photoUrl: Array.isArray(photos) && photos.length > 0 ? photos[0] : (typeof photos === 'string' ? photos : undefined),
      videoUrl: Array.isArray(videos) && videos.length > 0 ? videos[0] : (typeof videos === 'string' ? videos : undefined)
    });

    res.status(201).json({
      success: true,
      message: 'የችግር ሪፖርቱ በስኬት ተመዝግቧል',
      incident: created
    });
  } catch (err: any) {
    console.error('Create incident error:', err);
    res.status(500).json({ success: false, error: err.message || 'Error recording incident' });
  }
});

// PATCH update incident status (Admin / Technician)
incidentsRouter.patch('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, note, assignedTo, technicianPhone } = req.body;

  const existing = db.getIncidents().find(i => i.id === id || i.ticketNumber === id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Incident not found' });
  }

  const updates: any = {};
  if (status) updates.status = status;
  if (assignedTo) updates.assignedTechnician = assignedTo;
  if (technicianPhone) updates.technicianPhone = technicianPhone;
  if (note) updates.resolutionNotes = note;

  const updated = db.updateIncident(id, updates);
  res.json({ success: true, message: 'Incident updated successfully', incident: updated });
});
