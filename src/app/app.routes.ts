import { Routes } from '@angular/router';
import { CadastroComponent } from './cadastro/cadastro.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';

import { MaterialViewComponent } from './materiais/view/material-view.component';
import { PainelLayoutComponent } from './painel-layout/painel-layout.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { EquipamentosComponent } from './equipamentos/equipamentos.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  {
    path: '',
    component: PainelLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'pedidos', component: PedidosComponent },
      { path: 'equipamentos', component: EquipamentosComponent },
      { path: 'materiais', component: MaterialViewComponent },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
