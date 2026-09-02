import { Injectable, signal, computed } from '@angular/core';
import { SupervisorSession, SupervisorUser } from '../models/construction.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Shared fixed security password for all 10 supervisor accounts
  readonly SHARED_SUPERVISOR_PASSWORD = 'TrojanSafety#2026';

  // 10 Authorized Supervisor Profiles with unique email/username, designation, first name, and surname
  readonly SUPERVISOR_ROSTER: SupervisorUser[] = [
    {
      id: 'EMP-001',
      firstName: 'Basiouny',
      surname: '',
      name: 'Basiouny',
      email: 'basiouny@trojan.ae',
      usernameAlias: 'foreman01@trojan.ae',
      designation: 'Foreman',
      computerNo: 'EMP-8849',
      Language: 'Arabic,English,Hindi',
      contractorName: 'TGC',
      // phone: '+1 (555) 234-8849',
      role: 'Foreman'
    },
    {
      id: 'EMP-002',
      firstName: 'Rehmat',
      surname: 'Ali',
      name: 'Rehmat Ali',
      email: 'rehmat.ali@trojan.ae',
      usernameAlias: 'foreman02`@trojan.ae',
      designation: 'Foreman',
      computerNo: 'EMP-8850',
      Language: 'Bhojpuri + Hindi + English ',
      contractorName: 'TGC',
      // phone: '+1 (555) 234-8850',
      role: 'Foreman'
    },
    {
      id: 'EMP-003',
      firstName: 'Rahid',
      surname: '',
      name: 'Rahid ',
      email: 'rahid@trojan.ae',
      usernameAlias: 'foreman03@trojan.ae',
      designation: 'Foreman',
      computerNo: 'EMP-8851',
      Language: 'Pashto + Urdu',
      contractorName:  'TGC',
      // phone: '+1 (555) 234-8851',
      role:'Foreman'
    },
    {
      id: 'EMP-004',
      firstName: 'Rahil',
      surname: '',
      name: 'Rahil',
      email: 'rahil@trojan.ae',
      usernameAlias: 'foreman04@trojan.ae',
      designation: 'Foreman',
      computerNo: 'EMP-8852',
      Language: 'Pashto + Urdu',
      contractorName: 'TGC',
      // phone: '+1 (555) 234-8852',
      role: 'Foreman'
    },
    {
      id: 'EMP-005',
      firstName: 'Fazal',
      surname: '',
      name: 'Fazal ',
      email: 'fazal@trojan.ae',
      usernameAlias: 'foreman05@trojan.ae',
      designation: 'Foreman',
      computerNo: 'EMP-8853',
      Language: 'Pashto + Urdu + Arabic W',
      contractorName: 'TGC',
      // phone: '+1 (555) 234-8853',
      role: 'Foreman'
    },
     {
      id: 'EMP-006',
      firstName: 'Savad',
      surname: 'Mohamed Salim',
      name: 'Savad Mohamed Salim ',
      email: 'savad.salim@trojan.ae',
      usernameAlias: 'hse06@trojan.ae',
      designation: 'HSE Officer',
      computerNo: 'EMP-8854',
      Language: 'English + Malayalam +Hindi',
      contractorName: 'TGC',
      // phone: '+1 (555) 234-8853',
      role: 'HSE Officer'
    }
  ];

  // Default credentials legacy fallback
  readonly FIXED_SUPERVISOR_CREDS = {
    username: 'savad.salim@trojan.ae',
    alternateUsername: 'supervisor@trojan.ae',
    password: this.SHARED_SUPERVISOR_PASSWORD
  };

  private currentSupervisorSignal = signal<SupervisorSession | null>(null);
  
  readonly currentSupervisor = this.currentSupervisorSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentSupervisorSignal() !== null);

  constructor() {
    this.restoreSession();
  }

  private restoreSession() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('apex_supervisor_session');
      if (saved) {
        try {
          this.currentSupervisorSignal.set(JSON.parse(saved));
        } catch {
          localStorage.removeItem('apex_supervisor_session');
        }
      }
    }
  }

  // --- Supervisor Fetcher & Query Helpers ---
  getAllSupervisors(): SupervisorUser[] {
    return [...this.SUPERVISOR_ROSTER];
  }

  getSupervisorById(id: string): SupervisorUser | undefined {
    return this.SUPERVISOR_ROSTER.find(s => s.id.toLowerCase() === id.trim().toLowerCase());
  }

  getSupervisorByEmail(email: string): SupervisorUser | undefined {
    const clean = email.trim().toLowerCase();
    return this.SUPERVISOR_ROSTER.find(
      s => s.email.toLowerCase() === clean || (s.usernameAlias && s.usernameAlias.toLowerCase() === clean)
    );
  }

  getSupervisorBySurname(surname: string): SupervisorUser | undefined {
    const clean = surname.trim().toLowerCase();
    return this.SUPERVISOR_ROSTER.find(s => s.surname.toLowerCase() === clean);
  }

  getSupervisorsByDesignation(keyword: string): SupervisorUser[] {
    const clean = keyword.trim().toLowerCase();
    return this.SUPERVISOR_ROSTER.filter(s => s.designation.toLowerCase().includes(clean));
  }

  getSupervisorByComputerNo(compNo: string): SupervisorUser | undefined {
    const clean = compNo.trim().toLowerCase();
    return this.SUPERVISOR_ROSTER.find(s => s.computerNo.toLowerCase() === clean);
  }

  // --- Authentication Handler ---
  login(identifier: string, pass: string): { success: boolean; message: string; user?: SupervisorUser } {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check shared password
    const matchesPass =
      cleanPass === this.SHARED_SUPERVISOR_PASSWORD ||
      cleanPass === 'TrojanSafety#2026' ||
      cleanPass === 'safety2025';

    if (!matchesPass) {
      return {
        success: false,
        message: 'Invalid security password. Please enter the authorized supervisor password: TrojanSafety#2026'
      };
    }

    // Match against any of the 10 supervisor profiles (by email, username alias, computer badge no, or fallback keyword)
    let matchedUser = this.SUPERVISOR_ROSTER.find(
      s =>
        s.email.toLowerCase() === cleanId ||
        (s.usernameAlias && s.usernameAlias.toLowerCase() === cleanId) ||
        s.computerNo.toLowerCase() === cleanId ||
        s.id.toLowerCase() === cleanId
    );

    // Fallback aliases (e.g. 'supervisor', 'supervisor01', 'supervisor1', etc.)
    if (!matchedUser) {      
      if (cleanId === 'supervisor' || cleanId === 'supervisor01' || cleanId === 'supervisor1') {
        matchedUser = this.SUPERVISOR_ROSTER[0];
      } else if (cleanId.startsWith('supervisor') && cleanId.length <= 13) {
        const num = parseInt(cleanId.replace(/\D/g, ''), 10);
        if (!isNaN(num) && num >= 1 && num <= this.SUPERVISOR_ROSTER.length) {
          matchedUser = this.SUPERVISOR_ROSTER[num - 1];
        }
      }
    }

    if (matchedUser) {      
      const session: SupervisorSession = {
        id: matchedUser.id,
        firstName: matchedUser.firstName,
        surname: matchedUser.surname,
        name: matchedUser.name,
        email: matchedUser.email,
        designation: matchedUser.designation,
        computerNo: matchedUser.computerNo,
        Language: matchedUser.Language,
        contractorName: matchedUser.contractorName,
        phone: matchedUser.phone,
        role: matchedUser.role
      };

      this.currentSupervisorSignal.set(session);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('apex_supervisor_session', JSON.stringify(session));
      }

      return {
        success: true,
        message: `Authentication successful. Welcome, ${matchedUser.designation} ${matchedUser.firstName} ${matchedUser.surname}.`,
        user: matchedUser
      };
    }

    return {
      success: false,
      message: 'Account not recognized. Please provide an authorized email'
    };
  }

  logout() {
    this.currentSupervisorSignal.set(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('apex_supervisor_session');
    }
  }

  demoFill(supervisorEmail?: string) {
    const target = supervisorEmail
      ? this.getSupervisorByEmail(supervisorEmail) || this.SUPERVISOR_ROSTER[0]
      : this.SUPERVISOR_ROSTER[0];

    return {
      username: target.email,
      password: this.SHARED_SUPERVISOR_PASSWORD
    };
  }
}
