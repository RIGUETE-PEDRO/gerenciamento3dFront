import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/config/api.config';

export interface ResultadoRegra {
  nome?: string;
  name?: string;
  valor?: string | number;
  value?: string | number;
  resultado?: string | number;
  porcentagem?: string | number;
  [key: string]: unknown;
}

export type ResultadoCalculo =
  | string
  | number
  | ResultadoRegra
  | ResultadoRegra[];

export interface CadastroCalculo {
  nome: string;
  porcentagem: number;
}

@Injectable({ providedIn: 'root' })
export class CalcularService {
  private readonly http = inject(HttpClient);
  private readonly calcularUrl = `${API_BASE_URL}/calcular`;
  private readonly cadastroUrl = `${API_BASE_URL}/calcular/cadastro`;

  calcular(valor: number): Observable<ResultadoCalculo> {
    return this.http.post<ResultadoCalculo>(this.calcularUrl, { valor });
  }

  cadastrar(dados: CadastroCalculo): Observable<string | object> {
    return this.http.post<string | object>(this.cadastroUrl, dados);
  }

}
