import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_BASE_URL } from '../../core/config/api.config';
import { CadastroRequest, LoginRequest } from '../models/auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly loginUrl = `${API_BASE_URL}/auth/login`;
  private readonly cadastroUrl = `${API_BASE_URL}/auth/cadastro`;
  private readonly tokenKey = 'auth_token';

  login(dados: LoginRequest): Observable<string> {
    return this.http.post(this.loginUrl, dados, { responseType: 'text' }).pipe(
      tap((token) => this.setToken(token)),
    );
  }

  cadastrar(dados: CadastroRequest): Observable<string> {
    return this.http.post(this.cadastroUrl, dados, { responseType: 'text' });
  }

  isAuthenticated(): Observable<boolean> {
    return of(this.getToken() !== null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private setToken(response: string): void {
    const token = response.trim().replace(/^"|"$/g, '');
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    }
  }
}
