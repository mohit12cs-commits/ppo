import express from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Razorpay from 'razorpay';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Initialize Razorpay instance if keys are configured
const razorpayKeyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

let razorpayInstance: Razorpay | null = null;
if (razorpayKeyId && razorpayKeySecret && !razorpayKeyId.includes('YourKeyIdHere')) {
  razorpayInstance = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
}

// 1. Create Order endpoint
app.post('/api/payment/order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount in paise is required' });
    }

    if (!razorpayInstance) {
      // Mock order for sandbox / test demonstration
      const mockOrderId = `order_mock_${Date.now()}`;
      return res.json({
        id: mockOrderId,
        amount: Math.round(amount),
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        status: 'created',
        isMock: true
      });
    }

    const options = {
      amount: Math.round(amount),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {}
    };

    const order = await razorpayInstance.orders.create(options);
    return res.json(order);
  } catch (err: any) {
    console.error('Error creating Razorpay order:', err);
    return res.status(500).json({ error: err.message || 'Failed to create payment order' });
  }
});

// 2. Verify Payment Signature
app.post('/api/payment/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: 'Order ID and Payment ID are required' });
    }

    if (!razorpayKeySecret || !razorpay_signature) {
      // Sandbox approval
      return res.json({ verified: true, mock: true });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      return res.json({ verified: true });
    } else {
      return res.status(400).json({ verified: false, error: 'Invalid HMAC signature' });
    }
  } catch (err: any) {
    console.error('Error verifying payment signature:', err);
    return res.status(500).json({ error: err.message || 'Internal verification error' });
  }
});

// 3. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'internship-portal-api', timestamp: new Date().toISOString() });
});

export default app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
  });
}
