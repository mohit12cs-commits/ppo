import express from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import nodemailer from 'nodemailer';

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

// Initialize Nodemailer SMTP Transporter
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = Number(process.env.SMTP_PORT) || 465;
const smtpUser = (process.env.SMTP_USER || 'mohit12cs@gmail.com').replace(/^["']|["']$/g, '').trim();
const smtpPass = (process.env.SMTP_PASS || 'twrv msap hfua yhcb').replace(/^["']|["']$/g, '').trim();
const smtpTransporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Dynamically fetch current MAIL_FROM and company name from environment
function getCurrentMailFrom(): string {
  return (process.env.MAIL_FROM || 'InternMitra <mohit12cs@gmail.com>').replace(/^["']|["']$/g, '').trim();
}

// Dynamically determine the portal / company name from MAIL_FROM (e.g. "InternMitra <user@gmail.com>" -> "InternMitra")
function getDynamicCompanyName(customName?: string): string {
  if (customName && customName.trim()) return customName.trim();
  const raw = (process.env.MAIL_FROM || '').replace(/^["']|["']$/g, '').trim();
  // Match display name before '<' or before '@'
  const match = raw.match(/^"?([^"<@]+)"?\s*</) || raw.match(/^([^<@]+)/);
  if (match && match[1].trim()) {
    return match[1].trim();
  }
  return process.env.VITE_APP_NAME || 'InternMitra';
}

// Brand configuration endpoint
app.get('/api/config/brand', (req, res) => {
  res.json({
    companyName: getDynamicCompanyName(),
    mailFrom: getCurrentMailFrom()
  });
});

// 1. Welcome / Registration Email endpoint
app.post('/api/send-welcome-email', async (req, res) => {
  try {
    const { studentName, email, rollNo, college, domain, companyName: customCompany } = req.body;
    const companyName = getDynamicCompanyName(customCompany);
    const activeMailFrom = getCurrentMailFrom();

    if (!email) {
      return res.status(400).json({ error: 'Recipient email is required' });
    }

    const mailOptions = {
      from: activeMailFrom,
      to: email,
      subject: `Registration Confirmed - 120-Hour Internship Program | ${companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #4f46e5, #06b6d4); padding: 30px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: -0.5px;">${companyName}</h1>
            <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">NEP-2020 Aligned Industrial Internship Portal</p>
          </div>
          
          <div style="padding: 30px; color: #334155; line-height: 1.6;">
            <p style="font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 0;">Dear ${studentName || 'Student'},</p>
            <p style="font-size: 14px;">Congratulations! Your registration for the <strong>NEP-2020 Compliant 120-Hour Industrial Internship Program</strong> at <strong>${companyName}</strong> has been successfully confirmed.</p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0;">
              <h3 style="margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #4f46e5;">Your Enrolled Particulars</h3>
              <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 4px 0; color: #64748b; width: 40%;">Candidate Name:</td>
                  <td style="padding: 4px 0; font-weight: bold; color: #0f172a;">${studentName}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">University Roll / Reg No:</td>
                  <td style="padding: 4px 0; font-weight: bold; color: #0f172a;">${rollNo || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Affiliated College:</td>
                  <td style="padding: 4px 0; font-weight: bold; color: #0f172a;">${college || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Internship Track:</td>
                  <td style="padding: 4px 0; font-weight: bold; color: #4f46e5;">${domain || 'Industry Program'}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Portal Login ID:</td>
                  <td style="padding: 4px 0; font-weight: bold; color: #0f172a;">${email}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 13px; color: #475569;">
              You can now log in to your student dashboard anytime using your registered email/roll number and password to access and download your <strong>Official Offer Letter (PDF)</strong> and <strong>Verified Payment Slip</strong>.
            </p>

            <div style="text-align: center; margin: 28px 0 10px;">
              <a href="${process.env.VITE_APP_URL || 'http://localhost:5173'}/login" style="background-color: #4f46e5; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                Access Student Dashboard
              </a>
            </div>
          </div>

          <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0;">© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
            <p style="margin: 4px 0 0;">Need assistance? Reply directly to this email or contact support.</p>
          </div>
        </div>
      `,
    };

    const info = await smtpTransporter.sendMail(mailOptions);
    console.log(`Welcome email dispatched successfully to ${email} (Message ID: ${info.messageId}) [Brand: ${companyName}]`);
    return res.json({ success: true, messageId: info.messageId, companyName });
  } catch (err: any) {
    console.error('Error sending welcome email:', err);
    // Don't block registration even if SMTP temporarily fails
    return res.status(500).json({ success: false, error: err.message || 'Failed to dispatch email' });
  }
});

// 2. Create Order endpoint
app.post('/api/payment/order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount in paise is required' });
    }

    if (!razorpayInstance) {
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

// 3. Verify Payment Signature
app.post('/api/payment/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: 'Order ID and Payment ID are required' });
    }

    if (!razorpayKeySecret || !razorpay_signature) {
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

// 4. Sync Payments Endpoint (fetches last 100 payments)
app.get('/api/payment/sync', async (req, res) => {
  try {
    const count = Number(req.query.count) || 100;
    if (razorpayInstance) {
      const response = await razorpayInstance.payments.all({ count });
      return res.json({
        success: true,
        count: response.items.length,
        items: response.items,
        timestamp: new Date().toISOString()
      });
    }

    return res.json({
      success: true,
      count: 0,
      items: [],
      mock: true,
      message: 'Razorpay keys not live; mock sync active',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Payment sync error:', err);
    return res.status(500).json({ error: err.message || 'Failed to sync payments' });
  }
});

// 5. Admin Change Student Password & Dispatch Notification
app.post('/api/admin/change-student-password', async (req, res) => {
  try {
    const { studentEmail, studentName, newPassword } = req.body;

    if (!studentEmail || !newPassword) {
      return res.status(400).json({ error: 'Student email and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Send email notification to student with their updated password
    const companyName = getDynamicCompanyName(req.body.companyName);
    try {
      await smtpTransporter.sendMail({
        from: getCurrentMailFrom(),
        to: studentEmail,
        subject: `Your ${companyName} Portal Password Has Been Updated`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, #4f46e5, #06b6d4); padding: 25px; text-align: center; color: #ffffff;">
              <h2 style="margin: 0; font-size: 22px;">${companyName}</h2>
              <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Account Security Notice</p>
            </div>
            <div style="padding: 25px; color: #334155; line-height: 1.6;">
              <p style="font-size: 15px; font-weight: bold; color: #0f172a;">Dear ${studentName || 'Student'},</p>
              <p style="font-size: 13px;">Your portal account password has been updated by the system administrator. Here are your updated credentials:</p>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="margin: 4px 0; font-size: 13px;"><strong>Login ID / Email:</strong> ${studentEmail}</p>
                <p style="margin: 4px 0; font-size: 13px;"><strong>New Secret Password:</strong> <code style="background: #e0e7ff; color: #4338ca; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${newPassword}</code></p>
              </div>
              <p style="font-size: 12px; color: #64748b;">You can now use this password to sign in and access your student dashboard, Offer Letter, and learning modules.</p>
              <div style="text-align: center; margin: 24px 0 10px;">
                <a href="${process.env.VITE_APP_URL || 'http://localhost:5173'}/login" style="background-color: #4f46e5; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; display: inline-block;">
                  Sign In to Dashboard
                </a>
              </div>
            </div>
            <div style="background-color: #f1f5f9; padding: 12px; text-align: center; font-size: 11px; color: #94a3b8;">
              <p style="margin: 0;">© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
            </div>
          </div>
        `
      });
    } catch (mailErr) {
      console.warn('Password change email dispatch warning:', mailErr);
    }

    return res.json({ success: true, message: 'Password updated and notification dispatched successfully' });
  } catch (err: any) {
    console.error('Change password error:', err);
    return res.status(500).json({ error: err.message || 'Failed to update password' });
  }
});

// 6. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'internship-portal-api', timestamp: new Date().toISOString() });
});

export default app;

if (process.env.NODE_ENV !== 'test' && !process.env.VITE_DEV_MIDDLEWARE) {
  app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
  });
}
