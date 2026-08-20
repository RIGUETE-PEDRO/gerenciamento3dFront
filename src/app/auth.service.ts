import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CadastroRequest {
  nome: string;
  email: string;
  senha: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly loginUrl = `${API_BASE_URL}/api/auth/login`;
  private readonly cadastroUrl = `${API_BASE_URL}/api/auth/cadastro`;

  login(dados: LoginRequest): Observable<string> {
    return this.http.post(this.loginUrl, dados, { responseType: 'text' });
  }

  cadastrar(dados: CadastroRequest): Observable<string> {
    return this.http.post(this.cadastroUrl, dados, { responseType: 'text' });
  }
}
