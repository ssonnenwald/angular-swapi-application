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
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatListItem,
  MatListItemIcon,
  MatListItemTitle,
  MatNavList,
} from '@angular/material/list';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    MatToolbar,
    MatToolbarRow,
    NgOptimizedImage,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatNavList,
    MatListItem,
    MatIcon,
    MatListItemIcon,
    MatListItemTitle,
    MatIconButton,
    RouterLink,
    RouterLinkActive,
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
