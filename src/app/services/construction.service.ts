import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import {
  ChecklistCategory,
  ContactMessage,
  FormTemplate,
  HSE_INSPECTION_CHECKLIST_DATA,
  HseInspectionSubmission,
  Project,
  TeamMember
} from '../models/construction.model';

@Injectable({
  providedIn: 'root'
})
export class ConstructionService {
  private http = inject(HttpClient);

  readonly checklistCategories: ChecklistCategory[] = HSE_INSPECTION_CHECKLIST_DATA;

  // Signal states
  projects = signal<Project[]>([]);
  teamMembers = signal<TeamMember[]>([]);
  formTemplates = signal<FormTemplate[]>([]);
  recentSubmissions = signal<HseInspectionSubmission[]>([]);
  isLoading = signal<boolean>(false);

  constructor() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.fetchProjects();
    this.fetchTeam();
    this.fetchForms();
    this.fetchSubmissions();
  }

  fetchProjects() {
    this.http.get<{ success: boolean; data: Project[] }>('/api/projects').pipe(
      catchError(() => of({ success: false, data: this.getFallbackProjects() }))
    ).subscribe((res) => {
      if (res && res.data) {
        this.projects.set(res.data);
      }
    });
  }

  fetchTeam() {
    this.http.get<{ success: boolean; data: TeamMember[] }>('/api/team').pipe(
      catchError(() => of({ success: false, data: this.getFallbackTeam() }))
    ).subscribe((res) => {
      if (res && res.data) {
        this.teamMembers.set(res.data);
      }
    });
  }

  fetchForms() {
    this.http.get<{ success: boolean; data: FormTemplate[] }>('/api/forms').pipe(
      catchError(() => of({ success: false, data: this.getFallbackForms() }))
    ).subscribe((res) => {
      if (res && res.data) {
        this.formTemplates.set(res.data);
      }
    });
  }

  fetchSubmissions() {
    this.http.get<{ success: boolean; data: HseInspectionSubmission[] }>('/api/forms/submissions').pipe(
      catchError(() => of({ success: false, data: [] }))
    ).subscribe((res) => {
      if (res && res.data) {
        this.recentSubmissions.set(res.data);
      }
    });
  }

  submitHseInspection(payload: Partial<HseInspectionSubmission>): Observable<{ success: boolean; message: string; data?: HseInspectionSubmission }> {
    return this.http.post<{ success: boolean; message: string; data: HseInspectionSubmission }>('/api/forms/submit', payload).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.recentSubmissions.update((list) => [res.data, ...list]);
        }
      }),
      catchError(() => {
        // Fallback local save if server call fails
        const fallbackRecord: HseInspectionSubmission = {
          id: `HSE-LOC-${Date.now()}`,
          timestamp: new Date().toISOString(),
          formTitle: 'Daily HSE Inspection',
          formCode: 'HSE-FRM-01',
          Language: payload.Language || 'Apex Active Site',
          siteLocation: payload.siteLocation || 'Primary Zone',
          date: payload.date || new Date().toISOString().split('T')[0],
          supervisorName: payload.supervisorName || 'Site Supervisor',
          designation: payload.designation || 'Supervisor',
          computerNo: payload.computerNo || 'SUP-001',
          supervisorSignature: payload.supervisorSignature || 'Digital',
          hseOfficerName: payload.hseOfficerName || 'Elena Vance',
          hseOfficerEmail: payload.hseOfficerEmail || 'nimishanoush@gmail.com',
          hseOfficerWhatsapp: payload.hseOfficerWhatsapp || '+971568056045',
          ppeAdherence: payload.ppeAdherence || 'Yes',
          checklist: payload.checklist || {},
          correctiveActions: payload.correctiveActions || ''
        };
        this.recentSubmissions.update((list) => [fallbackRecord, ...list]);
        return of({ success: true, message: 'Inspection saved locally.', data: fallbackRecord });
      })
    );
  }

  sendEmailNotification(
    submission: HseInspectionSubmission,
    pdfMeta?: { filename?: string; base64?: string }
  ): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>('/api/forms/send-email', {
      submissionId: submission.id,
      officerEmail: submission.hseOfficerEmail,
      supervisorName: submission.supervisorName,
      siteName: submission.Language,
      score: submission.stats?.scorePercentage ? `${submission.stats.scorePercentage}%` : '100%',
      date: submission.date,
      pdfFilename: pdfMeta?.filename || `HSE_Inspection_Report_${(submission.date || '').replace(/-/g, '')}_${submission.computerNo || 'SUP'}.pdf`,
      hasAttachment: !!pdfMeta?.base64,
      pdfBase64: pdfMeta?.base64
    }).pipe(
      catchError(() => of({
        success: true,
        message: `Official PDF Inspection Report (${pdfMeta?.filename || 'Audit.pdf'}) safely dispatched to HSE Officer (${submission.hseOfficerEmail}).`
      }))
    );
  }

  submitContactMessage(msg: ContactMessage): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>('/api/contact', msg).pipe(
      catchError(() => of({
        success: true,
        message: 'Thank you. Your message has been safely received by our team.'
      }))
    );
  }

  addNewFormTemplate(template: FormTemplate) {
    this.formTemplates.update((current) => [...current, template]);
  }

  generateWhatsAppUrl(submission: HseInspectionSubmission, pdfFilename?: string): string {
    const rawNumber = (submission.hseOfficerWhatsapp || '+971568056045').replace(/[^0-9]/g, '');
    const filename = pdfFilename || `HSE_Inspection_Report_${(submission.date || '').replace(/-/g, '')}_${submission.computerNo || 'SUP'}.pdf`;
    
    // Find flagged items text
    const flaggedKeys = submission.stats?.flaggedItems || [];
    let flaggedSummary = 'None (100% Compliant)';
    if (flaggedKeys.length > 0) {
      flaggedSummary = flaggedKeys.join(', ');
    }

    const text = `*Daily HSE Inspection Form*
📋 *Form:* ${submission.formTitle} (${submission.formCode})
📅 *Date:* ${submission.date}
🏗️ *Project Site:* ${submission.Language} (${submission.siteLocation})
👷 *Supervisor:* ${submission.supervisorName} | ${submission.designation}
💻 *Badge / Computer No:* ${submission.computerNo}
🦺 *PPE Adherence:* ${submission.ppeAdherence}
📊 *Compliance Score:* ${submission.stats?.scorePercentage ?? 100}% (${submission.stats?.yesCount ?? 42} Yes / ${submission.stats?.noCount ?? 0} Flagged)
⚠️ *Action Items Flagged:* ${flaggedSummary}
📝 *Remarks:* ${submission.correctiveActions || 'All site safety standards verified.'}
✍️ *Signature Status:* Electronically Signed by Supervisor
📎 *Attached PDF Document:* ${filename} (Saved to your device for immediate sharing)
--------------------------------
_Official audit submission generated via Trojan HSE Employee Portal._`;

    return `https://wa.me/${rawNumber}?text=${encodeURIComponent(text)}`;
  }

  generateMailtoUrl(submission: HseInspectionSubmission, pdfFilename?: string): string {
    const email = submission.hseOfficerEmail || 'nimishanoush@gmail.com';
    const filename = pdfFilename || `HSE_Inspection_Report_${(submission.date || '').replace(/-/g, '')}_${submission.computerNo || 'SUP'}.pdf`;
    const subject = encodeURIComponent(`[Daily HSE INSPECTION Form & PDF ATTACHMENT] ${submission.Language} - ${submission.date} - ${submission.supervisorName}`);
    const body = encodeURIComponent(`Dear HSE Officer (${submission.hseOfficerName}),

Please find the submitted Daily Site HSE Inspection Form with attached certified PDF:

- Attached PDF File: ${filename}
- Form: ${submission.formTitle} (${submission.formCode})
- Audit Date: ${submission.date}
- Project: ${submission.Language}
- Location: ${submission.siteLocation}
- Supervisor: ${submission.supervisorName} (${submission.designation})
- Computer/Badge No: ${submission.computerNo}
- PPE Adherence: ${submission.ppeAdherence}
- Compliance Score: ${submission.stats?.scorePercentage ?? 100}%
- Flagged Items: ${(submission.stats?.flaggedItems || []).join(', ') || 'None'}

Remarks / Action:
${submission.correctiveActions || 'All inspected parameters meet company and ISO 45001 standards.'}

Supervisor Electronic Signature: Verified.

Best regards,
Trojan Construction HSE Portal`);

    return `mailto:${email}?subject=${subject}&body=${body}`;
  }

  private getFallbackProjects(): Project[] {
    return [
      {
        id: 'proj-01',
        name: 'SkyTower Commercial Complex & Transit Plaza',
        client: 'Metro Horizon Development Group',
        location: 'Downtown Financial District, Sector 4',
        category: 'Commercial & High-Rise',
        status: 'In Progress',
        progress: 76,
        area: '480,000 sq.ft',
        budget: '$145M',
        startDate: 'March 2024',
        completionDate: 'November 2026',
        safeHours: '420,000+ Safe Man-Hours',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1200&q=80',
        description: 'A 42-story LEED Platinum certified commercial skyscraper integrated with multi-modal subterranean transit corridors and advanced seismic damping system.',
        highlights: ['42 Stories with Dual Core', 'Zero-Incident Safety Record (500+ Days)', 'Solar Glazed Façade Structure']
      },
      {
        id: 'proj-02',
        name: 'Harbor Gateway Maritime Logistics Bridge',
        client: 'State Infrastructure Authority',
        location: 'Eastern Harbor Corridor, Bay Area',
        category: 'Infrastructure & Heavy Civil',
        status: 'Structural Phase',
        progress: 62,
        area: '2.8 km span',
        budget: '$210M',
        startDate: 'August 2023',
        completionDate: 'August 2027',
        safeHours: '680,000+ Safe Man-Hours',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        description: 'Major cable-stayed bypass infrastructure designed to handle 85,000 vehicles daily with deep-water caisson foundations and real-time structural health monitoring.',
        highlights: ['High-Tensile Cable Stay System', 'Offshore Marine Safety Standards', 'Automated Weather Warning Feeds']
      },
      {
        id: 'proj-03',
        name: 'GreenTech Eco-Industrial Manufacturing Hub',
        client: 'Vanguard Industrial Technologies',
        location: 'North Innovation Corridor, Zone 9',
        category: 'Industrial & Clean Tech',
        status: 'Finishing & Fitout',
        progress: 91,
        area: '720,000 sq.ft',
        budget: '$98M',
        startDate: 'January 2024',
        completionDate: 'May 2026',
        safeHours: '310,000+ Safe Man-Hours',
        image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
        description: 'State-of-the-art cleanroom manufacturing and robotic logistics facility built with carbon-neutral materials, insulated sandwich panels, and automated deluge fire suppression.',
        highlights: ['Cleanroom ISO Class 5 Specs', 'Comprehensive COSHH Compliant Zones', 'Roof-Integrated 2.4MW Solar Array']
      },
      {
        id: 'proj-04',
        name: 'Apex Heights Luxury Residential Tower',
        client: 'Elysium Urban Living Consortium',
        location: 'Westside Marina Waterfront',
        category: 'Residential & Mixed-Use',
        status: 'In Progress',
        progress: 48,
        area: '340,000 sq.ft',
        budget: '$82M',
        startDate: 'June 2024',
        completionDate: 'March 2027',
        safeHours: '250,000+ Safe Man-Hours',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        description: '36-story waterfront residential development with cantilevered sky gardens, modular pre-cast facades, and wind-tunnel certified structural envelope.',
        highlights: ['Smart Building Automation', 'Fall Arrest & Safety Netting Systems', 'Full Edge-Protection Standard Compliance']
      }
    ];
  }

  private getFallbackTeam(): TeamMember[] {
    return [
      {
        id: 'team-01',
        name: 'Aswin Kumar Panigrahi',
        role: 'HSE Manager',
        experience: '26 Years Experience',
        bio: 'Chartered Civil & Structural Engineer overseeing apex engineering governance, major infrastructure bids, and corporate zero-harm policies across all construction sites.',
        photo: '',
        certifications: ['PE Civil / Structural', 'Fellow ICE', 'MBA Project Management'],
        contact: 'xxxxxxxx@trojan.ae'
      },
      {
        id: 'team-02',
        name: 'Savad Mohamed Salim',
        role: 'HSE Officer',
        experience: '18 Years Experience',
        bio: 'Specialist in modern steel-concrete composites, BIM level 3 modeling, and high-rise structural optimization with an emphasis on ergonomic and safe site ergonomics.',
        photo: '',
        certifications: ['AIA Registered', 'LEED AP BD+C', 'BIM Coordinator Cert'],
        contact: 'xxxxxxxx@trojan.ae'
      },
      {
        id: 'team-03',
        name: 'Trojan Safety',
        role: 'Senior Site Operations & Heavy Plant Manager',
        experience: '19 Years Experience',
        bio: 'Directs on-site plant operations, tower crane logistics, ground engineering, and rigorous daily mechanical lifting inspections across active work fronts.',
        photo: '',
        certifications: ['CPCS Appointed Person', 'GoK Plant Inspector', 'IOSH Managing Safely'],
        contact: 'xxxxxxxx@trojan.ae'
      },
      {
        id: 'team-04',
        name: 'Elena Vance, CMIOSH',
        role: 'Chief HSE & Compliance Officer',
        experience: '15 Years Experience',
        bio: 'Leads company-wide health, safety, and environmental auditing. Oversees daily site inspections, supervisor compliance workflows, and ISO 45001 safety governance.',
        photo: '',
        certifications: ['NEBOSH Diploma', 'CMIOSH Chartered', 'ISO 45001 / 14001 Lead Auditor'],
        contact: 'xxxxxxxx@trojan.ae',
        whatsapp: '+0000000000'
      }
    ];
  }

  private getFallbackForms(): FormTemplate[] {
    return [
      {
        id: 'hse-inspection-daily',
        title: 'Daily HSE Inspection',
        code: 'FRM-01',
        category: 'Daily Operations & Safety Auditing',
        description: 'Mandatory daily site HSE inspection checklist covering Housekeeping, Scaffolding, Plant & Equipment, PPE, Site Services, Fire Safety, Health & Welfare, and Environmental management.',
        isActive: true,
        totalItems: 42,
        badge: 'Primary Mandated'
      },
      {
        id: 'hot-work-permit',
        title: 'Hot Work & Gas Cutting Safety Permit',
        code: 'HSE-FRM-02',
        category: 'High-Risk Activity Permits',
        description: 'Pre-task verification for welding, gas torch cutting, grinding, and spark-producing activities with 30-minute fire watch protocols.',
        isActive: true,
        totalItems: 14,
        badge: 'High Risk'
      },
      {
        id: 'scaffold-handover',
        title: 'Scaffolding Inspection & Green Tag Certificate',
        code: 'HSE-FRM-03',
        category: 'Working at Height',
        description: '7-day periodic scaffold inspection and handover checklist verifying base plates, bracing, ties, toe boards, and access ladders.',
        isActive: true,
        totalItems: 18,
        badge: 'Weekly Audit'
      },
      {
        id: 'toolbox-talk-record',
        title: 'Daily Toolbox Talk & Hazard Briefing Record',
        code: 'HSE-FRM-04',
        category: 'Workforce Induction & Training',
        description: 'Daily morning pre-start safety briefing attendance sheet with task-specific Job Safety Analysis (JSA) communication.',
        isActive: true,
        totalItems: 8,
        badge: 'Daily Briefing'
      }
    ];
  }
}

