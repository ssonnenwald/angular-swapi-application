import { ComponentFixture, TestBed } from '@angular/core/testing';
import HomeComponent from './home.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, HomeComponent],
      declarations: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),

        provideRouter([]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the welcome message', () => {
    const welcomeMessage = fixture.nativeElement.querySelector('h1');

    expect(welcomeMessage.textContent).toContain(
      'Welcome to the Star Wars API Explorer'
    );
  });

  it('should render the start exploring button', () => {
    const startExploringButton = fixture.nativeElement.querySelector('button');

    expect(startExploringButton.textContent).toContain('Start Exploring');
  });

  it('should have a router link on the start exploring button', () => {
    const startExploringButton = fixture.nativeElement.querySelector('button');

    expect(startExploringButton.getAttribute('ng-reflect-router-link')).toBe(
      '/search/people'
    );
  });
});
