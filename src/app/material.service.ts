import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';

export interface MaterialCadastroRequest {
  nome: string;
  tipo: string;
  cor: string;
  quantidade: number;
  custo: number;
}

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private readonly http = inject(HttpClient);
  private readonly cadastroUrl = `${API_BASE_URL}/material/cadastro`;

  cadastrar(material: MaterialCadastroRequest): Observable<string> {
    return this.http.post(this.cadastroUrl, material, { responseType: 'text' });
  }
}
