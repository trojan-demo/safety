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
    doc.setFontSize(15);
    doc.setTextColor(17, 24, 39);
    doc.text('Daily HSE Inspection Form', pageWidth / 2, 14, { align: 'center' });

    // Project & Meta Sub-header banner
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    const subheaderText = `Audit Date: ${submission.date || new Date().toISOString().split('T')[0]}`;
    doc.text(subheaderText, pageWidth / 2, 19, { align: 'center' });

    // Prepare table body rows
    const tableBody: RowInput[] = [];

    categories.forEach((cat) => {
      // Category header row
      tableBody.push([
        {
          content: `${cat.categoryNumber}.`,
          styles: { fontStyle: 'bold', fillColor: [219, 234, 254], textColor: [15, 23, 42] }
        },
        {
          content: cat.categoryName,
          styles: { fontStyle: 'bold', fillColor: [219, 234, 254], textColor: [15, 23, 42] }
        },
        {
          content: '',
          styles: { fillColor: [219, 234, 254] }
        },
        {
          content: '',
          styles: { fillColor: [219, 234, 254] }
        }
      ]);

      // Items inside category
      cat.items.forEach((item) => {
        const val = submission.checklist[item.id] || '';
        const isYes = val === 'Yes';
        const isNo = val === 'No';

        const yesMark = isYes ? '[X] Yes' : '[  ] Yes';
        const noMark = isNo ? '[X] No' : '[  ] No';

        tableBody.push([
          item.id,
          item.text,
          {
            content: yesMark,
            styles: {
              fontStyle: isYes ? 'bold' : 'normal',
              textColor: isYes ? [22, 101, 52] : [100, 116, 139]
            }
          },
          {
            content: noMark,
            styles: {
              fontStyle: isNo ? 'bold' : 'normal',
              textColor: isNo ? [185, 28, 28] : [100, 116, 139]
            }
          }
        ]);
      });
    });

    // Generate Main Inspection Table
    autoTable(doc, {
      startY: 23,
      margin: { left: margin, right: margin, bottom: 20 },
      head: [
        [
          { content: 'Sl No', styles: { fontStyle: 'bold', halign: 'center' } },
          { content: 'Daily Site HSE Inspection', styles: { fontStyle: 'bold' } },
          { content: 'Yes', styles: { fontStyle: 'bold', halign: 'center', cellWidth: 20 } },
          { content: 'No', styles: { fontStyle: 'bold', halign: 'center', cellWidth: 20 } }
        ]
      ],
      body: tableBody,
      theme: 'grid',
      styles: {
        fontSize: 7.8,
        cellPadding: 2,
        lineColor: [51, 65, 85],
        lineWidth: 0.2,
        textColor: [30, 41, 59]
      },
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [15, 23, 42],
        lineColor: [51, 65, 85],
        lineWidth: 0.3
      },
      columnStyles: {
        0: { cellWidth: 14, halign: 'center' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 20, halign: 'center' }
      },
      didDrawPage: () => {
        // Page numbers
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        const pageStr = `Page ${doc.getNumberOfPages()} of `;
        doc.text(pageStr, pageWidth - margin - 15, pageHeight - 8);
      }
    });

    // Add Metadata & Signatures block
    const finalY = (doc.lastAutoTable?.finalY ?? 200) + 4;
    const footerStartY = finalY > 230 ? (() => { doc.addPage(); return 15; })() : finalY;

    autoTable(doc, {
      startY: footerStartY,
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 3,
        lineColor: [51, 65, 85],
        lineWidth: 0.25,
        textColor: [15, 23, 42]
      },
      body: [
        [
          { content: `Date: ${submission.date || '—'}`, styles: { cellWidth: 50 } },
          { content: `Name: ${submission.supervisorName || '—'}`, styles: { cellWidth: 70 } },
          { content: `Designation: ${submission.designation || 'Site Supervisor'}`, styles: { cellWidth: 'auto' } }
        ],
        [
          { content: `Computer No: ${submission.computerNo || '—'}`, styles: { cellWidth: 50 } },
          { content: `Signature: ${submission.supervisorSignature ? '[Electronically Signed]' : '_______________'}`, colSpan: 2, styles: { fontStyle: 'bold' } }
        ],
        [
          { content: `HSE Officer: ${submission.hseOfficerName || 'Savad Mohamed Salim'}`, styles: { cellWidth: 50 } },
          { content: `Signature: __________________________`, colSpan: 2 }
        ],
        [
          {
            content: `PPE Adherence:   ${submission.ppeAdherence === 'Yes' ? '[X] Yes   [  ] No' : '[  ] Yes   [X] No'}`,
            colSpan: 3,
            styles: { fontStyle: 'bold', fillColor: [248, 250, 252] }
          }
        ],
        [
          {
            content: `Audit Summary: Compliance Score: ${submission.stats?.scorePercentage ?? 100}% | Yes: ${submission.stats?.yesCount ?? 0} | Action Items Flagged: ${submission.stats?.noCount ?? 0}\nObservations / Corrective Action: ${submission.correctiveActions || 'Site safety conditions verified according to ISO 45001 standards.'}`,
            colSpan: 3,
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
    title = 'Daily HSE Inspection Form'
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

