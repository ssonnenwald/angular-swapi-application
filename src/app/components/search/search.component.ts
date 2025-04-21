import {
  AfterViewInit,
  Component,
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
import { MatFormField, MatLabel } from '@angular/material/form-field';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { TitleCasePipe } from '@angular/common';
import { ColumnConfig, SwapiColumnConfigs } from '../../models/column-config';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-search',
  imports: [
    MatFormField,
    MatLabel,
    MatTable,
    MatHeaderCell,
    MatHeaderCellDef,
    MatSortHeader,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatNoDataRow,
    MatColumnDef,
    MatInput,
    FormsModule,
    TitleCasePipe,
    MatPaginator,
    MatSort,
    RouterLink,
    MatProgressSpinner,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, AfterViewInit {
  private paginator: Signal<MatPaginator | undefined> = viewChild<
    MatPaginator | undefined
  >(MatPaginator);
  private sort: Signal<MatSort | undefined> = viewChild<MatSort | undefined>(
    MatSort
  );
  private route: ActivatedRoute = inject(ActivatedRoute);
  public swapi: SwapiService = inject(SwapiService);
  public isLoading: Signal<boolean> = this.swapi.isLoading;

  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  public displayedColumns: WritableSignal<string[]> = signal<string[]>([]);
  public columnDefs: WritableSignal<ColumnConfig[]> = signal<ColumnConfig[]>(
    []
  );

  public resources: string[] = [
    'people',
    'films',
    'planets',
    'species',
    'starships',
    'vehicles',
  ];

  public constructor() {
    effect(() => {
      this.dataSource.data = this.swapi.search.value()?.results ?? [];
    });
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const res = params.get('resource');

      if (res && this.resources.includes(res)) {
        this.swapi.resource.set(res);

        // Load column config for the selected resource
        this.columnDefs.set(SwapiColumnConfigs[res]);
        this.displayedColumns.set(this.columnDefs().map((c) => c.columnDef));

        this.swapi.searchTerm.set('');
      }
    });
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort()!;
    this.dataSource.paginator = this.paginator()!;
  }
}
