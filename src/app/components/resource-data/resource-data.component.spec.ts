import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceDataComponent } from './resource-data.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter, RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import { SwapiResourceType } from '../../models/swapi-resource-map';
import { LowerCasePipe, TitleCasePipe } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const mockResponse = {
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

const mockFilmResponse_1 = {
  title: 'A New Hope',
  episode_id: 4,
  opening_crawl:
    "It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring the battle, Rebel\r\nspies managed to steal secret\r\nplans to the Empire's\r\nultimate weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough power\r\nto destroy an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, Princess\r\nLeia races home aboard her\r\nstarship, custodian of the\r\nstolen plans that can save her\r\npeople and restore\r\nfreedom to the galaxy....",
  director: 'George Lucas',
  producer: 'Gary Kurtz, Rick McCallum',
  release_date: '1977-05-25',
  characters: [
    'https://swapi.py4e.com/api/people/1/',
    'https://swapi.py4e.com/api/people/2/',
    'https://swapi.py4e.com/api/people/3/',
    'https://swapi.py4e.com/api/people/4/',
    'https://swapi.py4e.com/api/people/5/',
    'https://swapi.py4e.com/api/people/6/',
    'https://swapi.py4e.com/api/people/7/',
    'https://swapi.py4e.com/api/people/8/',
    'https://swapi.py4e.com/api/people/9/',
    'https://swapi.py4e.com/api/people/10/',
    'https://swapi.py4e.com/api/people/12/',
    'https://swapi.py4e.com/api/people/13/',
    'https://swapi.py4e.com/api/people/14/',
    'https://swapi.py4e.com/api/people/15/',
    'https://swapi.py4e.com/api/people/16/',
    'https://swapi.py4e.com/api/people/18/',
    'https://swapi.py4e.com/api/people/19/',
    'https://swapi.py4e.com/api/people/81/',
  ],
  planets: [
    'https://swapi.py4e.com/api/planets/1/',
    'https://swapi.py4e.com/api/planets/2/',
    'https://swapi.py4e.com/api/planets/3/',
  ],
  starships: [
    'https://swapi.py4e.com/api/starships/2/',
    'https://swapi.py4e.com/api/starships/3/',
    'https://swapi.py4e.com/api/starships/5/',
    'https://swapi.py4e.com/api/starships/9/',
    'https://swapi.py4e.com/api/starships/10/',
    'https://swapi.py4e.com/api/starships/11/',
    'https://swapi.py4e.com/api/starships/12/',
    'https://swapi.py4e.com/api/starships/13/',
  ],
  vehicles: [
    'https://swapi.py4e.com/api/vehicles/4/',
    'https://swapi.py4e.com/api/vehicles/6/',
    'https://swapi.py4e.com/api/vehicles/7/',
    'https://swapi.py4e.com/api/vehicles/8/',
  ],
  species: [
    'https://swapi.py4e.com/api/species/1/',
    'https://swapi.py4e.com/api/species/2/',
    'https://swapi.py4e.com/api/species/3/',
    'https://swapi.py4e.com/api/species/4/',
    'https://swapi.py4e.com/api/species/5/',
  ],
  created: '2014-12-10T14:23:31.880000Z',
  edited: '2014-12-20T19:49:45.256000Z',
  url: 'https://swapi.py4e.com/api/films/1/',
  id: '1',
};
const mockFilmResponse_2 = {
  title: 'The Empire Strikes Back',
  episode_id: 5,
  opening_crawl:
    'It is a dark time for the\r\nRebellion. Although the Death\r\nStar has been destroyed,\r\nImperial troops have driven the\r\nRebel forces from their hidden\r\nbase and pursued them across\r\nthe galaxy.\r\n\r\nEvading the dreaded Imperial\r\nStarfleet, a group of freedom\r\nfighters led by Luke Skywalker\r\nhas established a new secret\r\nbase on the remote ice world\r\nof Hoth.\r\n\r\nThe evil lord Darth Vader,\r\nobsessed with finding young\r\nSkywalker, has dispatched\r\nthousands of remote probes into\r\nthe far reaches of space....',
  director: 'Irvin Kershner',
  producer: 'Gary Kurtz, Rick McCallum',
  release_date: '1980-05-17',
  characters: [
    'https://swapi.py4e.com/api/people/1/',
    'https://swapi.py4e.com/api/people/2/',
    'https://swapi.py4e.com/api/people/3/',
    'https://swapi.py4e.com/api/people/4/',
    'https://swapi.py4e.com/api/people/5/',
    'https://swapi.py4e.com/api/people/10/',
    'https://swapi.py4e.com/api/people/13/',
    'https://swapi.py4e.com/api/people/14/',
    'https://swapi.py4e.com/api/people/18/',
    'https://swapi.py4e.com/api/people/20/',
    'https://swapi.py4e.com/api/people/21/',
    'https://swapi.py4e.com/api/people/22/',
    'https://swapi.py4e.com/api/people/23/',
    'https://swapi.py4e.com/api/people/24/',
    'https://swapi.py4e.com/api/people/25/',
    'https://swapi.py4e.com/api/people/26/',
  ],
  planets: [
    'https://swapi.py4e.com/api/planets/4/',
    'https://swapi.py4e.com/api/planets/5/',
    'https://swapi.py4e.com/api/planets/6/',
    'https://swapi.py4e.com/api/planets/27/',
  ],
  starships: [
    'https://swapi.py4e.com/api/starships/3/',
    'https://swapi.py4e.com/api/starships/10/',
    'https://swapi.py4e.com/api/starships/11/',
    'https://swapi.py4e.com/api/starships/12/',
    'https://swapi.py4e.com/api/starships/15/',
    'https://swapi.py4e.com/api/starships/17/',
    'https://swapi.py4e.com/api/starships/21/',
    'https://swapi.py4e.com/api/starships/22/',
    'https://swapi.py4e.com/api/starships/23/',
  ],
  vehicles: [
    'https://swapi.py4e.com/api/vehicles/8/',
    'https://swapi.py4e.com/api/vehicles/14/',
    'https://swapi.py4e.com/api/vehicles/16/',
    'https://swapi.py4e.com/api/vehicles/18/',
    'https://swapi.py4e.com/api/vehicles/19/',
    'https://swapi.py4e.com/api/vehicles/20/',
  ],
  species: [
    'https://swapi.py4e.com/api/species/1/',
    'https://swapi.py4e.com/api/species/2/',
    'https://swapi.py4e.com/api/species/3/',
    'https://swapi.py4e.com/api/species/6/',
    'https://swapi.py4e.com/api/species/7/',
  ],
  created: '2014-12-12T11:26:24.656000Z',
  edited: '2014-12-15T13:07:53.386000Z',
  url: 'https://swapi.py4e.com/api/films/2/',
  id: '2',
};
const mockFilmResponse_3 = {
  title: 'Return of the Jedi',
  episode_id: 6,
  opening_crawl:
    'Luke Skywalker has returned to\r\nhis home planet of Tatooine in\r\nan attempt to rescue his\r\nfriend Han Solo from the\r\nclutches of the vile gangster\r\nJabba the Hutt.\r\n\r\nLittle does Luke know that the\r\nGALACTIC EMPIRE has secretly\r\nbegun construction on a new\r\narmored space station even\r\nmore powerful than the first\r\ndreaded Death Star.\r\n\r\nWhen completed, this ultimate\r\nweapon will spell certain doom\r\nfor the small band of rebels\r\nstruggling to restore freedom\r\nto the galaxy...',
  director: 'Richard Marquand',
  producer: 'Howard G. Kazanjian, George Lucas, Rick McCallum',
  release_date: '1983-05-25',
  characters: [
    'https://swapi.py4e.com/api/people/1/',
    'https://swapi.py4e.com/api/people/2/',
    'https://swapi.py4e.com/api/people/3/',
    'https://swapi.py4e.com/api/people/4/',
    'https://swapi.py4e.com/api/people/5/',
    'https://swapi.py4e.com/api/people/10/',
    'https://swapi.py4e.com/api/people/13/',
    'https://swapi.py4e.com/api/people/14/',
    'https://swapi.py4e.com/api/people/16/',
    'https://swapi.py4e.com/api/people/18/',
    'https://swapi.py4e.com/api/people/20/',
    'https://swapi.py4e.com/api/people/21/',
    'https://swapi.py4e.com/api/people/22/',
    'https://swapi.py4e.com/api/people/25/',
    'https://swapi.py4e.com/api/people/27/',
    'https://swapi.py4e.com/api/people/28/',
    'https://swapi.py4e.com/api/people/29/',
    'https://swapi.py4e.com/api/people/30/',
    'https://swapi.py4e.com/api/people/31/',
    'https://swapi.py4e.com/api/people/45/',
  ],
  planets: [
    'https://swapi.py4e.com/api/planets/1/',
    'https://swapi.py4e.com/api/planets/5/',
    'https://swapi.py4e.com/api/planets/7/',
    'https://swapi.py4e.com/api/planets/8/',
    'https://swapi.py4e.com/api/planets/9/',
  ],
  starships: [
    'https://swapi.py4e.com/api/starships/2/',
    'https://swapi.py4e.com/api/starships/3/',
    'https://swapi.py4e.com/api/starships/10/',
    'https://swapi.py4e.com/api/starships/11/',
    'https://swapi.py4e.com/api/starships/12/',
    'https://swapi.py4e.com/api/starships/15/',
    'https://swapi.py4e.com/api/starships/17/',
    'https://swapi.py4e.com/api/starships/22/',
    'https://swapi.py4e.com/api/starships/23/',
    'https://swapi.py4e.com/api/starships/27/',
    'https://swapi.py4e.com/api/starships/28/',
    'https://swapi.py4e.com/api/starships/29/',
  ],
  vehicles: [
    'https://swapi.py4e.com/api/vehicles/8/',
    'https://swapi.py4e.com/api/vehicles/16/',
    'https://swapi.py4e.com/api/vehicles/18/',
    'https://swapi.py4e.com/api/vehicles/19/',
    'https://swapi.py4e.com/api/vehicles/24/',
    'https://swapi.py4e.com/api/vehicles/25/',
    'https://swapi.py4e.com/api/vehicles/26/',
    'https://swapi.py4e.com/api/vehicles/30/',
  ],
  species: [
    'https://swapi.py4e.com/api/species/1/',
    'https://swapi.py4e.com/api/species/2/',
    'https://swapi.py4e.com/api/species/3/',
    'https://swapi.py4e.com/api/species/5/',
    'https://swapi.py4e.com/api/species/6/',
    'https://swapi.py4e.com/api/species/8/',
    'https://swapi.py4e.com/api/species/9/',
    'https://swapi.py4e.com/api/species/10/',
    'https://swapi.py4e.com/api/species/15/',
  ],
  created: '2014-12-18T10:39:33.255000Z',
  edited: '2014-12-20T09:48:37.462000Z',
  url: 'https://swapi.py4e.com/api/films/3/',
  id: '3',
};
const mockFilmResponse_6 = {
  title: 'Revenge of the Sith',
  episode_id: 3,
  opening_crawl:
    'War! The Republic is crumbling\r\nunder attacks by the ruthless\r\nSith Lord, Count Dooku.\r\nThere are heroes on both sides.\r\nEvil is everywhere.\r\n\r\nIn a stunning move, the\r\nfiendish droid leader, General\r\nGrievous, has swept into the\r\nRepublic capital and kidnapped\r\nChancellor Palpatine, leader of\r\nthe Galactic Senate.\r\n\r\nAs the Separatist Droid Army\r\nattempts to flee the besieged\r\ncapital with their valuable\r\nhostage, two Jedi Knights lead a\r\ndesperate mission to rescue the\r\ncaptive Chancellor....',
  director: 'George Lucas',
  producer: 'Rick McCallum',
  release_date: '2005-05-19',
  characters: [
    'https://swapi.py4e.com/api/people/1/',
    'https://swapi.py4e.com/api/people/2/',
    'https://swapi.py4e.com/api/people/3/',
    'https://swapi.py4e.com/api/people/4/',
    'https://swapi.py4e.com/api/people/5/',
    'https://swapi.py4e.com/api/people/6/',
    'https://swapi.py4e.com/api/people/7/',
    'https://swapi.py4e.com/api/people/10/',
    'https://swapi.py4e.com/api/people/11/',
    'https://swapi.py4e.com/api/people/12/',
    'https://swapi.py4e.com/api/people/13/',
    'https://swapi.py4e.com/api/people/20/',
    'https://swapi.py4e.com/api/people/21/',
    'https://swapi.py4e.com/api/people/33/',
    'https://swapi.py4e.com/api/people/35/',
    'https://swapi.py4e.com/api/people/46/',
    'https://swapi.py4e.com/api/people/51/',
    'https://swapi.py4e.com/api/people/52/',
    'https://swapi.py4e.com/api/people/53/',
    'https://swapi.py4e.com/api/people/54/',
    'https://swapi.py4e.com/api/people/55/',
    'https://swapi.py4e.com/api/people/56/',
    'https://swapi.py4e.com/api/people/58/',
    'https://swapi.py4e.com/api/people/63/',
    'https://swapi.py4e.com/api/people/64/',
    'https://swapi.py4e.com/api/people/67/',
    'https://swapi.py4e.com/api/people/68/',
    'https://swapi.py4e.com/api/people/75/',
    'https://swapi.py4e.com/api/people/78/',
    'https://swapi.py4e.com/api/people/79/',
    'https://swapi.py4e.com/api/people/80/',
    'https://swapi.py4e.com/api/people/81/',
    'https://swapi.py4e.com/api/people/82/',
    'https://swapi.py4e.com/api/people/83/',
  ],
  planets: [
    'https://swapi.py4e.com/api/planets/1/',
    'https://swapi.py4e.com/api/planets/2/',
    'https://swapi.py4e.com/api/planets/5/',
    'https://swapi.py4e.com/api/planets/8/',
    'https://swapi.py4e.com/api/planets/9/',
    'https://swapi.py4e.com/api/planets/12/',
    'https://swapi.py4e.com/api/planets/13/',
    'https://swapi.py4e.com/api/planets/14/',
    'https://swapi.py4e.com/api/planets/15/',
    'https://swapi.py4e.com/api/planets/16/',
    'https://swapi.py4e.com/api/planets/17/',
    'https://swapi.py4e.com/api/planets/18/',
    'https://swapi.py4e.com/api/planets/19/',
  ],
  starships: [
    'https://swapi.py4e.com/api/starships/2/',
    'https://swapi.py4e.com/api/starships/32/',
    'https://swapi.py4e.com/api/starships/48/',
    'https://swapi.py4e.com/api/starships/59/',
    'https://swapi.py4e.com/api/starships/61/',
    'https://swapi.py4e.com/api/starships/63/',
    'https://swapi.py4e.com/api/starships/64/',
    'https://swapi.py4e.com/api/starships/65/',
    'https://swapi.py4e.com/api/starships/66/',
    'https://swapi.py4e.com/api/starships/68/',
    'https://swapi.py4e.com/api/starships/74/',
    'https://swapi.py4e.com/api/starships/75/',
  ],
  vehicles: [
    'https://swapi.py4e.com/api/vehicles/33/',
    'https://swapi.py4e.com/api/vehicles/50/',
    'https://swapi.py4e.com/api/vehicles/53/',
    'https://swapi.py4e.com/api/vehicles/56/',
    'https://swapi.py4e.com/api/vehicles/60/',
    'https://swapi.py4e.com/api/vehicles/62/',
    'https://swapi.py4e.com/api/vehicles/67/',
    'https://swapi.py4e.com/api/vehicles/69/',
    'https://swapi.py4e.com/api/vehicles/70/',
    'https://swapi.py4e.com/api/vehicles/71/',
    'https://swapi.py4e.com/api/vehicles/72/',
    'https://swapi.py4e.com/api/vehicles/73/',
    'https://swapi.py4e.com/api/vehicles/76/',
  ],
  species: [
    'https://swapi.py4e.com/api/species/1/',
    'https://swapi.py4e.com/api/species/2/',
    'https://swapi.py4e.com/api/species/3/',
    'https://swapi.py4e.com/api/species/6/',
    'https://swapi.py4e.com/api/species/15/',
    'https://swapi.py4e.com/api/species/19/',
    'https://swapi.py4e.com/api/species/20/',
    'https://swapi.py4e.com/api/species/23/',
    'https://swapi.py4e.com/api/species/24/',
    'https://swapi.py4e.com/api/species/25/',
    'https://swapi.py4e.com/api/species/26/',
    'https://swapi.py4e.com/api/species/27/',
    'https://swapi.py4e.com/api/species/28/',
    'https://swapi.py4e.com/api/species/29/',
    'https://swapi.py4e.com/api/species/30/',
    'https://swapi.py4e.com/api/species/33/',
    'https://swapi.py4e.com/api/species/34/',
    'https://swapi.py4e.com/api/species/35/',
    'https://swapi.py4e.com/api/species/36/',
    'https://swapi.py4e.com/api/species/37/',
  ],
  created: '2014-12-20T18:49:38.403000Z',
  edited: '2014-12-20T20:47:52.073000Z',
  url: 'https://swapi.py4e.com/api/films/6/',
  id: '6',
};
const mockFilmResponse_7 = {
  title: 'The Force Awakens',
  episode_id: 7,
  opening_crawl:
    "Luke Skywalker has vanished.\r\nIn his absence, the sinister\r\nFIRST ORDER has risen from\r\nthe ashes of the Empire\r\nand will not rest until\r\nSkywalker, the last Jedi,\r\nhas been destroyed.\r\n \r\nWith the support of the\r\nREPUBLIC, General Leia Organa\r\nleads a brave RESISTANCE.\r\nShe is desperate to find her\r\nbrother Luke and gain his\r\nhelp in restoring peace and\r\njustice to the galaxy.\r\n \r\nLeia has sent her most daring\r\npilot on a secret mission\r\nto Jakku, where an old ally\r\nhas discovered a clue to\r\nLuke's whereabouts....",
  director: 'J. J. Abrams',
  producer: 'Kathleen Kennedy, J. J. Abrams, Bryan Burk',
  release_date: '2015-12-11',
  characters: [
    'https://swapi.py4e.com/api/people/1/',
    'https://swapi.py4e.com/api/people/3/',
    'https://swapi.py4e.com/api/people/5/',
    'https://swapi.py4e.com/api/people/13/',
    'https://swapi.py4e.com/api/people/14/',
    'https://swapi.py4e.com/api/people/27/',
    'https://swapi.py4e.com/api/people/84/',
    'https://swapi.py4e.com/api/people/85/',
    'https://swapi.py4e.com/api/people/86/',
    'https://swapi.py4e.com/api/people/87/',
    'https://swapi.py4e.com/api/people/88/',
  ],
  planets: ['https://swapi.py4e.com/api/planets/61/'],
  starships: [
    'https://swapi.py4e.com/api/starships/10/',
    'https://swapi.py4e.com/api/starships/77/',
  ],
  vehicles: [],
  species: [
    'https://swapi.py4e.com/api/species/1/',
    'https://swapi.py4e.com/api/species/2/',
    'https://swapi.py4e.com/api/species/3/',
  ],
  created: '2015-04-17T06:51:30.504780Z',
  edited: '2015-12-17T14:31:47.617768Z',
  url: 'https://swapi.py4e.com/api/films/7/',
  id: '7',
};

describe('ResourceDataComponent', () => {
  let component: ResourceDataComponent;
  let fixture: ComponentFixture<ResourceDataComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        RouterLink,
        MatProgressSpinnerModule,
        TitleCasePipe,
        LowerCasePipe,
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
    fixture = TestBed.createComponent(ResourceDataComponent);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);

    const resourceType = signal<SwapiResourceType>(
      'films' as SwapiResourceType
    );
    fixture.componentInstance.resourceType =
      resourceType as unknown as typeof fixture.componentInstance.resourceType;

    const data = signal<any>(mockResponse as any);
    fixture.componentInstance.data =
      data as unknown as typeof fixture.componentInstance.data;

    const selectedTabName = signal<string>('Films');
    fixture.componentInstance.selectedTabName =
      selectedTabName as unknown as typeof fixture.componentInstance.selectedTabName;

    fixture.detectChanges();

    loadFilmsDataForHttpRequests(httpTesting);

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display data table', async () => {
    const dataTable = fixture.nativeElement.querySelector('mat-table');

    expect(dataTable).toBeTruthy();
  });

  it('should display data table columns', () => {
    const dataTableColumns =
      fixture.nativeElement.querySelectorAll('mat-header-cell');

    expect(dataTableColumns.length).toBeGreaterThan(0);
  });

  it('should display data table rows', () => {
    const dataTableRows = fixture.nativeElement.querySelectorAll('mat-row');

    expect(dataTableRows.length).toBeGreaterThan(0);
  });

  // it('should display loading spinner when data is being loaded', () => {
  //   const loadingSpinner = fixture.nativeElement.querySelector('mat-spinner');
  //   expect(loadingSpinner).toBeTruthy();
  // });

  it('should hide loading spinner when data is loaded', () => {
    const loadingSpinner = fixture.nativeElement.querySelector(
      'mat-progress-spinner'
    );

    expect(loadingSpinner).toBeFalsy();
  });
});

function loadFilmsDataForHttpRequests(httpTesting: HttpTestingController) {
  // At this point, the request is pending, and we can assert it was made
  // via the `HttpTestingController`:
  let req = httpTesting.expectOne(
    'https://swapi.py4e.com/api/films/1',
    'Request to get the data.'
  );

  expect(req.request.method).toBe('GET'); // Check that the request is a GET request.

  req.flush(mockFilmResponse_1); // Flushing the request causes it to complete, delivering the result.

  // At this point, the request is pending, and we can assert it was made
  // via the `HttpTestingController`:
  req = httpTesting.expectOne(
    'https://swapi.py4e.com/api/films/2',
    'Request to get the data.'
  );

  expect(req.request.method).toBe('GET'); // Check that the request is a GET request.

  req.flush(mockFilmResponse_2); // Flushing the request causes it to complete, delivering the result.

  // At this point, the request is pending, and we can assert it was made
  // via the `HttpTestingController`:
  req = httpTesting.expectOne(
    'https://swapi.py4e.com/api/films/3',
    'Request to get the data.'
  );

  expect(req.request.method).toBe('GET'); // Check that the request is a GET request.

  req.flush(mockFilmResponse_3); // Flushing the request causes it to complete, delivering the result.

  // At this point, the request is pending, and we can assert it was made
  // via the `HttpTestingController`:
  req = httpTesting.expectOne(
    'https://swapi.py4e.com/api/films/6',
    'Request to get the data.'
  );

  expect(req.request.method).toBe('GET'); // Check that the request is a GET request.

  req.flush(mockFilmResponse_6); // Flushing the request causes it to complete, delivering the result.

  // At this point, the request is pending, and we can assert it was made
  // via the `HttpTestingController`:
  req = httpTesting.expectOne(
    'https://swapi.py4e.com/api/films/7',
    'Request to get the data.'
  );

  expect(req.request.method).toBe('GET'); // Check that the request is a GET request.

  req.flush(mockFilmResponse_7); // Flushing the request causes it to complete, delivering the result.

  httpTesting.verify(); // Assert that no other requests were made.
}
