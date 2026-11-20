import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PedidoFormComponent } from './form/pedido-form.component';
import { Produto } from './models/produto.types';
import { ProdutosService } from './service/pedido.service';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['../dashboard/dashboard.component.scss', './pedidos.component.scss'],
  imports: [PedidoFormComponent, ConfirmModalComponent],
})
export class PedidosComponent implements OnInit {
  private readonly produtoService = inject(ProdutosService);
  private readonly route = inject(ActivatedRoute);

  protected readonly modalAberto = signal(false);
  protected readonly produtos = signal<Produto[]>([]);
  protected readonly carregando = signal(false);
  protected readonly mensagemErro = signal('');
  protected readonly produtoEditando = signal<Produto | null>(null);
  protected readonly produtoExcluindo = signal<Produto | null>(null);
  protected readonly excluindo = signal(false);

  ngOnInit(): void {
    this.carregarProdutos();
    if (this.route.snapshot.queryParamMap.get('novo') === 'true') {
      this.abrirModal();
    }
  }

  private carregarProdutos(): void {
    this.carregando.set(true);
    this.mensagemErro.set('');

    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.produtos.set(produtos);
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error('Erro ao buscar produtos:', erro);
        this.mensagemErro.set('Não foi possível carregar os produtos.');
        this.carregando.set(false);
      },
    });
  }

  protected abrirModal(): void {
    this.produtoEditando.set(null);
    this.modalAberto.set(true);
  }

  protected abrirEdicao(produto: Produto): void {
    this.produtoEditando.set(produto);
    this.modalAberto.set(true);
  }

  protected fecharModal(): void {
    this.modalAberto.set(false);
    this.produtoEditando.set(null);
  }

  protected produtoSalvo(): void {
    this.fecharModal();
    this.carregarProdutos();
  }

  protected formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  protected excluir(produto: Produto): void {
    this.produtoExcluindo.set(produto);
  }

  protected confirmarExclusao(): void {
    const produto = this.produtoExcluindo();
    if (!produto) return;

    this.excluindo.set(true);
    this.produtoService.excluir(produto.id).subscribe({
      next: () => {
        this.excluindo.set(false);
        this.produtoExcluindo.set(null);
        this.produtos.update((itens) => itens.filter((item) => item.id !== produto.id));
      },
      error: (erro) => {
        this.excluindo.set(false);
        console.error('Erro ao excluir pedido:', erro);
        this.mensagemErro.set('Não foi possível excluir o pedido.');
      },
    });
  }
}
