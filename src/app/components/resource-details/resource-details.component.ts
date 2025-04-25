import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  MatTab,
  MatTabContent,
  MatTabGroup,
  MatTabLabel,
} from '@angular/material/tabs';
import { PropertiesComponent } from '../properties/properties.component';
import { ResourceDataComponent } from '../resource-data/resource-data.component';
import { ActivatedRoute } from '@angular/router';
import { SwapiService } from '../../services/swapi/swapi.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SwapiResourceType } from '../../models/swapi-resource-map';
import { MatBadge } from '@angular/material/badge';

@Component({
  selector: 'app-resource-details',
  imports: [
    MatTabGroup,
    MatTab,
    MatTabLabel,
    MatTabContent,
    MatIcon,
    PropertiesComponent,
    ResourceDataComponent,
    MatProgressSpinner,
    MatBadge,
  ],
  templateUrl: './resource-details.component.html',
  styleUrl: './resource-details.component.scss',
})
export class ResourceDetailsComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private route: ActivatedRoute = inject(ActivatedRoute);
  public swapi: SwapiService = inject(SwapiService);
  public isLoading: Signal<boolean> = this.swapi.resourceData.isLoading;

  public resources: string[] = [
    'people',
    'films',
    'planets',
    'species',
    'starships',
    'vehicles',
  ];

  public displayFilmsTab: WritableSignal<boolean> = signal(false);
  public displayPeopleTab: WritableSignal<boolean> = signal(false);
  public displayPlanetsTab: WritableSignal<boolean> = signal(false);
  public displaySpeciesTab: WritableSignal<boolean> = signal(false);
  public displayStarshipsTab: WritableSignal<boolean> = signal(false);
  public displayVehiclesTab: WritableSignal<boolean> = signal(false);

  public selectedTabIndex = signal(0);

  public constructor() {
    effect(() => {
      const data = this.swapi.typedResourceData();
      if (data?.results) {
        this.configureTabs(data.results);
      }
    });
  }

  public ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const resource: string = params.get('resource') || '';
        const resourceId: string = params.get('id') || '';

        if (resource && resourceId && this.resources.includes(resource)) {
          this.swapi.resource.set(resource as SwapiResourceType);
          this.swapi.resourceIds.set([resourceId]);
        }
      });
  }

  /**
   * Configures the tabs based on the resource data's properties.
   * The tabs are determined by the presence of the resource type in the first
   * element of the results array.
   * @param results The results array from swapi.
   */
  private configureTabs(results: any[]): void {
    this.displayFilmsTab.set('films' in results[0]);
    this.displayPeopleTab.set('people' in results[0]);
    this.displayPlanetsTab.set('planets' in results[0]);
    this.displaySpeciesTab.set('species' in results[0]);
    this.displayStarshipsTab.set('starships' in results[0]);
    this.displayVehiclesTab.set('vehicles' in results[0]);
  }

  public visibleTabs = computed(() => {
    const tabs = ['Properties'];

    if (this.displayFilmsTab()) tabs.push('Films');
    if (this.displayPeopleTab()) tabs.push('People');
    if (this.displayPlanetsTab()) tabs.push('Planets');
    if (this.displaySpeciesTab()) tabs.push('Species');
    if (this.displayStarshipsTab()) tabs.push('Starships');
    if (this.displayVehiclesTab()) tabs.push('Vehicles');

    return tabs;
  });

  public selectedTabName = computed(
    () => this.visibleTabs()[this.selectedTabIndex()]
  );
}
