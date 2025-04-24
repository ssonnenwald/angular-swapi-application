import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  Injector,
  input,
  InputSignal,
  OnInit,
  runInInjectionContext,
  signal,
  Signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { SwapiResourceType } from '../../models/swapi-resource-map';
import { SwapiService } from '../../services/swapi/swapi.service';
import { getIdFromUrl } from '../../shared/utils/url-utils';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TitleCasePipe } from '@angular/common';
import { ColumnConfig, SwapiColumnConfigs } from '../../models/column-config';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-resource-data',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRowDef,
    MatRow,
    MatSort,
    MatSortHeader,
    MatPaginator,
    RouterLink,
    MatProgressSpinner,
    TitleCasePipe,
  ],
  templateUrl: './resource-data.component.html',
  styleUrl: './resource-data.component.scss',
  providers: [SwapiService],
})
export class ResourceDataComponent implements OnInit, AfterViewInit {
  public readonly data: InputSignal<any | undefined> = input<any | undefined>(
    {}
  );
  public readonly resourceType: InputSignal<SwapiResourceType> =
    input<SwapiResourceType>('people');

  private paginator: Signal<MatPaginator | undefined> = viewChild<
    MatPaginator | undefined
  >(MatPaginator);

  private sort: Signal<MatSort | undefined> = viewChild<MatSort | undefined>(
    MatSort
  );

  public swapi = inject(SwapiService);

  public readonly selectedTabName: InputSignal<string> = input<string>('');

  public displayedColumns: WritableSignal<string[]> = signal<string[]>([]);
  public columnDefs: WritableSignal<ColumnConfig[]> = signal<ColumnConfig[]>(
    []
  );
  public isLoading: Signal<boolean> = this.swapi.resourceData.isLoading;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  private injector = inject(Injector); // get injector

  public constructor() {}

  public ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const tab = this.selectedTabName().toLowerCase();
        const config = SwapiColumnConfigs[tab];

        if (config) {
          this.columnDefs.set(config);
          this.displayedColumns.set(config.map((c) => c.columnDef));
        }
      });

      effect(() => {
        const ids = this.relatedIds();
        const resource =
          this.selectedTabName().toLowerCase() as SwapiResourceType;

        //console.log('🧠 Effect Triggered - IDs:', ids, 'Resource:', resource);

        if (ids.length > 0) {
          this.swapi.resource.set(resource);
          this.swapi.resourceIds.set(ids);
        }
      });

      effect(() => {
        const results = this.swapi.resourceData.value()?.results ?? [];

        //console.log('✅ Resource Data Results:', results);

        this.dataSource.data = results;
      });
    });

    // Load column config for the selected resource
    this.columnDefs.set(
      SwapiColumnConfigs[this.selectedTabName().toLowerCase()]
    );
    this.displayedColumns.set(this.columnDefs().map((c) => c.columnDef));

    //console.log('Selected Tab Name: ', this.selectedTabName());
    //console.log(
    //  'Raw tab data:',
    //  this.data()?.[this.selectedTabName().toLowerCase()]
    //);
  }

  public readonly relatedIds: Signal<string[]> = computed(() => {
    const raw = this.data()?.[this.selectedTabName().toLowerCase()];
    return Array.isArray(raw) ? raw.map(getIdFromUrl) : [];
  });

  public readonly relatedResourceData = computed(() => {
    return this.swapi.resourceData.value();
  });

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort()!;
    this.dataSource.paginator = this.paginator()!;
  }
}
