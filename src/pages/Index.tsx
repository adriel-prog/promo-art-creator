
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-md">
              Discar Distribuidora
            </h1>
            <p className="text-xl text-blue-100 mb-1">
              Gerador de Encartes Promocionais
            </p>
            <p className="text-sm text-blue-200">
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
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  1
                </div>
                <h2 className="text-xl font-semibold text-blue-800">Upload da Planilha</h2>
              </div>
              <FileUpload onProductsLoaded={handleProductsLoaded} />
            </div>

            {/* Step 2: Template Selection */}
            {products.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                    2
                  </div>
                  <h2 className="text-xl font-semibold text-blue-800">Escolha do Modelo</h2>
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
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                    3
                  </div>
                  <h2 className="text-xl font-semibold text-blue-800">Dados do Produto</h2>
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
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                4
              </div>
              <h2 className="text-xl font-semibold text-blue-800">Prévia do Encarte</h2>
            </div>
            <EncarteCanvas encarteData={currentEncarte} />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-md border border-blue-200">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Como usar:</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2 shadow-md">
                1
              </div>
              <p className="font-medium mb-1 text-blue-700">Upload da Planilha</p>
              <p className="text-gray-600">Carregue um arquivo CSV com códigos, nomes e URLs das imagens dos produtos</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2 shadow-md">
                2
              </div>
              <p className="font-medium mb-1 text-blue-700">Escolha o Modelo</p>
              <p className="text-gray-600">Selecione entre os modelos disponíveis: Moderno, Clássico ou Minimalista</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-700 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2 shadow-md">
                3
              </div>
              <p className="font-medium mb-1 text-blue-700">Dados do Produto</p>
              <p className="text-gray-600">Selecione o produto e insira os preços original e promocional</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-800 to-blue-900 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2 shadow-md">
                4
              </div>
              <p className="font-medium mb-1 text-blue-700">Download</p>
              <p className="text-gray-600">Baixe seu encarte em PNG ou JPG e compartilhe nas redes sociais</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-800 to-blue-900 mt-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-blue-100">
            © 2024 Discar Distribuidora - Parceira oficial Ambev | Gerador de Encartes Promocionais
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
