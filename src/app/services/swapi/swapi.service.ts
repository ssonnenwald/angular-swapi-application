import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SwapiResponse } from '../../models/swapi-response';
import {
  SwapiResourceType,
  SwapiResourceMap,
} from '../../models/swapi-resource-map';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class SwapiService {
  private baseUrl = 'https://swapi.py4e.com/api';
  private http = inject(HttpClient);

  private regexIdUrl = new RegExp('[^/]+(?=/$|$)');

  public resource: WritableSignal<string> = signal('people');
  public searchTerm: WritableSignal<string> = signal('');

  constructor() {}

  public search = rxResource({
    request: () => ({
      resource: this.resource(),
      searchTerm: this.searchTerm(),
    }),
    loader: ({ request }) =>
      this.typedLoader(
        request.resource as SwapiResourceType,
        request.searchTerm
      ),
  });

  private typedLoader<K extends SwapiResourceType>(
    resource: K,
    searchTerm: string
  ): Observable<SwapiResponse<SwapiResourceMap[K]>> {
    return this.http
      .get<SwapiResponse<SwapiResourceMap[K]>>(
        `${this.baseUrl}/${resource}/?search=${searchTerm}`
      )
      .pipe(
        tap((res) =>
          res.results.map((item) => (item.id = this.getIdFromUrl(item.url)))
        )
      );
  }

  private getIdFromUrl(url: string): string {
    let id = this.regexIdUrl.exec(url)![0];
    return id;
  }
}
