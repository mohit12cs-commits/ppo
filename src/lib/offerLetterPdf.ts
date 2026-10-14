import { doc, getDoc, increment, runTransaction, updateDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import { db } from './firebase';
import { UserProfile, OfferLetterTemplate, CohortBatch } from '../types';

export function loadImageAsDataUrl(src: string, format: 'image/png' | 'image/jpeg' = 'image/png'): Promise<string> {
  if (!src) return Promise.resolve('');
  if (src.startsWith('data:')) return Promise.resolve(src);

  return new Promise<string>((resolve) => {
    fetch(src, { mode: 'cors' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            fallbackCanvas();
          }
        };
        reader.onerror = () => fallbackCanvas();
        reader.readAsDataURL(blob);
      })
      .catch(() => fallbackCanvas());

    function fallbackCanvas() {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 800;
          canvas.height = img.naturalHeight || 200;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL(format));
            return;
          }
        } catch (e) {
          console.warn('Canvas toDataURL warning:', e);
        }
        resolve(src);
      };
      img.onerror = () => {
        console.warn(`Unable to preload image ${src}`);
        resolve('');
      };
      img.src = src;
    }
  });
}

export async function getOrCreateOfferLetterNumber(userId: string): Promise<string> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    if (userData?.offerLetterNumber) {
      return userData.offerLetterNumber;
    }

    const counterRef = doc(db, 'counters', 'offerLetter');
    const nextNumber = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      if (!counterDoc.exists()) {
        transaction.set(counterRef, { count: 10001, lastUpdated: new Date().toISOString() });
        return 10001;
      }
      const currentCount = counterDoc.data().count || 10000;
      const newCount = currentCount + 1;
      transaction.update(counterRef, { count: increment(1), lastUpdated: new Date().toISOString() });
      return newCount;
    });

    await updateDoc(userRef, { offerLetterNumber: nextNumber.toString() });
    return nextNumber.toString();
  } catch (err) {
    console.warn('Counter transaction failed, using timestamp fallback:', err);
    return Math.floor(10000 + Math.random() * 90000).toString();
  }
}

export async function getTemplateForStudent(profile: Partial<UserProfile>): Promise<OfferLetterTemplate | null> {
  try {
    if (profile.offerLetterTemplateId) {
      const tDoc = await getDoc(doc(db, 'offer_templates', profile.offerLetterTemplateId));
      if (tDoc.exists()) {
        return { id: tDoc.id, ...tDoc.data() } as OfferLetterTemplate;
      }
    }

    // Check if batch assigned
    if (profile.batchId) {
      const bDoc = await getDoc(doc(db, 'batches', profile.batchId));
      if (bDoc.exists()) {
        const batch = bDoc.data() as CohortBatch;
        if (batch.templateId) {
          const tDoc = await getDoc(doc(db, 'offer_templates', batch.templateId));
          if (tDoc.exists()) {
            return { id: tDoc.id, ...tDoc.data() } as OfferLetterTemplate;
          }
        }
      }
    }
  } catch (err) {
    console.warn('Error fetching custom template:', err);
  }
  return null;
}

export async function createOfferLetterPdf(
  profile: Partial<UserProfile>,
  letterNumber: string,
  template?: OfferLetterTemplate | null
): Promise<jsPDF> {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, H = 297, ML = 14;

  const headerImgUrl = template?.headerImageUrl || '/images/offer_letter_header.png';
  const footerImgUrl = template?.footerImageUrl || '/images/offer_letter_footer.png';
  const watermarkImgUrl = template?.watermarkUrl || '';

  const [headerImg, footerImg, watermarkImg] = await Promise.all([
    loadImageAsDataUrl(headerImgUrl),
    loadImageAsDataUrl(footerImgUrl),
    watermarkImgUrl ? loadImageAsDataUrl(watermarkImgUrl, 'image/jpeg') : Promise.resolve('')
  ]);

  const studentName = profile.fullName || 'Student Candidate';
  const registrationNumber = profile.universityRoll || profile.universityRollNo || 'N/A';
  const rollNumber = profile.universityRollNo || profile.universityRoll || 'N/A';
  const college = profile.college || 'Authorized Institution';
  const deptSemester = `${profile.department || profile.degree || 'Engineering'} - ${profile.semester || 'Current Semester'}`;
  const domain = profile.internshipDomain || 'Software & Industry Internship';
  const internshipMode = profile.internshipMode || 'Online / Hybrid (College Approved)';
  const companyName = template?.companyName || 'Internship & Research Organization';

  const formatDate = (iso: string | undefined) => {
    if (!iso) {
      const today = new Date();
      return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    }
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };
  const letterDate = formatDate(profile.registrationDate);

  // 1. Draw Header Image if present
  let currentY = 15;
  if (headerImg) {
    try {
      const headerH = (206 / 808) * W;
      pdf.addImage(headerImg, 'PNG', 0, 0, W, headerH);
      currentY = headerH + 6;
    } catch {
      currentY = 20;
    }
  } else {
    // Elegant text header fallback
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(30, 41, 59);
    pdf.text(companyName.toUpperCase(), W / 2, 22, { align: 'center' });
    pdf.setFontSize(9);
    pdf.setFont('Helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    pdf.text('In alignment with NEP-2020 & UGC Internship Framework', W / 2, 28, { align: 'center' });
    pdf.setDrawColor(226, 232, 240);
    pdf.line(ML, 32, W - ML, 32);
    currentY = 38;
  }

  // 2. Watermark
  if (watermarkImg) {
    try {
      const wmSize = 130;
      const wmX = (W - wmSize) / 2;
      const wmY = (H - wmSize) / 2;
      (pdf as any).saveGraphicsState();
      (pdf as any).setGState((pdf as any).GState({ opacity: 0.08 }));
      pdf.addImage(watermarkImg, 'JPEG', wmX, wmY, wmSize, wmSize);
      (pdf as any).restoreGraphicsState();
    } catch (e) {
      console.warn('Watermark render skipped', e);
    }
  }

  // 3. Ref and Date line
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.setTextColor(30, 41, 59);
  pdf.text('Ref No:', ML, currentY);
  pdf.setFont('Helvetica', 'normal');
  pdf.text(`INT/2026/OFFER/${letterNumber}`, ML + 16, currentY);

  pdf.setFont('Helvetica', 'bold');
  pdf.text('Date:', W - ML - 30, currentY);
  pdf.setFont('Helvetica', 'normal');
  pdf.text(letterDate, W - ML - 18, currentY);
  currentY += 8;

  // 4. Candidate Addressee
  pdf.setFont('Helvetica', 'normal');
  pdf.text('To,', ML, currentY); currentY += 5;
  pdf.setFont('Helvetica', 'bold');
  pdf.text(studentName, ML, currentY); currentY += 5;

  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(`Reg / Roll No: ${registrationNumber}`, ML, currentY); currentY += 4.5;
  pdf.text(`College / Institution: ${college}`, ML, currentY); currentY += 8;

  // 5. Subject & Salutation
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('SUBJECT: OFFER OF INTERNSHIP ENGAGEMENT', ML, currentY);
  currentY += 6;

  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.text('Dear Candidate,', ML, currentY);
  currentY += 5;

  const introParagraph = template?.bodyTemplate
    ? template.bodyTemplate
        .replace(/{{student_name}}/g, studentName)
        .replace(/{{college}}/g, college)
        .replace(/{{domain}}/g, domain)
        .replace(/{{registration_number}}/g, registrationNumber)
        .replace(/{{roll_number}}/g, rollNumber)
        .replace(/{{company_name}}/g, companyName)
    : `We are pleased to inform you that you have been selected for the structured Internship Programme at ${companyName}. Our internship framework is developed in compliance with National Education Policy (NEP) 2020 guidelines to impart practical industry skills and experiential learning.`;

  const splitIntro = pdf.splitTextToSize(introParagraph, W - 2 * ML);
  pdf.text(splitIntro, ML, currentY);
  currentY += splitIntro.length * 4.4 + 4;

  // 6. Internship Specification Table
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.text('INTERNSHIP PROGRAMME DETAILS:', ML, currentY);
  currentY += 5;

  const detailsTable: [string, string][] = [
    ['Candidate Name', studentName],
    ['University Roll / Reg No', rollNumber],
    ['College / Institution', college],
    ['Course & Semester', deptSemester],
    ['Internship Domain', domain],
    ['Total Duration', '120 Hours (NEP-2020 Aligned)'],
    ['Mode of Internship', internshipMode],
    ['Status', 'Confirmed / Enrolled']
  ];

  const colKey = ML + 4;
  const colVal = ML + 55;
  const rowHeight = 5.2;

  // Background box for details
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(226, 232, 240);
  pdf.roundedRect(ML, currentY - 2, W - 2 * ML, detailsTable.length * rowHeight + 4, 2, 2, 'FD');

  detailsTable.forEach(([key, val]) => {
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(51, 65, 85);
    pdf.text(key, colKey, currentY + 2.5);
    pdf.text(':', colVal - 4, currentY + 2.5);
    pdf.setFont('Helvetica', 'normal');
    pdf.setTextColor(15, 23, 42);
    pdf.text(val, colVal, currentY + 2.5);
    currentY += rowHeight;
  });
  currentY += 8;

  // 7. Instructions Paragraph
  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(51, 65, 85);
  const closingText = `Please present this Offer Letter to your College Internship Nodal Officer (CINO) / Head of Department for formal documentation. You are expected to adhere to the code of conduct, attend live mentoring sessions, and complete the designated capstone project report.`;
  const splitClosing = pdf.splitTextToSize(closingText, W - 2 * ML);
  pdf.text(splitClosing, ML, currentY);
  currentY += splitClosing.length * 4.2 + 8;

  // 8. Signatory & Stamp
  const signatoryX = W - ML - 60;
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(15, 23, 42);
  pdf.text('For ' + companyName, signatoryX, currentY);
  currentY += 12;

  pdf.setFont('Helvetica', 'bold');
  pdf.text(template?.signatoryName || 'Authorized Signatory', signatoryX, currentY);
  currentY += 4;
  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text(template?.signatoryRole || 'Head of Academic Partnerships', signatoryX, currentY);

  // 9. Draw Footer Image if present
  if (footerImg) {
    try {
      const footerH = (322 / 1002) * W;
      pdf.addImage(footerImg, 'PNG', 0, H - footerH, W, footerH);
    } catch (e) {
      console.warn('Footer image render skipped', e);
    }
  } else {
    pdf.setFontSize(7.5);
    pdf.setTextColor(148, 163, 184);
    pdf.text('This is a computer-generated offer letter and is valid without physical seal.', W / 2, H - 10, { align: 'center' });
  }

  return pdf;
}

export function offerLetterFileName(studentName?: string): string {
  return `Internship_Offer_Letter_${(studentName || 'Student').replace(/\s+/g, '_')}.pdf`;
}

export async function createOfferLetterPdfForUser(userId: string, profile: Partial<UserProfile>): Promise<jsPDF> {
  const [letterNumber, template] = await Promise.all([
    getOrCreateOfferLetterNumber(userId),
    getTemplateForStudent(profile)
  ]);
  return createOfferLetterPdf(profile, letterNumber, template);
}
