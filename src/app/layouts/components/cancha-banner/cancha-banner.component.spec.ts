import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanchaBannerComponent } from './cancha-banner.component';

describe('CanchaBannerComponent', () => {
  let component: CanchaBannerComponent;
  let fixture: ComponentFixture<CanchaBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanchaBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanchaBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
