import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-painel-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './painel-layout.component.html',
  styleUrl: './painel-layout.component.scss',
})
export class PainelLayoutComponent {}
