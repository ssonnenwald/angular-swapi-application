import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertiesComponent } from './properties.component';
import { ResourceDataComponent } from '../resource-data/resource-data.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { SwapiResourceType } from '../../models/swapi-resource-map';

const mockData = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  homeworld: 'https://swapi.py4e.com/api/planets/1/',
  films: [
    'https://swapi.py4e.com/api/films/1/',
    'https://swapi.py4e.com/api/films/2/',
    'https://swapi.py4e.com/api/films/3/',
    'https://swapi.py4e.com/api/films/6/',
    'https://swapi.py4e.com/api/films/7/',
  ],
  species: ['https://swapi.py4e.com/api/species/1/'],
  vehicles: [
    'https://swapi.py4e.com/api/vehicles/14/',
    'https://swapi.py4e.com/api/vehicles/30/',
  ],
  starships: [
    'https://swapi.py4e.com/api/starships/12/',
    'https://swapi.py4e.com/api/starships/22/',
  ],
  created: '2014-12-09T13:50:51.644000Z',
  edited: '2014-12-20T21:17:56.891000Z',
  url: 'https://swapi.py4e.com/api/people/1/',
  id: '1',
};

const mockPlanetData = {
  name: 'Tatooine',
  rotation_period: '23',
  orbital_period: '304',
  diameter: '10465',
  climate: 'arid',
  gravity: '1 standard',
  terrain: 'desert',
  surface_water: '1',
  population: '200000',
  residents: [
    'https://swapi.py4e.com/api/people/1/',
    'https://swapi.py4e.com/api/people/2/',
    'https://swapi.py4e.com/api/people/4/',
    'https://swapi.py4e.com/api/people/6/',
    'https://swapi.py4e.com/api/people/7/',
    'https://swapi.py4e.com/api/people/8/',
    'https://swapi.py4e.com/api/people/9/',
    'https://swapi.py4e.com/api/people/11/',
    'https://swapi.py4e.com/api/people/43/',
    'https://swapi.py4e.com/api/people/62/',
  ],
  films: [
    'https://swapi.py4e.com/api/films/1/',
    'https://swapi.py4e.com/api/films/3/',
    'https://swapi.py4e.com/api/films/4/',
    'https://swapi.py4e.com/api/films/5/',
    'https://swapi.py4e.com/api/films/6/',
  ],
  created: '2014-12-09T13:50:49.641000Z',
  edited: '2014-12-20T20:58:18.411000Z',
  url: 'https://swapi.py4e.com/api/planets/1/',
};

describe('PropertiesComponent', () => {
  let component: PropertiesComponent;
  let fixture: ComponentFixture<PropertiesComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatIconModule,
        MatTableModule,
        MatBadgeModule,
        PropertiesComponent,
        ResourceDataComponent,
      ],
      declarations: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),

        provideRouter([]),
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(PropertiesComponent);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);

    const resourceType = signal<SwapiResourceType>(
      'people' as SwapiResourceType
    );
    fixture.componentInstance.resourceType =
      resourceType as unknown as typeof fixture.componentInstance.resourceType;

    const data = signal<any>(mockData as any);
    fixture.componentInstance.data =
      data as unknown as typeof fixture.componentInstance.data;

    fixture.detectChanges();

    // At this point, the request is pending, and we can assert it was made
    // via the `HttpTestingController`:
    const req = httpTesting.expectOne(
      'https://swapi.py4e.com/api/planets/1',
      'Request to get the data.'
    );

    expect(req.request.method).toBe('GET'); // Check that the request is a GET request.

    req.flush(mockPlanetData); // Flushing the request causes it to complete, delivering the result.

    httpTesting.verify(); // Assert that no other requests were made.

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display properties', () => {
    const properties = fixture.nativeElement.querySelectorAll(
      '.properties-content'
    );

    expect(properties.length).toBeGreaterThan(0);
  });

  it('should display property keys and values', () => {
    const propertyKeys =
      fixture.nativeElement.querySelectorAll('.property-key');

    const propertyValues =
      fixture.nativeElement.querySelectorAll('.property-value');

    expect(propertyKeys.length).toBeGreaterThan(0);
    expect(propertyValues.length).toBeGreaterThan(0);
  });

  it('should display resource id', () => {
    const resourceName =
      fixture.nativeElement.querySelector('[data-testid="Id"]');

    expect(resourceName.textContent).toContain('1');
  });

  it('should display resource name', () => {
    const resourceName = fixture.nativeElement.querySelector(
      '[data-testid="Name"]'
    );

    expect(resourceName.textContent).toContain('Luke Skywalker');
  });

  it('should display resource birth year', () => {
    const resourceName = fixture.nativeElement.querySelector(
      '[data-testid="Birth Year"]'
    );

    expect(resourceName.textContent).toContain('19BBY');
  });

  it('should display resource eye color', () => {
    const resourceName = fixture.nativeElement.querySelector(
      '[data-testid="Eye Color"]'
    );

    expect(resourceName.textContent).toContain('blue');
  });

  it('should display resource hair color', () => {
    const resourceName = fixture.nativeElement.querySelector(
      '[data-testid="Hair Color"]'
    );

    expect(resourceName.textContent).toContain('blond');
  });

  it('should display resource height', () => {
    const resourceName = fixture.nativeElement.querySelector(
      '[data-testid="Height"]'
    );

    expect(resourceName.textContent).toContain('172');
  });

  it('should display resource mass', () => {
    const resourceName = fixture.nativeElement.querySelector(
      '[data-testid="Mass"]'
    );

    expect(resourceName.textContent).toContain('77');
  });

  it('should display resource skin color', () => {
    const resourceName = fixture.nativeElement.querySelector(
      '[data-testid="Skin Color"]'
    );

    expect(resourceName.textContent).toContain('fair');
  });

  it('should display resource homeworld', () => {
    const resourceName = fixture.nativeElement.querySelector(
      '[data-testid="Homeworld"]'
    );

    expect(resourceName.textContent).toContain('Tatooine');
  });

  it('should display resource created', () => {
    const resourceName = fixture.nativeElement.querySelector(
      '[data-testid="Created"]'
    );

    expect(resourceName.textContent).toContain(
      'December 9, 2014 at 8:50:51 AM EST'
    );
  });

  it('should display resource edited', () => {
    const resourceName = fixture.nativeElement.querySelector(
      '[data-testid="Edited"]'
    );

    expect(resourceName.textContent).toContain(
      'December 20, 2014 at 4:17:56 PM EST'
    );
  });
});
