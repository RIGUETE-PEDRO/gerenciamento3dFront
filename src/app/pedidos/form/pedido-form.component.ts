import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Produto, ProdutoCadastroRequest, ProdutoFormValue } from '../models/produto.types';
import { ProdutosService } from '../service/pedido.service';

@Component({
  selector: 'app-pedido-form',
  imports: [FormsModule],
  templateUrl: './pedido-form.component.html',
  styleUrl: './pedido-form.component.scss',
})
export class PedidoFormComponent implements OnInit {
  private readonly produtoService = inject(ProdutosService);

  readonly produtoParaEditar = input<Produto | null>(null);
  readonly fechar = output<void>();
  readonly salvo = output<void>();
  protected readonly editando = computed(() => this.produtoParaEditar() !== null);
  protected readonly salvando = signal(false);
  protected readonly mensagem = signal('');
  protected readonly sucesso = signal(false);

  protected produto: ProdutoFormValue = {
    nome: '',
    categoria: '',
    material: '',
    cor: '',
    quantidade: null,
    valorUnitario: null,
    prazoProducao: null,
    descricao: '',
  };

  ngOnInit(): void {
    const produtoParaEditar = this.produtoParaEditar();
    if (produtoParaEditar) {
      this.produto = {
        nome: produtoParaEditar.nome,
        categoria: produtoParaEditar.categoria,
        material: produtoParaEditar.material,
        cor: produtoParaEditar.cor,
        quantidade: produtoParaEditar.quantidade,
        valorUnitario: produtoParaEditar.valorUnitario,
        prazoProducao: produtoParaEditar.prazoProducao,
        descricao: produtoParaEditar.descricao,
      };
    }
  }

  protected salvar(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    this.mensagem.set('');
    const dados: ProdutoCadastroRequest = {
      ...this.produto,
      quantidade: this.produto.quantidade!,
      valorUnitario: this.produto.valorUnitario!,
      prazoProducao: this.produto.prazoProducao!,
    };
    const produtoParaEditar = this.produtoParaEditar();
    const requisicao = produtoParaEditar
      ? this.produtoService.atualizar(produtoParaEditar.id, dados)
      : this.produtoService.cadastrar(dados);

    requisicao.subscribe({
      next: (resposta) => {
        this.sucesso.set(true);
        this.mensagem.set(
          resposta ||
            (produtoParaEditar
              ? 'Produto atualizado com sucesso.'
              : 'Produto cadastrado com sucesso.'),
        );
        this.salvando.set(false);
        this.salvo.emit();
      },
      error: (erro: HttpErrorResponse) => {
        this.sucesso.set(false);
        this.mensagem.set(
          erro.status === 0
            ? 'Não foi possível conectar ao servidor.'
            : (erro.error?.mensagem ??
                erro.error?.message ??
                erro.error ??
                'Não foi possível salvar o produto.'),
        );
        this.salvando.set(false);
      },
    });
  }
}
