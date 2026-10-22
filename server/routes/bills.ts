import { Router, Request, Response } from 'express';
import { db } from '../db';

export const billsRouter = Router();

// GET all bills
billsRouter.get('/', (req: Request, res: Response) => {
  const bills = db.getBills();
  res.json({ success: true, count: bills.length, bills });
});

// GET search bills by meter number, customer ID or name
billsRouter.get('/search', (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  if (!query.trim()) {
    return res.json({ success: true, count: 0, bills: [] });
  }
  const results = db.findBillByQuery(query);
  res.json({ success: true, count: results.length, bills: results });
});

// POST Bulk upload water billing data (CSV / Excel text or parsed records)
billsRouter.post('/bulk-upload', (req: Request, res: Response) => {
  try {
    const { csvContent, records, billingPeriod } = req.body;
    let parsedRecords: any[] = [];

    if (Array.isArray(records) && records.length > 0) {
      parsedRecords = records;
    } else if (typeof csvContent === 'string' && csvContent.trim()) {
      // Parse CSV text line by line
      const lines = csvContent.trim().split('\n');
      if (lines.length < 2) {
        return res.status(400).json({ success: false, error: 'CSV file is empty or missing headers' });
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[\r"]/g, ''));
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const values = line.split(',').map(v => v.trim().replace(/[\r"]/g, ''));
        const obj: any = {};
        headers.forEach((h, idx) => {
          obj[h] = values[idx] || '';
        });

        // Map standard columns
        parsedRecords.push({
          meterNumber: obj['meter_id'] || obj['meter_number'] || obj['meter'] || obj['ቆጣሪ'],
          customerName: obj['full_name'] || obj['name'] || obj['customer_name'] || obj['ስም'],
          subCity: obj['sub_city'] || obj['district'] || obj['ክፍለ_ከተማ'] || 'ቦሌ',
          kebele: obj['kebele'] || obj['ቀበሌ'] || 'ቀበሌ 01',
          customerPhone: obj['phone'] || obj['phone_number'] || obj['ስልክ'] || '0911000000',
          previousReadingM3: Number(obj['prev_reading'] || obj['ያለፈው_ንባብ'] || 0),
          currentReadingM3: Number(obj['current_reading'] || obj['የአሁኑ_ንባብ'] || 20),
          totalBirr: Number(obj['current_bill'] || obj['amount'] || obj['total_birr'] || obj['የወር_ክፍያ'] || 250),
          billingPeriod: billingPeriod || obj['period'] || 'መስከረም 2026',
          dueDate: obj['due_date'] || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
        });
      }
    } else {
      return res.status(400).json({ success: false, error: 'No CSV content or records provided' });
    }

    const result = db.upsertCustomersBulk(parsedRecords);

    res.json({
      success: true,
      message: `Successfully processed ${parsedRecords.length} records (${result.addedCount} added, ${result.updatedCount} updated)`,
      stats: result
    });
  } catch (error: any) {
    console.error('Bulk upload processing error:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error processing bulk upload' });
  }
});

// POST pay bill
billsRouter.post('/:id/pay', (req: Request, res: Response) => {
  const { id } = req.params;
  const { paymentMethod, transactionRef } = req.body;

  const paidBill = db.payBill(id, paymentMethod || 'telebirr', transactionRef || `TX-${Date.now()}`);
  if (!paidBill) {
    return res.status(404).json({ success: false, error: 'Bill or Meter not found' });
  }

  res.json({
    success: true,
    message: 'Bill marked as paid and balance settled to 0 ETB',
    bill: paidBill
  });
});

// GET Sample CSV template download endpoint
billsRouter.get('/sample-template', (req: Request, res: Response) => {
  const sampleCsv = `meter_id,full_name,sub_city,kebele,phone,prev_reading,current_reading,current_bill,due_date
MTR-09412,አበበ ተፈራ ገብረመድህን,ቦሌ,ቀበሌ 04,0911245678,412,434,395.50,2026-11-05
MTR-10294,ወ/ሮ ትእግስት አስፋው,የካ,ቀበሌ 08,0922887766,180,198,313.00,2026-11-05
MTR-88401,ግርማ ካሳሁን,ቂርቆስ,ቀበሌ 02,0911332211,540,565,420.00,2026-11-10
MTR-77290,ሰላማዊት አበበ,ንፋስ ስልክ ላፍቶ,ቀበሌ 06,0944556677,290,312,340.00,2026-11-12
MTR-55102,ዳዊት ወልደሚካኤል,አራዳ,ቀበሌ 01,0933112233,610,632,380.00,2026-11-15`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="aquaflow_water_bills_template.csv"');
  res.send(sampleCsv);
});
