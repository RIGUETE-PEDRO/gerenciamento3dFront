import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent {
  readonly titulo = input('Confirmar ação');
  readonly mensagem = input.required<string>();
  readonly textoConfirmar = input('Confirmar');
  readonly processando = input(false);

  readonly cancelar = output<void>();
  readonly confirmar = output<void>();

  @HostListener('document:keydown.escape')
  protected cancelarComEscape(): void {
    this.cancelarModal();
  }

  protected cancelarModal(): void {
    if (!this.processando()) {
      this.cancelar.emit();
    }
  }
}
