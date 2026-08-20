import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-painel-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './painel-layout.html',
  styleUrl: './painel-layout.scss'
})
export class PainelLayout {}
