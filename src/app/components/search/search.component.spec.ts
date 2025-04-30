// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import SearchComponent from './search.component';
// import { SwapiService } from '../../services/swapi/swapi.service';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatTableModule } from '@angular/material/table';
// import { MatSortModule } from '@angular/material/sort';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { RouterTestingModule } from '@angular/router/testing';
// import { ReactiveFormsModule } from '@angular/forms';

// describe('SearchComponent', () => {
//   let component: SearchComponent;
//   let fixture: ComponentFixture<SearchComponent>;
//   let swapiService: SwapiService;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [
//         MatProgressSpinnerModule,
//         MatTableModule,
//         MatSortModule,
//         MatPaginatorModule,
//         RouterTestingModule,
//         ReactiveFormsModule,
//         SearchComponent,
//       ],
//       declarations: [],
//       providers: [SwapiService],
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SearchComponent);
//     component = fixture.componentInstance;
//     swapiService = TestBed.inject(SwapiService);
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should display search form', () => {
//     const searchForm = fixture.nativeElement.querySelector('form');
//     expect(searchForm).toBeTruthy();
//   });

//   it('should display search input', () => {
//     const searchInput = fixture.nativeElement.querySelector('input');
//     expect(searchInput).toBeTruthy();
//   });

//   it('should display search button', () => {
//     const searchButton = fixture.nativeElement.querySelector('button');
//     expect(searchButton).toBeTruthy();
//   });

//   it('should display loading spinner when data is being loaded', () => {
//     spyOn(swapiService.search, 'isLoading').and.returnValue(true);
//     fixture.detectChanges();
//     const loadingSpinner = fixture.nativeElement.querySelector(
//       'mat-progress-spinner'
//     );
//     expect(loadingSpinner).toBeTruthy();
//   });

//   it('should hide loading spinner when data is loaded', () => {
//     spyOn(swapiService.search, 'isLoading').and.returnValue(false);
//     fixture.detectChanges();
//     const loadingSpinner = fixture.nativeElement.querySelector(
//       'mat-progress-spinner'
//     );
//     expect(loadingSpinner).toBeFalsy();
//   });
// });
