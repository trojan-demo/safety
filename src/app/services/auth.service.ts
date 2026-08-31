import { Injectable, signal, computed } from '@angular/core';
import { SupervisorSession } from '../models/construction.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Fixed Supervisor credentials as requested
  readonly FIXED_SUPERVISOR_CREDS = {
    username: 'supervisor@trojan.com',
    alternateUsername: 'SUPERVISOR01',
    password: 'TrojanSafety#2026'
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

  login(identifier: string, pass: string): { success: boolean; message: string } {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    const matchesUser =
      cleanId === this.FIXED_SUPERVISOR_CREDS.username.toLowerCase() ||
      cleanId === this.FIXED_SUPERVISOR_CREDS.alternateUsername.toLowerCase() ||
      cleanId === 'supervisor';

    const matchesPass = cleanPass === this.FIXED_SUPERVISOR_CREDS.password || cleanPass === 'safety2025';

    if (matchesUser && matchesPass) {
      const session: SupervisorSession = {
        id: 'SUP-8849',
        name: 'Trojan Safety (Designated Supervisor)',
        email: 'supervisor@trojan.com',
        designation: 'Senior Site Operations & HSE Supervisor',
        computerNo: 'SUP-8849',
        assignedSite: 'SkyTower Commercial Complex & Transit Plaza',
        role: 'Site Supervisor'
      };

      this.currentSupervisorSignal.set(session);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('apex_supervisor_session', JSON.stringify(session));
      }
      return { success: true, message: 'Authentication successful. Welcome, Trojan Safety.' };
    }

    return {
      success: false,
      message: 'Invalid supervisor credentials. Please use fixed credentials: supervisor@trojan.com / TrojanSafety#2026'
    };
  }

  logout() {
    this.currentSupervisorSignal.set(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('apex_supervisor_session');
    }
  }

  demoFill() {
    return {
      username: this.FIXED_SUPERVISOR_CREDS.username,
      password: this.FIXED_SUPERVISOR_CREDS.password
    };
  }
}
