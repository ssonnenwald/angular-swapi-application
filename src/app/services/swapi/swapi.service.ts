import { HttpClient } from '@angular/common/http';
import {
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { debounce, debounceTime, delay, Observable, tap } from 'rxjs';
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

  public resourceId: WritableSignal<string> = signal('');

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
        ),
        delay(1000)
      );
  }

  public resourceData = rxResource({
    request: () => ({
      resource: this.resource(),
      id: this.resourceId(),
    }),
    loader: ({ request }) =>
      this.typedResourceLoader(
        request.resource as SwapiResourceType,
        request.id
      ),
  });

  private typedResourceLoader<K extends SwapiResourceType>(
    resource: K,
    id: string
  ): Observable<SwapiResponse<SwapiResourceMap[K]>> {
    return this.http
      .get<SwapiResponse<SwapiResourceMap[K]>>(
        `${this.baseUrl}/${resource}/${id}`
      )
      .pipe(
        tap((res) =>
          res.results.map((item) => (item.id = this.getIdFromUrl(item.url)))
        ),
        delay(1000)
      );
  }

  public isLoading: Signal<boolean> =
    this.search.isLoading || this.resourceData.isLoading;

  private getIdFromUrl(url: string): string {
    let id = this.regexIdUrl.exec(url)![0];
    return id;
  }
}
