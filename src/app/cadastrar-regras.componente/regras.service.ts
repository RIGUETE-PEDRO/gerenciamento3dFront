import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/config/api.config';

export interface RegraPorcentagem {
  id: number;
  nome: string;
  porcentagem: number;
}

export interface RegraPorcentagemCadastro {
  nome: string;
  porcentagem: number;
}

@Injectable({ providedIn: 'root' })
export class RegrasService {
  private readonly http = inject(HttpClient);
  private readonly regrasUrl = `${API_BASE_URL}/calcular`;

  listar(): Observable<RegraPorcentagem[]> {
    return this.http.get<RegraPorcentagem[]>(`${this.regrasUrl}/list`);
  }

  cadastrar(dados: RegraPorcentagemCadastro): Observable<string> {
    return this.http.post(`${this.regrasUrl}/cadastro`, dados, { responseType: 'text' });
  }

  atualizar(id: number, dados: RegraPorcentagemCadastro): Observable<string> {
    return this.http.put(`${this.regrasUrl}/update/${id}`, dados, { responseType: 'text' });
  }

  deletar(id: number): Observable<string> {
    return this.http.delete(`${this.regrasUrl}/delete/${id}`, { responseType: 'text' });
  }
}
