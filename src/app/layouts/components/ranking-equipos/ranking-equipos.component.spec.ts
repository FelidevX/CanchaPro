import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingEquiposComponent } from './ranking-equipos.component';

describe('RankingEquiposComponent', () => {
  let component: RankingEquiposComponent;
  let fixture: ComponentFixture<RankingEquiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RankingEquiposComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankingEquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
