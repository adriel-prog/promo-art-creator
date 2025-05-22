
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, EncarteData, TemplateType } from '@/types/product';
import { toast } from 'sonner';

interface ProductFormProps {
  products: Product[];
  selectedTemplate: TemplateType | null;
  onEncarteGenerate: (data: EncarteData) => void;
}

export const ProductForm = ({ products, selectedTemplate, onEncarteGenerate }: ProductFormProps) => {
  const [selectedProductCode, setSelectedProductCode] = useState('');
  const [precoOriginal, setPrecoOriginal] = useState('');
  const [precoPromocional, setPrecoPromocional] = useState('');

  const selectedProduct = products.find(p => p.codigo === selectedProductCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !selectedTemplate || !precoOriginal || !precoPromocional) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const precoOrig = parseFloat(precoOriginal.replace(',', '.'));
    const precoPromo = parseFloat(precoPromocional.replace(',', '.'));

    if (isNaN(precoOrig) || isNaN(precoPromo)) {
      toast.error('Por favor, insira preços válidos');
      return;
    }

    if (precoPromo >= precoOrig) {
      toast.error('O preço promocional deve ser menor que o preço original');
      return;
    }

    const encarteData: EncarteData = {
      product: selectedProduct,
      precoOriginal: precoOrig,
      precoPromocional: precoPromo,
      template: selectedTemplate
    };

    onEncarteGenerate(encarteData);
    toast.success('Encarte gerado com sucesso!');
  };

  const calcularDesconto = () => {
    if (precoOriginal && precoPromocional) {
      const orig = parseFloat(precoOriginal.replace(',', '.'));
      const promo = parseFloat(precoPromocional.replace(',', '.'));
      if (!isNaN(orig) && !isNaN(promo) && orig > promo) {
        return Math.round(((orig - promo) / orig) * 100);
      }
    }
    return 0;
  };

  if (products.length === 0 || !selectedTemplate) {
    return (
      <Card className="p-6 text-center bg-gray-50">
        <p className="text-gray-600">
          {products.length === 0 
            ? 'Faça upload de uma planilha para continuar' 
            : 'Selecione um modelo de encarte para continuar'
          }
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 animate-fade-in border border-blue-200 shadow-md">
      <h3 className="text-xl font-semibold mb-6 text-blue-700">
        Dados do Encarte
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="product" className="text-blue-700">Produto</Label>
          <Select value={selectedProductCode} onValueChange={setSelectedProductCode}>
            <SelectTrigger className="border-blue-200 focus:ring-blue-500">
              <SelectValue placeholder="Selecione um produto" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.codigo} value={product.codigo}>
                  {product.codigo} - {product.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProduct && (
          <div className="bg-blue-50 rounded-lg p-4 space-y-2 border border-blue-100">
            <p className="text-sm font-medium text-blue-700">Produto selecionado:</p>
            <p className="text-sm text-blue-600">{selectedProduct.nome}</p>
            <div className="flex items-center gap-2">
              <img 
                src={selectedProduct.urlImagem} 
                alt={selectedProduct.nome}
                className="w-16 h-16 object-cover rounded border border-blue-200"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNlYmYyZmEiIHJ4PSI4Ii8+PHBhdGggZD0iTTMyIDI4YzIuMjA5IDAgNC0xLjc5MSA0LTRzLTEuNzkxLTQtNC00LTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0em0xMiAySDIwdjEyaDE2VjM2aDh2LTZIMzJ2LTJ6bS0yNCAwaDJ2Mkg0OHYtMkgyMHoiIGZpbGw9IiM0Mjg4ZDkiLz48L3N2Zz4=';
                }}
              />
              <p className="text-xs text-blue-600 break-all">{selectedProduct.urlImagem}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="precoOriginal" className="text-blue-700">Preço Original (R$)</Label>
            <Input
              id="precoOriginal"
              type="text"
              placeholder="14,90"
              value={precoOriginal}
              onChange={(e) => setPrecoOriginal(e.target.value)}
              className="border-blue-200 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="precoPromocional" className="text-blue-700">Preço Promocional (R$)</Label>
            <Input
              id="precoPromocional"
              type="text"
              placeholder="9,99"
              value={precoPromocional}
              onChange={(e) => setPrecoPromocional(e.target.value)}
              className="border-blue-200 focus:ring-blue-500"
            />
          </div>
        </div>

        {calcularDesconto() > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-800">
              💰 Desconto de {calcularDesconto()}%
            </p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:opacity-90 text-white font-semibold py-3"
          disabled={!selectedProduct || !precoOriginal || !precoPromocional}
        >
          Gerar Encarte
        </Button>
      </form>
    </Card>
  );
};
