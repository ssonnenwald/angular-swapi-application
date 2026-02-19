// import { Injectable, computed, signal } from '@angular/core';
// import {
//   injectStore,
//   patchState,
//   signalStore,
//   withHooks,
//   withMethods,
//   withState,
// } from '@ngrx/signals';
// import { HttpClient } from '@angular/common/http';
// import { of, forkJoin } from 'rxjs';
// import { delay, map, switchMap, tap } from 'rxjs/operators';
// import { SwapiResponse } from '../../models/swapi-response';
// import {
//   SwapiResourceMap,
//   SwapiResourceType,
// } from '../../models/swapi-resource-map';
// import { SortKeyMap } from '../../models/sort-key-map';
// import { getIdFromUrl } from '../../shared/utils/url-utils';

// const baseUrl = 'https://swapi.py4e.com/api';

// export const SwapiStore = signalStore(
//   { providedIn: 'root' },
//   withState(() => ({
//     resource: 'people' as SwapiResourceType,
//     searchTerm: null as string | null,
//     resourceIds: [] as string[],
//     search: null as SwapiResponse<any> | null,
//     resourceData: null as SwapiResponse<any> | null,
//     isLoading: false,
//   })),
//   withMethods((store, http = injectStore(HttpClient)) => {
//     function setResource(resource: SwapiResourceType) {
//       patchState(store, { resource });
//     }

//     function setSearchTerm(term: string | null) {
//       patchState(store, { searchTerm: term });
//     }

//     function setResourceIds(ids: string[]) {
//       patchState(store, { resourceIds: ids });
//     }

//     function fetchSearchResults() {
//       const term = store.searchTerm();
//       if (term === null) return;

//       patchState(store, { isLoading: true });

//       typedLoader(store.resource(), term).subscribe((response) => {
//         patchState(store, { search: response, isLoading: false });
//       });
//     }

//     function fetchResourcesByIds() {
//       const ids = store.resourceIds();
//       if (ids.length === 0) return;

//       typedResourceLoader(store.resource(), ids).subscribe((response) => {
//         patchState(store, { resourceData: response });
//       });
//     }

//     function typedLoader<K extends SwapiResourceType>(
//       resource: K,
//       term: string | null
//     ) {
//       const url = `${baseUrl}/${resource}/?search=${term}`;
//       return fetchAllPages(resource, url).pipe(delay(1000));
//     }

//     function fetchAllPages<K extends SwapiResourceType>(
//       resource: K,
//       url: string
//     ) {
//       const getPage = (url: string) =>
//         http.get<SwapiResponse<SwapiResourceMap[K]>>(url);

//       const collectPages = (
//         url: string,
//         acc: SwapiResourceMap[K][] = []
//       ): any =>
//         getPage(url).pipe(
//           switchMap((response) => {
//             const updatedResults = response.results.map((item) => ({
//               ...item,
//               id: getIdFromUrl((item as any).url),
//             }));

//             const combined = [...acc, ...updatedResults];

//             if (response.next) {
//               return collectPages(response.next, combined);
//             } else {
//               const sortKey = SortKeyMap[resource];
//               if (sortKey) {
//                 combined.sort((a, b) =>
//                   String((a as any)[sortKey]).localeCompare(
//                     String((b as any)[sortKey])
//                   )
//                 );
//               }

//               return of({
//                 ...response,
//                 results: combined,
//               });
//             }
//           })
//         );

//       return collectPages(url);
//     }

//     function typedResourceLoader<K extends SwapiResourceType>(
//       resource: K,
//       ids: string[]
//     ) {
//       const requests = ids.map((id: string) =>
//         http
//           .get<SwapiResourceMap[K]>(`${baseUrl}/${resource}/${id}`)
//           .pipe(tap((item) => (item['id'] = getIdFromUrl(item['url']))))
//       );

//       return forkJoin(requests).pipe(
//         map((results) => {
//           const sortedResults = [...results].sort((a, b) => {
//             const keyA = Object.keys(a)[0];
//             const keyB = Object.keys(b)[0];
//             const valA = String((a as any)[keyA] ?? '').toLowerCase();
//             const valB = String((b as any)[keyB] ?? '').toLowerCase();
//             return valA.localeCompare(valB);
//           });

//           return {
//             count: sortedResults.length,
//             next: null,
//             previous: null,
//             results: sortedResults,
//           };
//         })
//       );
//     }

//     return {
//       setResource,
//       setSearchTerm,
//       setResourceIds,
//       fetchSearchResults,
//       fetchResourcesByIds,
//     };
//   }),
//   withHooks({
//     onInit({ fetchSearchResults, fetchResourcesByIds }) {
//       const unsubscribeSearch = computed(fetchSearchResults);
//       const unsubscribeResources = computed(fetchResourcesByIds);

//       return () => {
//         unsubscribeSearch();
//         unsubscribeResources();
//       };
//     },
//   }),
//   {
//     resourceCounts: computed(() => {
//       const data = SwapiStore.resourceData();
//       const first = data?.results?.[0];

//       if (!first) return {};

//       const keys = swapiResources;

//       const result: Record<string, number> = {};
//       const typed = first as unknown as Record<string, unknown>;

//       for (const key of keys) {
//         const value = typed[key];
//         if (Array.isArray(value)) {
//           result[key] = value.length;
//         }
//       }

//       return result;
//     }),
//   }
// );

// Gemini 2.0 - Flash - Generated Code

// import { HttpClient } from '@angular/common/http';
// import {
//   computed,
//   inject,
//   Injectable,
//   signal,
//   WritableSignal,
// } from '@angular/core';
// import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
// import { SwapiResponse } from '../../models/swapi-response';
// import {
//   SwapiResourceType,
//   SwapiResourceMap,
// } from '../../models/swapi-resource-map';
// import { SortKeyMap } from '../../models/sort-key-map';
// import { getIdFromUrl } from '../../shared/utils/url-utils';
// import { swapiResources } from '../../models/swapi-resources';
// import {
//   patchState,
//   signalStore,
//   withComputed,
//   withMethods,
//   withState,
// } from '@ngrx/signals';
// import { tapResponse } from '@ngrx/operators';

// interface SwapiState {
//   resource: SwapiResourceType;
//   searchTerm: string | null;
//   searchResults: SwapiResponse<SwapiResourceMap[SwapiResourceType]> | null;
//   searchLoading: boolean;
//   searchError: string | null;
//   resourceIds: string[];
//   resourceData: SwapiResponse<SwapiResourceMap[SwapiResourceType]> | null;
//   resourceDataLoading: boolean;
//   resourceDataError: string | null;
// }

// const initialState: SwapiState = {
//   resource: 'people',
//   searchTerm: null,
//   searchResults: null,
//   searchLoading: false,
//   searchError: null,
//   resourceIds: [],
//   resourceData: null,
//   resourceDataLoading: false,
//   resourceDataError: null,
// };

// export const SwapiStore = signalStore(
//   { providedIn: 'root' },
//   withState(initialState),
//   withComputed((state) => ({
//     resourceCounts: computed(() => {
//       const data = state.resourceData();
//       const first = data?.results?.[0];

//       if (!first) return {};

//       const keys = swapiResources;
//       const result: Record<string, number> = {};
//       const typed = first as unknown as Record<string, unknown>;

//       for (const key of keys) {
//         const value = typed[key];
//         if (Array.isArray(value)) {
//           result[key] = value.length;
//         }
//       }
//       return result;
//     }),
//   })),
//   withMethods((store, http = inject(HttpClient)) => ({
//     setResource(resource: SwapiResourceType): void {
//       patchState(store, { resource });
//     },
//     setSearchTerm(searchTerm: string | null): void {
//       patchState(store, { searchTerm });
//     },
//     setResourceIds(resourceIds: string[]): void {
//       patchState(store, { resourceIds });
//     },
//     searchResources: (searchTerm: string | null = store.searchTerm()) => {
//       if (searchTerm === null) {
//         patchState(store, { searchResults: null });
//         return;
//       }

//       patchState(store, { searchLoading: true, searchError: null });
//       const url = `${store.state().baseUrl}/${store.state().resource}/?search=${searchTerm}`;

//       return store.fetchAllPages(store.state().resource, url).pipe(
//         delay(1000),
//         tapResponse({
//           next: (response) =>
//             patchState(store, { searchResults: response, searchLoading: false }),
//           error: (error: unknown) =>
//             patchState(store, {
//               searchError: String(error),
//               searchLoading: false,
//             }),
//           finalize: () => console.log('Search operation finished'),
//         })
//       );
//     },
//     fetchResourceDetails: (ids: string[] = store.state().resourceIds()) => {
//       if (ids.length === 0) {
//         patchState(store, { resourceData: null });
//         return;
//       }

//       patchState(store, { resourceDataLoading: true, resourceDataError: null });
//       const requests = ids.map((id: string) =>
//         http
//           .get<SwapiResourceMap[SwapiResourceType]>(
//             `${store.state().baseUrl}/${store.state().resource}/${id}`
//           )
//           .pipe(tap((item) => (item['id'] = getIdFromUrl(item['url']))))
//       );

//       return forkJoin(requests).pipe(
//         map((results) => {
//           const sortedResults = [...results].sort((a, b) => {
//             const keyA = Object.keys(a)[0];
//             const keyB = Object.keys(b)[0];
//             const valA = String((a as any)[keyA] ?? '').toLowerCase();
//             const valB = String((b as any)[keyB] ?? '').toLowerCase();
//             return valA.localeCompare(valB);
//           });

//           return {
//             count: sortedResults.length,
//             next: null,
//             previous: null,
//             results: sortedResults,
//           } as SwapiResponse<SwapiResourceMap[SwapiResourceType]>;
//         }),
//         tapResponse({
//           next: (response) =>
//             patchState(store, {
//               resourceData: response,
//               resourceDataLoading: false,
//             }),
//           error: (error: unknown) =>
//             patchState(store, {
//               resourceDataError: String(error),
//               resourceDataLoading: false,
//             }),
//           finalize: () => console.log('Fetch resource details finished'),
//         })
//       );
//     },
//     private: {
//       baseUrl: 'https://swapi.py4e.com/api',
//       fetchAllPages: <K extends SwapiResourceType>(
//         resource: K,
//         url: string
//       ): Observable<SwapiResponse<SwapiResourceMap[K]>> => {
//         const getPage = (
//           url: string
//         ): Observable<SwapiResponse<SwapiResourceMap[K]>> =>
//           http.get<SwapiResponse<SwapiResourceMap[K]>>(url);

//         const collectPages = (
//           url: string,
//           acc: SwapiResourceMap[K][] = []
//         ): Observable<SwapiResponse<SwapiResourceMap[K]>> => {
//           return getPage(url).pipe(
//             switchMap((response) => {
//               const updatedResults = response.results.map((item) => ({
//                 ...item,
//                 id: getIdFromUrl((item as any).url),
//               }));

//               const combined = [...acc, ...updatedResults];

//               if (response.next) {
//                 return collectPages(response.next, combined);
//               } else {
//                 const sortKey = SortKeyMap[resource];
//                 if (sortKey) {
//                   combined.sort((a, b) =>
//                     String((a as any)[sortKey]).localeCompare(
//                       String((b as any)[sortKey])
//                     )
//                   );
//                 }

//                 return of({
//                   ...response,
//                   results: combined,
//                 });
//               }
//             })
//           );
//         };

//         return collectPages(url);
//       },
//     },
//   }))
// );

// Gemini Pro 2.5
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { computed, inject, Signal } from '@angular/core';
// import {
//   patchState,
//   signalStore,
//   withComputed,
//   withMethods,
//   withState,
// } from '@ngrx/signals';
// import { rxMethod } from '@ngrx/signals/rxjs-interop';
// import {
//   pipe,
//   switchMap,
//   tap,
//   of,
//   Observable,
//   forkJoin,
//   map,
//   delay,
// } from 'rxjs';
// import { tapResponse } from '@ngrx/operators'; // Import tapResponse

// import { SwapiResponse } from '../../models/swapi-response';
// import {
//   SwapiResourceType,
//   SwapiResourceMap,
// } from '../../models/swapi-resource-map';
// import { SortKeyMap } from '../../models/sort-key-map';
// import { getIdFromUrl } from '../../shared/utils/url-utils';
// import { swapiResources } from '../../models/swapi-resources';

// // --- Define State Interface ---
// interface SwapiState {
//   resource: SwapiResourceType;
//   searchTerm: string | null;
//   resourceIds: string[];
//   searchResults: SwapiResponse<any> | null; // Using 'any' for simplicity, refine if needed
//   resourceDetails: SwapiResponse<any> | null; // Using 'any' for simplicity
//   isLoadingSearch: boolean;
//   isLoadingDetails: boolean;
//   searchError: HttpErrorResponse | Error | null;
//   detailsError: HttpErrorResponse | Error | null;
// }

// // --- Define Initial State ---
// const initialState: SwapiState = {
//   resource: 'people' as SwapiResourceType,
//   searchTerm: null,
//   resourceIds: [],
//   searchResults: null,
//   resourceDetails: null,
//   isLoadingSearch: false,
//   isLoadingDetails: false,
//   searchError: null,
//   detailsError: null,
// };

// // --- Create the Signal Store ---
// export const SwapiStore = signalStore(
//   { providedIn: 'root' }, // Make it injectable like the original service
//   withState(initialState),

//   // --- Computed Signals ---
//   withComputed((store) => ({
//     // Expose state signals directly if needed (often useful)
//     currentResource: store.resource,
//     currentSearchTerm: store.searchTerm,
//     currentResourceIds: store.resourceIds,
//     // Derived count based on resourceDetails
//     resourceCounts: computed(() => {
//       const data = store.resourceDetails();
//       const first = data?.results?.[0];

//       if (!first) return {};

//       const keys = swapiResources; // Assuming swapiResources is an array of relevant keys

//       const result: Record<string, number> = {};
//       const typed = first as unknown as Record<string, unknown>;

//       for (const key of keys) {
//         const value = typed[key];
//         if (Array.isArray(value)) {
//           result[key] = value.length;
//         }
//       }
//       return result;
//     }),
//   })),

//   // --- Methods (State Updaters & Effects) ---
//   withMethods((store, http = inject(HttpClient)) => {
//     const baseUrl = 'https://swapi.py4e.com/api';

//     // --- Private Helper: Fetch All Pages (from original service) ---
//     const fetchAllPages = <K extends SwapiResourceType>(
//       resource: K,
//       url: string
//     ): Observable<SwapiResponse<SwapiResourceMap[K]>> => {
//       const getPage = (
//         url: string
//       ): Observable<SwapiResponse<SwapiResourceMap[K]>> =>
//         http.get<SwapiResponse<SwapiResourceMap[K]>>(url);

//       const collectPages = (
//         url: string,
//         acc: SwapiResourceMap[K][] = []
//       ): Observable<SwapiResponse<SwapiResourceMap[K]>> => {
//         return getPage(url).pipe(
//           switchMap((response) => {
//             const updatedResults = response.results.map((item) => ({
//               ...item,
//               // Add 'id' property extracted from the URL
//               id: getIdFromUrl((item as any).url),
//             }));

//             const combined = [...acc, ...updatedResults];

//             if (response.next) {
//               // Recursively fetch the next page
//               return collectPages(response.next, combined);
//             } else {
//               // All pages fetched, sort the combined results
//               const sortKey = SortKeyMap[resource];
//               if (sortKey) {
//                 combined.sort((a, b) =>
//                   String((a as any)[sortKey] ?? '').localeCompare(
//                     String((b as any)[sortKey] ?? '')
//                   )
//                 );
//               }
//               // Return the final response structure
//               return of({
//                 ...response, // Keep count, next=null, previous=last_page
//                 results: combined,
//               });
//             }
//           })
//         );
//       };

//       return collectPages(url);
//     };

//     // --- Private Helper: Typed Loader for Search (from original service) ---
//     const typedLoader = <K extends SwapiResourceType>(
//       resource: K,
//       searchTerm: string | null
//     ): Observable<SwapiResponse<SwapiResourceMap[K]>> => {
//       // Handle empty/null search term if needed (e.g., fetch all or return empty)
//       // Original logic fetches based on search term, adjust if default fetch is needed
//       const url = `${baseUrl}/${resource}/?search=${searchTerm || ''}`;
//       // Added delay back as it was in the original service
//       return fetchAllPages(resource, url).pipe(delay(1000));
//     };

//     // --- Private Helper: Typed Loader for Resource IDs (from original service) ---
//     const typedResourceLoader = <K extends SwapiResourceType>(
//       resource: K,
//       ids: string[]
//     ): Observable<SwapiResponse<SwapiResourceMap[K]>> => {
//       if (!ids || ids.length === 0) {
//         // Return an empty response if no IDs are provided
//         return of({
//           count: 0,
//           next: null,
//           previous: null,
//           results: [],
//         } as SwapiResponse<SwapiResourceMap[K]>);
//       }

//       // Create an array of HTTP GET requests for each ID
//       const requests = ids.map((id: string) =>
//         http
//           .get<SwapiResourceMap[K]>(`${baseUrl}/${resource}/${id}`)
//           .pipe(
//             // Add 'id' property extracted from the URL to each item
//             tap((item: any) => (item['id'] = getIdFromUrl(item['url'])))
//           )
//       );

//       // Execute all requests in parallel and combine results
//       return forkJoin(requests).pipe(
//         map((results) => {
//           // Sort results (original logic used first property key, using 'id' might be more consistent)
//           // Keep original sorting logic for now:
//           const sortedResults = [...results].sort((a, b) => {
//             const keyA = Object.keys(a)[0]; // Be cautious, order isn't guaranteed
//             const keyB = Object.keys(b)[0];
//             const valA = String((a as any)[keyA] ?? '').toLowerCase();
//             const valB = String((b as any)[keyB] ?? '').toLowerCase();
//             return valA.localeCompare(valB);
//             // Alternative sorting by 'id' if preferred:
//             // return String(a.id ?? '').localeCompare(String(b.id ?? ''));
//           });

//           // Construct the SwapiResponse object
//           return {
//             count: sortedResults.length,
//             next: null,
//             previous: null,
//             results: sortedResults,
//           };
//         })
//       );
//     };

//     // --- Public Methods ---
//     return {
//       // --- State Updaters ---
//       setResource(resource: SwapiResourceType): void {
//         patchState(store, { resource });
//         // Optional: Trigger search or clear results when resource changes
//         // this.loadSearchResults(of(resource)); // Example trigger
//       },
//       setSearchTerm(searchTerm: string | null): void {
//         patchState(store, { searchTerm });
//         // Optional: Trigger search when term changes (debounced perhaps)
//         // this.loadSearchResults(of(searchTerm)); // Example trigger
//       },
//       setResourceIds(resourceIds: string[]): void {
//         patchState(store, { resourceIds });
//         // Optional: Trigger details load when IDs change
//         // this.loadResourceDetails(of(resourceIds)); // Example trigger
//       },

//       // --- Effects using rxMethod ---

//       // Effect for loading search results
//       readonly loadSearchResults = rxMethod<void>( // Triggered manually or by another signal/observable
//         pipe(
//           // Use state signals for parameters
//           switchMap(() => {
//             const currentResource = store.resource();
//             const currentSearchTerm = store.searchTerm();

//             // Skip if search term is null/empty (or adjust as needed)
//             if (currentSearchTerm === null || currentSearchTerm.trim() === '') {
//                 patchState(store, {
//                     searchResults: null, // Clear results if search term is empty
//                     isLoadingSearch: false,
//                     searchError: null,
//                 });
//                 return of(null); // Prevent API call
//             }

//             // Set loading state
//             patchState(store, { isLoadingSearch: true, searchError: null });

//             return typedLoader(currentResource, currentSearchTerm).pipe(
//               tapResponse({
//                 next: (searchResults) =>
//                   patchState(store, { searchResults, isLoadingSearch: false }),
//                 error: (error: HttpErrorResponse | Error) =>
//                   patchState(store, { searchError: error, isLoadingSearch: false }),
//                 // finalize: () => patchState(store, { isLoadingSearch: false }), // Already handled in next/error
//               })
//             );
//           })
//         )
//       ),

//       // Effect for loading resource details by IDs
//       readonly loadResourceDetails = rxMethod<void>( // Triggered manually or by another signal/observable
//         pipe(
//           // Use state signals for parameters
//           switchMap(() => {
//             const currentResource = store.resource();
//             const currentIds = store.resourceIds();

//              // Skip if no IDs are provided
//             if (!currentIds || currentIds.length === 0) {
//                  patchState(store, {
//                     resourceDetails: null, // Clear details
//                     isLoadingDetails: false,
//                     detailsError: null,
//                  });
//                 return of(null); // Prevent API call
//             }

//             // Set loading state
//             patchState(store, { isLoadingDetails: true, detailsError: null });

//             return typedResourceLoader(currentResource, currentIds).pipe(
//               tapResponse({
//                 next: (resourceDetails) =>
//                   patchState(store, { resourceDetails, isLoadingDetails: false }),
//                 error: (error: HttpErrorResponse | Error) =>
//                   patchState(store, { detailsError: error, isLoadingDetails: false }),
//                 // finalize: () => patchState(store, { isLoadingDetails: false }), // Already handled in next/error
//               })
//             );
//           })
//         )
//       ),
//     }; // End of methods return
//   }) // End of withMethods
// ); // End of signalStore

// --- How to Use in a Component ---
/*
import { Component, inject, OnInit, effect } from '@angular/core';
import { SwapiStore } from './swapi.store'; // Adjust path as needed
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwapiResourceType } from '../../models/swapi-resource-map'; // Adjust path

@Component({
  selector: 'app-swapi-consumer',
  standalone: true,
  imports: [JsonPipe, FormsModule],
  template: `
    <h2>Swapi NgRx Signal Store Example</h2>

    <label>
      Resource Type:
      <select [ngModel]="store.currentResource()" (ngModelChange)="changeResource($event)">
        <option value="people">People</option>
        <option value="planets">Planets</option>
        <option value="films">Films</option>
        <option value="species">Species</option>
        <option value="vehicles">Vehicles</option>
        <option value="starships">Starships</option>
      </select>
    </label>

    <br/>

    <label>
      Search Term:
      <input type="text" [ngModel]="store.currentSearchTerm()" (ngModelChange)="updateSearchTerm($event)" />
      <button (click)="store.loadSearchResults()" [disabled]="store.isLoadingSearch()">
        {{ store.isLoadingSearch() ? 'Searching...' : 'Search' }}
      </button>
       @if (store.searchError(); as error) {
          <p style="color: red;">Search Error: {{ error.message }}</p>
       }
    </label>

    <h3>Search Results ({{ store.searchResults()?.count ?? 0 }})</h3>
    <pre>{{ store.searchResults() | json }}</pre>

    <hr/>

     <label>
      Resource IDs (comma-separated):
      <input type="text" [ngModel]="store.currentResourceIds().join(',')" (ngModelChange)="updateResourceIds($event)" />
      <button (click)="store.loadResourceDetails()" [disabled]="store.isLoadingDetails()">
        {{ store.isLoadingDetails() ? 'Loading...' : 'Load Details' }}
      </button>
       @if (store.detailsError(); as error) {
          <p style="color: red;">Details Error: {{ error.message }}</p>
       }
    </label>

    <h3>Resource Details ({{ store.resourceDetails()?.count ?? 0 }})</h3>
     <pre>{{ store.resourceDetails() | json }}</pre>

     <h3>Resource Counts (from Details)</h3>
     <pre>{{ store.resourceCounts() | json }}</pre>

  `,
  styles: [`label { display: block; margin-bottom: 10px; }`],
})
export class SwapiConsumerComponent implements OnInit {
  readonly store = inject(SwapiStore);

  constructor() {
     // Example of reacting to state changes to trigger effects automatically
     // Be careful with potential infinite loops if not managed correctly
     // effect(() => {
     //   // Trigger search automatically when searchTerm changes (add debounce if needed)
     //   const term = this.store.currentSearchTerm();
     //   console.log('Search term changed:', term);
     //   if (term !== null && term.trim() !== '') { // Avoid triggering on initial null or empty
     //      this.store.loadSearchResults();
     //   }
     // }, { allowSignalWrites: true }); // Needed if effect calls methods that patchState

     // effect(() => {
     //   // Trigger details load automatically when resourceIds change
     //   const ids = this.store.currentResourceIds();
     //    console.log('Resource IDs changed:', ids);
     //   if (ids.length > 0) { // Avoid triggering on initial empty array
     //      this.store.loadResourceDetails();
     //   }
     // }, { allowSignalWrites: true });
  }


  ngOnInit() {
    // Optionally trigger initial load if needed
    // this.store.loadSearchResults();
    // this.store.loadResourceDetails();
  }

   changeResource(resource: string) {
    this.store.setResource(resource as SwapiResourceType);
    // Manually trigger search after changing resource if desired
    this.store.loadSearchResults();
  }

  updateSearchTerm(term: string | null) {
    this.store.setSearchTerm(term);
    // You might debounce this in a real app before calling loadSearchResults
     // Or rely on the manual button click / effect
  }

   updateResourceIds(idsString: string | null) {
      const ids = idsString?.split(',').map(id => id.trim()).filter(id => !!id) ?? [];
      this.store.setResourceIds(ids);
       // Or rely on the manual button click / effect
   }
}

*/
