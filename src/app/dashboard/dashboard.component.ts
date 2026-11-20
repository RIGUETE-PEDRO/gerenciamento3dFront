import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutosService } from '../pedidos/service/pedido.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly produtosService = inject(ProdutosService);

  protected readonly totalPedidos = signal(0);
  protected readonly carregandoPedidos = signal(true);

  ngOnInit(): void {
    this.carregarPedidos();
  }

  private carregarPedidos(): void {
    this.carregandoPedidos.set(true);
    this.produtosService.listar().subscribe({
      next: (pedidos) => {
        this.totalPedidos.set(pedidos.length);
        this.carregandoPedidos.set(false);
      },
      error: () => {
        this.totalPedidos.set(0);
        this.carregandoPedidos.set(false);
      },
    });
  }

  protected abrirCadastroPedido(): void {
    this.router.navigate(['/pedidos'], {
      queryParams: { novo: 'true' },
    });
  }
}
