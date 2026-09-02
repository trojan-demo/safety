import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule],
  template: `
    <footer class="bg-stone-950 text-stone-400 border-t border-stone-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <!-- Col 1: About Group -->
          <div>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-9 h-9 rounded bg-orange-600 text-white flex items-center justify-center font-black">
                <mat-icon class="!text-white !text-xl !w-5 !h-5">construction</mat-icon>
              </div>
              <span class="font-display font-extrabold text-xl text-white tracking-tight uppercase">
                TROJAN CONSTRUCTION HOLDING
              </span>
            </div>
            <p class="text-sm leading-relaxed text-stone-400 mb-5">
              Delivering high-precision commercial, infrastructure, and heavy civil engineering projects backed by uncompromising safety standards and zero-harm execution.
            </p>
            <div class="flex flex-wrap gap-2 text-xs font-semibold">
              <span class="px-2.5 py-1 rounded bg-stone-900 text-stone-300 border border-stone-800">ISO 9001:2015</span>
              <span class="px-2.5 py-1 rounded bg-stone-900 text-stone-300 border border-stone-800">ISO 45001:2018</span>
              <span class="px-2.5 py-1 rounded bg-stone-900 text-stone-300 border border-stone-800">ISO 14001:2015</span>
            </div>
          </div>

          <!-- Col 2: Quick Links -->
          <div>
            <h4 class="text-white font-bold text-xs uppercase tracking-widest mb-4 border-b border-stone-800 pb-2">
              Navigation
            </h4>
            <ul class="space-y-2.5 text-sm">
              <li>
                <a routerLink="/" class="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <mat-icon class="!text-orange-400 !text-xs !w-3.5 !h-3.5">chevron_right</mat-icon>
                  Home & Overview
                </a>
              </li>
              <li>
                <a routerLink="/supervisor-portal" class="hover:text-orange-400 transition-colors flex items-center gap-1.5 font-semibold text-orange-400">
                  <mat-icon class="!text-orange-400 !text-xs !w-3.5 !h-3.5">lock</mat-icon>
                  Employee HSE Inspection Portal
                </a>
              </li>
              <li>
                <a routerLink="/contact" class="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <mat-icon class="!text-orange-400 !text-xs !w-3.5 !h-3.5">chevron_right</mat-icon>
                  Contact Us & Enquiries
                </a>
              </li>
            </ul>
          </div>

          <!-- Col 3: HSE Officer Desk -->
          <div>
            <h4 class="text-white font-bold text-xs uppercase tracking-widest mb-4 border-b border-stone-800 pb-2">
              HSE Officer Desk
            </h4>
            <div class="space-y-3 text-sm">
              <div class="flex items-start gap-2.5">
                <mat-icon class="!text-orange-400 !text-lg !w-5 !h-5 shrink-0 mt-0.5">verified_user</mat-icon>
                <div>
                  <div class="text-white font-semibold">Savad Mohamed Salim (HSE Officer)</div>
                  <div class="text-xs text-stone-400">HSE Officer</div>
                </div>
              </div>
              <div class="flex items-start gap-2.5">
                <mat-icon class="!text-orange-400 !text-lg !w-5 !h-5 shrink-0 mt-0.5">email</mat-icon>
                <div>
                  <div class="text-xs text-stone-400">Direct Audit Email:</div>
                  <a href="mailto:savad.salim@trojan.ae" class="text-white hover:text-orange-400 transition-colors text-xs font-mono">
                    savad.salim@trojan.ae
                  </a>
                </div>
              </div>
              <div class="flex items-start gap-2.5">
                <mat-icon class="!text-emerald-400 !text-lg !w-5 !h-5 shrink-0 mt-0.5">chat</mat-icon>
                <div>
                  <div class="text-xs text-stone-400">WhatsApp Safety Dispatch:</div>
                  <a href="https://wa.me/000000" target="_blank" class="text-emerald-400 hover:underline text-xs font-mono">
                    000000000
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Col 4: Corporate Headquarters -->
          <div>
            <h4 class="text-white font-bold text-xs uppercase tracking-widest mb-4 border-b border-stone-800 pb-2">
              Corporate Office
            </h4>
            <div class="space-y-3 text-sm">
              <div class="flex items-start gap-2.5">
                <mat-icon class="!text-orange-400 !text-lg !w-5 !h-5 shrink-0 mt-0.5">location_on</mat-icon>
                <span class="text-stone-300">
                  Trojan Construction Holding
                  Worker City 1 - Jarn Yafour - Mafraq Industrial Area - Abu Dhabi - United Arab Emirates
                </span>
              </div>
              <div class="flex items-start gap-2.5">
                <mat-icon class="!text-orange-400 !text-lg !w-5 !h-5 shrink-0 mt-0.5">call</mat-icon>
                <span class="text-stone-300">Tel : +971 25097300</span>
              </div>
              <div class="flex items-start gap-2.5">
                <mat-icon class="!text-orange-400 !text-lg !w-5 !h-5 shrink-0 mt-0.5">schedule</mat-icon>
                <span class="text-stone-400 text-xs">Mon - Fri: 08:00 AM - 05:00 PM (Site Operations 24/7)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-12 pt-6 border-t border-stone-900 text-[10px] text-stone-400 flex flex-col md:flex-row items-center justify-between gap-4 uppercase tracking-widest">
          <p>© 2026 TROJAN CONSTRUCTION HOLDING Group. All rights reserved.</p>
          <div class="flex items-center gap-6">
            <span class="text-stone-400">Zero-Harm Workplace Policy</span>
            <span class="text-stone-400">ISO 45001 Certified Operations</span>
            <a routerLink="/supervisor-portal" class="text-orange-400 hover:underline">Employee Portal</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
