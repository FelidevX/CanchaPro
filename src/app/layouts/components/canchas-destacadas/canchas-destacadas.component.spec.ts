import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanchasDestacadasComponent } from './canchas-destacadas.component';

describe('CanchasDestacadasComponent', () => {
  let component: CanchasDestacadasComponent;
  let fixture: ComponentFixture<CanchasDestacadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanchasDestacadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanchasDestacadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
