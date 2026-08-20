import { Routes } from '@angular/router';
import { Cadastro } from './cadastro/cadastro';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';

import { Materiais } from './materiais/materiais';
import { PainelLayout } from './painel-layout/painel-layout';
import { Pedidos } from './pedidos/pedidos';
import { Equipamentos } from './Equipamento/Equipamento';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: '', component: PainelLayout, children: [
    { path: 'dashboard', component: Dashboard },
    { path: 'pedidos', component: Pedidos },
    { path: 'Equipamentos', component: Equipamentos },
    { path: 'materiais', component: Materiais }
  ] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
