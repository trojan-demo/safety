import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { ChecklistCategory, HseInspectionSubmission } from '../models/construction.model';

interface AutoTableJsPdfWithFinalY extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  generateHseInspectionPdf(
    submission: HseInspectionSubmission,
    categories: ChecklistCategory[]
  ): jsPDF {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    }) as AutoTableJsPdfWithFinalY;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;

    // Helper: Header block on Page 1
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 95);
    doc.text('Daily Site HSE Inspection / Performance Evaluation', pageWidth / 2, 13, { align: 'center' });

    // Rating legend subtitle
    doc.setFontSize(7.8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(
      'Rating: 5 - Excellent | 4 - Good | 3 - Fair/Needs Improvement | 2 - Poor | 1 - Unsatisfactory | NA - Not Applicable',
      pageWidth / 2,
      18,
      { align: 'center' }
    );

    // Prepare table body rows
    const tableBody: RowInput[] = [];
    let totalMarks = 0;
    let maxMarks = 0;

    categories.forEach((cat) => {
      // Category header row (A. ..., B. ..., etc.)
      tableBody.push([
        {
          content: `${cat.categoryCode}. ${cat.categoryName}`,
          colSpan: 4,
          styles: {
            fontStyle: 'bold',
            fillColor: [219, 234, 254],
            textColor: [30, 58, 95]
          }
        }
      ]);

      // Items inside category
      cat.items.forEach((item) => {
        const rating = submission.checklist[item.id] || '';
        const remarkText = (submission.remarks && submission.remarks[item.id]) ? submission.remarks[item.id] : '';

        const numVal = Number(rating);
        if (!Number.isNaN(numVal) && numVal >= 1 && numVal <= 5) {
          totalMarks += numVal;
          maxMarks += 5;
        }

        let ratingColor: [number, number, number] = [30, 41, 59];
        if (rating === '5' || rating === '4') {
          ratingColor = [22, 101, 52];
        } else if (rating === '3') {
          ratingColor = [180, 83, 9];
        } else if (rating === '2' || rating === '1') {
          ratingColor = [185, 28, 28];
        } else if (rating === 'NA') {
          ratingColor = [100, 116, 139];
        }

        tableBody.push([
          `${item.id}.`,
          item.text,
          {
            content: rating || '—',
            styles: {
              fontStyle: 'bold',
              halign: 'center',
              textColor: ratingColor
            }
          },
          {
            content: remarkText,
            styles: {
              textColor: [51, 65, 85]
            }
          }
        ]);
      });
    });

    const computedTotalMarks = submission.stats?.totalMarks ?? totalMarks;
    const computedMaxMarks = submission.stats?.maxMarks ?? maxMarks;
    const computedPercent = computedMaxMarks > 0 ? Math.round((computedTotalMarks / computedMaxMarks) * 100) : 100;

    // Total Marks row
    tableBody.push([
      {
        content: 'Total Marks',
        colSpan: 2,
        styles: {
          fontStyle: 'bold',
          fillColor: [241, 245, 249],
          textColor: [15, 23, 42]
        }
      },
      {
        content: `${computedTotalMarks} / ${computedMaxMarks}`,
        styles: {
          fontStyle: 'bold',
          halign: 'center',
          fillColor: [241, 245, 249],
          textColor: [30, 58, 95]
        }
      },
      {
        content: `Overall Performance Score: ${computedPercent}%`,
        styles: {
          fontStyle: 'bold',
          fillColor: [241, 245, 249],
          textColor: [22, 101, 52]
        }
      }
    ]);

    // Generate Main Inspection Table
    autoTable(doc, {
      startY: 21,
      margin: { left: margin, right: margin, bottom: 18 },
      head: [
        [
          { content: 'Sl. No.', styles: { fontStyle: 'bold', halign: 'center' } },
          { content: 'HSE Inspection / Performance Criteria', styles: { fontStyle: 'bold' } },
          { content: 'Rating\n(1-5/NA)', styles: { fontStyle: 'bold', halign: 'center' } },
          { content: 'Remarks', styles: { fontStyle: 'bold' } }
        ]
      ],
      body: tableBody,
      theme: 'grid',
      styles: {
        fontSize: 7.4,
        cellPadding: 1.8,
        lineColor: [71, 85, 105],
        lineWidth: 0.2,
        textColor: [30, 41, 59],
        valign: 'middle'
      },
      headStyles: {
        fillColor: [30, 64, 104],
        textColor: [255, 255, 255],
        lineColor: [51, 65, 85],
        lineWidth: 0.3
      },
      columnStyles: {
        0: { cellWidth: 13, halign: 'center' },
        1: { cellWidth: 96 },
        2: { cellWidth: 22, halign: 'center' },
        3: { cellWidth: 'auto' }
      },
      didDrawPage: () => {
        // Page numbers
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        const pageStr = `Page ${doc.getNumberOfPages()}`;
        doc.text(pageStr, pageWidth - margin - 14, pageHeight - 8);
      }
    });

    // Add Metadata & Signatures block matching PDF Page 3 + sign-off details
    const finalY = (doc.lastAutoTable?.finalY ?? 200) + 5;
    const footerStartY = finalY > 235 ? (() => { doc.addPage(); return 15; })() : finalY;

    autoTable(doc, {
      startY: footerStartY,
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2.8,
        lineColor: [51, 65, 85],
        lineWidth: 0.25,
        textColor: [15, 23, 42]
      },
      body: [
        [
          { content: `Project: ${submission.Language || '—'}`, styles: { fontStyle: 'bold', cellWidth: 91 } },
          { content: `Location: ${submission.siteLocation || '—'}`, styles: { fontStyle: 'bold', cellWidth: 91 } }
        ],
        [
          { content: `Level/Zone: ${submission.levelZone || 'General Site'}`, styles: { fontStyle: 'bold' } },
          { content: `Date: ${submission.date || '—'}`, styles: { fontStyle: 'bold' } }
        ],
        [
          { content: `Task Supervisor Name: ${submission.supervisorName || '—'} (${submission.computerNo || '—'})`, styles: { fontStyle: 'bold' } },
          { content: `Signature: ${submission.supervisorSignature ? `${submission.supervisorSignature} [Digitally Verified]` : '_______________'}`, styles: { fontStyle: 'bold' } }
        ],
        [
          { content: `HSO/I Name: ${submission.hseOfficerName || 'Savad Mohamed Salim'}`, styles: { fontStyle: 'bold' } },
          { content: `Signature: __________________________`, styles: { fontStyle: 'bold' } }
        ],
        [
          {
            content: `Designation: ${submission.designation || 'Site Supervisor'}   |   PPE Adherence: ${submission.ppeAdherence === 'Yes' ? '[X] Yes  [ ] No' : '[ ] Yes  [X] No'}`,
            colSpan: 2,
            styles: { fontSize: 7.5, fillColor: [248, 250, 252] }
          }
        ],
        [
          {
            content: `Summary & Observations: Total Marks ${computedTotalMarks}/${computedMaxMarks} (${computedPercent}%) | NA Items: ${submission.stats?.naCount ?? 0} | Flagged (1-2): ${submission.stats?.flaggedItems?.length ?? 0}\nCorrective Actions / Overall Remarks: ${submission.correctiveActions || 'Site safety conditions verified according to ISO 45001 standards.'}`,
            colSpan: 2,
            styles: { fontSize: 7.5, textColor: [71, 85, 105] }
          }
        ]
      ]
    });

    return doc;
  }

  getPdfFilename(submission: HseInspectionSubmission): string {
    const dateStr = (submission.date || new Date().toISOString().split('T')[0]).replace(/-/g, '');
    const compNo = (submission.computerNo || 'SUP').replace(/[^a-zA-Z0-9_-]/g, '');
    return `HSE_Inspection_Report_${dateStr}_${compNo}.pdf`;
  }

  getPdfFile(submission: HseInspectionSubmission, categories: ChecklistCategory[]): { blob: Blob; file: File; filename: string } {
    const doc = this.generateHseInspectionPdf(submission, categories);
    const blob = doc.output('blob');
    const filename = this.getPdfFilename(submission);
    const file = new File([blob], filename, { type: 'application/pdf' });
    return { blob, file, filename };
  }

  getPdfBase64(submission: HseInspectionSubmission, categories: ChecklistCategory[]): { base64: string; filename: string } {
    const doc = this.generateHseInspectionPdf(submission, categories);
    const dataUri = doc.output('datauristring');
    const base64 = dataUri.split(',')[1] || '';
    const filename = this.getPdfFilename(submission);
    return { base64, filename };
  }

  downloadHseInspectionPdf(submission: HseInspectionSubmission, categories: ChecklistCategory[]): string {
    const doc = this.generateHseInspectionPdf(submission, categories);
    const filename = this.getPdfFilename(submission);
    doc.save(filename);
    return filename;
  }

  openPdfInNewTab(submission: HseInspectionSubmission, categories: ChecklistCategory[]) {
    const doc = this.generateHseInspectionPdf(submission, categories);
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    if (typeof window !== 'undefined') {
      window.open(blobUrl, '_blank');
    }
  }

  async sharePdfNative(
    submission: HseInspectionSubmission,
    categories: ChecklistCategory[],
    title = 'Daily Inspection Report'
  ): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.share) {
      return false;
    }

    try {
      const { file, filename } = this.getPdfFile(submission, categories);
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title,
          text: `Official HSE Site Inspection Report (${submission.Language || 'Site'}) - ${filename}`,
          files: [file]
        });
        return true;
      }
    } catch {
      // User cancelled or share failed
      return false;
    }
    return false;
  }
}

