import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SwapiService } from '../../services/swapi/swapi.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { ColumnConfig, SwapiColumnConfigs } from '../../models/column-config';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwapiResourceType } from '../../models/swapi-resource-map';
import { swapiResources } from '../../models/swapi-resources';

@Component({
  selector: 'app-search',
  imports: [
    MatTableModule,
    MatPaginator,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinner,
    FormsModule,
    TitleCasePipe,
    RouterLink,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  providers: [SwapiService],
})
export default class SearchComponent implements OnInit, AfterViewInit {
  private paginator: Signal<MatPaginator | undefined> = viewChild<
    MatPaginator | undefined
  >(MatPaginator);
  private sort: Signal<MatSort | undefined> = viewChild<MatSort | undefined>(
    MatSort,
  );
  private destroyRef = inject(DestroyRef);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private swapi: SwapiService = inject(SwapiService);
  public isLoading: Signal<boolean> = this.swapi.search.isLoading;

  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  public resource: string = '';
  public searchTerm: WritableSignal<string | null> = signal<string | null>(
    null,
  );

  public displayedColumns: WritableSignal<string[]> = signal<string[]>([]);
  public columnDefs: WritableSignal<ColumnConfig[]> = signal<ColumnConfig[]>(
    [],
  );
  private _searchDebounceTimer: any;

  public constructor() {
    effect(() => {
      this.dataSource.data = this.swapi.search.value()?.results ?? [];
    });

    // Debounce updates to the service `searchTerm` to avoid racing full-load
    // requests when the user types quickly.
    effect(() => {
      const term = this.searchTerm();

      if (this._searchDebounceTimer) {
        clearTimeout(this._searchDebounceTimer);
      }

      this._searchDebounceTimer = setTimeout(() => {
        this.swapi.searchTerm.set(term);
        this._searchDebounceTimer = undefined;
      }, 300);

      return () => {
        if (this._searchDebounceTimer) {
          clearTimeout(this._searchDebounceTimer);
          this._searchDebounceTimer = undefined;
        }
      };
    });
  }

  public ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const res = params.get('resource') as SwapiResourceType;

        if (res && swapiResources.includes(res)) {
          this.swapi.resource = res as SwapiResourceType;
          this.resource = res;

          // Load column config for the selected resource
          this.columnDefs.set(SwapiColumnConfigs[res]);
          this.displayedColumns.set(this.columnDefs().map((c) => c.columnDef));

          // Clear the table immediately to avoid showing stale rows from the
          // previous resource while the new resource loads.
          this.dataSource.data = [];

          // Reset the local input state. The service watches `searchTerm` and
          // will load the full resource when it becomes `null`.
          this.searchTerm.set(null);
        }
      });
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort()!;
    this.dataSource.paginator = this.paginator()!;
  }
}
