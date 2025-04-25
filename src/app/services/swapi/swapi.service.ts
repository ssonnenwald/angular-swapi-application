import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
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
import { getIdFromUrl } from '../../shared/utils/url-utils';

@Injectable({
  providedIn: 'root',
})
export class SwapiService {
  private baseUrl = 'https://swapi.py4e.com/api';
  private http = inject(HttpClient);

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

  /**
   * Performs a search for a given resource type and search term.
   * If the search term is empty, fetches all resources of the given type.
   * @param resource The resource type to fetch.
   * @param searchTerm The search term to use.
   * @returns An observable that emits the search result.
   */
  private typedLoader<K extends SwapiResourceType>(
    resource: K,
    searchTerm: string
  ): Observable<SwapiResponse<SwapiResourceMap[K]>> {
    const url = `${this.baseUrl}/${resource}/?search=${searchTerm}`;
    return this.fetchAllPages(resource, url).pipe(delay(1000));
  }

  /**
   * Recursively fetches all pages of a resource from the SWAPI API until there are no more pages.
   * The results are combined into a single array of objects, which are then sorted by the appropriate
   * key for the given resource type.
   * @param resource The resource type to fetch.
   * @param url The initial URL to fetch. This should be the base URL for the resource with a query parameter for the search term.
   * @returns An observable that emits a single SwapiResponse object, which contains the combined results and information about the total number of results.
   */
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
            id: getIdFromUrl((item as any).url),
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

  public typedResourceData = computed(() => {
    const resource = this.resource();
    const data = this.resourceData.value();

    if (!data) return null;

    type T = SwapiResourceMap[typeof resource];
    return data as SwapiResponse<T>;
  });

  public resourceData = rxResource({
    request: () => ({
      resource: this.resource(),
      ids: this.resourceIds(),
    }),
    loader: ({ request }) =>
      this.typedResourceLoader(request.resource, request.ids),
  });

  /**
   * Fetches multiple resources of a given type by their IDs.
   *
   * The result is an observable that emits a {@link SwapiResponse} with the
   * `results` property containing the sorted array of resources.
   * The resources are sorted by the first property key of the first resource.
   * @param resource The resource type to fetch.
   * @param ids The IDs of the resources to fetch.
   * @returns An observable that emits the search result.
   */
  private typedResourceLoader<K extends SwapiResourceType>(
    resource: K,
    ids: string[]
  ): Observable<SwapiResponse<SwapiResourceMap[K]>> {
    const requests = ids.map((id: string) =>
      this.http
        .get<SwapiResourceMap[K]>(`${this.baseUrl}/${resource}/${id}`)
        .pipe(tap((item) => (item['id'] = getIdFromUrl(item['url']))))
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

  public readonly resourceCounts = computed(() => {
    const data = this.typedResourceData();
    const first = data?.results?.[0];

    if (!first) return {};

    const keys = [
      'films',
      'people',
      'planets',
      'species',
      'starships',
      'vehicles',
    ] as const;

    const result: Record<string, number> = {};
    const typed = first as unknown as Record<string, unknown>;

    for (const key of keys) {
      const value = typed[key];
      if (Array.isArray(value)) {
        result[key] = value.length;
      }
    }

    return result;
  });
}
