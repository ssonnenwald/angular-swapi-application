import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SwapiService } from './swapi.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Person } from '../../models/person';

describe('SwapiService', () => {
  let service: SwapiService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(), // Necessary to provide HttpClient
        provideHttpClientTesting(), // Mocking HTTP requests
        provideRouter([]),
      ],
    });

    service = TestBed.inject(SwapiService);
    httpMock = TestBed.inject(HttpTestingController); // Inject HttpTestingController for HTTP mocks
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no pending HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch person by ID', fakeAsync(() => {
    const mock = {
      name: 'Luke Skywalker',
      url: 'https://swapi.py4e.com/api/people/1/',
    };
    service.resource = 'people';
    service.resourceIds.set(['1']);
    TestBed.flushEffects();

    const req = httpMock.expectOne('https://swapi.py4e.com/api/people/1');
    expect(req.request.method).toBe('GET');
    req.flush(mock);

    tick();
    const data = service.resourceData.value();
    expect(data?.count).toBe(1);
    expect((data?.results[0] as any).name).toBe('Luke Skywalker');
  }));

  it('should fetch film by ID', fakeAsync(() => {
    const mock = {
      title: 'A New Hope',
      url: 'https://swapi.py4e.com/api/films/1/',
    };
    service.resource = 'films';
    service.resourceIds.set(['1']);
    TestBed.flushEffects();

    const req = httpMock.expectOne('https://swapi.py4e.com/api/films/1');
    expect(req.request.method).toBe('GET');
    req.flush(mock);

    tick();
    const data = service.resourceData.value();
    expect(data?.count).toBe(1);
    expect((data?.results[0] as any).title).toBe('A New Hope');
  }));

  it('should fetch planet by ID', fakeAsync(() => {
    const mock = {
      name: 'Tatooine',
      url: 'https://swapi.py4e.com/api/planets/1/',
    };
    service.resource = 'planets';
    service.resourceIds.set(['1']);
    TestBed.flushEffects();

    const req = httpMock.expectOne('https://swapi.py4e.com/api/planets/1');
    expect(req.request.method).toBe('GET');
    req.flush(mock);

    tick();
    const data = service.resourceData.value();
    expect(data?.count).toBe(1);
    expect((data?.results[0] as any).name).toBe('Tatooine');
  }));

  it('should fetch species by ID', fakeAsync(() => {
    const mock = {
      name: 'Human',
      url: 'https://swapi.py4e.com/api/species/1/',
    };
    service.resource = 'species';
    service.resourceIds.set(['1']);
    TestBed.flushEffects();

    const req = httpMock.expectOne('https://swapi.py4e.com/api/species/1');
    expect(req.request.method).toBe('GET');
    req.flush(mock);

    tick();
    const data = service.resourceData.value();
    expect(data?.count).toBe(1);
    expect((data?.results[0] as any).name).toBe('Human');
  }));

  it('should fetch starship by ID', fakeAsync(() => {
    const mock = {
      name: 'X-wing',
      url: 'https://swapi.py4e.com/api/starships/1/',
    };
    service.resource = 'starships';
    service.resourceIds.set(['1']);
    TestBed.flushEffects();

    const req = httpMock.expectOne('https://swapi.py4e.com/api/starships/1');
    expect(req.request.method).toBe('GET');
    req.flush(mock);

    tick();
    const data = service.resourceData.value();
    expect(data?.count).toBe(1);
    expect((data?.results[0] as any).name).toBe('X-wing');
  }));

  it('should fetch vehicle by ID', fakeAsync(() => {
    const mock = {
      name: 'Sand Crawler',
      url: 'https://swapi.py4e.com/api/vehicles/1/',
    };
    service.resource = 'vehicles';
    service.resourceIds.set(['1']);
    TestBed.flushEffects();

    const req = httpMock.expectOne('https://swapi.py4e.com/api/vehicles/1');
    expect(req.request.method).toBe('GET');
    req.flush(mock);

    tick();
    const data = service.resourceData.value();
    expect(data?.count).toBe(1);
    expect((data?.results[0] as any).name).toBe('Sand Crawler');
  }));

  it('should handle empty resourceIds gracefully', () => {
    service.resourceIds.set([]); // Set empty resourceIds

    TestBed.flushEffects(); // Flush signal effects

    const data = service.resourceData.value(); // Read the signal value
    expect(data).toBeUndefined(); // Assert
  });

  it('should search people', fakeAsync(() => {
    const searchTerm = 'Luke';
    const mockResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'Luke Skywalker', id: 'undefined' }],
    };

    service.resource = 'people';
    service.searchTerm.set(searchTerm);

    TestBed.flushEffects();

    const req = httpMock.expectOne(
      `https://swapi.py4e.com/api/people/?search=${searchTerm}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    tick(2000);

    expect(service.search.value()).toEqual(mockResponse as any);
  }));

  it('should search films', fakeAsync(() => {
    const searchTerm = 'Hope';
    const mockResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [{ title: 'A New Hope', id: 'undefined' }],
    };

    service.resource = 'films';
    service.searchTerm.set(searchTerm);

    TestBed.flushEffects();

    const req = httpMock.expectOne(
      `https://swapi.py4e.com/api/films/?search=${searchTerm}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    tick(2000);

    expect(service.search.value()).toEqual(mockResponse as any);
  }));

  it('should search planets', fakeAsync(() => {
    const searchTerm = 'Tatooine';
    const mockResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'Tatooine', id: 'undefined' }],
    };

    service.resource = 'planets';
    service.searchTerm.set(searchTerm);

    TestBed.flushEffects();

    const req = httpMock.expectOne(
      `https://swapi.py4e.com/api/planets/?search=${searchTerm}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    tick(2000);

    expect(service.search.value()).toEqual(mockResponse as any);
  }));

  it('should search species', fakeAsync(() => {
    const searchTerm = 'Human';
    const mockResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'Human', id: 'undefined' }],
    };

    service.resource = 'species';
    service.searchTerm.set(searchTerm);

    TestBed.flushEffects();

    const req = httpMock.expectOne(
      `https://swapi.py4e.com/api/species/?search=${searchTerm}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    tick(2000);

    expect(service.search.value()).toEqual(mockResponse as any);
  }));

  it('should search starships', fakeAsync(() => {
    const searchTerm = 'X-wing';
    const mockResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'X-wing', id: 'undefined' }],
    };

    service.resource = 'starships';
    service.searchTerm.set(searchTerm);

    TestBed.flushEffects();

    const req = httpMock.expectOne(
      `https://swapi.py4e.com/api/starships/?search=${searchTerm}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    tick(2000);

    expect(service.search.value()).toEqual(mockResponse as any);
  }));

  it('should search vehicles', fakeAsync(() => {
    const searchTerm = 'Sand';
    const mockResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'Sand Crawler', id: 'undefined' }],
    };

    service.resource = 'vehicles';
    service.searchTerm.set(searchTerm);

    TestBed.flushEffects();

    const req = httpMock.expectOne(
      `https://swapi.py4e.com/api/vehicles/?search=${searchTerm}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    tick(2000);

    expect(service.search.value()).toEqual(mockResponse as any);
  }));
});
