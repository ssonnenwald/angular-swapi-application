import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
} from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';
import { ColumnConfig, SwapiColumnConfigs } from '../../models/column-config';

@Component({
  selector: 'app-search',
  imports: [
    MatButton,
    MatFormField,
    MatLabel,
    MatTable,
    MatHeaderCell,
    MatHeaderCellDef,
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
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private swapi: SwapiService = inject(SwapiService);

  private regexIdUrl = new RegExp('[^/]+(?=/$|$)');
  public resource: WritableSignal<string> = signal('people');
  public searchTerm: WritableSignal<string> = signal('');
  public data: WritableSignal<any[]> = signal<any[]>([]);
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

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const res = params.get('resource');

      if (res && this.resources.includes(res)) {
        this.resource.set(res);

        // Load column config for the selected resource
        this.columnDefs.set(SwapiColumnConfigs[res]);
        this.displayedColumns.set(this.columnDefs().map((c) => c.columnDef));

        this.searchTerm.set('');
        this.data.set([]);

        this.onSearch();
      }
    });
  }

  public async onSearch() {
    const res = (await this.swapi
      .search(this.resource() as any, this.searchTerm())
      .toPromise()) || { results: [] };

    const results = res.results;

    // Map the Ids to the corresponding names for the selected resource
    results.map((item) => (item.id = this.getIdFromUrl(item.url)));

    this.data.set(results);
  }

  private getIdFromUrl(url: string): string {
    let id = this.regexIdUrl.exec(url)![0];
    return id;
  }
}
