import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly router = inject(Router);

  protected abrirCadastroPedido(): void {
    this.router.navigate(['/pedidos'], {
      queryParams: { novo: 'true' },
    });
  }
}
