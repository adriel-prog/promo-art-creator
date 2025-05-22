
import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { TemplateSelector } from '@/components/TemplateSelector';
import { ProductForm } from '@/components/ProductForm';
import { EncarteCanvas } from '@/components/EncarteCanvas';
import { Product, EncarteData, TemplateType } from '@/types/product';
import { ArrowDown, ArrowRight, FileUp, PenTool, Download } from 'lucide-react';

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
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-xl relative overflow-hidden">
        {/* Padrão decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{background: 'linear-gradient(45deg, #1e40af 25%, transparent 25%, transparent 50%, #1e40af 50%, #1e40af 75%, transparent 75%, transparent)', backgroundSize: '80px 80px'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-md">
              Discar Distribuidora
            </h1>
            <p className="text-2xl text-blue-100 mb-2">
              Gerador de Encartes Promocionais
            </p>
            <p className="text-md text-blue-200 max-w-2xl mx-auto">
              Parceira oficial Ambev - Crie encartes profissionais em segundos para impulsionar suas vendas
            </p>
          </div>
        </div>
        
        {/* Onda decorativa na base do header */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 transform">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-8 text-blue-50">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-current"></path>
          </svg>
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
                <div className="w-10 h-10 bg-gradient-to-r from-blue-700 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  1
                </div>
                <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-600">
                  Upload da Planilha
                </h2>
              </div>
              <FileUpload onProductsLoaded={handleProductsLoaded} />
            </div>

            {/* Step 2: Template Selection */}
            {products.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-700 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    2
                  </div>
                  <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-600">
                    Escolha do Modelo
                  </h2>
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
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-700 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    3
                  </div>
                  <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-600">
                    Dados do Produto
                  </h2>
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
              <div className="w-10 h-10 bg-gradient-to-r from-blue-700 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                4
              </div>
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-600">
                Prévia do Encarte
              </h2>
            </div>
            <EncarteCanvas encarteData={currentEncarte} />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-lg p-8 shadow-lg border border-blue-200">
          <h3 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-600 text-center">
            Como usar o Gerador de Encartes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-center hover-scale">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-md">
                <FileUp size={24} />
              </div>
              <p className="font-medium mb-2 text-blue-800">Upload da Planilha</p>
              <p className="text-gray-600">Carregue um arquivo CSV com códigos, nomes e URLs das imagens dos produtos</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-center hover-scale">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-md">
                <Layout size={24} />
              </div>
              <p className="font-medium mb-2 text-blue-800">Escolha o Modelo</p>
              <p className="text-gray-600">Selecione entre os modelos disponíveis para seu encarte promocional</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-center hover-scale">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-md">
                <PenTool size={24} />
              </div>
              <p className="font-medium mb-2 text-blue-800">Dados do Produto</p>
              <p className="text-gray-600">Selecione o produto e insira os preços original e promocional</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-center hover-scale">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-md">
                <Download size={24} />
              </div>
              <p className="font-medium mb-2 text-blue-800">Download</p>
              <p className="text-gray-600">Baixe seu encarte em PNG ou JPG e compartilhe nas redes sociais</p>
            </div>
          </div>
          
          <div className="mt-8 bg-blue-700 text-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <ArrowRight className="w-8 h-8" />
              </div>
              <div className="block md:hidden">
                <ArrowDown className="w-8 h-8" />
              </div>
              <div>
                <p className="font-semibold mb-1">Dica profissional</p>
                <p className="text-sm text-blue-100">
                  Para melhores resultados, utilize imagens de produtos com fundo transparente (PNG) ou escolha a opção "Remover fundo" para destacar seus produtos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-700 mt-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Discar Distribuidora</h3>
            <p className="text-blue-200">Parceira oficial Ambev</p>
          </div>
          
          <div className="w-40 h-1 bg-blue-400 mx-auto my-6 rounded-full opacity-50"></div>
          
          <p className="text-blue-200 mb-4">
            © 2024 Discar Distribuidora | Gerador de Encartes Promocionais
          </p>
          
          <div className="text-sm text-blue-300">
            <p>Impulsione suas vendas com encartes profissionais</p>
            <p>www.discardistribuidora.com.br</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
