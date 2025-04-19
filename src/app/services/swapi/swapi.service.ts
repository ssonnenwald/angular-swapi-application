import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SwapiResponse } from '../../models/swapi-response';
import {
  SwapiResourceType,
  SwapiResourceMap,
} from '../../models/swapi-resource-map';

@Injectable({
  providedIn: 'root',
})
export class SwapiService {
  private baseUrl = 'https://swapi.py4e.com/api';
  private http = inject(HttpClient);

  constructor() {}

  public search<K extends SwapiResourceType>(
    resource: K,
    term: string
  ): Observable<SwapiResponse<SwapiResourceMap[K]>> {
    return this.http.get<SwapiResponse<SwapiResourceMap[K]>>(
      `${this.baseUrl}/${resource}/?search=${term}`
    );
  }
}
