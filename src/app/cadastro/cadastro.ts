import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({ selector: 'app-cadastro', imports: [FormsModule, RouterLink], templateUrl: './cadastro.html', styleUrl: '../login/login.scss' })
export class Cadastro {
    private readonly auth = inject(AuthService); private readonly router = inject(Router);
    protected nome = ''; protected email = ''; protected senha = ''; protected readonly mostrarSenha = signal(false); protected readonly enviado = signal(false); protected readonly carregando = signal(false); protected readonly mensagem = signal('');
    protected cadastrar(form: NgForm): void { this.enviado.set(true); this.mensagem.set(''); if (form.invalid) { form.control.markAllAsTouched(); return } this.carregando.set(true); this.auth.cadastrar({ nome: this.nome, email: this.email, senha: this.senha }).subscribe({ next: () => this.router.navigate(['/login']), error: (e: HttpErrorResponse) => { this.mensagem.set(e.status === 0 ? 'Não foi possível conectar ao servidor.' : e.status === 409 ? 'Este e-mail já está cadastrado.' : 'Não foi possível realizar o cadastro.'); this.carregando.set(false) } }) }
}
