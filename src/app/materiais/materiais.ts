import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MaterialService } from '../material.service';

@Component({
  selector: 'app-materiais',
  imports: [FormsModule],
  templateUrl: './materiais.html',
  styleUrls: ['../dashboard/dashboard.scss','materiais.scss']
})
export class Materiais {
  private readonly materialService = inject(MaterialService);
  protected readonly modalAberto = signal(false);
  protected readonly salvando = signal(false);
  protected readonly mensagem = signal('');
  protected readonly sucesso = signal(false);

  protected material = {
    nome: '',
    tipo: '',
    cor: '',
    quantidade: null as number | null,
    custo: null as number | null
  };

  protected abrirModal(): void {
    this.mensagem.set('');
    this.modalAberto.set(true);
  }

  protected fecharModal(): void {
    this.modalAberto.set(false);
  }

  protected salvar(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    this.mensagem.set('');
    this.materialService.cadastrar({
      ...this.material,
      quantidade: this.material.quantidade!,
      custo: this.material.custo!
    }).subscribe({
      next: (resposta) => {
        this.sucesso.set(true);
        this.mensagem.set(resposta || 'Material cadastrado com sucesso.');
        this.salvando.set(false);
        form.resetForm({ nome: '', tipo: '', cor: '', quantidade: null, custo: null });
      },
      error: (erro: HttpErrorResponse) => {
        this.sucesso.set(false);
        this.mensagem.set(
          erro.status === 0
            ? 'Não foi possível conectar ao servidor.'
            : erro.error?.mensagem ?? erro.error?.message ?? erro.error ?? 'Não foi possível salvar o material.'
        );
        this.salvando.set(false);
      }
    });
  }
}
