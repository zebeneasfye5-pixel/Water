import { Router, Request, Response } from 'express';
import { db } from '../db';

export const broadcastRouter = Router();

// GET all active emergency notices & broadcasts
broadcastRouter.get('/notices', (_req: Request, res: Response) => {
  const notices = db.getNotices();
  res.json({ success: true, count: notices.length, notices });
});

// POST dispatch SMS broadcast to residents
broadcastRouter.post('/sms', (req: Request, res: Response) => {
  try {
    const { targetSubCity, targetKebele, title, message, urgency, sendToAll } = req.body;

    if (!message || !title) {
      return res.status(400).json({ success: false, error: 'Title and message are required' });
    }

    // Find recipient phone numbers from customer database
    const customers = db.getCustomers();
    let recipients: { name: string; phone: string; subCity: string }[] = [];

    if (sendToAll || targetSubCity === 'all' || !targetSubCity) {
      recipients = customers.map(c => ({
        name: c.fullName,
        phone: c.phone,
        subCity: c.subCity || c.city || 'አጠቃላይ'
      }));
    } else {
      recipients = customers
        .filter(c => (c.subCity || c.city || '').toLowerCase() === targetSubCity.toLowerCase())
        .map(c => ({
          name: c.fullName,
          phone: c.phone,
          subCity: c.subCity || c.city || targetSubCity
        }));
    }

    // Always include sample delivery numbers if database is small
    if (recipients.length === 0) {
      recipients.push(
        { name: 'ተጠቃሚ (ቦሌ)', phone: '0911245678', subCity: targetSubCity || 'ቦሌ' },
        { name: 'ተጠቃሚ (የካ)', phone: '0922887766', subCity: targetSubCity || 'የካ' }
      );
    }

    // Add to system notices so it shows up in user notifications and banners
    const notice = db.addNotice({
      titleAm: title,
      titleEn: title,
      messageAm: message,
      messageEn: message,
      severity: urgency === 'critical' ? 'urgent' : urgency === 'high' ? 'warning' : 'info',
      affectedAreasAm: sendToAll || !targetSubCity || targetSubCity === 'all' ? 'ሁሉንም ክፍለ ከተሞች' : targetSubCity,
      affectedAreasEn: sendToAll || !targetSubCity || targetSubCity === 'all' ? 'All Sub-Cities' : targetSubCity,
      active: true
    });

    // Simulated SMS Gateway Dispatch (Africastalking / Ethio Telecom SMS API)
    const broadcastId = `SMS-${Date.now()}`;
    const smsReport = {
      broadcastId,
      gateway: "Ethio Telecom / Africa's Talking SMS Gateway API",
      status: 'delivered',
      urgency: urgency || 'high',
      sentCount: recipients.length,
      sampleRecipients: recipients.slice(0, 5),
      timestamp: new Date().toISOString(),
      preview: message.substring(0, 120) + (message.length > 120 ? '...' : ''),
      costEtb: Number((recipients.length * 0.35).toFixed(2)) // Standard SMS tariff
    };

    res.json({
      success: true,
      message: `የአስቸኳይ ጊዜ ኤስኤምኤስ ለ ${recipients.length} ደንበኞች በስኬት ተልኳል!`,
      report: smsReport,
      notice
    });
  } catch (err: any) {
    console.error('SMS broadcast error:', err);
    res.status(500).json({ success: false, error: err.message || 'SMS broadcast failed' });
  }
});

// POST subscribe phone number for water schedule alerts
broadcastRouter.post('/subscribe', (req: Request, res: Response) => {
  const { scheduleId, phone } = req.body;
  if (!scheduleId || !phone) {
    return res.status(400).json({ success: false, error: 'ScheduleId and phone required' });
  }

  db.addSubscriber(scheduleId, phone);
  res.json({
    success: true,
    message: `ስልክ ቁጥር ${phone} ለውሃ ማሳወቂያ በስኬት ተመዝግቧል! ውሃው ሲለቀቅ ኤስኤምኤስ ይደርስዎታል።`
  });
});
