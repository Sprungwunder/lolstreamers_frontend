import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditVideoComponent } from './admin-edit-video.component';

describe('AdminEditVideoComponent', () => {
  let component: AdminEditVideoComponent;
  let fixture: ComponentFixture<AdminEditVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditVideoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminEditVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
