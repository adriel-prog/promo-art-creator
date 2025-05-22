
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
  },
  {
    id: 'branco',
    name: 'Fundo Branco',
    description: 'Ideal para produtos com imagens de fundo transparente',
    preview: 'bg-white border border-blue-200',
    colors: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      accent: '#FFFFFF'
    }
  },
  {
    id: 'escuro',
    name: 'Tema Escuro',
    description: 'Design elegante com fundo escuro e detalhes em azul',
    preview: 'bg-gradient-to-r from-gray-800 to-blue-900',
    colors: {
      primary: '#1E3A8A',
      secondary: '#3B82F6',
      accent: '#F3F4F6'
    }
  },
  {
    id: 'destaque',
    name: 'Destaque Premium',
    description: 'Layout premium com cores vibrantes e estilo promocional',
    preview: 'bg-gradient-to-r from-blue-600 to-purple-600',
    colors: {
      primary: '#4F46E5',
      secondary: '#7C3AED',
      accent: '#FFFFFF'
    }
  }
];
