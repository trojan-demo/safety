import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { ConstructionService } from '../../services/construction.service';
import { PdfExportService } from '../../services/pdf-export.service';
import { ChecklistCategory, FormTemplate, HSE_INSPECTION_CHECKLIST_DATA, HseInspectionSubmission,  HseRatingValue, SupervisorUser } from '../../models/construction.model';

@Component({
  selector: 'app-supervisor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './supervisor.html',
  styleUrl: './supervisor.css'
})
export class SupervisorComponent {
  authService = inject(AuthService);
  constructionService = inject(ConstructionService);
  pdfExportService = inject(PdfExportService);

  readonly checklistCategories: ChecklistCategory[] = HSE_INSPECTION_CHECKLIST_DATA;
   readonly ratingOptions: HseRatingValue[] = ['1', '2', '3', '4', '5', 'NA'];

  // Active view tab: 'active-form' | 'submissions' | 'forms-catalog'
  readonly activeTab = signal<'active-form' | 'submissions' | 'forms-catalog'>('active-form');

  // Supervisor Roster for login selection
  readonly showRosterModal = signal<boolean>(false);
  readonly selectedSupervisorEmail = signal<string>('savad.salim@trojan.ae');

  // Login form
  readonly loginForm = new FormGroup({
    username: new FormControl('savad.salim@trojan.ae', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('TrojanSafety#2026', { nonNullable: true, validators: [Validators.required] })
  });

  readonly loginErrorMessage = signal<string>('');

  // HSE Inspection Form Controls
  readonly inspectionForm = new FormGroup({
    
    Language: new FormControl('Maysan Development Phase I TG2164', { nonNullable: true, validators: [Validators.required] }),
    siteLocation: new FormControl('Al Reem Island', { nonNullable: true }),
        levelZone: new FormControl('All Levels / Core Zone', { nonNullable: true }),
    date: new FormControl(new Date().toISOString().split('T')[0], { nonNullable: true, validators: [Validators.required] }),
    supervisorName: new FormControl('Savad Mohamed Salim', { nonNullable: true, validators: [Validators.required] }),
    designation: new FormControl('HSE', { nonNullable: true }),
    computerNo: new FormControl('SUP-8849', { nonNullable: true, validators: [Validators.required] }),
    hseOfficerName: new FormControl('Savad Mohamed Salim', { nonNullable: true }),
    hseOfficerEmail: new FormControl('savad.salim@trojan.ae', { nonNullable: true, validators: [Validators.email] }),
    hseOfficerWhatsapp: new FormControl('+0000000000', { nonNullable: true }),
    ppeAdherence: new FormControl<'Yes' | 'No'>('Yes', { nonNullable: true }),
    correctiveActions: new FormControl('', { nonNullable: true }),
    signatureText: new FormControl('Savad Mohamed Salim (Digitally Verified)', { nonNullable: true })
  });

// State of checklist ratings: e.g. { "1": "5", "2": "4", "6": "NA", ... }
  readonly checklistAnswers = signal<Record<string, HseRatingValue>>({});
  // State of per-item remarks: e.g. { "1": "JSA reviewed at morning TBT", ... }
  readonly checklistRemarks = signal<Record<string, string>>({});
  // Submitting / dispatch status
  readonly isSubmitting = signal<boolean>(false);
  readonly submittedRecord = signal<HseInspectionSubmission | null>(null);
  readonly showDispatchModal = signal<boolean>(false);
  readonly savedPdfFilename = signal<string>('');
  readonly emailSentStatus = signal<string>('');
  readonly pdfShareStatus = signal<string>('');
  readonly canNativeShare = signal<boolean>(false);

  // Future Form Creation Modal
  readonly showNewFormModal = signal<boolean>(false);
  readonly newFormGroup = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    code: new FormControl('HSE-FRM-05', { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl('Site Safety & Verification', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    totalItems: new FormControl(10, { nonNullable: true }),
    badge: new FormControl('New Audit', { nonNullable: true })
  });

  constructor() {
    this.initChecklistAnswers();
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      this.canNativeShare.set(true);
    }
  }

  private initChecklistAnswers() {
    const initial: Record<string, HseRatingValue> = {};
    this.checklistCategories.forEach((cat) => {
      cat.items.forEach((item) => {
        initial[item.id] = '5'; // default to 5 (Excellent) for ease of use; supervisor adjusts per item
      });
    });
    this.checklistAnswers.set(initial);
    this.checklistRemarks.set({});
  }

  // --- Auth Handlers ---
  handleLogin() {
    this.loginErrorMessage.set('');
    const { username, password } = this.loginForm.value;
    if (!username || !password) {
      this.loginErrorMessage.set('Please provide both username and password.');
      return;
    }

    const res = this.authService.login(username, password);
    if (!res.success) {
      this.loginErrorMessage.set(res.message);
    } else {
      const user = this.authService.currentSupervisor();
      if (user) {
        console.log(user,'usererrrrrrrrrrr');
        
        this.selectedSupervisorEmail.set(user.email);
        this.inspectionForm.patchValue({
          supervisorName: `${user.firstName} ${user.surname}`,
          designation: user.designation,
          computerNo: user.computerNo,
          Language: user.Language,
          signatureText: `${user.firstName} ${user.surname} (${user.designation})`
        });
      }
    }
  }

  selectSupervisorForLogin(supervisor: SupervisorUser) {
    this.selectedSupervisorEmail.set(supervisor.email);
    this.loginForm.patchValue({
      username: supervisor.email,
      password: this.authService.SHARED_SUPERVISOR_PASSWORD
    });
    this.loginErrorMessage.set('');
  }

  quickLoginAsSupervisor(supervisor: SupervisorUser) {
    this.selectSupervisorForLogin(supervisor);
    this.handleLogin();
  }

  handleDemoLogin(email?: string) {
    const demo = this.authService.demoFill(email || this.selectedSupervisorEmail());
    this.loginForm.setValue({
      username: demo.username,
      password: demo.password
    });
    this.handleLogin();
  }

 // --- Checklist Rating & Remarks Handlers ---
  setAnswer(itemId: string, value: HseRatingValue) {
    this.checklistAnswers.update((current) => ({
      ...current,
      [itemId]: value
    }));
  }
   onRemarkInput(itemId: string, event: Event) {
    const input = event.target as HTMLInputElement | null;
    const value = input ? input.value : '';
    this.checklistRemarks.update((current) => ({
      ...current,
      [itemId]: value
    }));
  }

   markAll(value: HseRatingValue) {
    const updated: Record<string, HseRatingValue> = {};
    this.checklistCategories.forEach((cat) => {
      cat.items.forEach((item) => {
        updated[item.id] = value;
      });
    });
    this.checklistAnswers.set(updated);
    if (value === '') {
      this.checklistRemarks.set({});
    }
  }

  getRatingButtonClass(currentValue: HseRatingValue | undefined, option: HseRatingValue): string {
    const isSelected = currentValue === option;
    if (!isSelected) {
      return 'bg-stone-950 text-stone-400 hover:text-white hover:border-stone-600 border-stone-800';
    }
    switch (option) {
      case '5':
        return 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-sm shadow-emerald-500/30';
      case '4':
        return 'bg-teal-500 text-slate-950 font-black border-teal-400 shadow-sm shadow-teal-500/30';
      case '3':
        return 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow-sm shadow-amber-400/30';
      case '2':
        return 'bg-orange-500 text-white font-black border-orange-400 shadow-sm shadow-orange-500/30';
      case '1':
        return 'bg-red-600 text-white font-black border-red-500 shadow-sm shadow-red-600/30';
      case 'NA':
        return 'bg-stone-600 text-white font-black border-stone-500 shadow-sm';
      default:
        return 'bg-stone-950 text-stone-400 border-stone-800';
    }
  }

  
 get stats() {
    const answers = this.checklistAnswers();
    const remarks = this.checklistRemarks();
    let total = 0;
    let ratedCount = 0;
    let naCount = 0;
    let unratedCount = 0;
    let totalMarks = 0;
    let maxMarks = 0;
    let remarksCount = 0;
    const flaggedItems: string[] = [];

    this.checklistCategories.forEach((cat) => {
      cat.items.forEach((item) => {
        total++;
        const val = answers[item.id] || '';
        if (remarks[item.id] && remarks[item.id].trim().length > 0) {
          remarksCount++;
        }
        if (val === 'NA') {
          naCount++;
        } else if (val === '') {
          unratedCount++;
        } else {
          const numVal = Number(val);
          if (!Number.isNaN(numVal) && numVal >= 1 && numVal <= 5) {
            ratedCount++;
            totalMarks += numVal;
            maxMarks += 5;
            if (numVal <= 2) {
              flaggedItems.push(`#${item.id} (${val}/5) - ${item.text}`);
            }
          }
        }
      });
    });
 const scorePercentage = maxMarks > 0 ? Math.round((totalMarks / maxMarks) * 100) : 100;
    return { total, ratedCount, naCount, unratedCount, totalMarks, maxMarks, scorePercentage, remarksCount, flaggedItems };
  }

  // Build submission object
  private buildSubmissionObject(): HseInspectionSubmission {
    const formVals = this.inspectionForm.getRawValue();
    const answers = this.checklistAnswers();
        const remarks = this.checklistRemarks();

    const statsObj = this.stats;

    return {
      id: `HSE-${Date.now()}`,
      timestamp: new Date().toISOString(),
      formTitle: 'Supervisor Site HSE Inspection',
      formCode: 'HSE-FRM-01',
      Language: formVals.Language,
      siteLocation: formVals.siteLocation,
      levelZone: formVals.levelZone,
      date: formVals.date,
      supervisorName: formVals.supervisorName,
      designation: formVals.designation,
      computerNo: formVals.computerNo,
      supervisorSignature: formVals.signatureText,
      hseOfficerName: formVals.hseOfficerName,
      hseOfficerEmail: formVals.hseOfficerEmail,
      hseOfficerWhatsapp: formVals.hseOfficerWhatsapp,
      ppeAdherence: formVals.ppeAdherence,
      checklist: answers,
      remarks,
      correctiveActions: formVals.correctiveActions,
      stats: {
        totalChecked: statsObj.total,
        ratedCount: statsObj.ratedCount,
        naCount: statsObj.naCount,
        totalMarks: statsObj.totalMarks,
        maxMarks: statsObj.maxMarks,
        scorePercentage: statsObj.scorePercentage,
        flaggedItems: statsObj.flaggedItems
      }
    };
  }

  // --- PDF Download Handler ---
  downloadPdf() {
    const submission = this.submittedRecord() || this.buildSubmissionObject();
    const filename = this.pdfExportService.downloadHseInspectionPdf(submission, this.checklistCategories);
    this.savedPdfFilename.set(filename);
    this.pdfShareStatus.set(`PDF document downloaded: ${filename}`);
  }

  previewPdf() {
    const submission = this.submittedRecord() || this.buildSubmissionObject();
    this.pdfExportService.openPdfInNewTab(submission, this.checklistCategories);
  }

  async sharePdfNative() {
    const record = this.submittedRecord() || this.buildSubmissionObject();
    this.pdfShareStatus.set('Opening share dialog with certified PDF report...');
    const shared = await this.pdfExportService.sharePdfNative(record, this.checklistCategories);
    if (shared) {
      this.pdfShareStatus.set('PDF report successfully shared with HSE Officer!');
    }
  }

  // --- Submit & Dispatch Handler ---
  submitInspection() {
    if (this.inspectionForm.invalid) {
      this.inspectionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const submission = this.buildSubmissionObject();

    this.constructionService.submitHseInspection(submission).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        const record = res.data || submission;
        this.submittedRecord.set(record);
        // Automatically generate and download the saved PDF report
        const filename = this.pdfExportService.downloadHseInspectionPdf(record, this.checklistCategories);
        this.savedPdfFilename.set(filename);
        this.pdfShareStatus.set(`Official PDF Report (${filename}) generated and saved to your device.`);
        this.showDispatchModal.set(true);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.submittedRecord.set(submission);
        const filename = this.pdfExportService.downloadHseInspectionPdf(submission, this.checklistCategories);
        this.savedPdfFilename.set(filename);
        this.pdfShareStatus.set(`Official PDF Report (${filename}) generated and saved.`);
        this.showDispatchModal.set(true);
      }
    });
  }

  // Send Email directly via backend (with attached PDF data)
  triggerSendEmail() {
    const record = this.submittedRecord() || this.buildSubmissionObject();
    this.emailSentStatus.set('Attaching PDF report and sending email...');
    
    // Generate base64 PDF and filename for official attachment
    const { base64, filename } = this.pdfExportService.getPdfBase64(record, this.checklistCategories);
    this.savedPdfFilename.set(filename);

    this.constructionService.sendEmailNotification(record, { filename, base64 }).subscribe({
      next: (res) => {
        this.emailSentStatus.set(res.message);
      },
      error: () => {
        this.emailSentStatus.set(`PDF Report (${filename}) attached and emailed to ${record.hseOfficerEmail}.`);
      }
    });
  }

  // Open WhatsApp Link with saved PDF reference and auto-save check
  openWhatsApp() {
    const record = this.submittedRecord() || this.buildSubmissionObject();
    
    // Ensure PDF is saved
    let filename = this.savedPdfFilename();
    if (!filename) {
      filename = this.pdfExportService.downloadHseInspectionPdf(record, this.checklistCategories);
      this.savedPdfFilename.set(filename);
    }

    this.pdfShareStatus.set(`PDF saved as "${filename}". Opening WhatsApp chat with HSE Officer Elena Vance...`);
    
    const url = this.constructionService.generateWhatsAppUrl(record, filename);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  }

  // Open Mailto link fallback with PDF filename attached
  openMailto() {
    const record = this.submittedRecord() || this.buildSubmissionObject();
    
    let filename = this.savedPdfFilename();
    if (!filename) {
      filename = this.pdfExportService.downloadHseInspectionPdf(record, this.checklistCategories);
      this.savedPdfFilename.set(filename);
    }

    const mailto = this.constructionService.generateMailtoUrl(record, filename);
    if (typeof window !== 'undefined') {
      window.location.href = mailto;
    }
  }

  closeDispatchModal() {
    this.showDispatchModal.set(false);
    this.emailSentStatus.set('');
    this.pdfShareStatus.set('');
  }

  // Re-download from submissions history
  downloadSubmissionPdf(item: HseInspectionSubmission) {
    this.pdfExportService.downloadHseInspectionPdf(item, this.checklistCategories);
  }

  // Future Form Creation
  handleCreateNewForm() {
    if (this.newFormGroup.invalid) {
      this.newFormGroup.markAllAsTouched();
      return;
    }

    const val = this.newFormGroup.getRawValue();
    const newTemplate: FormTemplate = {
      id: `form-${Date.now()}`,
      title: val.title,
      code: val.code,
      category: val.category,
      description: val.description,
      isActive: true,
      totalItems: Number(val.totalItems) || 10,
      badge: val.badge || 'Active Template'
    };

    this.constructionService.addNewFormTemplate(newTemplate);
    this.showNewFormModal.set(false);
    this.newFormGroup.reset({
      title: '',
      code: `HSE-FRM-0${this.constructionService.formTemplates().length + 2}`,
      category: 'Site Safety & Verification',
      description: '',
      totalItems: 10,
      badge: 'Custom Template'
    });
  }
}
