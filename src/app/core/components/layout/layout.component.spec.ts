// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { LayoutComponent } from './layout.component';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { RouterTestingModule } from '@angular/router/testing';
// import { signal } from '@angular/core';

// describe('LayoutComponent', () => {
//   let component: LayoutComponent;
//   let fixture: ComponentFixture<LayoutComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [
//         LayoutComponent,
//         MatSidenavModule,
//         RouterTestingModule.withRoutes([]), // Pass an empty array of routes
//       ],
//       declarations: [],
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(LayoutComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize isMobile signal to false', () => {
//     expect(component.isMobile()).toBe(false);
//   });

//   it('should toggle sidenav on toggleSideNav call', () => {
//     const sidenav = fixture.nativeElement.querySelector('mat-sidenav');
//     expect(sidenav.opened).toBe(true);
//     component.toggleSideNav();
//     fixture.detectChanges();
//     expect(sidenav.opened).toBe(false);
//   });

//   it('should open sidenav on constructor call when not mobile', () => {
//     const sidenav = fixture.nativeElement.querySelector('mat-sidenav');
//     expect(sidenav.opened).toBe(true);
//   });

//   it('should not open sidenav on constructor call when mobile', () => {
//     component.isMobile = signal(true);
//     fixture.detectChanges();
//     const sidenav = fixture.nativeElement.querySelector('mat-sidenav');
//     expect(sidenav.opened).toBe(false);
//   });
// });
