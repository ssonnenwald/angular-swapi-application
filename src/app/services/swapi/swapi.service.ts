import { HttpClient } from '@angular/common/http';
import {
  computed,
  effect,
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
import { SortKeyMap } from '../../models/sort-key-map';
import { getIdFromUrl } from '../../shared/utils/url-utils';
import { swapiResources } from '../../models/swapi-resources';

@Injectable({
  providedIn: 'root',
})
export class SwapiService {
  private baseUrl = 'https://swapi.py4e.com/api';
  private http = inject(HttpClient);

  private _resource = signal<SwapiResourceType>('people' as SwapiResourceType);
  public get resource(): SwapiResourceType {
    return this._resource();
  }
  public set resource(value: SwapiResourceType) {
    this._resource.set(value);
  }
  public searchTerm: WritableSignal<string | null> = signal(null);

  public resourceIds: WritableSignal<string[]> = signal([]);

  private _searchData = signal<SwapiResponse<
    SwapiResourceMap[SwapiResourceType]
  > | null>(null);
  private _searchLoading = signal<boolean>(false);
  public search = {
    value: () => this._searchData(),
    isLoading: this._searchLoading as import('@angular/core').Signal<boolean>,
  };

  constructor() {
    effect(() => {
      const term = this.searchTerm();
      if (term === null) {
        this._searchData.set(null);
        this._searchLoading.set(false);
        return;
      }

      this._searchLoading.set(true);
      const sub = this.typedLoader(this.resource, term).subscribe({
        next: (res) => this._searchData.set(res),
        error: () => this._searchLoading.set(false),
        complete: () => this._searchLoading.set(false),
      });

      return () => {
        sub.unsubscribe();
        this._searchLoading.set(false);
      };
    });
  }

  /**
   * Performs a search for a given resource type and search term.
   * If the search term is empty, fetches all resources of the given type.
   * @param resource The resource type to fetch.
   * @param searchTerm The search term to use.
   * @returns An observable that emits the search result.
   */
  private typedLoader<K extends SwapiResourceType>(
    resource: K,
    searchTerm: string | null,
  ): Observable<SwapiResponse<SwapiResourceMap[K]>> {
    // If searchTerm is an empty string, request the resource root (all items).
    // Some SWAPI endpoints behave differently when given an empty `search` query,
    // so avoid appending `?search=` when the term is falsy but not null.
    const url =
      searchTerm === '' || searchTerm === null
        ? `${this.baseUrl}/${resource}/`
        : `${this.baseUrl}/${resource}/?search=${encodeURIComponent(
            searchTerm,
          )}`;
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
    url: string,
  ): Observable<SwapiResponse<SwapiResourceMap[K]>> {
    const getPage = (
      url: string,
    ): Observable<SwapiResponse<SwapiResourceMap[K]>> =>
      this.http.get<SwapiResponse<SwapiResourceMap[K]>>(url);

    const collectPages = (
      url: string,
      acc: SwapiResourceMap[K][] = [],
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
                  String((b as any)[sortKey]),
                ),
              );
            }

            return of({
              ...response,
              results: combined,
            });
          }
        }),
      );
    };

    return collectPages(url);
  }

  private _resourceData = signal<SwapiResponse<
    SwapiResourceMap[SwapiResourceType]
  > | null>(null);
  private _resourceLoading = signal<boolean>(false);
  public resourceData = {
    value: () => this._resourceData() ?? undefined,
    isLoading: this._resourceLoading as import('@angular/core').Signal<boolean>,
  };

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
    ids: string[],
  ): Observable<SwapiResponse<SwapiResourceMap[K]>> {
    const requests = ids.map((id: string) =>
      this.http
        .get<SwapiResourceMap[K]>(`${this.baseUrl}/${resource}/${id}`)
        .pipe(tap((item) => (item['id'] = getIdFromUrl(item['url'])))),
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
      }),
    );
  }

  public readonly resourceCounts = computed(() => {
    const data = this.resourceData.value();
    const first = data?.results?.[0];

    if (!first) return {};

    const keys = swapiResources;

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
