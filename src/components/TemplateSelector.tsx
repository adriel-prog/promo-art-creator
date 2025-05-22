
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { templates } from '@/data/templates';
import { TemplateType } from '@/types/product';
import { CheckCircle, Layout } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType | null;
  onTemplateSelect: (template: TemplateType) => void;
}

export const TemplateSelector = ({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">
        Escolha o Modelo de Encarte
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover-scale ${
              selectedTemplate === template.id 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:shadow-md border border-blue-100'
            }`}
            onClick={() => onTemplateSelect(template.id)}
          >
            <div className={`h-32 ${template.preview} relative`}>
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <div className="w-16 h-10 bg-white/90 rounded mb-2 mx-auto flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-800">OFERTA</span>
                  </div>
                  <div className="text-xs opacity-90 bg-black/40 rounded px-2 py-1">
                    <Layout className="w-3 h-3 inline-block mr-1" />
                    Prévia do modelo
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1 text-blue-700">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
              <Button 
                variant={selectedTemplate === template.id ? "default" : "outline"}
                size="sm" 
                className={`w-full ${selectedTemplate === template.id ? 'bg-gradient-to-r from-blue-600 to-blue-800 hover:opacity-90' : 'border-blue-200'}`}
              >
                {selectedTemplate === template.id ? 'Selecionado' : 'Selecionar'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
