import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
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
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.carregando.set(true);
    this.authService.login({ username: this.email, password: this.senha }).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigateByUrl(returnUrl && returnUrl.startsWith('/') ? returnUrl : '/dashboard');
      },
      error: (erro: HttpErrorResponse) => {
        this.mensagem.set(
          erro.status === 0
            ? 'Não foi possível conectar ao servidor.'
            : erro.status === 401 || erro.status === 403
              ? 'E-mail ou senha incorretos.'
              : (erro.error?.mensagem ??
                erro.error?.message ??
                'Não foi possível realizar o login.'),
        );
        this.carregando.set(false);
      },
    });
  }
}
