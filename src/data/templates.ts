
import { Template } from '../types/product';

export const templates: Template[] = [
  {
    id: 'moderno',
    name: 'Moderno',
    description: 'Design clean e contemporâneo com gradientes azuis',
    preview: 'bg-gradient-blue',
    colors: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      accent: '#FFFFFF'
    }
  },
  {
    id: 'classico',
    name: 'Clássico',
    description: 'Estilo tradicional com tons de azul elegantes',
    preview: 'bg-gradient-blue',
    colors: {
      primary: '#1E3A8A',
      secondary: '#2563EB',
      accent: '#FFFFFF'
    }
  },
  {
    id: 'minimalista',
    name: 'Minimalista',
    description: 'Design limpo e minimalista com foco no produto',
    preview: 'bg-gradient-blue',
    colors: {
      primary: '#0369A1',
      secondary: '#0EA5E9',
      accent: '#FFFFFF'
    }
  }
];
