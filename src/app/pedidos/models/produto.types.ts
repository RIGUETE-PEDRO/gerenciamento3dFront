export interface Produto {
  id: number;
  nome: string;
  categoria: string;
  material: string;
  cor: string;
  quantidade: number;
  valorUnitario: number;
  prazoProducao: number;
  descricao: string;
}

export type ProdutoFormulario = Omit<Produto, 'id'>;

export type ProdutoCadastroRequest = ProdutoFormulario;

export type ProdutoFormValue = Omit<
  ProdutoFormulario,
  'quantidade' | 'valorUnitario' | 'prazoProducao'
> & {
  quantidade: number | null;
  valorUnitario: number | null;
  prazoProducao: number | null;
};
