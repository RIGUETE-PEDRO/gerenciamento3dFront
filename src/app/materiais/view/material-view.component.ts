import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MaterialCreateComponent } from '../create/material-create.component';
import { MaterialEditComponent } from '../edit/material-edit.component';
import { MaterialService } from '../services/material.service';
import { Loja, Material } from '../models/material.types';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-material-view',
  imports: [MaterialCreateComponent, MaterialEditComponent, ConfirmModalComponent],
  templateUrl: './material-view.component.html',
  styleUrls: ['../../dashboard/dashboard.component.scss', 'material-view.component.scss'],
})
export class MaterialViewComponent implements OnInit {
  private readonly materialService = inject(MaterialService);

  protected readonly modalAberto = signal(false);
  protected readonly materialSelecionado = signal<Material | null>(null);
  protected readonly materialParaExcluir = signal<Material | null>(null);
  protected readonly excluindo = signal(false);
  protected readonly materiais = signal<Material[]>([]);
  protected readonly lojas = signal<Loja[]>([]);
  protected readonly lojasPorId = computed(
    () => new Map(this.lojas().map((loja) => [loja.id, loja.nome])),
  );
  protected readonly carregando = signal(false);
  protected readonly mensagemErro = signal('');

  ngOnInit(): void {
    this.carregarMateriais();
    this.carregarLojas();
  
  }

  protected pedirExclusao(material: Material): void {
    this.materialParaExcluir.set(material);
  }

  protected cancelarExclusao(): void {
    if (!this.excluindo()) {
      this.materialParaExcluir.set(null);
    }
  }

  protected confirmarExclusao(): void {
    const material = this.materialParaExcluir();
    if (!material || this.excluindo()) {
      return;
    }

    this.excluindo.set(true);
    this.materialService.excluir(material.id).subscribe({
      next: () => {
        this.excluindo.set(false);
        this.materialParaExcluir.set(null);
        this.materiais.update((itens) => itens.filter((item) => item.id !== material.id));
      },
      error: (erro) => {
        console.error('Erro ao excluir material:', erro);
        this.excluindo.set(false);
        this.materialParaExcluir.set(null);
        this.mensagemErro.set('Não foi possível excluir o material.');
      },
    });
  }

  private carregarLojas(): void {
    this.materialService.listarLojas().subscribe({
      next: (lojas) => this.lojas.set(lojas),
      error: (erro) => console.error('Erro ao buscar lojas:', erro),
    });
  }

  public converteData(data:string): string {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); 
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  private carregarMateriais(): void {
    this.carregando.set(true);
    this.mensagemErro.set('');

    this.materialService.listar().subscribe({
      next: (materiais) => {
        this.materiais.set(materiais);
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error('Erro ao buscar materiais:', erro);
        this.mensagemErro.set('Não foi possível carregar os materiais.');
        this.carregando.set(false);
      },
    });
  }

  protected abrirModal(): void {
    this.materialSelecionado.set(null);
    this.modalAberto.set(true);
  }

  protected editarMaterial(material: Material): void {
    this.materialSelecionado.set(material);
    this.modalAberto.set(true);
  }

  protected fecharModal(): void {
    this.modalAberto.set(false);
    this.materialSelecionado.set(null);
  }

  protected materialSalvo(): void {
    this.fecharModal();
    this.carregarMateriais();
  }
}
