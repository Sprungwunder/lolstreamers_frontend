import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddVideoComponent } from './admin-add-video.component';

describe('AdminAddVideoComponent', () => {
  let component: AdminAddVideoComponent;
  let fixture: ComponentFixture<AdminAddVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddVideoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminAddVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
