
import { Template } from '../types/product';

export const templates: Template[] = [
  {
    id: 'moderno',
    name: 'Moderno',
    description: 'Design clean e contemporâneo com gradientes vibrantes',
    preview: 'bg-gradient-promo',
    colors: {
      primary: '#FF6B35',
      secondary: '#E63946',
      accent: '#FFFFFF'
    }
  },
  {
    id: 'classico',
    name: 'Clássico',
    description: 'Estilo tradicional com cores sólidas e elegantes',
    preview: 'bg-gradient-blue',
    colors: {
      primary: '#457B9D',
      secondary: '#8E44AD',
      accent: '#FFFFFF'
    }
  },
  {
    id: 'minimalista',
    name: 'Minimalista',
    description: 'Design limpo e minimalista com foco no produto',
    preview: 'bg-gradient-success',
    colors: {
      primary: '#27AE60',
      secondary: '#F39C12',
      accent: '#FFFFFF'
    }
  }
];
