import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly authService = inject(AuthService);

  protected email = '';
  protected senha = '';
  protected lembrar = false;
  protected readonly mostrarSenha = signal(false);
  protected readonly enviado = signal(false);
  protected readonly carregando = signal(false);
  protected readonly mensagem = signal('');
  protected readonly sucesso = signal(false);

  protected entrar(form: NgForm): void {
    this.enviado.set(true);
    this.mensagem.set('');

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.carregando.set(true);
    this.authService.login({ username: this.email, password: this.senha }).subscribe({
      next: (resposta) => {
        this.sucesso.set(true);
        this.mensagem.set(resposta || 'Login realizado com sucesso.');
        this.carregando.set(false);
      },
      error: (erro: HttpErrorResponse) => {
        this.sucesso.set(false);
        this.mensagem.set(this.obterMensagemDeErro(erro));
        this.carregando.set(false);
      }
    });
  }

  private obterMensagemDeErro(erro: HttpErrorResponse): string {
    if (erro.status === 0) return 'Não foi possível conectar ao servidor.';
    if (erro.status === 401 || erro.status === 403) return 'E-mail ou senha incorretos.';
    return erro.error?.mensagem ?? erro.error?.message ?? 'Não foi possível realizar o login.';
  }
}
