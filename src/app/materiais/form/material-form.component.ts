import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MaterialService } from '../services/material.service';
import {
  Loja,
  Material,
  MaterialCadastroRequest,
  MaterialFormValue,
} from '../models/material.types';

@Component({
  selector: 'app-material-form',
  imports: [FormsModule],
  templateUrl: './material-form.component.html',
  styleUrl: './material-form.component.scss',
})
export class MaterialFormComponent implements OnInit {
  private readonly materialService = inject(MaterialService);

  readonly materialParaEditar = input<Material | null>(null);
  readonly fechar = output<void>();
  readonly salvo = output<void>();
  protected readonly editando = computed(() => this.materialParaEditar() !== null);
  protected readonly salvando = signal(false);
  protected readonly mensagem = signal('');
  protected readonly sucesso = signal(false);
  protected readonly lojas = signal<Loja[]>([]);
  protected readonly carregandoLojas = signal(false);

  protected material: MaterialFormValue = {
    nome: '',
    tipo: '',
    cor: '',
    quantidade: null as number | null,
    custo: null as number | null,
    dataCompra: '',
    lojaId: null as number | null,
  };

  ngOnInit(): void {
    this.carregarLojas();
    const materialParaEditar = this.materialParaEditar();
    if (materialParaEditar) {
      this.material = {
        nome: materialParaEditar.nome,
        tipo: materialParaEditar.tipo,
        cor: materialParaEditar.cor,
        quantidade: materialParaEditar.quantidade,
        custo: materialParaEditar.custo,
        dataCompra: materialParaEditar.dataCompra,
        lojaId: materialParaEditar.lojaId,
      };
    }
  }

  private carregarLojas(): void {
    this.carregandoLojas.set(true);
    this.materialService.listarLojas().subscribe({
      next: (lojas) => {
        this.lojas.set(lojas);
        this.carregandoLojas.set(false);
      },
      error: () => {
        this.lojas.set([]);
        this.carregandoLojas.set(false);
      },
    });
  }

  protected salvar(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    this.mensagem.set('');
    const dados: MaterialCadastroRequest = {
      ...this.material,
      quantidade: this.material.quantidade!,
      custo: this.material.custo!,
      lojaId: this.material.lojaId!,
    };
    const materialParaEditar = this.materialParaEditar();
    const requisicao = materialParaEditar
      ? this.materialService.atualizar(materialParaEditar.id, dados)
      : this.materialService.cadastrar(dados);

    requisicao.subscribe({
      next: (resposta) => {
        this.sucesso.set(true);
        this.mensagem.set(
          resposta ||
            (materialParaEditar
              ? 'Material atualizado com sucesso.'
              : 'Material cadastrado com sucesso.'),
        );
        this.salvando.set(false);
        this.salvo.emit();
      },
      error: (erro: HttpErrorResponse) => {
        this.sucesso.set(false);
        this.mensagem.set(
          erro.status === 0
            ? 'Não foi possível conectar ao servidor.'
            : (erro.error?.mensagem ??
                erro.error?.message ??
                erro.error ??
                'Não foi possível salvar o material.'),
        );
        this.salvando.set(false);
      },
    });
  }
}
