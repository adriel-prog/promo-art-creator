
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { templates } from '@/data/templates';
import { TemplateType } from '@/types/product';
import { CheckCircle } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType | null;
  onTemplateSelect: (template: TemplateType) => void;
}

export const TemplateSelector = ({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold bg-gradient-promo bg-clip-text text-transparent">
        Escolha o Modelo de Encarte
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover-scale ${
              selectedTemplate === template.id 
                ? 'ring-2 ring-promo-orange shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => onTemplateSelect(template.id)}
          >
            <div className={`h-32 ${template.preview} relative`}>
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <div className="w-16 h-10 bg-white/90 rounded mb-2 mx-auto flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-800">OFERTA</span>
                  </div>
                  <div className="text-xs opacity-90">Preview do modelo</div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <Button 
                variant={selectedTemplate === template.id ? "default" : "outline"}
                size="sm" 
                className="w-full"
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
