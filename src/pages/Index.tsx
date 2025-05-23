
import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { TemplateSelector } from '@/components/TemplateSelector';
import { ProductForm } from '@/components/ProductForm';
import { EncarteCanvas } from '@/components/EncarteCanvas';
import { ImageTransform } from '@/components/ImageEditor';
import { Product, EncarteData, TemplateType } from '@/types/product';
import { Sparkles, FileUp, PenTool, Download, Layout, Zap, Target, TrendingUp } from 'lucide-react';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [currentEncarte, setCurrentEncarte] = useState<(EncarteData & { imageTransform?: ImageTransform }) | null>(null);

  const handleProductsLoaded = (loadedProducts: Product[]) => {
    setProducts(loadedProducts);
    setCurrentEncarte(null);
  };

  const handleTemplateSelect = (template: TemplateType) => {
    setSelectedTemplate(template);
    setCurrentEncarte(null);
  };

  const handleEncarteGenerate = (encarteData: EncarteData & { imageTransform?: ImageTransform }) => {
    setCurrentEncarte(encarteData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Header - Ultra Modern */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white/90 text-sm font-medium">Parceira oficial Ambev</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight animate-glow">
              Discar Distribuidora
            </h1>
            <p className="text-2xl md:text-3xl text-blue-100 mb-4 font-light">
              Gerador de Encartes Promocionais
            </p>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Crie encartes profissionais em segundos com nossa tecnologia avançada. 
              Design moderno, ajustes visuais intuitivos e resultados impressionantes.
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-white text-sm">Geração Instantânea</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Target className="w-4 h-4 text-green-300" />
                <span className="text-white text-sm">Editor Visual</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <TrendingUp className="w-4 h-4 text-blue-300" />
                <span className="text-white text-sm">Alta Qualidade</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modern wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-8 text-slate-50">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-current"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Controls */}
          <div className="space-y-12">
            {/* Step 1: Upload */}
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <div className="step-indicator">
                  1
                </div>
                <div>
                  <h2 className="text-2xl font-bold gradient-text">
                    Upload da Planilha
                  </h2>
                  <p className="text-gray-600 mt-1">Carregue seus produtos de forma inteligente</p>
                </div>
              </div>
              <FileUpload onProductsLoaded={handleProductsLoaded} />
            </div>

            {/* Step 2: Template Selection */}
            {products.length > 0 && (
              <div className="space-y-6 animate-slide-up">
                <div className="flex items-center gap-4">
                  <div className={`step-indicator ${products.length > 0 ? 'completed' : ''}`}>
                    2
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold gradient-text">
                      Escolha do Modelo
                    </h2>
                    <p className="text-gray-600 mt-1">Selecione o design perfeito para sua marca</p>
                  </div>
                </div>
                <TemplateSelector 
                  selectedTemplate={selectedTemplate} 
                  onTemplateSelect={handleTemplateSelect} 
                />
              </div>
            )}

            {/* Step 3: Product Form */}
            {products.length > 0 && selectedTemplate && (
              <div className="space-y-6 animate-scale-in">
                <div className="flex items-center gap-4">
                  <div className={`step-indicator ${selectedTemplate ? 'completed' : ''}`}>
                    3
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold gradient-text">
                      Dados do Produto
                    </h2>
                    <p className="text-gray-600 mt-1">Configure preços e personalize detalhes</p>
                  </div>
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
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`step-indicator ${currentEncarte ? 'completed' : ''}`}>
                  4
                </div>
                <div>
                  <h2 className="text-2xl font-bold gradient-text">
                    Prévia do Encarte
                  </h2>
                  <p className="text-gray-600 mt-1">Visualize e baixe seu encarte finalizado</p>
                </div>
              </div>
              <EncarteCanvas encarteData={currentEncarte} />
            </div>
          </div>
        </div>

        {/* Enhanced Instructions Section */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold gradient-text mb-4">
              Como Funciona o Gerador
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Um processo simples e intuitivo para criar encartes profissionais em minutos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="modern-card p-8 text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <FileUp size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Upload Inteligente</h4>
              <p className="text-gray-600 leading-relaxed">
                Carregue planilhas CSV ou Excel com códigos, nomes e URLs das imagens dos produtos de forma rápida e segura
              </p>
            </div>
            
            <div className="modern-card p-8 text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <Layout size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Templates Modernos</h4>
              <p className="text-gray-600 leading-relaxed">
                Escolha entre diversos modelos profissionais otimizados para diferentes tipos de produtos e promoções
              </p>
            </div>
            
            <div className="modern-card p-8 text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <PenTool size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Editor Visual</h4>
              <p className="text-gray-600 leading-relaxed">
                Ajuste imagens com precisão usando nosso editor drag-and-drop com zoom, posicionamento e muito mais
              </p>
            </div>
            
            <div className="modern-card p-8 text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <Download size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Download HD</h4>
              <p className="text-gray-600 leading-relaxed">
                Baixe em PNG ou JPG com alta qualidade e compartilhe diretamente nas redes sociais
              </p>
            </div>
          </div>
          
          <div className="mt-12 modern-card p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">💡 Dica Profissional</h4>
                <p className="text-gray-700 leading-relaxed">
                  Para resultados ainda melhores, utilize imagens de produtos com fundo transparente (PNG) ou ative nossa 
                  funcionalidade experimental de remoção de fundo. O editor visual permite ajustes precisos de posição, 
                  tamanho e enquadramento para destacar perfeitamente seus produtos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Footer */}
      <footer className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-blue-400" />
              <h3 className="text-3xl font-bold text-white">Discar Distribuidora</h3>
            </div>
            <p className="text-blue-200 text-lg">Parceira oficial Ambev</p>
          </div>
          
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto my-8"></div>
          
          <div className="space-y-4">
            <p className="text-blue-200">
              © {new Date().getFullYear()} Discar Distribuidora | Gerador de Encartes Promocionais
            </p>
            <div className="text-sm text-blue-300 space-y-1">
              <p>🚀 Impulsione suas vendas com encartes profissionais</p>
              <p>🌐 www.discardistribuidora.com.br</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
