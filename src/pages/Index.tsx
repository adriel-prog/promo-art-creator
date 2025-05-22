
import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { TemplateSelector } from '@/components/TemplateSelector';
import { ProductForm } from '@/components/ProductForm';
import { EncarteCanvas } from '@/components/EncarteCanvas';
import { Product, EncarteData, TemplateType } from '@/types/product';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [currentEncarte, setCurrentEncarte] = useState<EncarteData | null>(null);

  const handleProductsLoaded = (loadedProducts: Product[]) => {
    setProducts(loadedProducts);
    setCurrentEncarte(null); // Reset current encarte when new products are loaded
  };

  const handleTemplateSelect = (template: TemplateType) => {
    setSelectedTemplate(template);
    setCurrentEncarte(null); // Reset current encarte when template changes
  };

  const handleEncarteGenerate = (encarteData: EncarteData) => {
    setCurrentEncarte(encarteData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-promo bg-clip-text text-transparent mb-2">
              Discar Distribuidora
            </h1>
            <p className="text-xl text-gray-600 mb-1">
              Gerador de Encartes Promocionais
            </p>
            <p className="text-sm text-gray-500">
              Parceira oficial Ambev - Crie encartes profissionais em segundos
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-8">
            {/* Step 1: Upload */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-promo rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <h2 className="text-xl font-semibold">Upload da Planilha</h2>
              </div>
              <FileUpload onProductsLoaded={handleProductsLoaded} />
            </div>

            {/* Step 2: Template Selection */}
            {products.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-blue rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <h2 className="text-xl font-semibold">Escolha do Modelo</h2>
                </div>
                <TemplateSelector 
                  selectedTemplate={selectedTemplate} 
                  onTemplateSelect={handleTemplateSelect} 
                />
              </div>
            )}

            {/* Step 3: Product Form */}
            {products.length > 0 && selectedTemplate && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-success rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <h2 className="text-xl font-semibold">Dados do Produto</h2>
                </div>
                <ProductForm 
                  products={products}
                  selectedTemplate={selectedTemplate}
                  onEncarteGenerate={handleEncarteGenerate}
                />
              </div>
            )}
          </div>

          {/* Right Column - Canvas Preview */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                4
              </div>
              <h2 className="text-xl font-semibold">Prévia do Encarte</h2>
            </div>
            <EncarteCanvas encarteData={currentEncarte} />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Como usar:</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-promo rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                1
              </div>
              <p className="font-medium mb-1">Upload da Planilha</p>
              <p className="text-gray-600">Carregue um arquivo CSV com códigos, nomes e URLs das imagens dos produtos</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-blue rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                2
              </div>
              <p className="font-medium mb-1">Escolha o Modelo</p>
              <p className="text-gray-600">Selecione entre os modelos disponíveis: Moderno, Clássico ou Minimalista</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                3
              </div>
              <p className="font-medium mb-1">Dados do Produto</p>
              <p className="text-gray-600">Selecione o produto e insira os preços original e promocional</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                4
              </div>
              <p className="font-medium mb-1">Download</p>
              <p className="text-gray-600">Baixe seu encarte em PNG ou JPG e compartilhe nas redes sociais</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">
            © 2024 Discar Distribuidora - Parceira oficial Ambev | Gerador de Encartes Promocionais
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
