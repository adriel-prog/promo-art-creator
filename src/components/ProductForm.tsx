
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Product, EncarteData, TemplateType } from '@/types/product';
import { ProductSearch } from '@/components/ProductSearch';
import { ImageEditor, ImageTransform } from '@/components/ImageEditor';
import { toast } from 'sonner';
import { CalendarIcon, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface ProductFormProps {
  products: Product[];
  selectedTemplate: TemplateType | null;
  onEncarteGenerate: (data: EncarteData & { imageTransform?: ImageTransform }) => void;
}

export const ProductForm = ({ products, selectedTemplate, onEncarteGenerate }: ProductFormProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [precoOriginal, setPrecoOriginal] = useState('');
  const [precoPromocional, setPrecoPromocional] = useState('');
  const [informacoesAdicionais, setInformacoesAdicionais] = useState('');
  const [validade, setValidade] = useState<Date | undefined>(undefined);
  const [imagemSemFundo, setImagemSemFundo] = useState(false);
  const [imageTransform, setImageTransform] = useState<ImageTransform>({ 
    scale: 1, x: 0, y: 0, rotation: 0 
  });
  const [showImageEditor, setShowImageEditor] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !selectedTemplate || !precoOriginal || !precoPromocional) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
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

    const encarteData: EncarteData & { imageTransform?: ImageTransform } = {
      product: selectedProduct,
      precoOriginal: precoOrig,
      precoPromocional: precoPromo,
      template: selectedTemplate,
      informacoesAdicionais: informacoesAdicionais || undefined,
      validade: validade ? format(validade, 'dd/MM/yyyy') : undefined,
      imagemSemFundo,
      imageTransform
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
      <Card className="p-8 text-center bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-100 shadow-lg">
        <div className="text-gray-600">
          <Sparkles className="mx-auto h-12 w-12 text-blue-400 mb-4" />
          <p className="text-lg font-medium mb-2">Vamos começar!</p>
          <p className="text-gray-500">
            {products.length === 0 
              ? 'Faça upload de uma planilha para continuar' 
              : 'Selecione um modelo de encarte para continuar'
            }
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dados do Encarte
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">Produto</Label>
            <ProductSearch
              products={products}
              selectedProduct={selectedProduct}
              onProductSelect={(product) => {
                setSelectedProduct(product);
                setShowImageEditor(true);
              }}
            />
          </div>

          {selectedProduct && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="precoOriginal" className="text-gray-700 font-medium">Preço Original (R$)</Label>
                <Input
                  id="precoOriginal"
                  type="text"
                  placeholder="14,90"
                  value={precoOriginal}
                  onChange={(e) => setPrecoOriginal(e.target.value)}
                  className="h-12 border-2 border-gray-200 focus:border-blue-400 transition-colors"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="precoPromocional" className="text-gray-700 font-medium">Preço Promocional (R$)</Label>
                <Input
                  id="precoPromocional"
                  type="text"
                  placeholder="9,99"
                  value={precoPromocional}
                  onChange={(e) => setPrecoPromocional(e.target.value)}
                  className="h-12 border-2 border-gray-200 focus:border-blue-400 transition-colors"
                />
              </div>
            </div>
          )}

          {calcularDesconto() > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">%</span>
                </div>
                <p className="text-green-800 font-semibold">
                  Desconto de {calcularDesconto()}% - Economia de R$ {(parseFloat(precoOriginal.replace(',', '.')) - parseFloat(precoPromocional.replace(',', '.'))).toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="validade" className="text-gray-700 font-medium">Data de Validade</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="validade"
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-12 border-2 border-gray-200 hover:border-blue-400 transition-colors"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {validade ? (
                    format(validade, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                  ) : (
                    <span className="text-gray-500">Selecione uma data de validade</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={validade}
                  onSelect={setValidade}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3">
            <Label htmlFor="informacoesAdicionais" className="text-gray-700 font-medium">Informações Adicionais</Label>
            <Textarea
              id="informacoesAdicionais"
              placeholder="Ex.: Válido apenas para unidades selecionadas, enquanto durarem os estoques."
              value={informacoesAdicionais}
              onChange={(e) => setInformacoesAdicionais(e.target.value)}
              className="border-2 border-gray-200 focus:border-blue-400 transition-colors min-h-[100px] resize-none"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Switch 
              id="imagemSemFundo" 
              checked={imagemSemFundo} 
              onCheckedChange={setImagemSemFundo} 
            />
            <Label htmlFor="imagemSemFundo" className="text-gray-700 font-medium cursor-pointer">
              Remover fundo da imagem automaticamente (experimental)
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            disabled={!selectedProduct || !precoOriginal || !precoPromocional}
          >
            <Sparkles className="mr-2" />
            Gerar Encarte Promocional
          </Button>
        </form>
      </Card>

      {selectedProduct && showImageEditor && (
        <ImageEditor
          imageUrl={selectedProduct.urlImagem}
          onImageTransform={setImageTransform}
          initialTransform={imageTransform}
        />
      )}
    </div>
  );
};
