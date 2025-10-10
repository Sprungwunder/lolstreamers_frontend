import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeksBannerComponent } from './keks-banner.component';

describe('KeksBannerComponent', () => {
  let component: KeksBannerComponent;
  let fixture: ComponentFixture<KeksBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeksBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeksBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
