import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.config';
import { Produto, ProdutoCadastroRequest } from '../models/produto.types';

@Injectable({ providedIn: 'root' })
export class ProdutosService {
  private readonly http = inject(HttpClient);
  private readonly produtoUrl = `${API_BASE_URL}/pedidos`;

  listar(): Observable<Produto[]> {
    return this.http
      .get<Produto[] | Produto | null>(`${this.produtoUrl}/listar`)
      .pipe(map((resposta) => (resposta ? (Array.isArray(resposta) ? resposta : [resposta]) : [])));
  }

  cadastrar(produto: ProdutoCadastroRequest): Observable<string> {
    return this.http.post(`${this.produtoUrl}/cadastrar`, produto, { responseType: 'text' });
  }

  atualizar(id: number, produto: ProdutoCadastroRequest): Observable<string> {
    return this.http.put(`${this.produtoUrl}/atualizar/${id}`, produto, {
      responseType: 'text',
    });
  }

  excluir(id: number): Observable<string> {
    return this.http.delete(`${this.produtoUrl}/deletar/${id}`, {
      responseType: 'text',
    });
  }
}
