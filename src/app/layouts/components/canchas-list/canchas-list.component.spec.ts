import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanchasListComponent } from './canchas-list.component';

describe('CanchasListComponent', () => {
  let component: CanchasListComponent;
  let fixture: ComponentFixture<CanchasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanchasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanchasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
