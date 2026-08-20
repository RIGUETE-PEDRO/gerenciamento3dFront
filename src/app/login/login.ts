import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({ selector: 'app-login', imports: [FormsModule, RouterLink], templateUrl: './login.html', styleUrl: './login.scss' })
export class Login {
  private readonly authService = inject(AuthService);
  protected email = '';
  protected senha = '';
  protected lembrar = false;
  protected readonly mostrarSenha = signal(false);
  protected readonly enviado = signal(false);
  protected readonly carregando = signal(false);
  protected readonly mensagem = signal('');

  protected entrar(form: NgForm): void {
    this.enviado.set(true);
    this.mensagem.set('');
    if (form.invalid) { form.control.markAllAsTouched(); return; }
    this.carregando.set(true);
    this.authService.login({ username: this.email, password: this.senha }).subscribe({
      next: () => {
        window.location.assign('/dashboard');
      },
      error: (erro: HttpErrorResponse) => {
        this.mensagem.set(erro.status === 0 ? 'Não foi possível conectar ao servidor.' :
          erro.status === 401 || erro.status === 403 ? 'E-mail ou senha incorretos.' :
          erro.error?.mensagem ?? erro.error?.message ?? 'Não foi possível realizar o login.');
        this.carregando.set(false);
      }
    });
  }
}
