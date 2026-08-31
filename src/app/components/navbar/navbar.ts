import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <header class="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-lg">
      <!-- Top info bar -->
      <div class="bg-stone-950 px-4 py-1.5 text-xs text-stone-400 border-b border-stone-800/80">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1">
              <mat-icon class="!text-orange-400 !text-sm !w-4 !h-4 leading-none">verified</mat-icon>
              ISO 45001 & ISO 14001 Certified Construction Group
            </span>
            <span class="hidden md:inline text-stone-700">|</span>
            <span class="hidden md:flex items-center gap-1 text-emerald-400">
              <mat-icon class="!text-emerald-400 !text-sm !w-4 !h-4 leading-none">security</mat-icon>
              500+ Days Lost-Time Injury Free
            </span>
          </div>
        </div>
      </div>

      <!-- Main navigation -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
            
            <div>
            
              <div class="flex items-center gap-1.5">
               <div class="w-10 h-10 rounded-sm  text-white flex items-center justify-center font-bold text-xxl shadow-lg  group-hover:scale-105 transition-transform">
                <img src="https://imgs.search.brave.com/ZBcMxV1uSEITPN2teekJ0i7X26H0nwY8YSRiXLD2wyQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/YnJhbmRmZXRjaC5p/by9pZDc1NGxoTFY0/L3cvNDAwL2gvNDAw/L3RoZW1lL2Rhcmsv/aWNvbi5qcGVnP2M9/MWJ4aWQ2NE11cDdh/Y3pld1NBWU1YJnQ9/MTc4MTczOTY4Mjg3/OQ" alt="Photo 1">
    
            </div>
                <span class="font-display font-extrabold text-3xl tracking-tight text-white group-hover:text-orange-400 transition-colors">
                  TROJAN CONSTRUCTION HOLDING
                </span>
                
              </div>
            </div>

          <!-- Desktop Navigation Links -->
          <nav class="hidden md:flex items-center gap-1.5 text-sm font-semibold tracking-wide uppercase">
            <a
              routerLink="/"
              routerLinkActive="bg-stone-800 text-orange-400"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 rounded-lg text-xs font-bold text-stone-300 hover:text-white hover:bg-stone-800/60 transition-all flex items-center gap-1.5"
            >
              <mat-icon class="!text-lg !w-5 !h-5">domain</mat-icon>
              Home
            </a>

            <a
              routerLink="/supervisor-portal"
              routerLinkActive="bg-orange-600 text-white font-bold shadow-md shadow-orange-600/20"
              class="px-4 py-2 rounded-full bg-stone-800 border border-stone-700 text-xs font-bold text-stone-200 hover:text-white hover:bg-stone-700 transition-all flex items-center gap-1.5 ml-2"
            >
              <mat-icon class="!text-lg !w-5 !h-5">assignment_turned_in</mat-icon>
              Supervisor Portal
              @if (authService.isAuthenticated()) {
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              }
            </a>

            <a
              routerLink="/contact"
              routerLinkActive="bg-stone-800 text-orange-400"
              class="px-4 py-2 rounded-lg text-xs font-bold text-stone-300 hover:text-white hover:bg-stone-800/60 transition-all flex items-center gap-1.5 ml-1"
            >
              <mat-icon class="!text-lg !w-5 !h-5">contact_support</mat-icon>
              Contact Us
            </a>
          </nav>

          <!-- Right Action / User Status -->
          <div class="flex items-center gap-3">
            @if (authService.isAuthenticated()) {
              <div class="hidden sm:flex items-center gap-2 bg-stone-800/90 border border-stone-700 px-3 py-1.5 rounded-lg text-xs">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span class="text-stone-300 font-medium truncate max-w-[140px]">
                  {{ authService.currentSupervisor()?.name?.split(' ')?.[0] || 'Supervisor' }}
                </span>
                <button
                  type="button"
                  (click)="authService.logout()"
                  class="text-stone-400 hover:text-red-400 transition-colors ml-1 p-0.5"
                  title="Log out"
                >
                  <mat-icon class="!text-sm !w-4 !h-4">logout</mat-icon>
                </button>
              </div>
            } @else {
              <a
                routerLink="/supervisor-portal"
                class="hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-stone-800 hover:bg-stone-700 text-orange-400 px-3.5 py-2 rounded-lg border border-stone-700 transition-all shadow-sm"
              >
                <mat-icon class="!text-orange-400 !text-sm !w-4 !h-4">lock</mat-icon>
                Supervisor Login
              </a>
            }

            <!-- Mobile menu icon button -->
            <a
              routerLink="/supervisor-portal"
              class="md:hidden p-2 rounded-lg bg-stone-800 text-orange-400 hover:bg-stone-700"
              title="Supervisor Portal"
            >
              <mat-icon class="!text-xl !w-5 !h-5">assignment</mat-icon>
            </a>
          </div>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
}
