import { Component, inject, OnInit, signal } from '@angular/core';
import { PedidoFormComponent } from './form/pedido-form.component';
import { Produto } from './models/produto.types';
import { ProdutosService } from './service/pedido.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['../dashboard/dashboard.component.scss', './pedidos.component.scss'],
  imports: [PedidoFormComponent],
})
export class PedidosComponent implements OnInit {
  private readonly produtoService = inject(ProdutosService);

  protected readonly modalAberto = signal(false);
  protected readonly produtos = signal<Produto[]>([]);
  protected readonly carregando = signal(false);
  protected readonly mensagemErro = signal('');

  ngOnInit(): void {
    this.carregarProdutos();
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
    this.modalAberto.set(true);
  }

  protected fecharModal(): void {
    this.modalAberto.set(false);
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
}
