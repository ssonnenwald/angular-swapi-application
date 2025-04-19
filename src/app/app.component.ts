import { Component, inject } from '@angular/core';
import { LayoutComponent } from './core/components/layout/layout.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private iconRegistry: MatIconRegistry = inject(MatIconRegistry);
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  public title: string = 'Angular Swapi Application';

  constructor() {
    this.registerIcons();
  }

  private registerIcons(): void {
    // Films
    this.iconRegistry.addSvgIcon(
      'sw_film',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'icons/theaters-black-18dp.svg'
      )
    );

    // People
    this.iconRegistry.addSvgIcon(
      'sw_people',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'icons/finn_by_radiusss.svg'
      )
    );

    // Planet
    this.iconRegistry.addSvgIcon(
      'sw_planet',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'icons/geonosis_by_radiusss.svg'
      )
    );

    // Species
    this.iconRegistry.addSvgIcon(
      'sw_species',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'icons/master_yoda_by_radiusss.svg'
      )
    );

    // Starships
    this.iconRegistry.addSvgIcon(
      'sw_starship',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'icons/millenium_falcon_by_radiusss.svg'
      )
    );

    // vehicle
    this.iconRegistry.addSvgIcon(
      'sw_vehicle',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'icons/speeder_by_radiusss.svg'
      )
    );
  }
}
