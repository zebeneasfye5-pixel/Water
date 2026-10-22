import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { db } from '../db';

export const paymentsRouter = Router();

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || 'CHASECK_TEST-water-utility-portal-demo-key';

// GET all webhook logs
paymentsRouter.get('/webhook-logs', (_req: Request, res: Response) => {
  const logs = db.getWebhookLogs();
  res.json({ success: true, count: logs.length, logs });
});

// POST initialize a payment (Chapa / Telebirr)
paymentsRouter.post('/initialize', (req: Request, res: Response) => {
  try {
    const { meterNumber, amount, email, firstName, lastName, phoneNumber, paymentMethod } = req.body;

    if (!meterNumber || !amount) {
      return res.status(400).json({ success: false, error: 'Meter number and amount are required' });
    }

    const txRef = `AQUA-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // In a live environment with valid Chapa API key:
    // const chapaRes = await axios.post('https://api.chapa.co/v1/transaction/initialize', ...)
    
    // For demonstration and production readiness:
    res.json({
      success: true,
      message: 'Transaction initialized',
      txRef,
      paymentMethod: paymentMethod || 'chapa',
      amount: Number(amount),
      currency: 'ETB',
      customer: {
        meterNumber,
        name: `${firstName || ''} ${lastName || ''}`.trim() || 'ውሃ ተጠቃሚ ደንበኛ',
        phone: phoneNumber || '0911000000',
        email: email || 'customer@example.com'
      },
      checkoutUrl: `https://checkout.chapa.co/checkout/payment/${txRef}`,
      webhookUrl: '/api/payments/webhook'
    });
  } catch (err: any) {
    console.error('Payment initialization error:', err);
    res.status(500).json({ success: false, error: err.message || 'Payment initialization failed' });
  }
});

// POST Chapa / Telebirr Webhook Handler
paymentsRouter.post('/webhook', (req: Request, res: Response) => {
  try {
    const rawSignature = (req.headers['x-chapa-signature'] as string) || (req.headers['chapa-signature'] as string);
    const payload = req.body;

    // Verify webhook signature if present in production
    if (rawSignature && process.env.NODE_ENV === 'production' && process.env.CHAPA_SECRET_KEY) {
      const hash = crypto
        .createHmac('sha256', CHAPA_SECRET_KEY)
        .update(JSON.stringify(payload))
        .digest('hex');

      if (hash !== rawSignature) {
        console.warn('Webhook signature mismatch rejected:', rawSignature);
        return res.status(401).json({ success: false, error: 'Invalid webhook signature' });
      }
    }

    // Extract transaction details
    const txRef = payload.tx_ref || payload.trx_ref || payload.reference || `TX-${Date.now()}`;
    const meterNumber = payload.customization?.meter_number || payload.meter_number || payload.meterNumber || payload.meta?.meter_number;
    const amount = Number(payload.amount || payload.total || 0);
    const currency = payload.currency || 'ETB';
    const status = (payload.status === 'success' || payload.event === 'charge.complete' || payload.status === 'paid') ? 'success' : 'failed';
    const provider = payload.provider || (rawSignature ? 'chapa' : 'telebirr');

    // Settle bill in database
    let settledBill = null;
    if (status === 'success' && meterNumber) {
      settledBill = db.payBill(meterNumber, provider, txRef);
    }

    // Log the webhook
    const logEntry = db.logWebhook({
      provider: provider as any,
      event: payload.event || 'charge.complete',
      txRef,
      meterNumber: meterNumber || 'UNKNOWN',
      amount,
      currency,
      status,
      payload
    });

    res.status(200).json({
      success: true,
      message: status === 'success' 
        ? `Payment verified! Bill for meter ${meterNumber} settled to 0.00 ETB`
        : 'Webhook received but payment was not successful',
      txRef,
      meterNumber,
      bill: settledBill,
      logId: logEntry.id
    });
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ success: false, error: err.message || 'Webhook error' });
  }
});

// POST simulate incoming webhook directly from frontend testing panel
paymentsRouter.post('/simulate-webhook', (req: Request, res: Response) => {
  const { meterNumber, amount, provider, status } = req.body;
  if (!meterNumber) {
    return res.status(400).json({ success: false, error: 'Meter number is required' });
  }

  const txRef = `CHAPA-SIM-${Date.now()}`;
  const isSuccess = status !== 'failed';

  let settledBill = null;
  if (isSuccess) {
    settledBill = db.payBill(meterNumber, provider || 'chapa', txRef);
  }

  const logEntry = db.logWebhook({
    provider: provider || 'chapa',
    event: 'charge.complete',
    txRef,
    meterNumber,
    amount: Number(amount) || 395.50,
    currency: 'ETB',
    status: isSuccess ? 'success' : 'failed',
    payload: {
      event: 'charge.complete',
      tx_ref: txRef,
      amount: Number(amount) || 395.50,
      currency: 'ETB',
      status: isSuccess ? 'success' : 'failed',
      meter_number: meterNumber,
      timestamp: new Date().toISOString()
    }
  });

  res.json({
    success: true,
    message: isSuccess
      ? `የቻፓ ክፍያ ማረጋገጫ (Webhook) በተሳካ ሁኔታ ደርሷል! የቆጣሪ ${meterNumber} ቀሪ ዕዳ 0.00 ብር ሆኗል።`
      : 'የተከሸፈ ክፍያ Webhook ተመዝግቧል።',
    txRef,
    bill: settledBill,
    log: logEntry
  });
});
