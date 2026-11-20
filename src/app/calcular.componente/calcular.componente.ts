import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CalcularService, ResultadoCalculo, ResultadoRegra } from './calcular.service';

@Component({
  selector: 'app-calcular',
  imports: [FormsModule],
  templateUrl: './calcular.componente.html',
  styleUrl: './calcular.componente.scss',
})
export class CalcularComponente {
  private readonly calcularService = inject(CalcularService);

  protected valor: number | null = null;
  protected readonly resultados = signal<ResultadoRegra[]>([]);
  protected readonly enviado = signal(false);
  protected readonly carregando = signal(false);
  protected readonly mensagem = signal('');
  protected readonly cadastroAberto = signal(false);
  protected readonly cadastroEnviado = signal(false);
  protected readonly cadastroCarregando = signal(false);
  protected readonly cadastroMensagem = signal('');
  protected nome = '';
  protected porcentagem: number | null = null;

  protected formatarResultado(resultado: string | number | null): string {
    if (resultado === null) {
      return '';
    }

    const numero = typeof resultado === 'number'
      ? resultado
      : Number(String(resultado).replace(',', '.').trim());

    if (Number.isFinite(numero)) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numero);
    }

    return String(resultado);
  }

  protected valorDoResultado(resultado: ResultadoRegra): string | number | null {
    return resultado.valor ?? resultado.value ?? resultado.resultado ?? resultado.porcentagem ?? null;
  }

  protected nomeDoResultado(resultado: ResultadoRegra): string {
    return resultado.nome ?? resultado.name ?? 'Resultado';
  }

  protected enviar(form: NgForm): void {
    this.enviado.set(true);
    this.mensagem.set('');
    this.resultados.set([]);

    if (form.invalid || this.valor === null) {
      form.control.markAllAsTouched();
      return;
    }

    this.carregando.set(true);
    this.calcularService.calcular(this.valor).subscribe({
      next: (resultado) => {
        this.processarResultado(resultado);
        this.carregando.set(false);
      },
      error: (erro: HttpErrorResponse) => {
        this.mensagem.set(
          erro.status === 0
            ? 'Não foi possível conectar ao servidor.'
            : 'Não foi possível calcular o valor.',
        );
        this.carregando.set(false);
      },
    });
  }

  private processarResultado(resultado: ResultadoCalculo): void {
    if (typeof resultado === 'string') {
      const texto = resultado.trim();
      if (texto.startsWith('[') || texto.startsWith('{')) {
        try {
          this.processarResultado(JSON.parse(texto));
          return;
        } catch {
          this.resultados.set([{ nome: 'Resultado', valor: texto }]);
          return;
        }
      }

      this.resultados.set([{ nome: 'Resultado', valor: texto }]);
      return;
    }

    if (typeof resultado === 'number') {
      this.resultados.set([{ nome: 'Resultado', valor: resultado }]);
      return;
    }

    if (Array.isArray(resultado)) {
      this.resultados.set(
        resultado.map((item) =>
          typeof item === 'number'
            ? { nome: 'Resultado', valor: item }
            : item,
        ),
      );
      return;
    }

    if (resultado && typeof resultado === 'object') {
      this.resultados.set([resultado]);
    }
  }

  protected abrirCadastro(): void {
    this.cadastroMensagem.set('');
    this.cadastroEnviado.set(false);
    this.cadastroAberto.set(true);
  }

  protected fecharCadastro(): void {
    this.cadastroAberto.set(false);
  }

  protected cadastrar(form: NgForm): void {
    this.cadastroEnviado.set(true);
    this.cadastroMensagem.set('');

    if (form.invalid || !this.nome.trim() || this.porcentagem === null) {
      form.control.markAllAsTouched();
      return;
    }

    this.cadastroCarregando.set(true);
    this.calcularService
      .cadastrar({ nome: this.nome.trim(), porcentagem: this.porcentagem })
      .subscribe({
        next: () => {
          this.cadastroMensagem.set('Cadastro realizado com sucesso.');
          this.cadastroCarregando.set(false);
          this.nome = '';
          this.porcentagem = null;
          this.cadastroEnviado.set(false);
        },
        error: (erro: HttpErrorResponse) => {
          this.cadastroMensagem.set(
            erro.status === 0
              ? 'Não foi possível conectar ao servidor.'
              : 'Não foi possível realizar o cadastro.',
          );
          this.cadastroCarregando.set(false);
        },
      });
  }
}
