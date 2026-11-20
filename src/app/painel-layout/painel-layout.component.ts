import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-painel-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './painel-layout.component.html',
  styleUrl: './painel-layout.component.scss',
})
export class PainelLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected sair(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
