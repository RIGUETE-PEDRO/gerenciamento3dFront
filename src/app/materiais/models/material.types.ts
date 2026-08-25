export interface Loja {
  id: number;
  nome: string;
}

export interface Material {
  id: number;
  nome: string;
  tipo: string;
  cor: string;
  quantidade: number;
  custo: number;
  dataCompra: string;
  lojaId: number;
}

export type MaterialFormulario = Omit<Material, 'id'>;

export type MaterialCadastroRequest = MaterialFormulario;

export type MaterialFormValue = Omit<MaterialFormulario, 'quantidade' | 'custo' | 'lojaId'> & {
  quantidade: number | null;
  custo: number | null;
  lojaId: number | null;
};
