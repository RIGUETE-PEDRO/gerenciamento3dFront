import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RegrasService, RegraPorcentagem } from './regras.service';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-cadastrar-regras.componente',
  imports: [FormsModule, ConfirmModalComponent],
  templateUrl: './cadastrar-regras.componente.html',
  styleUrl: './cadastrar-regras.componente.scss',
})
export class CadastrarRegrasComponente implements OnInit {
  private readonly regrasService = inject(RegrasService);

  protected readonly regras = signal<RegraPorcentagem[]>([]);
  protected readonly carregando = signal(false);
  protected readonly mensagem = signal('');
  protected modalAberto = false;
  protected readonly enviado = signal(false);
  protected readonly salvando = signal(false);
  protected nome = '';
  protected porcentagem: number | null = null;
  protected regraEditando: RegraPorcentagem | null = null;
  protected readonly regraExcluindo = signal<RegraPorcentagem | null>(null);
  protected readonly excluindo = signal(false);

  ngOnInit(): void {
    this.listar();
  }

  protected listar(): void {
    this.carregando.set(true);
    this.mensagem.set('');

    this.regrasService.listar().subscribe({
      next: (regras) => {
        this.regras.set(regras);
        this.carregando.set(false);
      },
      error: (erro: HttpErrorResponse) => {
        this.mensagem.set(this.mensagemErro(erro, 'Não foi possível listar as regras.'));
        this.carregando.set(false);
      },
    });
  }

  public abrirCadastro(): void {
    this.regraEditando = null;
    this.nome = '';
    this.porcentagem = null;
    this.enviado.set(false);
    this.mensagem.set('');
    this.modalAberto = true;
  }

  public abrirEdicao(regra: RegraPorcentagem): void {
    this.regraEditando = regra;
    this.nome = regra.nome;
    this.porcentagem = regra.porcentagem;
    this.enviado.set(false);
    this.mensagem.set('');
    this.modalAberto = true;
  }

  public fecharModal(): void {
    this.modalAberto = false;
  }

  protected salvar(form: NgForm): void {
    this.enviado.set(true);
    this.mensagem.set('');

    if (
      form.invalid ||
      !this.nome.trim() ||
      this.porcentagem === null ||
      this.porcentagem === undefined
    ) {
      form.control.markAllAsTouched();
      return;
    }

    const dados = { nome: this.nome.trim(), porcentagem: this.porcentagem };
    this.salvando.set(true);

    if (this.regraEditando) {
      this.regrasService.atualizar(this.regraEditando.id, dados).subscribe({
        next: () => this.concluirSalvar(),
        error: (erro: HttpErrorResponse) =>
          this.concluirComErro(erro, 'Não foi possível alterar a regra.'),
      });
      return;
    }

    this.regrasService.cadastrar(dados).subscribe({
      next: () => this.concluirSalvar(),
      error: (erro: HttpErrorResponse) =>
        this.concluirComErro(erro, 'Não foi possível criar a regra.'),
    });
  }

  protected deletar(regra: RegraPorcentagem): void {
    this.regraExcluindo.set(regra);
  }

  protected confirmarExclusao(): void {
    const regra = this.regraExcluindo();
    if (!regra) return;

    this.excluindo.set(true);
    this.mensagem.set('');
    this.regrasService.deletar(regra.id).subscribe({
      next: () => {
        this.excluindo.set(false);
        this.regraExcluindo.set(null);
        this.regras.update((itens) => itens.filter((item) => item.id !== regra.id));
        this.mensagem.set('Regra excluída com sucesso.');
      },
      error: (erro: HttpErrorResponse) => {
        this.excluindo.set(false);
        this.mensagem.set(this.mensagemErro(erro, 'Não foi possível excluir a regra.'));
      },
    });
  }

  private concluirSalvar(): void {
    this.salvando.set(false);
    this.modalAberto = false;
    this.mensagem.set(
      this.regraEditando ? 'Regra alterada com sucesso.' : 'Regra criada com sucesso.',
    );
    this.listar();
  }

  private concluirComErro(erro: HttpErrorResponse, fallback: string): void {
    this.salvando.set(false);
    this.mensagem.set(this.mensagemErro(erro, fallback));
  }

  private mensagemErro(erro: HttpErrorResponse, fallback: string): string {
    return erro.status === 0
      ? 'Não foi possível conectar ao servidor.'
      : erro.error?.mensagem ?? erro.error?.message ?? fallback;
  }
}
