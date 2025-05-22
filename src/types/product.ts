
export interface Product {
  codigo: string;
  nome: string;
  urlImagem: string;
}

export interface EncarteData {
  product: Product;
  precoOriginal: number;
  precoPromocional: number;
  template: TemplateType;
}

export type TemplateType = 'moderno' | 'classico' | 'minimalista';

export interface Template {
  id: TemplateType;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}
