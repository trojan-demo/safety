import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <header class="sticky top-0 z-50 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-lg">

      <!-- Top info bar -->
      <div class="bg-stone-950 px-4 py-1.5 text-xs text-stone-400 border-b border-stone-800/80">
        <div class="max-w-7xl mx-auto flex items-center justify-between">

          <div class="flex items-center gap-1 min-w-0">
            <mat-icon
              class="!text-orange-400 !text-sm !w-4 !h-4 shrink-0">
              verified
            </mat-icon>

            <span class="truncate">
              ISO 45001 & ISO 14001 Certified Construction Group
            </span>
          </div>

          <span class="hidden md:flex items-center gap-1 text-emerald-400 shrink-0 ml-4">
            <mat-icon class="!text-emerald-400 !text-sm !w-4 !h-4">
              security
            </mat-icon>
            500+ Days Lost-Time Injury Free
          </span>

        </div>
      </div>


      <!-- Main Navigation -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="flex items-center justify-between min-h-20 py-2">

          <!-- Logo / Company Name -->
          <div class="flex items-center min-w-0 flex-1">

            <div class="flex items-center gap-2 min-w-0">

              <!-- Logo -->
              <div class="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center">
  <img
    src="trojanlogo.png"
    alt="Trojan Construction logo"
    class="w-full h-full object-contain"
  />
</div>

              <!-- Company Name -->
              <span
                class="font-display font-extrabold
                       text-lg sm:text-3xl
                       leading-tight tracking-tight
                       text-white
                       min-w-0">

                TROJAN CONSTRUCTION HOLDING

              </span>

            </div>

          </div>


          <!-- Desktop Navigation -->
          <nav
            class="hidden md:flex items-center gap-1.5
                   text-sm font-semibold tracking-wide uppercase
                   shrink-0 ml-4">

            <!-- Home -->
            <a
              routerLink="/"
              routerLinkActive="bg-stone-800 text-orange-400"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 rounded-lg text-xs font-bold
                     text-stone-300
                     hover:text-white hover:bg-stone-800/60
                     transition-all flex items-center gap-1.5">

              <mat-icon class="!text-lg !w-5 !h-5">
                domain
              </mat-icon>

              Home
            </a>


            <!-- Supervisor Portal -->
            <a
              routerLink="/supervisor-portal"
              routerLinkActive="bg-orange-600 text-white font-bold shadow-md shadow-orange-600/20"
              class="px-4 py-2 rounded-full
                     bg-stone-800 border border-stone-700
                     text-xs font-bold text-stone-200
                     hover:text-white hover:bg-stone-700
                     transition-all flex items-center gap-1.5 ml-2">

              <mat-icon class="!text-lg !w-5 !h-5">
                assignment_turned_in
              </mat-icon>

              Supervisor Portal

              @if (authService.isAuthenticated()) {
                <span
                  class="w-2 h-2 rounded-full
                         bg-emerald-400 animate-pulse">
                </span>
              }

            </a>


            <!-- Contact -->
            <a
              routerLink="/contact"
              routerLinkActive="bg-stone-800 text-orange-400"
              class="px-4 py-2 rounded-lg
                     text-xs font-bold text-stone-300
                     hover:text-white hover:bg-stone-800/60
                     transition-all flex items-center gap-1.5 ml-1">

              <mat-icon class="!text-lg !w-5 !h-5">
                contact_support
              </mat-icon>

              Contact Us

            </a>

          </nav>


          <!-- Right side -->
          <div class="flex items-center gap-2 sm:gap-3 ml-2 shrink-0">

            <!-- Logged-in user -->
            @if (authService.isAuthenticated()) {

              <div
                class="hidden sm:flex items-center gap-2
                       bg-stone-800/90 border border-stone-700
                       px-3 py-1.5 rounded-lg text-xs">

                <span
                  class="w-2 h-2 rounded-full bg-emerald-400">
                </span>

                <span
                  class="text-stone-300 font-medium
                         truncate max-w-[140px]">

                  {{
                    authService.currentSupervisor()?.name?.split(' ')?.[0]
                    || 'Supervisor'
                  }}

                </span>

                 <button
                  type="button"
                  (click)="authService.logout()"
                  class="text-stone-300
                         hover:text-red-400
                         transition-colors
                         p-1
                         rounded
                         hover:bg-stone-700"
                  title="Log out"
                  aria-label="Log out">

                  <mat-icon
                    class="!text-lg !w-5 !h-5">

                    logout

                  </mat-icon>

                </button>


              </div>

            } @else {

              <!-- Desktop login -->
              <a
                routerLink="/supervisor-portal"
                class="hidden sm:flex items-center gap-1.5
                       text-xs font-bold uppercase tracking-wider
                       bg-stone-800 hover:bg-stone-700
                       text-orange-400 px-3.5 py-2
                       rounded-lg border border-stone-700
                       transition-all shadow-sm">

                <mat-icon
                  class="!text-orange-400 !text-sm !w-4 !h-4">
                  lock
                </mat-icon>

                Supervisor Login

              </a>

            }


            <!-- MOBILE HAMBURGER -->
            <button
              type="button"
              class="md:hidden flex items-center justify-center
                     w-10 h-10 rounded-lg
                     bg-stone-800 border border-stone-700
                     text-orange-400
                     hover:bg-stone-700
                     transition-colors"
              (click)="mobileMenuOpen = !mobileMenuOpen"
              [attr.aria-expanded]="mobileMenuOpen"
              aria-label="Toggle navigation menu">

              <mat-icon>
                {{ mobileMenuOpen ? 'close' : 'menu' }}
              </mat-icon>

            </button>

          </div>

        </div>


        <!-- MOBILE MENU -->
        @if (mobileMenuOpen) {

          <div
            class="md:hidden border-t border-stone-800
                   bg-stone-950 py-3">

            <nav class="flex flex-col gap-1">

              <!-- Home -->
              <a
                routerLink="/"
                routerLinkActive="bg-stone-800 text-orange-400"
                [routerLinkActiveOptions]="{ exact: true }"
                class="flex items-center gap-3
                       px-4 py-3 rounded-lg
                       text-sm font-bold text-stone-300
                       hover:bg-stone-800
                       hover:text-white
                       transition-colors"
                (click)="closeMobileMenu()">

                <mat-icon class="!text-xl">
                  domain
                </mat-icon>

                Home

              </a>


              <!-- Supervisor Portal -->
              <a
                routerLink="/supervisor-portal"
                routerLinkActive="bg-stone-800 text-orange-400"
                class="flex items-center gap-3
                       px-4 py-3 rounded-lg
                       text-sm font-bold text-stone-300
                       hover:bg-stone-800
                       hover:text-white
                       transition-colors"
                (click)="closeMobileMenu()">

                <mat-icon class="!text-xl">
                  assignment_turned_in
                </mat-icon>

                Supervisor Portal

              </a>


              <!-- Contact -->
              <a
                routerLink="/contact"
                routerLinkActive="bg-stone-800 text-orange-400"
                class="flex items-center gap-3
                       px-4 py-3 rounded-lg
                       text-sm font-bold text-stone-300
                       hover:bg-stone-800
                       hover:text-white
                       transition-colors"
                (click)="closeMobileMenu()">

                <mat-icon class="!text-xl">
                  contact_support
                </mat-icon>

                Contact Us

              </a>
                <!-- MOBILE LOGOUT -->
              @if (authService.isAuthenticated()) {

                <button
                  type="button"
                  (click)="authService.logout(); mobileMenuOpen = false"
                  class="w-full
                         flex items-center gap-3
                         px-4 py-3
                         rounded-lg
                         text-sm font-bold
                         text-red-400
                         hover:bg-stone-800
                         transition-colors
                         text-left">

                  <mat-icon
                    class="!text-xl !w-5 !h-5">

                    logout

                  </mat-icon>

                  Logout

                </button>

              }


              <!-- MOBILE LOGIN -->
              @else {

                <a
                  routerLink="/supervisor-portal"
                  class="flex items-center gap-3
                         px-4 py-3
                         rounded-lg
                         text-sm font-bold
                         text-orange-400
                         hover:bg-stone-800
                         transition-colors"
                  (click)="mobileMenuOpen = false">

                  <mat-icon
                    class="!text-xl !w-5 !h-5">

                    lock

                  </mat-icon>

                  Supervisor Login

                </a>

              }



            </nav>

          </div>

        }

      </div>

    </header>
  `
})
export class NavbarComponent {

  authService = inject(AuthService);

  mobileMenuOpen = false;

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

}