import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  effect,
  HostListener,
  inject,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-layout',
  imports: [
    RouterModule,
    MatToolbarModule,
    NgOptimizedImage,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  public sidenav: Signal<MatSidenav | undefined> = viewChild<
    MatSidenav | undefined
  >('sidenav');

  private router: Router = inject(Router);

  public isMobile: WritableSignal<boolean> = signal(false);

  public constructor() {
    this.checkMobileScreen();

    effect(() => {
      if (!this.isMobile()) {
        this.sidenav()?.open();
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event): void {
    this.checkMobileScreen();
  }

  private checkMobileScreen(): void {
    this.isMobile.set(window.innerWidth <= 768); // Threshold for mobile view (can be adjusted)
  }

  public navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  public toggleSideNav(): void {
    this.sidenav()?.toggle(!this.sidenav()?.opened);
  }
}
