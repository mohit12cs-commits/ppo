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

type TextSegment = {
  text: string;
  bold?: boolean;
};

function renderRichText(
  pdf: jsPDF,
  segments: TextSegment[],
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  fontSize: number
) {
  let cursorX = x;
  let cursorY = y;

  pdf.setFontSize(fontSize);
  segments.forEach((segment) => {
    const words = segment.text.split(/(\s+)/).filter(Boolean);
    pdf.setFont('Helvetica', segment.bold ? 'bold' : 'normal');

    words.forEach((word) => {
      const wordWidth = pdf.getTextWidth(word);
      if (cursorX > x && cursorX + wordWidth > x + maxWidth) {
        cursorX = x;
        cursorY += lineHeight;
      }
      pdf.text(word, cursorX, cursorY);
      cursorX += wordWidth;
    });
  });

  return cursorY + lineHeight;
}

export async function createOfferLetterPdf(
  profile: Partial<UserProfile>,
  letterNumber: string,
  template?: OfferLetterTemplate | null
): Promise<jsPDF> {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, H = 297, ML = 12;

  const headerImgUrl = template?.headerImageUrl || '/images/offer_letter_header.png';
  const footerImgUrl = template?.footerImageUrl || '/images/document_footer.png';
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
  const deptSemester = `${profile.department || profile.degree || 'Engineering'} - ${profile.semester || '5th Semester'}`;
  const domain = profile.internshipDomain || 'Software & Industry Internship';
  const internshipMode = profile.internshipMode || 'Online';

  const formatDate = (iso: string | undefined) => {
    if (!iso) {
      const today = new Date();
      return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    }
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };
  const letterDate = formatDate(profile.registrationDate);

  const headerH = (206 / 808) * W;
  const footerH = (322 / 1002) * W;

  // 1. Header Banner Image
  if (headerImg) {
    try {
      pdf.addImage(headerImg, 'PNG', -0.6, 0, W + 1.2, headerH);
    } catch (e) {
      console.warn('Failed to render header image:', e);
    }
  }

  // 2. Watermark
  if (watermarkImg) {
    try {
      const wmSize = 140;
      const wmX = (W - wmSize) / 2;
      const wmY = headerH + 20;
      (pdf as any).saveGraphicsState();
      (pdf as any).setGState((pdf as any).GState({ opacity: 0.08 }));
      pdf.addImage(watermarkImg, 'JPEG', wmX, wmY, wmSize, wmSize);
      (pdf as any).restoreGraphicsState();
    } catch (e) {
      console.warn('Watermark render skipped', e);
    }
  }

  const x = ML;
  let y = headerH + 3;
  pdf.setFontSize(10);
  pdf.setTextColor(20, 20, 20);

  // 3. Letter Ref & Date Line
  pdf.setFont('Times', 'bold');
  pdf.text('Letter Ref. No.:', x, y);
  pdf.setFont('Times', 'normal');
  pdf.text(`IM/2026/IAL/${letterNumber}`, x + pdf.getTextWidth('Letter Ref. No.:') + 2, y);
  pdf.setFont('Times', 'bold');
  pdf.text('Date:', 163, y);
  pdf.setFont('Times', 'normal');
  pdf.text(` ${letterDate}`, 174, y);
  y += 10;

  // 4. Candidate Addressee
  pdf.setFont('Helvetica', 'normal');
  pdf.text('To,', x, y); y += 6;
  pdf.setFont('Helvetica', 'bold');
  pdf.text(studentName, x, y); y += 6;
  pdf.setFont('Helvetica', 'bold');
  const detailColonX = x + 45;
  const detailValueX = detailColonX + 5;
  pdf.text('University Reg. Number', x, y);
  pdf.text(':', detailColonX, y);
  pdf.setFont('Helvetica', 'normal');
  pdf.text(registrationNumber, detailValueX, y); y += 6;
  pdf.setFont('Helvetica', 'bold');
  pdf.text('College / Institution', x, y);
  pdf.text(':', detailColonX, y);
  pdf.setFont('Helvetica', 'normal');
  pdf.text(college, detailValueX, y); y += 12;

  // 5. Salutation & Acceptance Body
  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.text('Dear Candidate,', x, y); y += 4.8;
  y = renderRichText(pdf, [
    { text: 'We are pleased to accept your application and formally offer you an internship at ' },
    { text: 'Patliputra University (PPU) Technical Internship Council.', bold: true },
    { text: ' Our internship programmes are designed in full alignment with ' },
    { text: 'NEP-2020, AICTE and UGC Internship Guidelines,', bold: true },
    { text: " and your university's specific internship framework." }
  ], x, y, W - 2 * ML, 4.3, 9.5) + 7;

  // 6. Internship Specification Details
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('Your internship details are as follows:', x, y); y += 7;

  const rowX = x + 8;
  const colC = 78, colV = 82, rH = 6;
  const rows: [string, string][] = [
    ['Name of the Student', studentName],
    ['University Roll Number', rollNumber],
    ['College / Institution', college],
    ['Department & Semester', deptSemester],
    ['Internship Domain', domain],
    ['Internship Duration', '120 Hours'],
    ['Mode of Internship', `${internshipMode} (as approved by College)`]
  ];

  rows.forEach(([label, value]) => {
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(20, 20, 20);
    pdf.text(label, rowX, y);
    pdf.text(':', colC, y);
    pdf.setFont('Helvetica', 'normal');
    pdf.text(value, colV, y);
    y += rH;
  });
  y += 5;

  // 7. Instructions Paragraph
  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(9.5);
  y = renderRichText(pdf, [
    { text: 'Please report to us on your start date as per the schedule above and bring this letter along with the ' },
    { text: 'Consent Letter', bold: true },
    { text: ' issued by your College. We also request that you inform your ' },
    { text: 'College Internship Nodal Officer (CINO)', bold: true },
    { text: ' upon receiving this acceptance letter. During the programme, you are required to maintain the minimum required attendance and complete all tasks and assignments given by your mentor.' }
  ], x, y, W - 2 * ML, 4.2, 9.5) + 4;

  renderRichText(pdf, [
    { text: 'We look forward to a meaningful and enriching internship experience and appreciate your interest in ' },
    { text: 'Patliputra University (PPU) Technical Internship Council.', bold: true }
  ], x, y, W - 2 * ML, 4.2, 9.5);

  // 8. Footer Banner Image
  if (footerImg) {
    try {
      pdf.addImage(footerImg, 'PNG', 0, H - footerH, W, footerH);
    } catch (e) {
      console.warn('Failed to render footer image:', e);
    }
  }

  return pdf;
}

export function offerLetterFileName(studentName?: string): string {
  return `PPO_Intern_Offer_Letter_${(studentName || 'Student').replace(/\s+/g, '_')}.pdf`;
}

export async function createOfferLetterPdfForUser(userId: string, profile: Partial<UserProfile>): Promise<jsPDF> {
  const [letterNumber, template] = await Promise.all([
    getOrCreateOfferLetterNumber(userId),
    getTemplateForStudent(profile)
  ]);
  return createOfferLetterPdf(profile, letterNumber, template);
}
