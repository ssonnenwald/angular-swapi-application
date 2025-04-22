import { HttpClient } from '@angular/common/http';
import {
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { SwapiResponse } from '../../models/swapi-response';
import {
  SwapiResourceType,
  SwapiResourceMap,
} from '../../models/swapi-resource-map';
import { rxResource } from '@angular/core/rxjs-interop';
import { SortKeyMap } from '../../models/sort-key-map';

@Injectable({
  providedIn: 'root',
})
export class SwapiService {
  private baseUrl = 'https://swapi.py4e.com/api';
  private http = inject(HttpClient);

  private regexIdUrl = new RegExp('[^/]+(?=/$|$)');

  public resource: WritableSignal<SwapiResourceType> =
    signal<SwapiResourceType>('people');
  public searchTerm: WritableSignal<string> = signal('');

  public resourceIds: WritableSignal<string[]> = signal([]);

  constructor() {}

  public search = rxResource({
    request: () => ({
      resource: this.resource(),
      searchTerm: this.searchTerm(),
    }),
    loader: ({ request }) =>
      this.typedLoader(request.resource, request.searchTerm),
  });

  private typedLoader<K extends SwapiResourceType>(
    resource: K,
    searchTerm: string
  ): Observable<SwapiResponse<SwapiResourceMap[K]>> {
    const url = `${this.baseUrl}/${resource}/?search=${searchTerm}`;
    return this.fetchAllPages(resource, url).pipe(delay(1000));
  }

  private fetchAllPages<K extends SwapiResourceType>(
    resource: K,
    url: string
  ): Observable<SwapiResponse<SwapiResourceMap[K]>> {
    const getPage = (
      url: string
    ): Observable<SwapiResponse<SwapiResourceMap[K]>> =>
      this.http.get<SwapiResponse<SwapiResourceMap[K]>>(url);

    const collectPages = (
      url: string,
      acc: SwapiResourceMap[K][] = []
    ): Observable<SwapiResponse<SwapiResourceMap[K]>> => {
      return getPage(url).pipe(
        switchMap((response) => {
          const updatedResults = response.results.map((item) => ({
            ...item,
            id: this.getIdFromUrl((item as any).url),
          }));

          const combined = [...acc, ...updatedResults];

          if (response.next) {
            return collectPages(response.next, combined);
          } else {
            const sortKey = SortKeyMap[resource];
            if (sortKey) {
              combined.sort((a, b) =>
                String((a as any)[sortKey]).localeCompare(
                  String((b as any)[sortKey])
                )
              );
            }

            return of({
              ...response,
              results: combined,
            });
          }
        })
      );
    };

    return collectPages(url);
  }

  public resourceData = rxResource({
    request: () => ({
      resource: this.resource(),
      ids: this.resourceIds(),
    }),
    loader: ({ request }) =>
      this.typedResourceLoader(request.resource, request.ids).pipe(delay(1000)),
  });

  private typedResourceLoader<K extends SwapiResourceType>(
    resource: K,
    ids: string[]
  ): Observable<SwapiResponse<SwapiResourceMap[K]>> {
    const requests = ids.map((id) =>
      this.http
        .get<SwapiResourceMap[K]>(`${this.baseUrl}/${resource}/${id}`)
        .pipe(tap((item) => (item['id'] = this.getIdFromUrl(item['url']))))
    );

    return forkJoin(requests).pipe(
      map((results) => {
        const sortedResults = [...results].sort((a, b) => {
          const keyA = Object.keys(a)[0];
          const keyB = Object.keys(b)[0];
          const valA = String((a as any)[keyA] ?? '').toLowerCase();
          const valB = String((b as any)[keyB] ?? '').toLowerCase();
          return valA.localeCompare(valB);
        });

        return {
          count: sortedResults.length,
          next: null,
          previous: null,
          results: sortedResults,
        };
      })
    );
  }

  private getIdFromUrl(url: string): string {
    let id = this.regexIdUrl.exec(url)![0];
    return id;
  }
}
