import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcularComponente } from './calcular.componente';

describe('CalcularComponente', () => {
  let component: CalcularComponente;
  let fixture: ComponentFixture<CalcularComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalcularComponente],
    }).compileComponents();

    fixture = TestBed.createComponent(CalcularComponente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
