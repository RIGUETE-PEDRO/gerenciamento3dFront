import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarRegrasComponente } from './cadastrar-regras.componente';

describe('CadastrarRegrasComponente', () => {
  let component: CadastrarRegrasComponente;
  let fixture: ComponentFixture<CadastrarRegrasComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarRegrasComponente],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarRegrasComponente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
