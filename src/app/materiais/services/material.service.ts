import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.config';
import { Loja, Material, MaterialCadastroRequest } from '../models/material.types';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private readonly http = inject(HttpClient);
  private readonly materialUrl = `${API_BASE_URL}/material`;
  private readonly lojaUrl = `${API_BASE_URL}/loja`;

  listar(): Observable<Material[]> {
    return this.http
      .get<Material[] | Material>(`${this.materialUrl}/listar`)
      .pipe(map((resposta) => (Array.isArray(resposta) ? resposta : [resposta])));
  }

  listarLojas(): Observable<Loja[]> {
    return this.http.get<Loja[]>(`${this.lojaUrl}/listar`);
  }

  cadastrar(material: MaterialCadastroRequest): Observable<string> {
    return this.http.post(`${this.materialUrl}/cadastrar`, material, { responseType: 'text' });
  }

  atualizar(id: number, material: MaterialCadastroRequest): Observable<string> {
    return this.http.put(`${this.materialUrl}/editar/${id}`, material, {
      responseType: 'text',
    });
  }

  excluir(id: number): Observable<string> {
    return this.http.delete(`${this.materialUrl}/excluir/${id}`, {
      responseType: 'text',
    });
  }
}
