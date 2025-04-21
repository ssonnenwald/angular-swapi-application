import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDataComponent } from './resource-data.component';

describe('ResourceDataComponent', () => {
  let component: ResourceDataComponent;
  let fixture: ComponentFixture<ResourceDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
