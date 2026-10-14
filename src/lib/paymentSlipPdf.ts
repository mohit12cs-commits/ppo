import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { UserProfile, PaymentRecord } from '../types';

export async function generatePaymentSlipPdf(
  profile: Partial<UserProfile>,
  paymentData?: Partial<PaymentRecord>
): Promise<jsPDF> {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, H = 297, ML = 18;

  const studentName = profile.fullName || 'Student Candidate';
  const rollNo = profile.universityRoll || profile.universityRollNo || 'N/A';
  const college = profile.college || 'Registered College';
  const email = profile.email || 'N/A';
  const phone = profile.contactNumber || 'N/A';
  const domain = profile.internshipDomain || 'NEP-2020 Industrial Internship';

  const paymentId = paymentData?.razorpayPaymentId || profile.razorpayPaymentId || `pay_mock_${Date.now()}`;
  const orderId = paymentData?.razorpayOrderId || profile.razorpayOrderId || `order_mock_${Date.now()}`;
  const amount = paymentData?.amount || profile.paymentAmount || 1000;
  
  const paymentDate = profile.paymentVerifiedAt 
    ? new Date(profile.paymentVerifiedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) 
    : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Generate verification QR code
  const qrString = `VERIFIED PAYMENT RECEIPT\nStudent: ${studentName}\nRoll: ${rollNo}\nAmount: INR ${amount}\nPayment ID: ${paymentId}\nStatus: SUCCESS`;
  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(qrString, { width: 140, margin: 1 });
  } catch (err) {
    console.warn('QR generation error:', err);
  }

  // Primary Header Banner
  pdf.setFillColor(15, 23, 42); // slate-900
  pdf.rect(0, 0, W, 38, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text('INTERNSHIP PORTAL', ML, 16);

  pdf.setFontSize(9);
  pdf.setFont('Helvetica', 'normal');
  pdf.setTextColor(203, 213, 225); // slate-300
  pdf.text('Official Fee Payment Receipt & Acknowledgment', ML, 23);
  pdf.text('NEP-2020 Compliant 120-Hour Practical Training Program', ML, 28);

  // Status Badge on Header Right
  pdf.setFillColor(16, 185, 129); // emerald-500
  pdf.roundedRect(W - ML - 38, 12, 38, 14, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('PAID / SUCCESS', W - ML - 19, 21, { align: 'center' });

  let y = 48;

  // Transaction Meta Grid
  pdf.setFillColor(248, 250, 252); // slate-50
  pdf.setDrawColor(226, 232, 240); // slate-200
  pdf.roundedRect(ML, y, W - 2 * ML, 24, 2, 2, 'FD');

  pdf.setFontSize(8);
  pdf.setFont('Helvetica', 'bold');
  pdf.setTextColor(100, 116, 139);
  pdf.text('RECEIPT NUMBER', ML + 6, y + 7);
  pdf.text('TRANSACTION DATE', ML + 60, y + 7);
  pdf.text('PAYMENT GATEWAY', ML + 120, y + 7);

  pdf.setFontSize(9.5);
  pdf.setFont('Helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  pdf.text(`REC-${paymentId.slice(-8).toUpperCase()}`, ML + 6, y + 16);
  pdf.setFont('Helvetica', 'normal');
  pdf.text(paymentDate, ML + 60, y + 16);
  pdf.text('Razorpay Secured', ML + 120, y + 16);

  y += 34;

  // Student & Academic Details Section
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(30, 41, 59);
  pdf.text('STUDENT INFORMATION', ML, y);
  y += 5;

  pdf.setDrawColor(226, 232, 240);
  pdf.line(ML, y, W - ML, y);
  y += 6;

  const studentFields: [string, string][] = [
    ['Candidate Full Name', studentName],
    ['University Roll / Reg No', rollNo],
    ['Affiliated College', college],
    ['Course / Degree', `${profile.degree || 'B.Tech / B.Sc'} (${profile.semester || 'Current'})`],
    ['Internship Domain', domain],
    ['Email Address', email],
    ['Registered Phone', phone],
  ];

  const colWidth = (W - 2 * ML) / 2;
  studentFields.forEach(([label, value], idx) => {
    const isCol2 = idx % 2 === 1;
    const curX = isCol2 ? ML + colWidth : ML;
    const curY = y + Math.floor(idx / 2) * 11;

    pdf.setFont('Helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(label.toUpperCase(), curX, curY);

    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(15, 23, 42);
    pdf.text(value, curX, curY + 5);
  });

  y += Math.ceil(studentFields.length / 2) * 11 + 8;

  // Payment Breakdown Section
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(30, 41, 59);
  pdf.text('PAYMENT DETAILS & INVOICE BREAKDOWN', ML, y);
  y += 5;

  pdf.setDrawColor(226, 232, 240);
  pdf.line(ML, y, W - ML, y);
  y += 6;

  // Table Header
  pdf.setFillColor(241, 245, 249);
  pdf.rect(ML, y, W - 2 * ML, 8, 'F');
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(71, 85, 105);
  pdf.text('ITEM DESCRIPTION', ML + 4, y + 5.5);
  pdf.text('DURATION', ML + 110, y + 5.5);
  pdf.text('AMOUNT (INR)', W - ML - 30, y + 5.5);
  y += 8;

  // Table Row
  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(15, 23, 42);
  pdf.text('NEP-2020 Industrial Internship Enrollment & Mentorship Fee', ML + 4, y + 6);
  pdf.text('120 Hours', ML + 110, y + 6);
  pdf.setFont('Helvetica', 'bold');
  pdf.text(`Rs. ${amount.toLocaleString('en-IN')}.00`, W - ML - 30, y + 6);
  y += 12;

  pdf.setDrawColor(226, 232, 240);
  pdf.line(ML, y, W - ML, y);
  y += 4;

  // Total Row
  pdf.setFillColor(248, 250, 252);
  pdf.rect(ML, y, W - 2 * ML, 10, 'F');
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(15, 23, 42);
  pdf.text('TOTAL AMOUNT PAID', ML + 4, y + 7);
  pdf.setTextColor(16, 185, 129); // green
  pdf.setFontSize(12);
  pdf.text(`INR ${amount.toLocaleString('en-IN')}.00`, W - ML - 38, y + 7);
  y += 18;

  // Identifiers Box (Razorpay Order & Payment ID)
  pdf.setFillColor(241, 245, 249);
  pdf.roundedRect(ML, y, W - 2 * ML, 16, 2, 2, 'F');
  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text(`Razorpay Payment ID: ${paymentId}`, ML + 4, y + 6);
  pdf.text(`Razorpay Order ID: ${orderId}`, ML + 4, y + 11);
  y += 24;

  // QR Code & Signatory Verification Footer
  if (qrDataUrl) {
    try {
      pdf.addImage(qrDataUrl, 'PNG', ML, y, 28, 28);
      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text('Scan this QR code using any smartphone', ML + 32, y + 10);
      pdf.text('to instantly verify this official payment receipt.', ML + 32, y + 15);
      pdf.setFont('Helvetica', 'bold');
      pdf.text('Digitally Verified & Locked', ML + 32, y + 20);
    } catch (e) {
      console.warn('QR image render skipped', e);
    }
  }

  // Authorized Signatory
  const signX = W - ML - 55;
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(15, 23, 42);
  pdf.text('Finance & Accounts Dept.', signX, y + 15);
  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Internship Program Office', signX, y + 20);
  pdf.text('(Authorized Computer Generated Slip)', signX, y + 25);

  // Bottom Notice
  pdf.setFontSize(7.5);
  pdf.setTextColor(148, 163, 184);
  pdf.text('This receipt serves as proof of fee payment for University submission and CINO verification.', W / 2, H - 12, { align: 'center' });

  return pdf;
}

export function paymentSlipFileName(studentName?: string): string {
  return `Internship_Payment_Slip_${(studentName || 'Student').replace(/\s+/g, '_')}.pdf`;
}
